"use client"

import { LogIn } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

import { PlatoSkeleton } from "@/components/custom/plato-skeleton"
import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import SafeImage from "@/components/ui/safe-image"
import { useProducto } from "@/hooks/use-producto"
import { getProductImageUrl } from "@/lib/image-url"

// Mapeo de iconos por defecto para cuando la API no devuelve icono
const defaultIcons: Record<string, string> = {
  "Nueces": "🥜",
  "Sésamo": "🌰",
  "Crustáceo": "🦐",
  "Mariscos": "🦐",
  "Huevo": "🥚",
  "Gluten": "🌾",
  "Pescado": "🐟",
  "Cítricos": "🍋",
  "Moluscos": "🐙",
  "Aj": "🧄",
};

export default function PlatoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { producto, loading, error } = useProducto(params.id as string)

  // Extraer alergenos directamente del producto (ya vienen en la respuesta)
  const alergenos = producto?.alergenos?.map((item: any) => ({
    nombre: item.nombre,
    icono: item.icono || defaultIcons[item.nombre] || "⚠️",
  })) || [];

  const alergenosLoading = loading;

  // Usar skeleton rápido en lugar de Loading completo
  if (loading && !producto) {
    return <PlatoSkeleton />
  }

  // Mostrar contenido aunque los alérgenos sigan cargando
  if (error) return <div>Error: {error}</div>
  if (!producto) return <div>Producto no encontrado</div>



  return (
    <div className="min-h-screen bg-[#FAFCFE] flex flex-col">
      <Header showFullNavigation={true} />

      <main className="flex-1">
        <div className="max-w-[1110px] mx-auto px-4 py-8">
          <div className="mb-16">
            <Link href="/menu" className="flex items-center gap-2 mb-6">
              <LogIn className="w-7 h-7" style={{ transform: 'scaleX(-1)' }} />
            </Link>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="order-2 lg:order-1 space-y-6">
              {/* Nombre y Descripción */}
              <div>
                <h1 className="text-3xl lg:text-2xl font-bold text-gray-800 mb-4 text-center">
                  {producto.nombre || 'Sin nombre'}
                </h1>
                <p className="text-base lg:text-lg text-gray-800 leading-relaxed mb-6">
                  {producto.descripcion || 'Sin descripción'}
                </p>
              </div>

              {/* Precio y Ordenar Ahora */}
              <div className="flex flex-col items-center">
                {/* Contenedor responsive: 1 columna en móvil, 2 columnas en pantallas md+ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl items-center">

                  {/* Precio */}
                  <div className="flex justify-center md:justify-center">
                    <span className="text-xl font-bold text-gray-800 text-center md:text-left">
                      Precio: S/. {producto.precio_base || '0.00'}
                    </span>
                  </div>

                  {/* Botón */}
                  <div className="flex justify-center md:justify-center">
                    <Button
                      className="w-32 h-12 bg-[#004166] hover:bg-[#004299] text-white text-lg font-semibold rounded-xl"
                      onClick={() => {
                        router.push(`/plato/${String(params.id)}/personalizar`)
                      }}
                    >
                      Ordenar
                    </Button>
                  </div>
                </div>
              </div>

              {/* Alergenos */}
              <div>
                <h2 className="hidden md:block text-xl font-normal text-gray-800 mb-4 text-left">
                  Lista de Alergenos presentes:</h2>

                {alergenosLoading ? (
                  <div className="flex justify-center md:justify-start mt-6">
                    <div className="flex flex-wrap justify-center items-center bg-[#FAFCFE] rounded-2xl shadow-md px-6 py-4 max-w-3xl gap-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex flex-col items-center justify-center text-center mx-2 my-1 animate-pulse">
                          <span className="text-xl mb-1 text-gray-300 w-6 h-6 rounded-full bg-gray-200"></span>
                          <span className="text-xs font-medium text-gray-300 h-3 w-12 bg-gray-200 rounded"></span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : alergenos.length > 0 ? (
                  <div className="w-full flex justify-center md:justify-start mt-6">
                    <div className="flex flex-wrap justify-center items-center bg-[#FAFCFE] rounded-2xl shadow-md px-6 py-4 max-w-3xl">
                      {alergenos.map((item) => (
                        <div
                          key={item.nombre}
                          className="flex flex-col items-center justify-center text-center mx-2 my-1"
                        >
                          {item.icono && (
                            <span className="text-xl mb-1 filter grayscale">{item.icono}</span>
                          )}
                          <span className="text-xs font-medium text-[#0D1030]">
                            {item.nombre}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm mt-2">
                    No hay alérgenos registrados para este producto.
                  </div>
                )}
              </div>

            </div>

            <div className="order-1 lg:order-2 space-y-6">
              <div className="relative">
                <div className="w-full h-64 lg:h-96 rounded-2xl bg-gray-100 overflow-hidden flex items-center justify-center">
                  <SafeImage
                    src={getProductImageUrl(producto.imagen_path) || '/placeholder-image.png'}
                    alt={producto.nombre || 'Sin nombre'}
                    className="w-full h-full"
                    showIndicator={true}
                    width={800}
                    height={600}
                    priority={true}
                    quality={75}
                    objectFit="contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <br></br><br></br>

      <Footer />
    </div>
  )
}