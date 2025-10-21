import { useState, useEffect } from 'react'

import { CategoriasResponse } from '@/types/categorias'

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

export function useCategorias() {
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

  const fetchCategorias = async (force = false) => {
    try {
      // Si hay cache válido y no es forzado, usar cache
      if (!force && cachedCategorias && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
        setCategorias(cachedCategorias)
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/categorias', {
        next: { revalidate: 300 } // Cache en el cliente también
      })
      const result = await response.json() as { success: boolean; data: CategoriasResponse; error?: string }
      
      if (result.success) {
        // Convertir URLs de Google Drive a URLs directas
        const categoriasConImagenes = result.data.items.map(categoria => ({
          ...categoria,
          imagen_path: convertGoogleDriveUrl(categoria.imagen_path)
        }))
        
        // Actualizar cache global
        cachedCategorias = categoriasConImagenes
        cacheTimestamp = Date.now()
        
        setCategorias(categoriasConImagenes)
      } else {
        setError(result.error || 'Error al cargar las categorías')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchCategorias()
  }, [])

  return {
    categorias,
    loading,
    error,
    refetch: () => void fetchCategorias(true)
  }
}
