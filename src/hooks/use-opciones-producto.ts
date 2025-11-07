import { useState, useEffect, useCallback, useRef } from 'react'

export interface Opcion {
  id: string
  nombre: string
  precio_adicional: string
  activo: boolean
  orden: number
  id_producto: string
  id_tipo_opcion: string
  fecha_creacion: string
  fecha_modificacion: string
}

export interface ProductoConOpciones {
  id: string
  nombre: string
  descripcion: string
  precio_base: string
  imagen_path: string | null
  disponible: boolean
  opciones: Opcion[]
  tipos_opciones?: TipoOpcion[]
}

export interface TipoOpcion {
  id_tipo_opcion: string
  nombre_tipo: string
  seleccion_maxima: number
  opciones: Opcion[]
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
