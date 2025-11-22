import { useState, useEffect, useCallback, useRef } from 'react'

import { API_BASE_URL } from '@/lib/api-config'
import { Opcion, ProductoConOpciones, TipoOpcion } from '@/types/productos'

// Re-export para compatibilidad hacia atrás
export type { Opcion, ProductoConOpciones, TipoOpcion }

// Convertir Google Drive URLs a directas una sola vez
function convertGoogleDriveUrl(url: string | null | undefined): string | null | undefined {
  if (!url || typeof url !== 'string') return url

  if (url.includes('drive.google.com')) {
    const match = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/)
    if (match) {
      const fileId = match[1]
      return `https://drive.google.com/uc?export=view&id=${fileId}`
    }
  }

  return url
}

export function useOpcionesProducto(id: string) {
  const [producto, setProducto] = useState<ProductoConOpciones | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasFetched = useRef<string | null>(null)

  const fetchOpciones = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${API_BASE_URL}/api/v1/productos/${id}`)

      if (!response.ok) {
        throw new Error(`Error ${response.status} al cargar el producto`)
      }

      const result = await response.json() as ProductoConOpciones

      // Convertir imagen_path de Google Drive a URL directa
      if (result.imagen_path) {
        result.imagen_path = convertGoogleDriveUrl(result.imagen_path) || result.imagen_path
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
