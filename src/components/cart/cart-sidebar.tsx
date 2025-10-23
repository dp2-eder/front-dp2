"use client"

import { X, Plus, Minus, Trash2, AlertTriangle } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/hooks/use-cart"

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cart, updateQuantity, removeFromCart, total } = useCart()

  // Función para verificar si se puede incrementar (límite por plato individual)
  const canIncrement = (itemId: string) => {
    const item = cart.find(item => item.id === itemId)
    return item ? item.quantity < 50 : true
  }

  // Función para convertir URL de Google Drive
  const convertGoogleDriveUrl = (url: string): string => {
    if (!url || url === 'null' || url === 'undefined' || !url.includes('drive.google.com')) {
      return '/placeholder-image.png'
    }
    
    const match = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/)
    if (match) {
      const fileId = match[1]
      return `https://drive.google.com/uc?export=view&id=${fileId}`
    }
    
    return url
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header - MISMO COLOR QUE HEADER ORIGINAL */}
          <div className="bg-[#004166] text-white p-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Mi Orden</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Tu carrito está vacío</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <Card key={item.id} className="p-3">
                    <CardContent className="p-0">
                      <div className="flex items-start space-x-3">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={convertGoogleDriveUrl(item.image)}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = '/placeholder-image.png'
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-sm">{item.name}</h3>
                            {!canIncrement(item.id) && (
                              <div className="flex items-center gap-1">
                                <AlertTriangle className="w-4 h-4 text-orange-500" />
                                <span className="text-xs text-orange-600 font-medium">Límite alcanzado</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Mostrar comentarios si existen */}
                          {item.comments && item.comments.trim() && (
                            <p className="text-xs text-gray-500 mt-1">
                              <span className="font-medium">Comentarios:</span> {item.comments.length > 50 ? `${item.comments.substring(0, 35)}...` : item.comments}
                            </p>
                          )}
                          
                          {/* Mostrar opciones adicionales si existen */}
                          {item.selectedOptions.length > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              <span className="font-medium">Adicionales:</span> {item.selectedOptions.map(opt => opt.name).join(', ')}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm font-medium">
                              S/ {item.totalPrice.toFixed(2)}
                            </span>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="text-sm">{item.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => canIncrement(item.id) && updateQuantity(item.id, item.quantity + 1)}
                                disabled={!canIncrement(item.id)}
                                className={!canIncrement(item.id) ? "opacity-50 cursor-not-allowed" : ""}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-500"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Footer - MISMO COLOR QUE HEADER ORIGINAL */}
          {cart.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>S/ {total.toFixed(2)}</span>
              </div>
              <Button className="w-full bg-[#004166] hover:bg-[#003d5c] text-white">
                Enviar Pedido S/ {total.toFixed(2)}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
