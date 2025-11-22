import { useState, useEffect, useCallback, useRef } from 'react'

import { API_BASE_URL } from '@/lib/api-config'
import { CategoriasResponse, Categoria } from '@/types/categorias'

// Cache global para las categorías
let cachedCategorias: CategoriasResponse['items'] | null = null
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

export function useCategorias(limit = 100) { // Aumentado a 100 para cargar todas las categorías (hay 23)
  const [categorias, setCategorias] = useState<CategoriasResponse['items']>(() => {
    // Inicializar con cache si está disponible
    return cachedCategorias || []
  })
  const [loading, setLoading] = useState(() => {
    // Si hay cache válido, no empezar en loading
    if (cachedCategorias && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
      return false
    }
    return true
  })
  const [error, setError] = useState<string | null>(null)
  const hasFetched = useRef(false)

  const fetchCategorias = useCallback(async (force = false) => {
    try {
      // Si hay cache válido y no es forzado, usar cache
      if (!force && cachedCategorias && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
        setCategorias(cachedCategorias)
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      const response = await fetch(`${API_BASE_URL}/api/v1/categorias?limit=${limit}`, {
        next: { revalidate: 300 } // Cache en el cliente también
      })

      if (!response.ok) throw new Error(`Error ${response.status} al cargar las categorías`)

      const rawData = await response.json() as unknown

      // Manejar tanto el formato de array como { items, total }
      let items: Categoria[] = []
      if (Array.isArray(rawData)) {
        items = (rawData as unknown[]).map(item => item as Categoria)
      } else {
        const result = rawData as CategoriasResponse
        items = result.items || []
      }

      // Convertir URLs de Google Drive a URLs directas
      const categoriasConImagenes = items.map((categoria) => {
        const imagenUrl = convertGoogleDriveUrl(categoria.imagen_path)

        return {
          ...categoria,
          imagen_path: imagenUrl
        }
      })

      // Actualizar cache global
      cachedCategorias = categoriasConImagenes
      cacheTimestamp = Date.now()

      setCategorias(categoriasConImagenes)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    // Solo ejecutar una vez en el montaje
    if (!hasFetched.current) {
      hasFetched.current = true
      void fetchCategorias()
    }
  }, [fetchCategorias])

  return {
    categorias,
    loading,
    error,
    refetch: () => void fetchCategorias(true)
  }
}
