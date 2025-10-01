'use client'

import {
  Shrimp,
  User,
  LogOut,
  RefreshCw,
  Phone,
  CheckCircle,
  Info,
  Star,
  Clock,
  Wifi,
  Loader2,
  ShoppingCart,
  Search,
  Menu,
  Heart,
  ChevronDown,
  ChevronUp,
  Facebook,
  Instagram,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'


// Tipo para la API
interface ApiMenuItem {
  name: string
  price: string
  description: string
  image: string
}

// Tipo para nuestro menú local
interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  rating: number
  prepTime: string
  image: string
  category: string
  popular: boolean
}

// Menú estático de cevichería (se muestra por defecto)
const localMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "Ceviche Clásico",
    description: "Pescado fresco marinado en limón con cebolla morada, ají limo y camote",
    price: 25.00,
    rating: 4.9,
    prepTime: "15 min",
    image: "/fresh-ceviche-with-red-onions-and-sweet-potato.jpg",
    category: "Entradas",
    popular: true
  },
  {
    id: 2,
    name: "Ceviche Mixto",
    description: "Pescado, pulpo, camarones y conchas negras en leche de tigre especial",
    price: 32.00,
    rating: 4.8,
    prepTime: "18 min",
    image: "/mixed-seafood-ceviche-with-shrimp-and-octopus.jpg",
    category: "Entradas",
    popular: true
  },
  {
    id: 3,
    name: "Tiradito Nikkei",
    description: "Cortes finos de pescado con salsa nikkei, palta y ajonjolí",
    price: 28.00,
    rating: 4.7,
    prepTime: "12 min",
    image: "/tiradito-nikkei-with-thin-fish-slices-and-sesame.jpg",
    category: "Entradas",
    popular: false
  },
  {
    id: 4,
    name: "Arroz con Mariscos",
    description: "Arroz amarillo con mariscos frescos, culantro y ají amarillo",
    price: 35.00,
    rating: 4.6,
    prepTime: "25 min",
    image: "/peruvian-seafood-rice-with-cilantro.jpg",
    category: "Criollo",
    popular: false
  },
  {
    id: 5,
    name: "Causa Limeña",
    description: "Papa amarilla con pollo, palta y mayonesa casera",
    price: 24.00,
    rating: 4.5,
    prepTime: "10 min",
    image: "/causa-limena-with-yellow-potato-and-avocado.jpg",
    category: "Entradas",
    popular: false
  },
  {
    id: 6,
    name: "Leche de Tigre",
    description: "El jugo concentrado del ceviche con mariscos y cancha",
    price: 18.00,
    rating: 4.8,
    prepTime: "5 min",
    image: "/leche-de-tigre-with-seafood-and-corn-nuts.jpg",
    category: "Bebidas",
    popular: true
  },
  {
    id: 7,
    name: "Arroz chaufa de mariscos",
    description: "Arroz frito con mariscos frescos y vegetales",
    price: 30.00,
    rating: 4.7,
    prepTime: "20 min",
    image: "/chaudfa-de-mariscos-500x450.jpg",
    category: "Criollo",
    popular: false
  },
  {
    id: 8,
    name: "Chaufa de langostinos",
    description: "Arroz frito con langostinos y vegetales",
    price: 38.00,
    rating: 4.8,
    prepTime: "18 min",
    image: "/maxresdefault.jpg",
    category: "Criollo",
    popular: false
  },
  {
    id: 9,
    name: "Chaufa de pescado",
    description: "Arroz frito con pescado fresco y vegetales",
    price: 32.00,
    rating: 4.6,
    prepTime: "20 min",
    image: "/6143e231d4bfcf3c4448e32e.jpg",
    category: "Pescados",
    popular: false
  },
  {
    id: 10,
    name: "Arroz con conchas negras",
    description: "Arroz con conchas negras frescas y culantro",
    price: 40.00,
    rating: 4.9,
    prepTime: "25 min",
    image: "/4.-Rice-with-black-scallops.jpg",
    category: "Criollo",
    popular: true
  },
  {
    id: 11,
    name: "Arroz con pulpo",
    description: "Arroz con pulpo fresco y vegetales",
    price: 35.00,
    rating: 4.7,
    prepTime: "22 min",
    image: "/maxresdefault (1).jpg",
    category: "Criollo",
    popular: false
  },
  {
    id: 12,
    name: "Aeropuerto marino",
    description: "Combinación de arroz con mariscos variados",
    price: 42.00,
    rating: 4.8,
    prepTime: "30 min",
    image: "/HQJJGNr2pPfcKZpbZ-2400-x.jpg",
    category: "Criollo",
    popular: true
  }
]

const categories = ["Todos", "Criollo", "Pescados", "Bebidas", "Entradas"]
const VISIBLE_COUNT = 5
const visibleCategories = categories.slice(0, VISIBLE_COUNT)
const hasMoreCategories = categories.length > VISIBLE_COUNT

export default function MenuPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [menuItems, setMenuItems] = useState<MenuItem[]>(localMenuItems)
  const [isApiData, setIsApiData] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [searchTerm, setSearchTerm] = useState("")
  const [cart, setCart] = useState<number[]>([])
  const [favorites, setFavorites] = useState<number[]>([])
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({
    "Entradas": true,
    "Criollo": true,
    "Pescados": true,
    "Bebidas": true
  })
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [categorySearch, setCategorySearch] = useState("")

  useEffect(() => {
    // Verificar autenticación
    const authStatus = localStorage.getItem("isAuthenticated")
    if (authStatus === "true") {
      setIsAuthenticated(true)
    }
  }, [router])

  // Función para convertir datos de API a nuestro formato
  const convertApiDataToMenuItems = (apiData: ApiMenuItem[]): MenuItem[] => {
    return apiData.map((item, index) => {
      // Parsear los strings JSON anidados
      let name = item.name
      let price = '0'
      let description = item.description
      let image = "/placeholder.jpg" // Imagen por defecto

      try {
        // Intentar parsear el name
        const nameData = JSON.parse(item.name)
        if (Array.isArray(nameData) && nameData.length > 0) {
          name = nameData[0].line || item.name
        }
      } catch (e) {
        // Si no se puede parsear, usar el valor original
      }

      try {
        // Intentar parsear el price
        const priceData = JSON.parse(item.price)
        if (Array.isArray(priceData) && priceData.length > 0) {
          price = priceData[0].price || item.price
        }
      } catch (e) {
        price = item.price
      }

      try {
        // Intentar parsear la description
        const descData = JSON.parse(item.description)
        if (Array.isArray(descData) && descData.length > 0) {
          description = descData[0].line || item.description
        }
      } catch (e) {
        // Si no se puede parsear, usar el valor original
      }

      try {
        // Intentar parsear la image - AQUÍ ESTÁ EL FIX
        // Reemplazar comillas simples por dobles para hacer JSON válido
        const imageJsonString = item.image.replace(/'/g, '"')
        const imageData = JSON.parse(imageJsonString)
        if (imageData && imageData.url) {
          image = imageData.url
        }
      } catch (e) {
        console.error("Error parsing image URL:", e, "for item:", item.image)
        // Si falla, usar imagen local como fallback
        image = localMenuItems[index % localMenuItems.length]?.image || "/placeholder.jpg"
      }

      return {
        id: index + 1,
        name,
        description,
        price: parseFloat(price.replace(/[^\d.-]/g, '')) || 0,
        rating: 4.5 + Math.random() * 0.5, // Rating aleatorio entre 4.5-5.0
        prepTime: "15-20 min",
        image, // Usar la imagen de la API
        category: localMenuItems[index % localMenuItems.length]?.category || "Entradas",
        popular: Math.random() > 0.7 // 30% chance de ser popular
      }
    })
  }

  const handleViewMenu = async () => {
    setIsLoading(true)

    try {
      // PASO 1: Llamar a test-selenium
      setLoadingStep('Iniciando automatización Selenium...')

      const testResponse = await fetch('/api/auth/test-selenium', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const testResult = await testResponse.json()
      console.log('Test Selenium Result:', testResult)

      if (!testResult.success) {
        throw new Error(testResult.error || 'Error en test-selenium')
      }

      // Esperar un poco antes del siguiente paso
      await new Promise(resolve => setTimeout(resolve, 2000))

      // PASO 2: Llamar al menú
      setLoadingStep('Obteniendo datos del menú...')

      const menuResponse = await fetch('/api/menu/pizzas', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const menuResult = await menuResponse.json()
      console.log('Menu Result:', menuResult)

      if (!menuResult.success) {
        throw new Error(menuResult.error || 'Error al obtener menú')
      }

      const apiMenuData: ApiMenuItem[] = menuResult.data

      // Convertir datos de API a nuestro formato
      if (Array.isArray(apiMenuData) && apiMenuData.length > 0) {
        const convertedItems = convertApiDataToMenuItems(apiMenuData)
        setMenuItems(convertedItems)
        setIsApiData(true)
        setLastUpdate(new Date())
        setLoadingStep('¡Menú actualizado con datos de la API!')
      } else {
        throw new Error('No se recibieron datos válidos de la API')
      }

      await new Promise(resolve => setTimeout(resolve, 1500))

    } catch (error) {
      console.error('Error en API calls:', error)
      setLoadingStep(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`)
      setMenuItems(localMenuItems)
      setIsApiData(false)
      await new Promise(resolve => setTimeout(resolve, 3000))
    } finally {
      setIsLoading(false)
      setLoadingStep('')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("user")
    router.push("/")
  }

  const addToCart = (dishId: number) => {
    setCart((prev) => [...prev, dishId])
  }

  const toggleFavorite = (dishId: number) => {
    setFavorites((prev) => (prev.includes(dishId) ? prev.filter((id) => id !== dishId) : [...prev, dishId]))
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const filteredDishes = menuItems.filter((dish) => {
    const matchesCategory = selectedCategory === "Todos" || dish.category === selectedCategory
    const matchesSearch =
      dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Agrupar platos por categoría
  const dishesByCategory = filteredDishes.reduce((acc, dish) => {
    if (!acc[dish.category]) {
      acc[dish.category] = []
    }
    acc[dish.category].push(dish)
    return acc
  }, {} as { [key: string]: MenuItem[] })

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-2xl">
          <CardContent className="p-8 text-center">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center mx-auto">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Actualizando Sistema</h3>
                <p className="text-foreground text-sm">{loadingStep}</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full animate-pulse transition-all duration-500"
                  style={{ width: isLoading ? '75%' : '100%' }}></div>
              </div>
              <div className="text-xs text-gray-500 flex items-center justify-center space-x-1">
                <Wifi className="w-3 h-3" />
                <span>Conectando con scrapper-dp2-fork.onrender.com</span>
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
      <Header
        showFullNavigation={true}
      />

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

          <div className="flex gap-2 flex-wrap justify-center md:justify-center lg:justify-start">
            {visibleCategories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 ${selectedCategory === category
                  ? "bg-secondary text-white hover:bg-secondary "
                  : "bg-white text-black hover:bg-gray-300"
                  }`}
              >
                {category}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="rounded-full px-4 py-2 bg-gray-200 text-foreground hover:bg-gray-300"
              onClick={() => setIsCategoryModalOpen(true)}
              aria-label="Ver todas las categorías"
              title="Ver todas las categorías"
            >
              …
            </Button>
          </div>
        </div>

        {/* API Status */}
        {isApiData && lastUpdate && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
              <p className="text-sm text-green-700">
                Datos de API actualizados: {lastUpdate.toLocaleTimeString()}
                ({menuItems.length} items)
              </p>
            </div>
          </div>
        )}

        {!isApiData && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex items-center">
              <Info className="w-5 h-5 text-yellow-400 mr-2" />
              <p className="text-sm text-yellow-700">
                Mostrando menú local de cevichería. Haz click en &quot;Actualizar Menú&quot; para obtener datos externos.
              </p>
            </div>
          </div>
        )}

        {/* Menu Sections */}
        {filteredDishes.length > 0 ? (
          Object.entries(dishesByCategory).map(([category, dishes]) => (
            <div key={category} className="mb-8">
              {/* Category Section */}
              <div className="bg-gray-200 rounded-lg p-6 shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
                {/* Category Header */}
                <div
                  className="flex items-center cursor-pointer mb-4"
                  onClick={() => toggleCategory(category)}
                >
                  <h2 className="flex-1 text-[30px] md:text-[30px] lg:text-[40px] text-foreground text-center font-extrabold">{category}</h2>

                  {expandedCategories[category] ? (
                    <ChevronUp className="w-5 h-5 text-primary" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-primary" />
                  )}
                </div>
                {/* Mostrar <hr> solo si está expandido */}
                {expandedCategories[category] && <hr className="border-primary" />}

                {/* Dishes Grid */}
                {expandedCategories[category] && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 py-5">
                    {dishes.map((dish) => (
                      <Link key={dish.id} href={`/plato/${dish.id}`}>
                        <article className="text-center cursor-pointer hover:scale-105 transition-transform duration-200 rounded-3xl border border-[#EFEFFD] shadow-[0_4px_4px_rgba(0,0,0,0.25)] overflow-hidden">
                          {/* Image Placeholder */}
                          <div className="relative">
                            <img
                              src={dish.image || "/placeholder.svg"}
                              alt={dish.name || "Imagen no disponible"}
                              className="object-cover bg-gray-300 aspect-[16/9]"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = "/placeholder.jpg"
                              }}
                            />
                            {dish.popular && (
                              <Badge className="absolute top-1 left-1 bg-yellow-500 text-white text-xs">Popular</Badge>
                            )}
                          </div>

                          {/* Dish Name */}
                          <h3 className="bg-primary text-white px-2 py-2 text-sm font-medium">
                            {dish.name || "Nombre no disponible"}
                          </h3>

                          {/* Price */}
                          {/*
                          <p className="mt-1 text-sm font-bold text-gray-800">
                            {isApiData ? `$${dish.price.toFixed(2)}` : `S/ ${dish.price.toFixed(2)}`} 
                          </p>
                          */}
                        </article>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <Card className="p-8 text-center bg-[#F5F7FA] shadow-sm rounded-xl">
            <div className="flex flex-col items-center">
              <Search className="w-10 h-10 text-gray-500 mb-4" />
              <h2 className="text-xl font-bold mb-2">No Tenemos El Producto</h2>
              <p className="text-gray-600 mb-2">Ingrese Otro</p>
              <p className="text-[#0056C6] font-semibold">"{searchTerm}"</p>
              <p className="text-gray-500 mt-2 text-sm">
                No encontramos ningún producto con tu búsqueda.<br />
                Revisa ortografía o prueba con términos más generales.
              </p>
            </div>
          </Card>
        )}

        {/* MODAL */}
        <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
          <DialogContent className="w-[95vw] max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto rounded-lg">
            <DialogHeader>
              <DialogTitle>Selección de filtros</DialogTitle>
            </DialogHeader>

            <div className="mb-3">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar categoría…"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="pr-9"
                />
              </div>
            </div>

            {/* Listado scrollable */}
            <div className="space-y-2 max-h-[50vh] overflow-auto pr-1">
              {categories
                .filter(c => c.toLowerCase().includes(categorySearch.toLowerCase()))
                .map((c) => {
                  const active = selectedCategory === c
                  return (
                    <button
                      key={c}
                      onClick={() => {
                        setSelectedCategory(c)
                        setIsCategoryModalOpen(false)
                        setCategorySearch("")
                      }}
                      className={[
                        "w-full rounded-xl border px-4 py-3 text-sm font-medium transition",
                        active
                          ? "bg-[#0056C6] text-white border-transparent"
                          : "bg-white hover:bg-gray-100 border-gray-200 text-gray-800"
                      ].join(" ")}
                    >
                      {c}
                    </button>
                  )
                })}
            </div>
          </DialogContent>
        </Dialog>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}