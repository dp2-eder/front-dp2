import { useState, useEffect } from 'react'
import { Root, Root2 } from '@/types/menu'

interface UseMenuReturn {
  menuItems: Root2[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useMenu(): UseMenuReturn {
  const [menuItems, setMenuItems] = useState<Root2[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMenu = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/menu/items')
      const result = await response.json()
      
      if (result.success) {
        setMenuItems(result.data)
      } else {
        setError(result.error || 'Error al cargar el menú')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMenu()
  }, [])

  return {
    menuItems,
    loading,
    error,
    refetch: fetchMenu
  }
}
