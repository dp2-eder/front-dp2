"use client"

import { useParams, useRouter } from "next/navigation"

import Loading from "@/app/loading"
import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"
import BackButton from "@/components/ui/back-button"
import { Button } from "@/components/ui/button"
import SafeImage from "@/components/ui/safe-image"
import { useProducto } from '@/hooks/use-producto'
import { useAlergenos } from "@/hooks/use-alergenos"

export default function PlatoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { producto, loading, error } = useProducto(params.id as string)
  const { alergenos, loading: alergenosLoading, error: alergenosError } = useAlergenos(params.id as string);

  if (loading) return <Loading />
  if (error) return <div>Error: {error}</div>
  if (!producto) return <div>Producto no encontrado</div>

  // Función para convertir URL de Google Drive:
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
    <div className="min-h-screen bg-[#FAFCFE] flex flex-col">
      <Header showFullNavigation={true} />

      <main className="flex-1">
        <div className="max-w-[1110px] mx-auto px-4 py-8">
          <div className="mb-16">
            <BackButton href="/menu" text="Volver Al Menú" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="order-2 lg:order-1 space-y-6">
              {/* Nombre y Descripción */}
              <div>
                <h1 className="text-3xl lg:text-2xl font-bold text-gray-800 mb-4 text-center">
                  {String((producto as Record<string, unknown>)?.nombre || 'Sin nombre')}
                </h1>
                <p className="text-base lg:text-lg text-gray-800 leading-relaxed mb-6">
                  {String((producto as Record<string, unknown>)?.descripcion || 'Sin descripción')}
                </p>
              </div>

              {/* Precio y Ordenar Ahora */}
              <div className="flex flex-col items-center">
                {/* Contenedor responsive: 1 columna en móvil, 2 columnas en pantallas md+ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl items-center">

                  {/* Precio */}
                  <div className="flex justify-center md:justify-center">
                    <span className="text-xl font-bold text-gray-800 text-center md:text-left">
                      Precio: S/. {String((producto as Record<string, unknown>)?.precio_base || '0.00')}
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
                <h2 className="text-xl font-normal text-gray-800 mb-4 text-left">
                  Lista de Alergenos presentes:</h2>

                <div className="w-full flex justify-left mt-6">
                  <div className="flex flex-wrap justify-center items-center bg-[#FAFCFE] rounded-2xl shadow-md px-6 py-4 max-w-3xl">
                    {alergenos.map((item) => (
                      <div
                        key={item.nombre}
                        className="flex flex-col items-center justify-center text-center mx-2 my-1"
                      >
                        <span className="text-xl mb-1 filter grayscale">{item.icono}</span>
                        <span className="text-xs font-medium text-[#0D1030]">
                          {item.nombre}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            <div className="order-1 lg:order-2 space-y-6">
              <div className="relative">
                <SafeImage
                  src={convertGoogleDriveUrl(String((producto as Record<string, unknown>)?.imagen_path || ''))}
                  alt={String((producto as Record<string, unknown>)?.nombre || 'Sin nombre')}
                  className="w-full h-64 lg:h-96 object-cover rounded-2xl bg-gray-300"
                  showIndicator={true}
                />
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