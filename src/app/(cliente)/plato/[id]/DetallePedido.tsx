// "use client"

// import { Minus, Plus, Facebook, Instagram, ChevronDown, ArrowLeft } from "lucide-react"
// import Link from "next/link"
// import { useParams, useRouter } from "next/navigation"
// import { useState, useEffect } from "react"

// import Footer from "@/components/layout/footer"
// import Header from "@/components/layout/header"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Textarea } from "@/components/ui/textarea"


// interface SideOption {
//   id: string
//   name: string
//   price: number
//   label?: string
// }

// interface ExtraOption {
//   id: string
//   name: string
//   price: number
// }

// interface MenuItem {
//   id: number
//   name: string
//   description: string
//   price: number
//   rating: number
//   prepTime: string
//   image: string
//   category: string
//   popular: boolean
// }

// // Menú estático de cevichería (mismo que en home)
// const localMenuItems: MenuItem[] = [
//   {
//     id: 1,
//     name: "Ceviche Clásico",
//     description: "Pescado fresco marinado en limón con cebolla morada, ají limo y camote",
//     price: 25.00,
//     rating: 4.9,
//     prepTime: "15 min",
//     image: "/fresh-ceviche-with-red-onions-and-sweet-potato.jpg",
//     category: "Entradas",
//     popular: true
//   },
//   {
//     id: 2,
//     name: "Ceviche Mixto",
//     description: "Pescado, pulpo, camarones y conchas negras en leche de tigre especial",
//     price: 32.00,
//     rating: 4.8,
//     prepTime: "18 min",
//     image: "/mixed-seafood-ceviche-with-shrimp-and-octopus.jpg",
//     category: "Entradas",
//     popular: true
//   },
//   {
//     id: 3,
//     name: "Tiradito Nikkei",
//     description: "Cortes finos de pescado con salsa nikkei, palta y ajonjolí",
//     price: 28.00,
//     rating: 4.7,
//     prepTime: "12 min",
//     image: "/tiradito-nikkei-with-thin-fish-slices-and-sesame.jpg",
//     category: "Entradas",
//     popular: false
//   },
//   {
//     id: 4,
//     name: "Arroz con Mariscos",
//     description: "Arroz amarillo con mariscos frescos, culantro y ají amarillo",
//     price: 35.00,
//     rating: 4.6,
//     prepTime: "25 min",
//     image: "/peruvian-seafood-rice-with-cilantro.jpg",
//     category: "Criollo",
//     popular: false
//   },
//   {
//     id: 5,
//     name: "Causa Limeña",
//     description: "Papa amarilla con pollo, palta y mayonesa casera",
//     price: 24.00,
//     rating: 4.5,
//     prepTime: "10 min",
//     image: "/causa-limena-with-yellow-potato-and-avocado.jpg",
//     category: "Entradas",
//     popular: false
//   },
//   {
//     id: 6,
//     name: "Leche de Tigre",
//     description: "El jugo concentrado del ceviche con mariscos y cancha",
//     price: 18.00,
//     rating: 4.8,
//     prepTime: "5 min",
//     image: "/leche-de-tigre-with-seafood-and-corn-nuts.jpg",
//     category: "Bebidas",
//     popular: true
//   },
//   {
//     id: 7,
//     name: "Arroz chaufa de mariscos",
//     description: "Arroz frito con mariscos frescos y vegetales",
//     price: 30.00,
//     rating: 4.7,
//     prepTime: "20 min",
//     image: "/placeholder.jpg",
//     category: "Criollo",
//     popular: false
//   },
//   {
//     id: 8,
//     name: "Chaufa de langostinos",
//     description: "Arroz frito con langostinos y vegetales",
//     price: 38.00,
//     rating: 4.8,
//     prepTime: "18 min",
//     image: "/placeholder.jpg",
//     category: "Criollo",
//     popular: false
//   },
//   {
//     id: 9,
//     name: "Chaufa de pescado",
//     description: "Arroz frito con pescado fresco y vegetales",
//     price: 32.00,
//     rating: 4.6,
//     prepTime: "20 min",
//     image: "/placeholder.jpg",
//     category: "Pescados",
//     popular: false
//   },
//   {
//     id: 10,
//     name: "Arroz con conchas negras",
//     description: "Arroz con conchas negras frescas y culantro",
//     price: 40.00,
//     rating: 4.9,
//     prepTime: "25 min",
//     image: "/placeholder.jpg",
//     category: "Criollo",
//     popular: true
//   },
//   {
//     id: 11,
//     name: "Arroz con pulpo",
//     description: "Arroz con pulpo fresco y vegetales",
//     price: 35.00,
//     rating: 4.7,
//     prepTime: "22 min",
//     image: "/placeholder.jpg",
//     category: "Criollo",
//     popular: false
//   },
//   {
//     id: 12,
//     name: "Aeropuerto marino",
//     description: "Combinación de arroz con mariscos variados",
//     price: 42.00,
//     rating: 4.8,
//     prepTime: "30 min",
//     image: "/placeholder.jpg",
//     category: "Criollo",
//     popular: true
//   }
// ]

// export default function DetallePedido() {
//   const params = useParams()
//   const router = useRouter()
//   const [selectedSide, setSelectedSide] = useState<string>("")
//   const [selectedExtras, setSelectedExtras] = useState<string[]>([])
//   const [quantity, setQuantity] = useState(1)
//   const [comments, setComments] = useState("")
//   const [showMaxExtrasWarning, setShowMaxExtrasWarning] = useState(false)
//   const [product, setProduct] = useState<MenuItem | null>(null)

//   useEffect(() => {
//     const productId = parseInt(params.id as string)
//     const foundProduct = localMenuItems.find(item => item.id === productId)
//     setProduct(foundProduct || null)
//   }, [params.id])

//   // Opciones de acompañamiento específicas para cevichería
//   const sideOptions: SideOption[] = [
//     { id: "cancha", name: "Cancha", price: 0, label: "Gratis" },
//     { id: "camote", name: "Camote", price: 0, label: "Gratis" },
//     { id: "choclo", name: "Choclo", price: 2000 },
//     { id: "yuca", name: "Yuca frita", price: 3000 },
//   ]

//   // Opciones extra específicas para cevichería
//   const extraOptions: ExtraOption[] = [
//     { id: "aji-extra", name: "Ají extra", price: 0 },
//     { id: "limon-extra", name: "Limón extra", price: 0 },
//     { id: "cebolla-extra", name: "Cebolla extra", price: 0 },
//     { id: "culantro", name: "Culantro", price: 1000 },
//   ]

//   const handleExtraChange = (extraId: string, checked: boolean) => {
//     if (checked) {
//       if (selectedExtras.length >= 3) {
//         setShowMaxExtrasWarning(true)
//         setTimeout(() => setShowMaxExtrasWarning(false), 3000)
//         return
//       }
//       setSelectedExtras([...selectedExtras, extraId])
//     } else {
//       setSelectedExtras(selectedExtras.filter((id) => id !== extraId))
//     }
//   }

//   const calculateTotal = () => {
//     if (!product) return 0
    
//     let total = product.price

//     // Add side price
//     const selectedSideOption = sideOptions.find((side) => side.id === selectedSide)
//     if (selectedSideOption) {
//       total += selectedSideOption.price
//     }

//     // Add extras prices
//     selectedExtras.forEach((extraId) => {
//       const extra = extraOptions.find((e) => e.id === extraId)
//       if (extra) {
//         total += extra.price
//       }
//     })

//     return total * quantity
//   }

//   const formatPrice = (price: number) => {
//     return `S/ ${price.toFixed(2)}`
//   }

//   const isAddToCartEnabled = selectedSide !== ""

//   if (!product) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Producto no encontrado</h2>
//           <Link href="/home">
//             <Button className="bg-[#0056C6] hover:bg-[#004299] text-white">
//               Volver al menú
//             </Button>
//           </Link>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-[#FAFCFE] flex flex-col">
//       {/* Header */}
//       <Header 
//         showFullNavigation={true}
//       />
// <main>
//       <div className="max-w-[1110px] mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//           {/* Left Column - Desktop: 8 cols, Mobile: full width */}
//           <div className="lg:col-span-8 space-y-6">
//             {/* Product Summary Card */}
//             <Card className="p-6 bg-white border border-[#ECF1F4] rounded-xl shadow-sm">
//               <div className="flex items-start space-x-4">
//                 <img
//                   src={product.image || "/placeholder.svg"}
//                   alt={product.name}
//                   className="w-20 h-20 rounded-[30px] object-cover flex-shrink-0"
//                 />
//                 <div className="flex-1">
//                   <h2 className="text-base font-semibold text-gray-900 mb-1">{product.name}</h2>
//                   <p className="text-sm text-[#8C8CA1] mb-2">{product.description}</p>
//                   <p className="text-base font-semibold text-gray-900">{formatPrice(product.price)}</p>
//                 </div>
//               </div>
//             </Card>

//             {/* Side Selection Card */}
//             <Card className="p-6 bg-white border border-[#ECF1F4] rounded-xl shadow-sm">
//               <div className="flex items-center gap-2 mb-4">
//                 <h3 className="text-lg font-semibold text-gray-900">Selecciona tu acompañamiento</h3>
//                 <Badge variant="secondary" className="bg-[#ECF1F4] text-[#8C8CA1] text-xs">
//                   Obligatorio
//                 </Badge>
//               </div>
//               <p className="text-sm text-[#8C8CA1] mb-4">Selecciona 1 opción</p>

//               <RadioGroup value={selectedSide} onValueChange={setSelectedSide} className="space-y-3">
//                 {sideOptions.map((option, index) => (
//                   <div key={option.id}>
//                     <div className="flex items-center justify-between py-3">
//                       <div className="flex items-center space-x-3">
//                         <RadioGroupItem value={option.id} id={option.id} />
//                         <Label htmlFor={option.id} className="text-sm font-medium cursor-pointer">
//                           {option.name}
//                         </Label>
//                       </div>
//                       <div className="text-sm font-medium text-gray-900">
//                         {option.label || (option.price > 0 ? `+${formatPrice(option.price)}` : "Gratis")}
//                       </div>
//                     </div>
//                     {index < sideOptions.length - 1 && <div className="border-b border-[#ECF1F4]"></div>}
//                   </div>
//                 ))}
//               </RadioGroup>
//             </Card>

//             {/* Extras Card */}
//             <Card className="p-6 bg-white border border-[#ECF1F4] rounded-xl shadow-sm">
//               <div className="flex items-center gap-2 mb-4">
//                 <h3 className="text-lg font-semibold text-gray-900">Agrega más sabor a tu orden</h3>
//                 <Badge variant="secondary" className="bg-[#ECF1F4] text-[#8C8CA1] text-xs">
//                   Opcional
//                 </Badge>
//               </div>
//               <p className="text-sm text-[#8C8CA1] mb-4">Selecciona hasta 3 opciones (opcional)</p>

//               {showMaxExtrasWarning && (
//                 <div className="mb-4 p-3 bg-[#ECF1F4] rounded-lg">
//                   <p className="text-sm text-[#8C8CA1]">Máximo 3 opciones</p>
//                 </div>
//               )}

//               <div className="space-y-3">
//                 {extraOptions.map((option, index) => (
//                   <div key={option.id}>
//                     <div className="flex items-center justify-between py-3">
//                       <div className="flex items-center space-x-3">
//                         <Checkbox
//                           id={option.id}
//                           checked={selectedExtras.includes(option.id)}
//                           onCheckedChange={(checked) => handleExtraChange(option.id, checked as boolean)}
//                         />
//                         <Label htmlFor={option.id} className="text-sm font-medium cursor-pointer">
//                           {option.name}
//                         </Label>
//                       </div>
//                       <div className="text-sm font-medium text-gray-900">
//                         {option.price > 0 ? `+${formatPrice(option.price)}` : "Gratis"}
//                       </div>
//                     </div>
//                     {index < extraOptions.length - 1 && <div className="border-b border-[#ECF1F4]"></div>}
//                   </div>
//                 ))}
//               </div>
//             </Card>

//             {/* Comments Card */}
//             <Card className="p-6 bg-white border border-[#ECF1F4] rounded-xl shadow-sm">
//               <div className="flex items-center gap-2 mb-4">
//                 <h3 className="text-lg font-semibold text-gray-900">Comentarios especiales</h3>
//                 <Badge variant="secondary" className="bg-[#ECF1F4] text-[#8C8CA1] text-xs">
//                   Opcional
//                 </Badge>
//               </div>
//               <p className="text-sm text-[#8C8CA1] mb-4">Agregamos cualquier modificación especial para tu plato</p>

//               <Textarea
//                 placeholder="Ej: Sin cebolla, ají aparte, bien cocido, etc…"
//                 value={comments}
//                 onChange={(e) => setComments(e.target.value)}
//                 maxLength={200}
//                 className="min-h-[100px] resize-none border-[#ECF1F4] focus:border-[#5CEFFA] focus:ring-[#5CEFFA]"
//               />
//               <p className="text-xs text-[#8C8CA1] mt-2">{comments.length}/200 caracteres</p>
//             </Card>
//           </div>

//           {/* Right Column - Desktop: 4 cols, Mobile: full width */}
//           <div className="lg:col-span-4">
//             <div className="lg:sticky lg:top-24">
//               <Card className="p-6 bg-white border border-[#ECF1F4] rounded-xl shadow-sm">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen del pedido</h3>

//                 <div className="flex items-center justify-between mb-4">
//                   <p className="text-sm text-gray-600">{product.name}</p>
//                   <p className="text-base font-semibold text-gray-900">{formatPrice(product.price)}</p>
//                 </div>

//                 {/* Quantity Control */}
//                 <div className="flex items-center justify-between mb-6">
//                   <span className="text-sm font-medium text-gray-900">Cantidad</span>
//                   <div className="flex items-center space-x-3">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="w-8 h-8 p-0 border-[#ECF1F4] bg-transparent"
//                       onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                       disabled={quantity <= 1}
//                     >
//                       <Minus className="w-4 h-4" />
//                     </Button>
//                     <span className="w-8 text-center text-sm font-medium">{quantity}</span>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="w-8 h-8 p-0 border-[#ECF1F4] bg-transparent"
//                       onClick={() => setQuantity(quantity + 1)}
//                     >
//                       <Plus className="w-4 h-4" />
//                     </Button>
//                   </div>
//                 </div>

//                 {/* Validation Banner */}
//                 {!isAddToCartEnabled && (
//                   <div className="mb-4 p-3 bg-[#ECF1F4] rounded-lg">
//                     <p className="text-sm text-[#8C8CA1]">
//                       Faltan selecciones obligatorias: Selecciona tu acompañamiento
//                     </p>
//                   </div>
//                 )}

//                 {/* Add to Cart Button */}
//                 <Button
//                   className={`w-full h-12 text-base font-semibold rounded-xl ${
//                     isAddToCartEnabled
//                       ? "bg-[#0056C6] hover:bg-[#004299] text-white"
//                       : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
//                   }`}
//                   disabled={!isAddToCartEnabled}
//                   onClick={() => {
//                     // Aquí puedes agregar la lógica para agregar al carrito
//                     console.log(`Agregando al carrito:`, {
//                       product: product.name,
//                       quantity,
//                       selectedSide,
//                       selectedExtras,
//                       comments,
//                       total: calculateTotal()
//                     })
//                     // Navegar al carrito o mostrar confirmación
//                     router.push('/carrito')
//                   }}
//                 >
//                   Agregar al carrito – {formatPrice(calculateTotal())}
//                 </Button>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>
// </main>
//       {/* Footer */}
//       <Footer />

//     </div>
//   )
// }