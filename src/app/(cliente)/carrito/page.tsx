"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Minus, Plus, Trash2, ShoppingBag, Menu } from "lucide-react"

import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"
import BackButton from "@/components/ui/back-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/hooks/use-cart"
import Loading from "@/app/loading"

export default function CarritoPage() {
  const router = useRouter()
  const { cart, updateQuantity, removeFromCart, clearCart, total, itemCount } = useCart()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const handleCheckout = () => {
    if (cart.length === 0) return
    router.push('/pago')
  }

  if (isLoading) {
    return <Loading />
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAFCFE] flex flex-col">
        <Header showFullNavigation={true} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-600 mb-6">Agrega algunos platos deliciosos</p>
            <BackButton href="/menu" text="Ver menú" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFCFE] flex flex-col">
      {/* Header */}
      <Header showFullNavigation={true} />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Título */}
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Mi Orden</h1>

          {/* Lista De Artículos */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Lista De Artículos</h2>
            
            <div className="space-y-4">
              {cart.map((item) => (
                <Card key={item.id} className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                  <div className="flex gap-4">
                    {/* Imagen del producto */}
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.jpg"
                        }}
                      />
                    </div>

                    {/* Detalles del producto */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800 mb-2">{item.name}</h3>
                      
                      {/* Comentarios */}
                      {item.comments && (
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Comentarios:</span> {item.comments}
                        </p>
                      )}

                      {/* Opciones seleccionadas */}
                      {item.selectedOptions.length > 0 && (
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Opciones:</span>
                          {item.selectedOptions.map((option, index) => (
                            <span key={index}>
                              {option.name} {option.price > 0 && `(+S/ ${option.price.toFixed(2)})`}
                              {index < item.selectedOptions.length - 1 && ", "}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Precio unitario */}
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Precio unitario:</span> S/ {item.basePrice.toFixed(2)}
                      </p>

                      {/* Total del item */}
                      <p className="text-lg font-bold text-gray-800">
                        Total: S/ {item.totalPrice.toFixed(2)}
                      </p>
                    </div>

                    {/* Controles de cantidad */}
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0 rounded-full border-2 border-gray-300 hover:border-gray-400"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      
                      <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0 rounded-full border-2 border-gray-300 hover:border-gray-400"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>

                      {/* Botón eliminar */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0 rounded-full border-2 border-red-300 hover:border-red-400 text-red-600 hover:text-red-700"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Botón Enviar Pedido */}
          <div className="text-center mb-8">
            <Button
              onClick={handleCheckout}
              className="w-full max-w-md h-12 bg-[#0056C6] hover:bg-[#004299] text-white text-lg font-semibold rounded-xl"
            >
              Enviar Pedido
            </Button>
          </div>

          {/* Historial De Artículos */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Historial De Artículos</h2>
            
            <Card className="p-8 bg-gray-100 border border-gray-200 rounded-xl">
              <div className="text-center">
                <p className="text-gray-500 text-lg">No hay historial disponible</p>
              </div>
            </Card>
          </div>

          {/* Resumen del pedido (opcional, para desktop) */}
          <div className="hidden lg:block">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Resumen del pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>S/ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>S/ {total.toFixed(2)}</span>
                </div>
                
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="w-full"
                >
                  Vaciar carrito
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}