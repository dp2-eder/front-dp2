"use client"

import { useParams, useRouter } from "next/navigation"

import Loading from "@/app/loading"
import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"
import BackButton from "@/components/ui/back-button"
import { Button } from "@/components/ui/button"
import SafeImage from "@/components/ui/safe-image"
import { useProducto } from '@/hooks/use-producto'

export default function PlatoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { producto, loading, error } = useProducto(params.id as string)

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
          <div className="mb-8">
            <BackButton href="/menu" text="Volver Al Menú" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="order-2 lg:order-1 space-y-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                  {String((producto as Record<string, unknown>)?.nombre || 'Sin nombre')}
                </h1>

                {/* Precio */}
                <div className="mb-4">
                  <span className="text-2xl font-bold text-[#0056C6]">
                    S/ {String((producto as Record<string, unknown>)?.precio_base || '0.00')}
                  </span>
                </div>

                <p className="text-base lg:text-lg text-gray-600 leading-relaxed mb-6">
                  {String((producto as Record<string, unknown>)?.descripcion || 'Sin descripción')}
                </p>
              </div>

              <div className="flex justify-center">
                <Button
                  className="w-full max-w-md h-12 bg-[#0056C6] hover:bg-[#004299] text-white text-lg font-semibold rounded-xl"
                  onClick={() => {
                    router.push(`/plato/${String(params.id)}/personalizar`)
                  }}
                >
                  Ordene Ahora
                </Button>
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

      <Footer />
    </div>
  )
}