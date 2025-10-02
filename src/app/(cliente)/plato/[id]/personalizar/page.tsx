"use client"

import { Minus, Plus, Facebook, Instagram, ChevronDown, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"

import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useMenu } from "@/hooks/use-menu"
import { useCart, CartItem } from '@/hooks/use-cart'
import { Root2 } from "@/types/menu"

export default function DetallePedidoPage() {
  const params = useParams()
  const router = useRouter()
  const [selectedSide, setSelectedSide] = useState<string>("")
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)
  const [comments, setComments] = useState("")
  const [showMaxExtrasWarning, setShowMaxExtrasWarning] = useState(false)
  const [product, setProduct] = useState<Root2 | null>(null)
  const [extraQuantities, setExtraQuantities] = useState<{[key: string]: number}>({})
  const [loading, setLoading] = useState(true)

  const { addToCart } = useCart()

  // Usar el hook de la API
  const { menuItems, loading: apiLoading, error } = useMenu()

  useEffect(() => {
    if (!apiLoading && menuItems.length > 0) {
      const productId = parseInt(params.id as string)
      const foundProduct = menuItems.find(item => item.id === productId)
      setProduct(foundProduct || null)
      setLoading(false)
    }
  }, [params.id, menuItems, apiLoading])

  const handleExtraChange = (extraId: string, checked: boolean) => {
    if (!product?.grupo_personalizacion) return

    const maxSelections = product.grupo_personalizacion.max_selecciones

    if (checked) {
      if (selectedExtras.length >= maxSelections) {
        setShowMaxExtrasWarning(true)
        setTimeout(() => setShowMaxExtrasWarning(false), 3000)
        return
      }
      setSelectedExtras([...selectedExtras, extraId])
      setExtraQuantities(prev => ({ ...prev, [extraId]: 1 }))
    } else {
      setSelectedExtras(selectedExtras.filter((id) => id !== extraId))
      setExtraQuantities(prev => {
        const newQuantities = { ...prev }
        delete newQuantities[extraId]
        return newQuantities
      })
    }
  }

  const updateExtraQuantity = (extraId: string, delta: number) => {
    setExtraQuantities(prev => ({
      ...prev,
      [extraId]: Math.max(1, (prev[extraId] || 1) + delta)
    }))
  }

  const calculateTotal = () => {
    if (!product) return 0

    let total = product.precio

    // Add side price (if it's a radio selection)
    if (product.grupo_personalizacion?.tipo === "acompanamiento" || product.grupo_personalizacion?.tipo === "tamaño") {
      const selectedOption = product.grupo_personalizacion.opciones.find(opt => opt.etiqueta === selectedSide)
      if (selectedOption) {
        total += selectedOption.precio_adicional
      }
    }

    // Add extras prices with quantities (if it's a checkbox selection)
    if (product.grupo_personalizacion?.tipo === "salsa" || product.grupo_personalizacion?.tipo === "checkbox") {
      selectedExtras.forEach((extraId) => {
        const extra = product.grupo_personalizacion?.opciones.find(opt => opt.etiqueta === extraId)
        const quantity = extraQuantities[extraId] || 1
        if (extra) {
          total += extra.precio_adicional * quantity
        }
      })
    }

    return total * quantity
  }

  const formatPrice = (price: number) => {
    return `S/${price.toFixed(2)}`
  }

  // Determinar si es obligatorio seleccionar opciones
  const isRequired = product?.grupo_personalizacion?.tipo === "acompanamiento" || 
                     product?.grupo_personalizacion?.tipo === "tamaño"
  
  const isAddToCartEnabled = !isRequired || selectedSide !== ""

  if (apiLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0056C6] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando producto...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error al cargar el producto</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/menu">
            <Button className="bg-[#0056C6] hover:bg-[#004299] text-white">
              Volver al menú
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Producto no encontrado</h2>
          <Link href="/menu">
            <Button className="bg-[#0056C6] hover:bg-[#004299] text-white">
              Volver al menú
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!product) return

    const cartItem: CartItem = {
      id: `${product.id}-${Date.now()}`,
      dishId: product.id,
      name: product.nombre,
      description: product.descripcion,
      basePrice: product.precio,
      quantity: quantity,
      image: product.imagen,
      selectedOptions: [
        ...(selectedSide ? [{
          type: product.grupo_personalizacion?.tipo || 'acompanamiento',
          name: selectedSide,
          price: product.grupo_personalizacion?.opciones.find(opt => opt.etiqueta === selectedSide)?.precio_adicional || 0
        }] : []),
        ...selectedExtras.map(extraId => {
          const extra = product.grupo_personalizacion?.opciones.find(opt => opt.etiqueta === extraId)
          return {
            type: 'extra',
            name: extraId,
            price: (extra?.precio_adicional || 0) * (extraQuantities[extraId] || 1)
          }
        })
      ],
      totalPrice: calculateTotal(),
      comments: comments
    }

    console.log('Adding item to cart:', cartItem)
    addToCart(cartItem)
    
    alert('¡Producto agregado al carrito!')
    router.push('/carrito')
  }

  return (
    <div className="min-h-screen bg-[#FAFCFE] flex flex-col">
      {/* Header */}
      <Header showFullNavigation={true} />
      
      <main>
        <div className="max-w-[1110px] mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Desktop: 8 cols, Mobile: full width */}
            <div className="lg:col-span-8 space-y-6">
              {/* Product Summary Card */}
              <Card className="p-6 bg-white border border-[#ECF1F4] rounded-xl shadow-sm">
                <div className="flex items-start space-x-4">
                  <img
                    src={product.imagen || "/placeholder.svg"}
                    alt={product.nombre}
                    className="w-20 h-20 rounded-[30px] object-cover flex-shrink-0"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.jpg"
                    }}
                  />
                  <div className="flex-1">
                    <h2 className="text-base font-semibold text-gray-900 mb-1">{product.nombre}</h2>
                    <p className="text-sm text-[#8C8CA1] mb-2">{product.descripcion}</p>
                    <p className="text-base font-semibold text-gray-900">{formatPrice(product.precio)}</p>
                  </div>
                </div>
              </Card>

              {/* Personalization Options Card */}
              {product.grupo_personalizacion && (
                <Card className="p-6 bg-white border border-[#ECF1F4] rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{product.grupo_personalizacion.etiqueta}</h3>
                    <Badge variant="secondary" className="bg-[#ECF1F4] text-[#8C8CA1] text-xs">
                      {isRequired ? "Obligatorio" : "Opcional"}
                    </Badge>
                  </div>
                  <p className="text-sm text-[#8C8CA1] mb-4">
                    Puedes elegir hasta {product.grupo_personalizacion.max_selecciones} opciones.
                  </p>

                  {product.grupo_personalizacion.tipo === "acompanamiento" || product.grupo_personalizacion.tipo === "tamaño" ? (
                    // Radio Group para selección única
                    <RadioGroup value={selectedSide} onValueChange={setSelectedSide} className="space-y-3">
                      {product.grupo_personalizacion.opciones?.map((option, index) => (
                        <div key={option.etiqueta}>
                          <div className="flex items-center justify-between py-3">
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem value={option.etiqueta} id={option.etiqueta} />
                              <Label htmlFor={option.etiqueta} className="text-sm font-medium cursor-pointer">
                                {option.etiqueta}
                              </Label>
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {option.precio_adicional === 0 ? "Gratis" : `+${formatPrice(option.precio_adicional)}`}
                            </div>
                          </div>
                          {index < (product.grupo_personalizacion?.opciones.length || 0) - 1 && <div className="border-b border-[#ECF1F4]"></div>}
                        </div>
                      ))}
                    </RadioGroup>
                  ) : (
                    // Checkbox Group para selección múltiple
                    <div className="space-y-3">
                      {showMaxExtrasWarning && (
                        <div className="mb-4 p-3 bg-[#ECF1F4] rounded-lg">
                          <p className="text-sm text-[#8C8CA1]">Máximo {product.grupo_personalizacion.max_selecciones} opciones</p>
                        </div>
                      )}

                      {product.grupo_personalizacion.opciones?.map((option, index) => (
                        <div key={option.etiqueta}>
                          <div className="flex items-center justify-between py-3">
                            <div className="flex items-center space-x-3 flex-1">
                              <Checkbox
                                id={option.etiqueta}
                                checked={selectedExtras.includes(option.etiqueta)}
                                onCheckedChange={(checked) => handleExtraChange(option.etiqueta, checked as boolean)}
                              />
                              <Label htmlFor={option.etiqueta} className="text-sm font-medium cursor-pointer flex-1">
                                {option.etiqueta}
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="text-sm font-medium text-gray-900">
                                +{formatPrice(option.precio_adicional)}
                              </div>
                              {/* Quantity controls for extras */}
                              {selectedExtras.includes(option.etiqueta) && (
                                <div className="flex items-center space-x-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-6 h-6 p-0 text-xs"
                                    onClick={() => updateExtraQuantity(option.etiqueta, -1)}
                                  >
                                    -
                                  </Button>
                                  <span className="w-4 text-center text-xs">
                                    {extraQuantities[option.etiqueta] || 1}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-6 h-6 p-0 text-xs"
                                    onClick={() => updateExtraQuantity(option.etiqueta, 1)}
                                  >
                                    +
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                          {index < (product.grupo_personalizacion?.opciones.length || 0) - 1 && <div className="border-b border-[#ECF1F4]"></div>}
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              )}

              {/* Comments Card */}
              <Card className="p-6 bg-white border border-[#ECF1F4] rounded-xl shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Comentarios</h3>
                  <Badge variant="secondary" className="bg-[#ECF1F4] text-[#8C8CA1] text-xs">
                    Opcional
                  </Badge>
                </div>

                <Textarea
                  placeholder="Sin ají , que no pique por favor ..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  maxLength={200}
                  className="min-h-[100px] resize-none border-[#ECF1F4] focus:border-[#5CEFFA] focus:ring-[#5CEFFA]"
                />
                <p className="text-xs text-[#8C8CA1] mt-2">{comments.length}/200 caracteres</p>
              </Card>
            </div>

            {/* Right Column - Desktop: 4 cols, Mobile: full width */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-24">
                <Card className="p-6 bg-white border border-[#ECF1F4] rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen del pedido</h3>

                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-600">{product.nombre}</p>
                    <p className="text-base font-semibold text-gray-900">{formatPrice(product.precio)}</p>
                  </div>

                  {/* Quantity Control */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm font-medium text-gray-900">Cantidad</span>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0 border-[#ECF1F4] bg-transparent"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0 border-[#ECF1F4] bg-transparent"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Validation Banner */}
                  {!isAddToCartEnabled && (
                    <div className="mb-4 p-3 bg-[#ECF1F4] rounded-lg">
                      <p className="text-sm text-[#8C8CA1]">
                        Faltan selecciones obligatorias: {product.grupo_personalizacion?.etiqueta}
                      </p>
                    </div>
                  )}

                  {/* Add to Cart Button */}
                  <Button
                    className={`w-full h-12 text-base font-semibold rounded-xl ${
                      isAddToCartEnabled
                        ? "bg-[#0056C6] hover:bg-[#004299] text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                    }`}
                    disabled={!isAddToCartEnabled}
                    onClick={handleAddToCart}
                  >
                    Agregar al carrito – {formatPrice(calculateTotal())}
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}