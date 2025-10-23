"use client"

import { Minus, Plus } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

import Loading from "@/app/loading"
import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import SafeImage from "@/components/ui/safe-image"
import { Textarea } from "@/components/ui/textarea"
import { useCart, CartItem } from '@/hooks/use-cart'
import { useOpcionesProducto } from '@/hooks/use-opciones-producto'

export default function PersonalizarPage() {
  const params = useParams()
  const router = useRouter()
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)
  const [comments, setComments] = useState("")
  const [extraQuantities, setExtraQuantities] = useState<{[key: string]: number}>({})

  const { addToCart } = useCart()

  // Usar solo la nueva API
  const { producto, loading, error } = useOpcionesProducto(params.id as string)

  // Función para convertir URL de Google Drive
  const convertGoogleDriveUrl = (url: string | null): string => {
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

  if (loading) return <Loading />
  
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

  if (!producto) {
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

  // Buscar opción por id en todos los tipos
  const findOpcionById = (id: string) => {
    for (const tipo of (producto.tipos_opciones ?? [])) {
      const found = tipo.opciones.find((opt: import('@/hooks/use-opciones-producto').Opcion) => opt.id === id)
      if (found) return found
    }
    return undefined
  }

  const calculateTotal = () => {
    let total = parseFloat(producto.precio_base)
    selectedExtras.forEach(extraId => {
      const opcion = findOpcionById(extraId)
      if (opcion) {
        total += parseFloat(opcion.precio_adicional) * (extraQuantities[extraId] || 1)
      }
    })
    return total * quantity
  }

  const formatPrice = (price: number) => {
    return `S/${price.toFixed(2)}`
  }

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: `${producto.id}-${Date.now()}`,
      dishId: parseInt(producto.id),
      name: producto.nombre,
      description: producto.descripcion,
      basePrice: parseFloat(producto.precio_base),
      quantity,
      image: convertGoogleDriveUrl(producto.imagen_path),
      selectedOptions: selectedExtras.map(extraId => {
        const opcion = findOpcionById(extraId)
        return {
          type: 'extra',
          name: opcion?.nombre || '',
          price: parseFloat(opcion?.precio_adicional || '0') * (extraQuantities[extraId] || 1)
        }
      }),
      totalPrice: calculateTotal(),
      comments
    }
    addToCart(cartItem)
    router.push('/carrito')
  }

  return (
    <div className="min-h-screen bg-[#FAFCFE] flex flex-col">
      <Header showFullNavigation={true} />
      
      <main>
        <div className="max-w-[1110px] mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-6">
              {/* Product Summary Card */}
              <Card className="p-6 bg-white border border-[#ECF1F4] rounded-xl shadow-sm">
                <div className="flex items-start space-x-4">
                  <SafeImage
                    src={convertGoogleDriveUrl(producto.imagen_path)}
                    alt={producto.nombre}
                    className="w-20 h-20 rounded-[30px] object-cover flex-shrink-0"
                    showIndicator={true}
                  />
                  <div className="flex-1">
                    <h2 className="text-base font-semibold text-gray-900 mb-1">{producto.nombre}</h2>
                    <p className="text-sm text-[#8C8CA1] mb-2">{producto.descripcion}</p>
                    <p className="text-base font-semibold text-gray-900">{formatPrice(parseFloat(producto.precio_base))}</p>
                  </div>
                </div>
              </Card>

              {/* Opciones */}
              {producto.tipos_opciones && producto.tipos_opciones.length > 0 && (
                <Card className="p-6 bg-white border border-[#ECF1F4] rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Opciones</h3>
                  <div className="space-y-6">
                    {producto.tipos_opciones.map((tipo: import('@/hooks/use-opciones-producto').TipoOpcion) => (
                      <div key={tipo.id_tipo_opcion}>
                        <h4 className="font-semibold text-gray-800 mb-2">{tipo.nombre_tipo}</h4>
                        <div className="space-y-3">
                          {tipo.seleccion_maxima === 1 ? (
                            // Radio buttons
                            <div className="flex flex-col gap-2">
                              {tipo.opciones.map((opcion: import('@/hooks/use-opciones-producto').Opcion) => (
                                <label key={opcion.id} className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name={tipo.id_tipo_opcion}
                                    value={opcion.id}
                                    checked={selectedExtras.includes(opcion.id)}
                                    onChange={() => {
                                      // Solo uno seleccionado por tipo
                                      setSelectedExtras(prev => [
                                        ...prev.filter(id => !tipo.opciones.some((o: import('@/hooks/use-opciones-producto').Opcion) => o.id === id)),
                                        opcion.id
                                      ])
                                      setExtraQuantities(prev => ({ ...prev, [opcion.id]: 1 }))
                                    }}
                                  />
                                  <span>{opcion.nombre}</span>
                                  <span className="text-sm text-gray-900">+{formatPrice(parseFloat(opcion.precio_adicional))}</span>
                                </label>
                              ))}
                            </div>
                          ) : (
                            // Checkbox
                            <div className="flex flex-col gap-2">
                              {tipo.opciones.map((opcion: import('@/hooks/use-opciones-producto').Opcion) => (
                                <label key={opcion.id} className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={selectedExtras.includes(opcion.id)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedExtras([...selectedExtras, opcion.id])
                                        setExtraQuantities(prev => ({ ...prev, [opcion.id]: 1 }))
                                      } else {
                                        setSelectedExtras(selectedExtras.filter(id => id !== opcion.id))
                                        setExtraQuantities(prev => {
                                          const newQuantities = { ...prev }
                                          delete newQuantities[opcion.id]
                                          return newQuantities
                                        })
                                      }
                                    }}
                                  />
                                  <span>{opcion.nombre}</span>
                                  <span className="text-sm text-gray-900">+{formatPrice(parseFloat(opcion.precio_adicional))}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Comments Card */}
              <Card className="p-6 bg-white border border-[#ECF1F4] rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Comentarios</h3>
                <Textarea
                  placeholder="Sin ají, que no pique por favor..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  maxLength={200}
                  className="min-h-[100px] resize-none border-[#ECF1F4] focus:border-[#5CEFFA] focus:ring-[#5CEFFA]"
                />
                <p className="text-xs text-[#8C8CA1] mt-2">{comments.length}/200 caracteres</p>
              </Card>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-24">
                <Card className="p-6 bg-white border border-[#ECF1F4] rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen del pedido</h3>

                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-600">{producto.nombre}</p>
                    <p className="text-base font-semibold text-gray-900">{formatPrice(parseFloat(producto.precio_base))}</p>
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

                  {/* Add to Cart Button */}
                  <Button
                    className="w-full h-12 text-base font-semibold rounded-xl bg-[#0056C6] hover:bg-[#004299] text-white"
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