import { useState, useEffect, useCallback, useRef } from 'react'

import { API_BASE_URL } from '@/lib/api-config'
import { getProductImageUrl } from '@/lib/image-url'
import { Opcion, ProductoConOpciones, TipoOpcion } from '@/types/productos'

// Re-export para compatibilidad hacia atrás
export type { Opcion, ProductoConOpciones, TipoOpcion }

export function useOpcionesProducto(id: string) {
  const [producto, setProducto] = useState<ProductoConOpciones | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasFetched = useRef<string | null>(null)

  const fetchOpciones = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${API_BASE_URL}/api/v1/productos/${id}/opciones`)

      if (!response.ok) {
        throw new Error(`Error ${response.status} al cargar las opciones del producto`)
      }

      const result = await response.json() as ProductoConOpciones

      // Transformar imagen_path para renderizado
      if (result.imagen_path) {
        result.imagen_path = getProductImageUrl(result.imagen_path) || result.imagen_path
      }

      setProducto(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id && hasFetched.current !== id) {
      hasFetched.current = id
      void fetchOpciones()
    }
  }, [id, fetchOpciones])

  return {
    producto,
    loading,
    error,
    refetch: () => void fetchOpciones()
  }
}
