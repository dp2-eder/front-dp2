import { useState, useEffect, useCallback, useRef } from 'react'

import { Producto } from '@/types/productos'

// Re-export para compatibilidad hacia atrás
export type { Producto }

export function useProducto(id: string) {
  const [producto, setProducto] = useState<Producto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasFetched = useRef<string | null>(null)

  const fetchProducto = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/productos/${id}`)

      if (!response.ok) {
        throw new Error(`Error ${response.status} al cargar el producto`)
      }

      const result = await response.json() as {
        success: boolean
        data: unknown
        error?: string
      }

      if (result.success && result.data) {
        // Validar que los campos requeridos existan
        const productoData = result.data as Record<string, unknown>
        if (productoData.nombre && productoData.descripcion !== undefined) {
          setProducto(result.data as Producto)
        } else {
          console.warn('Producto incompleto:', result.data)
          setError('El producto no tiene todos los datos requeridos')
        }
      } else {
        setError(result.error || 'Error al cargar el producto')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      console.error('Error al cargar producto:', errorMessage)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id && hasFetched.current !== id) {
      hasFetched.current = id
      void fetchProducto()
    }
  }, [id, fetchProducto])

  return {
    producto,
    loading,
    error,
    refetch: () => void fetchProducto()
  }
}
