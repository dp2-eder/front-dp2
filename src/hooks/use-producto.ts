import { useState, useEffect, useCallback } from 'react'

export function useProducto(id: string) {
  const [producto, setProducto] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducto = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/productos/${id}`)
      const result = await response.json() as { success: boolean; data: unknown; error?: string }
      
      if (result.success) {
        setProducto(result.data)
      } else {
        setError(result.error || 'Error al cargar el producto')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) {
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
