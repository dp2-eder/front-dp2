import { useState, useEffect, useMemo } from 'react'

import { Producto } from '@/types/productos'

import { useDebounce } from './use-debounce'

interface UseMenuFilteringReturn {
  categories: string[]
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  inputValue: string
  setInputValue: (value: string) => void
  filteredDishes: Producto[]
  dishesByCategory: { [key: string]: Producto[] }
  expandedCategories: { [key: string]: boolean }
  setExpandedCategories: (fn: (prev: { [key: string]: boolean }) => { [key: string]: boolean }) => void
  toggleCategory: (category: string) => void
  debouncedSearchTerm: string
}

export function useMenuFiltering(productos: Producto[]): UseMenuFilteringReturn {
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [inputValue, setInputValue] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({})
  const debouncedSearchTerm = useDebounce(inputValue, 500)

  // Generar categorías dinámicamente desde la API (memoizado para evitar loops infinitos)
  const categories = useMemo(() =>
    Array.isArray(productos) && productos.length > 0
      ? ['Todos', ...Array.from(new Set(productos.map(item => item.categoria.nombre))).sort()]
      : ['Todos'],
    [productos]
  )

  // Filtrar platos por categoría y búsqueda
  const filteredDishes = productos.filter((dish) => {
    const matchesCategory = selectedCategory === 'Todos' || dish.categoria.nombre === selectedCategory
    const matchesSearch =
      (dish.nombre || '').toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Agrupar platos por categoría
  const dishesByCategory = filteredDishes.reduce((acc, dish) => {
    const category = dish.categoria.nombre
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(dish)
    return acc
  }, {} as { [key: string]: Producto[] })

  // Inicializar todas las categorías colapsadas (solo una vez al montar)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (Object.keys(expandedCategories).length === 0 && categories.length > 0) {
      const initialExpanded = categories.reduce((acc, category) => {
        acc[category] = false
        return acc
      }, {} as { [key: string]: boolean })
      setExpandedCategories(initialExpanded)
    }
  }, [])

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  return {
    categories,
    selectedCategory,
    setSelectedCategory,
    inputValue,
    setInputValue,
    filteredDishes,
    dishesByCategory,
    expandedCategories,
    setExpandedCategories,
    toggleCategory,
    debouncedSearchTerm
  }
}
