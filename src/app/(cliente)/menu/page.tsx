'use client'
import {
  RefreshCw,
  Info,
  Loader2,
  Search
} from 'lucide-react'
import { useRouter, useSearchParams } from "next/navigation"
import React, { useState, useEffect } from "react"

import Loading from "@/app/loading"
import DishCard from '@/components/custom/dish-card'
// import { DishGridSkeleton } from '@/components/custom/dish-card-skeleton'
import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"
import { ClientDishCard } from '@/components/menu/client-dish-card'
import { MenuLayout } from '@/components/menu/menu-layout'
import { MoreOptionsCard } from '@/components/menu/more-options-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useMenuFiltering } from '@/hooks/use-menu-filtering'
import { useProductos } from '@/hooks/use-productos'

// Categorías basadas en tu API

export default function MenuPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoria = searchParams.get("categoria")
  //console.log("Categoría recibida por query param:", categoria)

  //const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  //const [cart, setCart] = useState<number[]>([])
  //const [favorites, setFavorites] = useState<number[]>([])
  // Track de categorías que ya se expandieron al menos una vez (para optimizar carga de imágenes)
  const [loadedCategories, setLoadedCategories] = useState<Set<string>>(new Set())
  //const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  //const [categorySearch, setCategorySearch] = useState("")

  // Usar el hook de la API
  const { productos, loading, fromCache, error, refetch } = useProductos()

  // Usar el hook de filtrado común
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    inputValue,
    setInputValue,
    filteredDishes,
    dishesByCategory,
    expandedCategories,
    setExpandedCategories,
    toggleCategory
  } = useMenuFiltering(productos)

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
  }, [categoria, categories, setSelectedCategory, setExpandedCategories])

  useEffect(() => {
    // Verificar autenticación
    const authStatus = localStorage.getItem("isAuthenticated")
    if (authStatus === "true") {
      setIsAuthenticated(true)
    }
  }, [router])

  // Extender la funcionalidad de toggleCategory con optimización de imágenes
  /*
  const toggleCategory = (category: string) => {
    const isExpanding = !expandedCategories[category]

    baseToggleCategory(category)

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
      }, 150) // Reducido de 300ms a 150ms para ser más instantáneo
    }
  }
  */

  // OPTIMIZACIÓN: Precargar automáticamente las primeras 2 categorías SOLO si no están en caché
  useEffect(() => {
    if (Object.keys(dishesByCategory).length > 0 && !loading && typeof window !== 'undefined') {
      const firstCategories = Object.entries(dishesByCategory).slice(0, 2)

      // Precargar las primeras 6 imágenes de cada una de las primeras 2 categorías
      // Solo si no están en caché del navegador
      firstCategories.forEach(([_, dishes]) => {
        dishes.slice(0, 6).forEach(dish => {
          if (dish.imagen_path) {
            // Verificar si ya está en caché antes de precargar
            const img = new window.Image()
            img.src = dish.imagen_path
            // Si ya está en caché del navegador, no hace nada (el navegador lo maneja)
            // Si no está, se precarga
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

  // En lugar de mostrar <Loading />, solo hacerlo si no hay data previa
  if (loading && productos.length === 0) {
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

        {/* Search and Filters - Shared between desktop and mobile */}
        <div className="mb-8">
          <div className="flex justify-center md:justify-center lg:justify-start mb-4">
            <div className="relative w-full md:w-full lg:w-1/2">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black-50 h-5 w-5" />
              <input
                placeholder="Buscar platos..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full h-12 text-lg rounded-[10px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] px-4 border border-gray-200"
                aria-label="Buscar productos"
                data-testid="search-input"
                data-cy="search-input"
              />
            </div>
          </div>

          {/* Category filter carousel */}
          <div className="relative">
            {inputValue.length > 0 ? (
              <div className="py-2">
                <div
                  className="inline-block bg-gray-200 text-gray-700 rounded-full px-4 py-2 text-sm font-medium"
                  aria-live="polite"
                >
                  {filteredDishes.length} {filteredDishes.length === 1 ? 'producto encontrado' : 'productos encontrados'}
                </div>
              </div>
            ) : (
              <div
                className="flex gap-2 overflow-x-auto scrollbar-hide py-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                role="group"
                aria-label="Filtros de categoría"
              >
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-4 py-2 whitespace-nowrap flex-shrink-0 ${selectedCategory === category
                      ? 'bg-[#004166] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    aria-pressed={selectedCategory === category}
                    data-testid={`category-${category.toLowerCase()}`}
                    data-cy={category === 'Todos' ? 'all-categories-btn' : 'category-button'}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* VISTA DESKTOP - Usa MenuLayout para evitar duplicación */}
        <div className="hidden md:block">
          <MenuLayout
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            inputValue={inputValue}
            onInputChange={setInputValue}
            filteredDishes={filteredDishes}
            dishesByCategory={dishesByCategory}
            expandedCategories={expandedCategories}
            onToggleCategory={toggleCategory}
            renderProductCard={(dish) => (
              <ClientDishCard
                dish={dish}
                showPrice={true}
                priority={!fromCache && !loadedCategories.has(dish.categoria.nombre)}
                disableAnimation={fromCache}
              />
            )}
            maxProductsPerCategory={8}
            renderMoreOptions={(category) => (
              <MoreOptionsCard
                category={category}
                onCategorySelect={setSelectedCategory}
              />
            )}
            renderCategorySkeleton={() => null}
            searchPlaceholder="Buscar platos..."
            showSearch={false}
          />
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
                          id: dishes[0]?.id || "",
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
                        priority={!fromCache && index < 3}
                        disableAnimation={fromCache}
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
                        id: dish.id,
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
                      priority={!fromCache && index < 4}
                      disableAnimation={fromCache}  // Solo las primeras 4 en mobile
                    />
                  ))}
                </div>
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
              <h2 className="text-4xl font-medium mb-8">Ítem No Disponible, Ingrese Otro</h2>
              <p className="text-foreground text-3xl font-normal mb-4">&ldquo;{inputValue}&rdquo;</p>
              <p className="text-foreground mt-2 text-xl">
                No Encontramos Ningún Ítem Con Tu Búsqueda<br />
                Revisa Ortografía O Prueba Con Términos Más Generales
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