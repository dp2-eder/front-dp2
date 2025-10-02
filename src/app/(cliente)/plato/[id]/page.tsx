"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"

import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import BackButton from "@/components/ui/back-button"
import { useMenu } from "@/hooks/use-menu"
import { Root2 } from "@/types/menu"

export default function PlatoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [dish, setDish] = useState<Root2 | null>(null)
  const [loading, setLoading] = useState(true)

  // Usar el hook de la API
  const { menuItems, loading: apiLoading, error } = useMenu()

  useEffect(() => {
    if (!apiLoading && menuItems.length > 0) {
      const dishId = parseInt(params.id as string)
      const foundDish = menuItems.find(item => item.id === dishId)
      setDish(foundDish || null)
      setLoading(false)
    }
  }, [params.id, menuItems, apiLoading])

  if (apiLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0056C6] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando plato...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error al cargar el plato</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <BackButton href="/menu" text="Volver al menú" />
        </div>
      </div>
    )
  }

  if (!dish) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Plato no encontrado</h2>
          <BackButton href="/menu" text="Volver al menú" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFCFE] flex flex-col">
      {/* Header */}
      <Header showFullNavigation={true} />

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-[1110px] mx-auto px-4 py-8">
          {/* Botón Volver */}
          <div className="mb-8">
            <BackButton href="/menu" text="Volver Al Menú" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mobile: Image first, Desktop: Text first */}
            <div className="order-2 lg:order-1 space-y-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">{dish.nombre}</h1>
                
                {/* Categoría */}
                <div className="mb-4">
                  <span className="inline-block bg-[#0056C6] text-white px-3 py-1 rounded-full text-sm font-medium">
                    {dish.categoria}
                  </span>
                </div>
                
                <p className="text-base lg:text-lg text-gray-600 leading-relaxed mb-6">
                  {dish.descripcion}
                </p>

                {/* Información adicional de la API */}
                <div className="space-y-2 mb-6">
                  {dish.alergenos && (
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Alérgenos:</span> {dish.alergenos}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Tiempo de preparación:</span> {dish.tiempo_preparacion} minutos
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Disponible:</span> {dish.disponible ? 'Sí' : 'No'}
                  </p>
                </div>
              </div>

              {/* Solo el botón Ordene Ahora */}
              <div className="flex justify-center">
                <Button 
                  className="w-full max-w-md h-12 bg-[#0056C6] hover:bg-[#004299] text-white text-lg font-semibold rounded-xl"
                  onClick={() => {
                    router.push(`/plato/${dish.id}/personalizar`)
                  }}
                  disabled={!dish.disponible}
                >
                  {dish.disponible ? 'Ordene Ahora' : 'No Disponible'}
                </Button>
              </div>
            </div>

            {/* Mobile: Text second, Desktop: Image second */}
            <div className="order-1 lg:order-2 space-y-6">
              <div className="relative">
                <img
                  src={dish.imagen}
                  alt={dish.nombre}
                  className="w-full h-64 lg:h-96 object-cover rounded-2xl bg-gray-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.jpg"
                  }}
                />
                {!dish.disponible && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
                    <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
                      Agotado
                    </span>
                  </div>
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