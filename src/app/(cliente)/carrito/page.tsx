"use client"

import { Minus, Plus, X, CheckCircle, Menu as MenuIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface CartItem {
  id: string
  name: string
  description: string
  price: number
  quantity: number
  image: string
  selectedSide?: string
  selectedExtras?: string[]
  comments?: string
  total: number
}

interface OrderHistoryItem {
  id: string
  items: CartItem[]
  total: number
  date: Date
  status: 'completed'
}

export default function CarritoPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>([])
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Cargar datos del localStorage al montar el componente
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    const savedHistory = localStorage.getItem("orderHistory")
    
    console.log("Carrito guardado:", savedCart) // DEBUG
    
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart)
      console.log("Carrito parseado:", parsedCart) // DEBUG
      setCartItems(parsedCart)
    }
    
    if (savedHistory) {
      setOrderHistory(JSON.parse(savedHistory))
    }
  }, [])

  // Guardar en localStorage cuando cambie el carrito
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems))
  }, [cartItems])

  // Guardar historial en localStorage
  useEffect(() => {
    localStorage.setItem("orderHistory", JSON.stringify(orderHistory))
  }, [orderHistory])

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId)
      return
    }

    setCartItems(items => 
      items.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity, total: (item.price * newQuantity) }
          : item
      )
    )
  }

  const removeItem = (itemId: string) => {
    setCartItems(items => items.filter(item => item.id !== itemId))
  }

  const calculateCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.total, 0)
  }

  const formatPrice = (price: number) => {
    return `S/${price.toFixed(2)}`
  }

  const handleSendOrder = async () => {
    if (cartItems.length === 0) return

    setIsLoading(true)

    // Simular envío del pedido
    setTimeout(() => {
      const newOrder: OrderHistoryItem = {
        id: Date.now().toString(),
        items: [...cartItems],
        total: calculateCartTotal(),
        date: new Date(),
        status: 'completed'
      }

      // Agregar al historial
      setOrderHistory(prev => [newOrder, ...prev])

      // Limpiar el carrito
      setCartItems([])

      setIsLoading(false)
      setShowSuccessDialog(true)
    }, 2000)
  }

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false)
    router.push('/menu')
  }

  return (
    <div className="min-h-screen bg-[#FAFCFE] flex flex-col">
      {/* Header */}
      <Header showFullNavigation={true} />
      
      <main className="flex-1">
        <div className="max-w-[400px] mx-auto px-4 py-8">
          {/* Title */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-6"></div> {/* Spacer */}
              <h1 className="text-xl font-bold text-gray-900">Mi Orden</h1>
              <MenuIcon className="w-6 h-6 text-gray-600" />
            </div>
          </div>

          {/* Lista De Artículos Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Lista De Artículos</h2>
            
            {cartItems.length === 0 ? (
              <Card className="p-8 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl text-center">
                <div className="text-gray-500">
                  <p className="text-base font-medium mb-2">Añada artículos para pedir...</p>
                </div>
              </Card>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <Card key={item.id} className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <div className="flex items-start space-x-3">
                      {/* Product Image */}
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </h3>
                        {item.selectedSide && (
                          <p className="text-xs text-gray-500">
                            Acompañamiento: {item.selectedSide}
                          </p>
                        )}
                        {item.selectedExtras && item.selectedExtras.length > 0 && (
                          <p className="text-xs text-gray-500">
                            Extras: {item.selectedExtras.join(", ")}
                          </p>
                        )}
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          Total: S/ {item.total.toFixed(2)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end space-y-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-6 h-6 p-0 text-gray-400 hover:text-red-500"
                          onClick={() => removeItem(item.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-6 h-6 p-0 text-xs rounded-full"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="w-6 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-6 h-6 p-0 text-xs rounded-full"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Send Order Button */}
            <Button
              className={`w-full mt-6 h-12 text-base font-semibold rounded-xl ${
                cartItems.length > 0
                  ? "bg-[#0056C6] hover:bg-[#004299] text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={cartItems.length === 0 || isLoading}
              onClick={handleSendOrder}
            >
              {isLoading ? "Enviando Pedido..." : "Enviar Pedido"}
            </Button>
          </div>

          {/* Historial De Artículos Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Historial De Artículos</h2>
            
            {orderHistory.length === 0 ? (
              <Card className="p-8 bg-gray-50 border border-gray-200 rounded-xl text-center">
                <div className="text-gray-500">
                  <p className="text-base">No hay historial disponible</p>
                </div>
              </Card>
            ) : (
              <div className="space-y-3">
                {orderHistory.map((order) => (
                  <Card key={order.id} className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-gray-900">
                          Pedido #{order.id.slice(-6)}
                        </span>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                        Completado
                      </Badge>
                    </div>
                    
                    <div className="text-xs text-gray-500 mb-2">
                      {order.date.toLocaleDateString()} - {order.date.toLocaleTimeString()}
                    </div>
                    
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-xs">
                          <span className="text-gray-700">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="text-gray-900 font-medium">
                            {formatPrice(item.total)}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t border-gray-200 mt-2 pt-2">
                      <div className="flex justify-between text-sm font-semibold">
                        <span>Total:</span>
                        <span>{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <DialogTitle className="text-xl font-semibold">¡Pedido enviado!</DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Tu pedido ha sido enviado exitosamente y aparecerá en tu historial.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6">
            <Button
              className="w-full bg-[#0056C6] hover:bg-[#004299] text-white"
              onClick={handleSuccessDialogClose}
            >
              Aceptar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  )
}