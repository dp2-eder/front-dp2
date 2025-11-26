import { useState, useEffect, useCallback, useRef } from 'react'

import { API_BASE_URL } from '@/lib/api-config'
import { markImageAsCached } from '@/lib/image-cache'
import { getProductImageUrl } from '@/lib/image-url'
import { Producto } from '@/types/productos'

// Re-export para compatibilidad hacia atrás
export type { Producto }

// Caché global compartido para evitar llamadas repetidas
const cache = new Map<string, { data: Producto; timestamp: number }>()
const CACHE_DURATION = 3 * 60 * 1000 // 3 minutos

// Control de requests en curso para evitar duplicados
const pendingRequests = new Map<string, Promise<Producto>>()

// Función compartida para prefetch que guarda en caché
export async function prefetchProducto(id: string): Promise<void> {
  // Si ya está en caché, precargar la imagen de todas formas
  const cached = cache.get(id)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    // Precargar imagen aunque esté en caché
    if (cached.data.imagen_path && typeof window !== 'undefined') {
      const img = new window.Image()
      img.src = cached.data.imagen_path
    }
    return
  }

  // Si ya hay un request en curso, esperar a que termine
  const pendingRequest = pendingRequests.get(id)
  if (pendingRequest) {
    const producto = await pendingRequest.catch(() => null)
    // Precargar imagen del request pendiente
    if (producto?.imagen_path && typeof window !== 'undefined') {
      const img = new window.Image()
      img.src = producto.imagen_path
    }
    return
  }

  // Crear nuevo request y guardarlo
  const requestPromise = fetch(`${API_BASE_URL}/api/v1/productos/${id}`)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Error ${response.status}`)
      }
      const result = await response.json() as unknown
      const resultData = result as Record<string, unknown>
      if (resultData.nombre && resultData.descripcion !== undefined) {
        const productoFinal = result as Producto
        // Transformar imagen_path para renderizado
        if (productoFinal.imagen_path) {
          productoFinal.imagen_path = getProductImageUrl(productoFinal.imagen_path) || productoFinal.imagen_path
        }
        cache.set(id, { data: productoFinal, timestamp: Date.now() })
          
          // Precargar imagen inmediatamente después de obtener los datos
          if (productoFinal.imagen_path && typeof window !== 'undefined') {
            const img = new window.Image()
            // Convertir URL de Google Drive a enlace directo
            let imageUrl = productoFinal.imagen_path
            if (imageUrl.includes('drive.google.com')) {
              const match = imageUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)/)
              if (match) {
                const fileId = match[1]
                imageUrl = `https://drive.google.com/uc?export=view&id=${fileId}`
              }
            }
            img.src = imageUrl

            // Marcar la URL en caché cuando se carga
            img.onload = () => {
              if (typeof window !== 'undefined' && window.localStorage) {
                markImageAsCached(imageUrl)
                markImageAsCached(productoFinal.imagen_path)
              }
            }
          }
          
          return productoFinal
        }
      throw new Error('El producto no tiene todos los datos requeridos')
    })
    .finally(() => {
      pendingRequests.delete(id)
    })

  pendingRequests.set(id, requestPromise)
  await requestPromise.catch(() => {})
}

export function useProducto(id: string) {
  const [producto, setProducto] = useState<Producto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasFetched = useRef<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchProducto = useCallback(async () => {
    // Verificar caché primero
    const cached = cache.get(id)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setProducto(cached.data)
      setLoading(false)
      return
    }

    // Si ya hay un request en curso para este ID, esperar a que termine
    // Esto incluye requests del prefetch
    const pendingRequest = pendingRequests.get(id)
    if (pendingRequest) {
      try {
        const data = await pendingRequest
        setProducto(data)
        setLoading(false)
        return
      } catch (err) {
        // Si falla el request pendiente, continuar con uno nuevo
      }
    }

    try {
      setLoading(true)
      setError(null)

      // Cancelar request anterior del hook si existe (solo si es diferente)
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      const url = `${API_BASE_URL}/api/v1/productos/${id}`;

      // Crear el request y guardarlo en el mapa de pendientes
      const requestPromise = fetch(url, {
        signal: abortControllerRef.current.signal
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status} al cargar el producto`)
        }

        const result = await response.json() as unknown
        const resultData = result as Record<string, unknown>

        // Validar que los campos requeridos existan
        if (resultData.nombre && resultData.descripcion !== undefined) {
          const productoFinal = result as Producto
          // Transformar imagen_path para renderizado
          if (productoFinal.imagen_path) {
            productoFinal.imagen_path = getProductImageUrl(productoFinal.imagen_path) || productoFinal.imagen_path
          }
          // Guardar en caché
          cache.set(id, { data: productoFinal, timestamp: Date.now() })
          return productoFinal
        } else {
          throw new Error('El producto no tiene todos los datos requeridos')
        }
      })

      // Guardar el request pendiente
      pendingRequests.set(id, requestPromise)

      const productoFinal = await requestPromise
      setProducto(productoFinal)
      setLoading(false)

      // Limpiar el request pendiente
      pendingRequests.delete(id)
    } catch (err) {
      // Limpiar el request pendiente en caso de error
      pendingRequests.delete(id)

      // No mostrar error si fue cancelado
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }

      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id && hasFetched.current !== id) {
      hasFetched.current = id
      void fetchProducto()
    }

    // Cleanup: cancelar request si el componente se desmonta o cambia el ID
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [id, fetchProducto])

  return {
    producto,
    loading,
    error,
    refetch: () => void fetchProducto()
  }
}
