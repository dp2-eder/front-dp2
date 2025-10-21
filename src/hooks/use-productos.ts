import { useState, useEffect } from 'react'

import { ProductosResponse } from '@/types/productos'

// Cache global para los productos
let cachedProductos: ProductosResponse['items'] | null = null
let cacheTimestamp: number | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos en milisegundos

// Función para convertir URL de Google Drive a URL directa de imagen
const convertGoogleDriveUrl = (url: string | null | undefined): string => {
  // Si la URL es null, undefined o una cadena vacía, devuelve un placeholder
  if (!url || url === 'null' || url === 'undefined') {
    return '/placeholder-image.png'
  }
  
  // Si no es una URL de Google Drive, la devuelve tal cual
  if (!url.includes('drive.google.com')) {
    return url
  }
  
  // Extraer el ID del archivo de la URL
  const match = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/)
  if (match) {
    const fileId = match[1]
    return `https://drive.google.com/uc?export=view&id=${fileId}`
  }
  
  return url
}

export function useProductos() {
  const [productos, setProductos] = useState<ProductosResponse['items']>(() => {
    // Inicializar con cache si está disponible
    return cachedProductos || []
  })
  const [loading, setLoading] = useState(() => {
    // Si hay cache válido, no empezar en loading
    if (cachedProductos && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
      return false
    }
    return true
  })
  const [error, setError] = useState<string | null>(null)

  const fetchProductos = async (force = false) => {
    try {
      // Si hay cache válido y no es forzado, usar cache
      if (!force && cachedProductos && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
        setProductos(cachedProductos)
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/productos', {
        next: { revalidate: 300 } // Cache en el cliente también
      })
      const result = await response.json() as { success: boolean; data: ProductosResponse; error?: string }
      
      if (result.success) {
        // Convertir URLs de Google Drive a URLs directas
        const productosConImagenes = result.data.items.map(producto => ({
          ...producto,
          imagen_path: convertGoogleDriveUrl(producto.imagen_path),
          categoria: {
            ...producto.categoria,
            imagen_path: convertGoogleDriveUrl(producto.categoria.imagen_path)
          }
        }))
        
        // Actualizar cache global
        cachedProductos = productosConImagenes
        cacheTimestamp = Date.now()
        
        setProductos(productosConImagenes)
      } else {
        setError(result.error || 'Error al cargar los productos')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchProductos()
  }, [])

  return {
    productos,
    loading,
    error,
    refetch: () => void fetchProductos(true)
  }
}
