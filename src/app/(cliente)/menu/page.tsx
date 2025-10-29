'use client'
import {
  RefreshCw,
  Info,
  Loader2,
  Search,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { useSearchParams, useRouter } from "next/navigation"
import React, { useState, useEffect } from "react"

import Loading from "@/app/loading"
import DishCard from '@/components/custom/dish-card'
import { DishGridSkeleton } from '@/components/custom/dish-card-skeleton'
import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useProductos } from '@/hooks/use-productos'
import { Producto } from '@/types/productos'

// Categorías basadas en tu API

export default function MenuPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoria = searchParams.get("categoria")
  //console.log("Categoría recibida por query param:", categoria)

  //const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("Todos") // Mostrar todos por defecto
  const [searchTerm, setSearchTerm] = useState("")
  //const [cart, setCart] = useState<number[]>([])
  //const [favorites, setFavorites] = useState<number[]>([])
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({})
  // Track de categorías que ya se expandieron al menos una vez (para optimizar carga de imágenes)
  const [loadedCategories, setLoadedCategories] = useState<Set<string>>(new Set())
  // Track de categorías que están cargando actualmente
  const [loadingCategories, setLoadingCategories] = useState<Set<string>>(new Set())
  //const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  //const [categorySearch, setCategorySearch] = useState("")

  // Usar el hook de la API
  const { productos, loading, error, refetch } = useProductos()

  // Generar categorías dinámicamente desde la API
  const categories = React.useMemo(() => {
    if (!productos.length) return ["Todos"]

    const uniqueCategories = Array.from(new Set(productos.map(item => item.categoria.nombre)))
    return ["Todos", ...uniqueCategories.sort()]
  }, [productos])

  // Manejar categoría desde URL params
  useEffect(() => {
    //console.log("Categoría recibida por query param:", categoria)
    if (categoria && categories.length > 0) {
      // Verificar que la categoría existe en las categorías disponibles
      const categoryExists = categories.includes(categoria)
      if (categoryExists) {
        setSelectedCategory(categoria)
        // OPTIMIZACIÓN: Si viene de una categoría específica, solo expandir esa
        setExpandedCategories(prev => ({
          ...prev,
          [categoria]: true
        }))
        // Marcar como cargada
        setLoadedCategories(prev => new Set([...prev, categoria]))
      }
    }
  }, [categoria, categories])

  // Inicializar expandedCategories con las categorías dinámicas
  // OPTIMIZACIÓN: Todas colapsadas por defecto para carga más rápida
  React.useEffect(() => {
    if (productos.length > 0) {
      const initialExpanded = categories.reduce((acc, category) => {
        if (category !== "Todos") {
          acc[category] = false // ← Todas colapsadas por defecto
        }
        return acc
      }, {} as { [key: string]: boolean })
      setExpandedCategories(initialExpanded)
    }
  }, [productos, categories])

  useEffect(() => {
    // Verificar autenticación
    const authStatus = localStorage.getItem("isAuthenticated")
    if (authStatus === "true") {
      setIsAuthenticated(true)
    }
  }, [router])

  const toggleCategory = (category: string) => {
    const isExpanding = !expandedCategories[category]

    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))

    // Si se está expandiendo por primera vez, marcar como cargando
    if (isExpanding && !loadedCategories.has(category)) {
      setLoadingCategories(prev => new Set([...prev, category]))

      // Reducir tiempo de skeleton - solo 300ms ahora
      // Si las imágenes están en cache, se verá aún más rápido
      setTimeout(() => {
        setLoadedCategories(prev => new Set([...prev, category]))
        setLoadingCategories(prev => {
          const newSet = new Set(prev)
          newSet.delete(category)
          return newSet
        })
      }, 300) // Reducido de 400ms a 300ms para ser más instantáneo
    }
  }
  
  // Función para precargar imágenes al hacer hover (mejorada)
  const handleCategoryHover = (category: string, dishes: typeof productos) => {
    // Solo precargar si no está ya cargada
    if (!loadedCategories.has(category) && !loadingCategories.has(category)) {
      // Precargar las primeras 6 imágenes (aumentado de 3 a 6)
      dishes.slice(0, 6).forEach(dish => {
        if (dish.imagen_path) {
          const img = new Image()
          img.src = dish.imagen_path
        }
      })
    }
  }

  // Filtrar platos por categoría y búsqueda - Memoizado para evitar recalcular en cada render
  const filteredDishes = React.useMemo(() => {
    return productos.filter((dish) => {
      const matchesCategory = selectedCategory === "Todos" || dish.categoria.nombre === selectedCategory
      const matchesSearch =
        (dish.nombre || '').toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [productos, selectedCategory, searchTerm])

  // Función para precargar imágenes al hacer hover (mejorada)
  const handleCategoryHover = (category: string, dishes: typeof productos) => {
    // Solo precargar si no está ya cargada
    if (!loadedCategories.has(category) && !loadingCategories.has(category)) {
      // Precargar las primeras 6 imágenes (aumentado de 3 a 6)
      dishes.slice(0, 6).forEach(dish => {
        if (dish.imagen_path) {
          const img = new Image()
          img.src = dish.imagen_path
        }
      })
    }
  }

  // Filtrar platos por categoría y búsqueda - Memoizado para evitar recalcular en cada render
  const filteredDishes = React.useMemo(() => {
    return productos.filter((dish) => {
      const matchesCategory = selectedCategory === "Todos" || dish.categoria.nombre === selectedCategory
      const matchesSearch =
        (dish.nombre || '').toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [productos, selectedCategory, searchTerm])

  // Agrupar platos por categoría - Memoizado
  const dishesByCategory = React.useMemo(() => {
    return filteredDishes.reduce((acc, dish) => {
      const category = dish.categoria.nombre
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(dish)
      return acc
    }, {} as { [key: string]: Producto[] })
  }, [filteredDishes])

  // OPTIMIZACIÓN: Precargar automáticamente las primeras 2 categorías
  useEffect(() => {
    if (Object.keys(dishesByCategory).length > 0 && !loading) {
      const firstCategories = Object.entries(dishesByCategory).slice(0, 2)

      // Precargar las primeras 6 imágenes de cada una de las primeras 2 categorías
      firstCategories.forEach(([_, dishes]) => {
        dishes.slice(0, 6).forEach(dish => {
          if (dish.imagen_path) {
            const img = new Image()
            img.src = dish.imagen_path
          }
        })
      })
    }
  }, [dishesByCategory, loading])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center">
        <div className="text-white text-xl flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Verificando autenticación...</span>
        </div>
      </div>
    )
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white shadow-2xl border-0 rounded-2xl">
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <Info className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Error al Cargar Menú</h3>
                <p className="text-foreground text-sm mb-4">{error}</p>
                <Button onClick={refetch} className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reintentar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white" data-cy="page-container">
      {/* Header */}
      <Header showFullNavigation={true} />

      {/* Main Content */}
      <main className="container mx-auto px-8 py-20">
        {/* Title */}
        <h1 className="text-4xl font-bold text-center text-foreground mb-8">Nuestro Menú</h1>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex justify-center md:justify-center lg:justify-start mb-4">
            <div className="relative w-full md:w-full lg:w-1/2">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black-50 h-5 w-5" />
              <Input
                placeholder="Buscar platos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 text-lg rounded-[10px] shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
                aria-label="Buscar platos"
                data-testid="search-input"
                data-cy="search-input"
              />
            </div>
          </div>

          {/*Renderizado condicional de filtros o recuento de búsqueda */}
          <div className="relative">
            {searchTerm.length > 0 ? (
              // CUANDO HAY BÚSQUEDA: Mostrar recuento de resultados
              <div className="py-2"> {/* Contenedor para mantener el espaciado vertical */}
                <div
                  className="inline-block bg-gray-200 text-gray-700 rounded-full px-4 py-2 text-sm font-medium"
                  aria-live="polite" // Mejora de accesibilidad: anuncia los cambios a lectores de pantalla
                >
                  {filteredDishes.length} {filteredDishes.length === 1 ? 'producto encontrado' : 'productos encontrados'}
                </div>
              </div>
            ) : (
              // CUANDO NO HAY BÚSQUEDA: Mostrar carrusel de categorías
              <div
                className="flex gap-2 overflow-x-auto scrollbar-hide py-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                role="group"
                aria-label="Filtros de categoría"
              >
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-4 py-2 whitespace-nowrap flex-shrink-0 ${selectedCategory === category
                      ? "bg-[#0056C6] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    aria-pressed={selectedCategory === category}
                    data-testid={`category-${category.toLowerCase()}`}
                    data-cy={category === "Todos" ? "all-categories-btn" : "category-button"}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Menu Sections */}
        {filteredDishes.length > 0 ? (
          <>
            {/* VISTA MOBILE */}
            <div className="md:hidden">
              {/* Título dinámico según categoría seleccionada */}
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                {!selectedCategory || selectedCategory === "Todos" ? "Categorías" : selectedCategory}
              </h2>

              {!selectedCategory || selectedCategory === "Todos" ? (
                <div className="grid grid-cols-1 gap-6">
                  {Object.entries(dishesByCategory).map(([category, dishes], index) => (
                    <div
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className="cursor-pointer"
                    >
                      <DishCard
                        dish={{
                          id: dishes[0]?.id as unknown as number,
                          nombre: category,
                          descripcion: "",
                          precio: 0,
                          imagen: dishes[0]?.categoria.imagen_path || "/placeholder.svg", // ← Usar imagen de categoría
                          categoria: category,
                          disponible: true,
                          stock: 0,
                          alergenos: [],
                          tiempo_preparacion: 0,
                          ingredientes: [],
                          grupo_personalizacion: undefined
                        }}
                        className="pointer-events-none"
                        priority={index < 3}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {dishesByCategory[selectedCategory]?.map((dish, index) => (
                    <DishCard
                      key={dish.id}
                      dish={{
                        id: dish.id as unknown as number,
                        nombre: dish.nombre || 'Sin nombre',
                        imagen: dish.imagen_path || '/placeholder-image.png',
                        precio: parseFloat(dish.precio_base),
                        stock: 10,
                        disponible: true,
                        categoria: dish.categoria.nombre,
                        alergenos: [],
                        tiempo_preparacion: 15,
                        descripcion: '',
                        ingredientes: [],
                        grupo_personalizacion: []
                      }}
                      showPrice={true}
                      priority={index < 5} // Solo las primeras 4 en mobile
                    />
                  ))}
                </div>
              )}
            </div>

            {/* VISTA DESKTOP */}
            <div className="hidden md:block">
              {selectedCategory === "Todos" ? (
                // Vista con contenedores expandibles cuando está en "Todos"
                Object.entries(dishesByCategory).map(([category, dishes]) => (
                  <div key={category} className="mb-8">
                    <div className="bg-gray-200 rounded-lg p-6 transition-all duration-200 hover:shadow-md">
                      {/* Header categoría */}
                      <div
                        className="flex items-center cursor-pointer mb-4 group"
                        onClick={() => toggleCategory(category)}
                        onMouseEnter={() => handleCategoryHover(category, dishes)}
                      >
                        <h2 className="text-xl font-bold text-gray-800 flex-1 text-center group-hover:text-[#0056C6] transition-colors">
                          {category}
                        </h2>
                        {expandedCategories[category] ? (
                          <ChevronUp className="w-6 h-6 text-gray-600 group-hover:text-[#0056C6] transition-colors" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-gray-600 group-hover:text-[#0056C6] transition-colors" />
                        )}
                      </div>

                      {/* Línea solo expandido */}
                      {expandedCategories[category] && <hr className="border-blue-700" />}

                      {/* Platos o Skeleton */}
                      {expandedCategories[category] && (
                        <>
                          {loadingCategories.has(category) ? (
                            <DishGridSkeleton count={Math.min(dishes.length, 6)} />
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-5" data-cy="plate-grid">
                              {/* Mostrar solo las primeras 8 cards */}
                              {dishes.slice(0, 8).map((dish, index) => {
                                const isFirstLoad = !loadedCategories.has(category)
                                const shouldPrioritize = isFirstLoad && index < 6

                                return (
                                  <DishCard
                                    key={dish.id}
                                    dish={{
                                      id: dish.id as unknown as number,
                                      nombre: dish.nombre || 'Sin nombre',
                                      imagen: dish.imagen_path || '/placeholder-image.png',
                                      precio: parseFloat(dish.precio_base),
                                      stock: 10,
                                      disponible: true,
                                      categoria: dish.categoria.nombre,
                                      alergenos: [],
                                      tiempo_preparacion: 15,
                                      descripcion: '',
                                      ingredientes: [],
                                      grupo_personalizacion: []
                                    }}
                                    showPrice={true}
                                    priority={shouldPrioritize}
                                  />
                                )
                              })}
                              
                              {/* Card "Más opciones..." si hay más de 8 platos */}
                              {dishes.length > 8 && (
                                <div
                                  onClick={() => setSelectedCategory(category)}
                                  className="cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center bg-[#004166] text-white"
                                  style={{ minHeight: '300px' }}
                                >
                                  <div className="text-center p-6">
                                    <h3 className="text-2xl font-bold">Más opciones...</h3>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                // Vista sin contenedor cuando hay una categoría específica seleccionada
                Object.entries(dishesByCategory).map(([category, dishes]) => (
                  <div key={category} className="mb-8">
                    {/* Solo el título de la categoría */}
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                      {category}
                    </h2>
                    
                    {/* Cards directamente sin contenedor */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-cy="plate-grid">
                      {dishes.map((dish, index) => (
                        <DishCard
                          key={dish.id}
                          dish={{
                            id: dish.id as unknown as number,
                            nombre: dish.nombre || 'Sin nombre',
                            imagen: dish.imagen_path || '/placeholder-image.png',
                            precio: parseFloat(dish.precio_base),
                            stock: 10,
                            disponible: true,
                            categoria: dish.categoria.nombre,
                            alergenos: [],
                            tiempo_preparacion: 15,
                            descripcion: '',
                            ingredientes: [],
                            grupo_personalizacion: []
                          }}
                          showPrice={true}
                          priority={index < 6}
                        />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <Card className="p-8 text-center bg-unavailable rounded-3xl">
            <div className="flex flex-col items-center">
              <Search
                className="w-24 h-24 mt-5 mb-16 text-foreground"
                strokeWidth={0.5}
                stroke="currentColor"
              />
              <h2 className="text-4xl font-medium mb-8">Ítem no disponible, ingrese otro</h2>
              <p className="text-foreground text-3xl font-normal mb-4">&ldquo;{searchTerm}&rdquo;</p>
              <p className="text-foreground mt-2 text-xl">
                No encontramos ningún ítem con tu búsqueda<br />
                Revisa ortografía o prueba con términos más generales
              </p>
            </div>
          </Card>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}