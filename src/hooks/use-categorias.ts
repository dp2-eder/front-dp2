import { useState, useEffect } from 'react'

import { CategoriasResponse } from '@/types/categorias'

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
  const [categorias, setCategorias] = useState<CategoriasResponse['items']>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategorias = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/categorias')
      const result = await response.json() as { success: boolean; data: CategoriasResponse; error?: string }
      
      if (result.success) {
        // Convertir URLs de Google Drive a URLs directas
        const categoriasConImagenes = result.data.items.map(categoria => ({
          ...categoria,
          imagen_path: convertGoogleDriveUrl(categoria.imagen_path)
        }))
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
    refetch: () => void fetchCategorias()
  }
}
