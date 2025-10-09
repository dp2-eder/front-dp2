import { useState, useEffect } from 'react'

import { ProductosResponse } from '@/types/productos'

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
  const [productos, setProductos] = useState<ProductosResponse['items']>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProductos = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/productos')
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
    refetch: () => void fetchProductos()
  }
}
