"use client"

import { LogIn } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

import Loading from "@/app/loading"
import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import SafeImage from "@/components/ui/safe-image"
import { Textarea } from "@/components/ui/textarea"
import { useCart, type CartItem } from "@/hooks/use-cart"
import { useOpcionesProducto } from "@/hooks/use-opciones-producto"
import { getProductImageUrl } from "@/lib/image-url"

export default function PersonalizarPage() {
  const params = useParams()
  const router = useRouter()
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [quantity] = useState(1)
  const [comments, setComments] = useState("")
  const [extraQuantities, setExtraQuantities] = useState<{[key: string]: number}>({})

  const { addToCart } = useCart()

  // Usar solo la nueva API
  const { producto, loading, error } = useOpcionesProducto(params.id as string)

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
    try {
      // Convertir dishId de forma segura (producto.id es UUID, no número)
      // Extraer solo los dígitos del inicio o usar 0 como fallback
      const dishIdNum = Number(producto.id.replace(/\D/g, '').slice(0, 10)) || 0
      
      const cartItem: CartItem = {
        id: `${producto.id}-${Date.now()}`,
        dishId: dishIdNum,
        name: producto.nombre,
        description: producto.descripcion,
        basePrice: parseFloat(producto.precio_base) || 0,
        quantity,
        image: producto.imagen_path || '/placeholder-image.png',
        selectedOptions: selectedExtras.map(extraId => {
          const opcion = findOpcionById(extraId)
          return {
            id: opcion?.id || '', // id_producto_opcion
            type: 'extra',
            name: opcion?.nombre || '',
            price: parseFloat(opcion?.precio_adicional || '0') * (extraQuantities[extraId] || 1)
          }
        }),
        totalPrice: calculateTotal(),
        comments
      }
      addToCart(cartItem)
      router.push('/menu')
    } catch (error) {
      alert('Error al agregar el producto al carrito. Por favor, intenta de nuevo.')
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFCFE] flex flex-col">
      <Header showFullNavigation={true} />
      
      <main className="pb-12">
        <div className="max-w-[1110px] mx-auto px-4 py-8">
          <div className="mb-16">
            <Link href={`/plato/${params.id as string}`} className="flex items-center gap-2 mb-6">
              <LogIn className="w-7 h-7" style={{ transform: 'scaleX(-1)' }} />
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-6">
              {/* Product Summary Card - Cuadrito pequeño */}
              <Card className="p-3 bg-white border border-[#99A1AF] rounded-lg shadow-sm">
                <div className="flex items-center space-x-3">
                  <div
                    className="flex-shrink-0 overflow-hidden"
                    style={{
                      width: '56px',
                      height: '56px',
                      minWidth: '56px',
                      minHeight: '56px',
                      maxWidth: '56px',
                      maxHeight: '56px',
                      position: 'relative',
                      boxSizing: 'border-box',
                      borderRadius: '8px',
                      contain: 'strict',
                      isolation: 'isolate',
                      transform: 'translateZ(0)',
                      WebkitTransform: 'translateZ(0)'
                    }}
                  >
                    <SafeImage
                      src={getProductImageUrl(producto.imagen_path) || '/placeholder-image.png'}
                      alt={producto.nombre}
                      width={56}
                      height={56}
                      priority={true}
                      quality={75}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-semibold text-gray-900 mb-0.5 truncate">{producto.nombre}</h2>
                    <p className="text-xs text-[#8C8CA1] mb-1 line-clamp-1">{producto.descripcion}</p>
                    <p className="text-sm font-semibold text-gray-900">{formatPrice(parseFloat(producto.precio_base))}</p>
                  </div>
                </div>
              </Card>

              {/* Opciones */}
              {producto.tipos_opciones && producto.tipos_opciones.length > 0 && (
                <Card className="p-6 bg-white border border-[#99A1AF] rounded-xl shadow-sm">
                  <div className="flex items-baseline gap-4 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Opciones</h3>
                    <span className="px-2 py-1 text-xs font-medium text-white bg-[#004166] rounded-md">
                      Opcional
                    </span>
                  </div>
                  <div className="space-y-6">
                    {producto.tipos_opciones.map((tipo: import('@/hooks/use-opciones-producto').TipoOpcion) => (
                      <div key={tipo.id_tipo_opcion}>
                        <h4 className="font-semibold text-gray-800 mb-1">{tipo.nombre_tipo}</h4>
                        <p className="text-sm text-gray-500 mb-3">
                          {tipo.seleccion_maxima === 1 
                            ? "Puedes elegir 1 opción." 
                            : `Puedes elegir hasta ${tipo.seleccion_maxima || tipo.opciones.length} opciones.`
                          }
                        </p>
                        <div className="space-y-3">
                          {tipo.seleccion_maxima === 1 ? (
                            // Radio buttons
                            <div className="space-y-0">
                              {tipo.opciones.map((opcion: import('@/hooks/use-opciones-producto').Opcion, index: number) => (
                                <div key={opcion.id}>
                                  <label className="flex items-center justify-between py-3">
                                    <div className="flex items-center gap-2">
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
                                    </div>
                                    <span className="text-sm text-gray-900 mr-4">
                                      {parseFloat(opcion.precio_adicional) === 0 
                                        ? "Gratis" 
                                        : `+${formatPrice(parseFloat(opcion.precio_adicional))}`
                                      }
                                    </span>
                                  </label>
                                  {index < tipo.opciones.length - 1 && (
                                    <div className="border-b border-gray-200"></div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            // Checkbox
                            <div className="space-y-0">
                              {tipo.opciones.map((opcion: import('@/hooks/use-opciones-producto').Opcion, index: number) => (
                                <div key={opcion.id}>
                                  <label className="flex items-center justify-between py-3">
                                    <div className="flex items-center gap-2">
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
                                    </div>
                                    <span className="text-sm text-gray-900 mr-4">
                                      {parseFloat(opcion.precio_adicional) === 0 
                                        ? "Gratis" 
                                        : `+${formatPrice(parseFloat(opcion.precio_adicional))}`
                                      }
                                    </span>
                                  </label>
                                  {index < tipo.opciones.length - 1 && (
                                    <div className="border-b border-gray-200"></div>
                                  )}
                                </div>
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
              <Card className="p-6 bg-white border border-[#99A1AF] rounded-xl shadow-sm mb-8">
                <div className="flex items-baseline gap-4 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Comentarios</h3>
                  <span className="px-2 py-1 text-xs font-medium text-white bg-[#004166] rounded-md">
                    Opcional
                  </span>
                </div>
                <Textarea
                  placeholder="Sin ají, que no pique por favor..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  maxLength={200}
                  className="min-h-[100px] resize-none border border-[#99A1AF] focus:border-[#5CEFFA] focus:ring-[#5CEFFA]"
                />
                <p className="text-xs text-[#8C8CA1] mt-2">{comments.length}/200 caracteres</p>
              </Card>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-24">
                <Card className="p-6 bg-white border border-[#99A1AF] rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen del pedido</h3>

                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-600">{producto.nombre}</p>
                    <p className="text-base font-semibold text-gray-900">{formatPrice(parseFloat(producto.precio_base))}</p>
                  </div>

                  {/* Selected Options */}
                  {selectedExtras.length > 0 && (
                    <div className="mb-4">
                      <div className="border-t border-gray-200 pt-4">
                        {selectedExtras.map((extraId) => {
                          const extra = producto.tipos_opciones
                            ?.flatMap(tipo => tipo.opciones)
                            .find(opcion => opcion.id === extraId)
                          if (!extra) return null
                          
                          return (
                            <div key={extraId} className="flex items-center justify-between py-2">
                              <p className="text-sm text-gray-600">{extra.nombre}</p>
                              <p className="text-sm font-medium text-gray-900">+{formatPrice(parseFloat(extra.precio_adicional))}</p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Total */}
                  <div className="flex items-center justify-between mb-6 border-t border-gray-200 pt-4">
                    <p className="text-base font-semibold text-gray-900">Total</p>
                    <p className="text-lg font-bold text-gray-900">{formatPrice(calculateTotal())}</p>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    className="w-full h-12 text-base font-semibold rounded-xl bg-[#004166] hover:bg-[#003049] text-white"
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