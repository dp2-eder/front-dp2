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
import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"
import { Button } from '@/components/ui/button'
import { Card, CardContent} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useMenu } from '@/hooks/use-menu'
import { Root2 } from '@/types/menu'

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
  //const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  //const [categorySearch, setCategorySearch] = useState("")

  // Usar el hook de la API
  const { menuItems, loading, error, refetch } = useMenu()

  // Generar categorías dinámicamente desde la API
  const categories = React.useMemo(() => {
    if (!menuItems.length) return ["Todos"]
    
    const uniqueCategories = Array.from(new Set(menuItems.map(item => item.categoria)))
    return ["Todos", ...uniqueCategories.sort()]
  }, [menuItems])

  // Manejar categoría desde URL params
  useEffect(() => {
    //console.log("Categoría recibida por query param:", categoria)
    if (categoria && categories.length > 0) {
      // Verificar que la categoría existe en las categorías disponibles
      const categoryExists = categories.includes(categoria)
      if (categoryExists) {
        setSelectedCategory(categoria)
      }
    }
  }, [categoria, categories])

  // Inicializar expandedCategories con las categorías dinámicas
  React.useEffect(() => {
    if (menuItems.length > 0) {
      const initialExpanded = categories.reduce((acc, category) => {
        if (category !== "Todos") {
          acc[category] = true
        }
        return acc
      }, {} as { [key: string]: boolean })
      setExpandedCategories(initialExpanded)
    }
  }, [menuItems, categories])

  useEffect(() => {
    // Verificar autenticación
    const authStatus = localStorage.getItem("isAuthenticated")
    if (authStatus === "true") {
      setIsAuthenticated(true)
    }
  }, [router])

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  // Filtrar platos por categoría y búsqueda
  const filteredDishes = menuItems.filter((dish) => {
    const matchesCategory = selectedCategory === "Todos" || dish.categoria === selectedCategory
    const matchesSearch =
      dish.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dish.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Agrupar platos por categoría
  const dishesByCategory = filteredDishes.reduce((acc, dish) => {
    const category = dish.categoria
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(dish)
    return acc
  }, {} as { [key: string]: Root2[] })

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
    <div className="min-h-screen bg-gray-100">
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
              />
            </div>
          </div>

          {/* Carrusel de categorías horizontal sin flechitas */}
          <div className="relative">
            <div
              className="flex gap-2 overflow-x-auto scrollbar-hide py-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-2 whitespace-nowrap flex-shrink-0 ${
                    selectedCategory === category
                      ? "bg-[#0056C6] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Sections */}
        {filteredDishes.length > 0 ? (
          <>
            {/* VISTA MOBILE */}
            <div className="md:hidden">
              {!selectedCategory || selectedCategory === "Todos" ? (
                <div className="grid grid-cols-1 gap-6">
                  {Object.entries(dishesByCategory).map(([category, dishes]) => (
                    <div
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className="cursor-pointer"
                    >
                      <DishCard
                        dish={{
                          id: dishes[0]?.id ?? 0,
                          nombre: category,
                          descripcion: "",
                          precio: 0,
                          imagen: dishes[0]?.imagen || "/placeholder.svg",
                          categoria: category,
                          disponible: true,
                          stock: 0,
                          alergenos: [],
                          tiempo_preparacion: 0,
                          ingredientes: [],
                          grupo_personalizacion: undefined
                        }}
                        className="pointer-events-none"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {dishesByCategory[selectedCategory]?.map((dish) => (
                    <DishCard
                      key={dish.id}
                      dish={dish}
                      showPrice={true}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* VISTA DESKTOP */}
            <div className="hidden md:block">
              {Object.entries(dishesByCategory).map(([category, dishes]) => (
                <div key={category} className="mb-8">
                  <div className="bg-gray-200 rounded-lg p-6">
                    {/* Header categoría */}
                    <div
                      className="flex items-center cursor-pointer mb-4"
                      onClick={() => toggleCategory(category)}
                    >
                      <h2 className="text-xl font-bold text-gray-800 flex-1 text-center">
                        {category}
                      </h2>
                      {expandedCategories[category] ? (
                        <ChevronUp className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      )}
                    </div>

                    {/* Línea solo expandido */}
                    {expandedCategories[category] && <hr className="border-blue-700" />}

                    {/* Platos */}
                    {expandedCategories[category] && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-5">
                        {dishes.map((dish) => (
                          <DishCard
                            key={dish.id}
                            dish={dish}
                            showPrice={true}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <Card className="p-8 text-center bg-[#F5F7FA] shadow-sm rounded-xl">
            <div className="flex flex-col items-center">
              <Search className="w-10 h-10 text-gray-500 mb-4" />
              <h2 className="text-xl font-bold mb-2">No Tenemos El Producto</h2>
              <p className="text-gray-600 mb-2">Ingrese Otro</p>
              <p className="text-[#004166] font-semibold">&ldquo;{searchTerm}&rdquo;</p>
              <p className="text-gray-500 mt-2 text-sm">
                No encontramos ningún producto con tu búsqueda.<br />
                Revisa ortografía o prueba con términos más generales.
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