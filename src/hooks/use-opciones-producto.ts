import { useState, useEffect, useCallback, useRef } from 'react'

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

      const response = await fetch(`/api/productos/${id}/opciones`)
      const result = await response.json() as { success: boolean; data: ProductoConOpciones; error?: string }

      if (result.success && result.data) {
        setProducto(result.data) // Usar result.data en lugar de result directamente
      } else {
        setError(result.error || 'Error al cargar las opciones')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
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
