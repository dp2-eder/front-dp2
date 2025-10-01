"use client"

import { Minus, Plus, Star, Clock } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"

import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"


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

// Menú estático de cevichería (mismo que en home)
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
    image: "/placeholder.jpg",
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
    image: "/placeholder.jpg",
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
    image: "/placeholder.jpg",
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
    image: "/placeholder.jpg",
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
    image: "/placeholder.jpg",
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
    image: "/placeholder.jpg",
    category: "Criollo",
    popular: true
  }
]

export default function PlatoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [dish, setDish] = useState<MenuItem | null>(null)

  useEffect(() => {
    const dishId = parseInt(params.id as string)
    const foundDish = localMenuItems.find(item => item.id === dishId)
    setDish(foundDish || null)
  }, [params.id])

  if (!dish) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Plato no encontrado</h2>
          <Link href="/home">
            <Button className="bg-[#0056C6] hover:bg-[#004299] text-white">
              Volver al menú
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const totalPrice = dish.price * quantity

  return (
    <div className="min-h-screen bg-[#FAFCFE] flex flex-col">
      {/* Header */}
      <Header 
        showFullNavigation={true}
      />

      {/* Main Content */}
      <main className="flex-1">
      <div className="max-w-[1110px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mobile: Image first, Desktop: Text first */}
          <div className="order-2 lg:order-1 space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">{dish.name}</h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="text-lg font-semibold text-gray-800">{dish.rating}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span>{dish.prepTime}</span>
                </div>
                <Badge variant="outline" className="text-gray-600">
                  {dish.category}
                </Badge>
              </div>

              <p className="text-base lg:text-lg text-gray-600 leading-relaxed mb-6">
                {dish.description}
              </p>
            </div>

            {/* Price and Quantity */}
            <Card className="p-6 bg-white border border-gray-200 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">PRECIO</p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-800">S/ {dish.price.toFixed(2)}</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-10 h-10 p-0"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-10 h-10 p-0"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-800">Total:</span>
                  <span className="text-xl lg:text-2xl font-bold text-[#0056C6]">S/ {totalPrice.toFixed(2)}</span>
                </div>
                
                <Button 
                  className="w-full h-12 bg-[#0056C6] hover:bg-[#004299] text-white text-lg font-semibold rounded-xl"
                  onClick={() => {
                    // Navegar a la página de detalle del pedido con el ID del plato
                    router.push(`/plato/${dish.id}/personalizar`)
                  }}
                >
                  Ordene Ahora
                </Button>
              </div>
            </Card>
          </div>

          {/* Mobile: Text second, Desktop: Image second */}
          <div className="order-1 lg:order-2 space-y-6">
            <div className="relative">
              <img
                src={dish.image || "/placeholder.svg"}
                alt={dish.name}
                className="w-full h-64 lg:h-96 object-cover rounded-2xl bg-gray-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.jpg"
                }}
              />
              {dish.popular && (
                <Badge className="absolute top-4 left-4 bg-yellow-500 text-white text-sm px-3 py-1">
                  Popular
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
</main>
      {/* Footer */}
      <Footer />
    </div>
  )
}