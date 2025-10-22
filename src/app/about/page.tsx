"use client"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useCategorias } from '@/hooks/use-categorias'

export default function AboutPage() {
  const router = useRouter()
  const { categorias, loading } = useCategorias()

  return (
    <div className="min-h-screen bg-background">
      <Header showFullNavigation={true} />

      {/* Hero Section */}
      <section className="lg:bg-gradient-to-br lg:from-[#0B4F6C] lg:to-[#0B4F6C]/90 lg:text-white lg:relative lg:overflow-hidden">
        {/* Fondo solo en desktop */}
        <div className="hidden lg:block absolute inset-0 bg-[url('/fondo-inicio.png')] bg-cover bg-center"></div>
        
        {/* Layout para móvil y tablet - Imagen arriba */}
        <div className="lg:hidden">
          <div className="relative w-full h-64 md:h-80">
            <Image
              src="/fondo-mobile-inicio.jpg"
              alt="Ceviche de bienvenida"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div className="bg-white py-8 px-4">
            <div className="container mx-auto text-center">
              <h1 className="scroll-m-20 text-3xl md:text-4xl font-bold tracking-tight text-[#0B4F6C] mb-4">
                Bienvenido a Dine Line
              </h1>
              <p className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed italic max-w-2xl mx-auto">
                &ldquo;Reconocido por su innovadora modalidad para brindarte
                una experiencia única y personalizada&rdquo;
              </p>
              <Link href="/menu">
                <Button
                  size="lg"
                  className="bg-[#0B4F6C] text-white hover:bg-[#094160] shadow-xl text-base md:text-lg px-10 py-6 rounded-xl font-semibold"
                >
                  Ordene Ahora
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Layout para desktop - Imagen de fondo con texto a la derecha */}
        <div className="hidden lg:block container mx-auto px-4 relative z-10 py-16 md:py-24">
          <div className="flex flex-col lg:flex-row items-center max-w-full mx-auto">
            <div className="lg:w-[60%]"></div>
            
            <div className="lg:w-[40%] flex flex-col items-center text-center justify-center lg:pr-8">
              <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl mb-6 text-white">
                Bienvenido a Dine Line
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed italic">
                &ldquo;Reconocido por su innovadora modalidad para brindarte
                una experiencia única y personalizada&rdquo;
              </p>
              <Link href="/menu">
                <Button
                  size="lg"
                  className="bg-[#0B4F6C] text-white hover:bg-[#094160] shadow-xl text-base md:text-lg px-10 py-6 rounded-xl font-semibold"
                >
                  Ordene Ahora
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-20 bg-white relative">
        <div className="hidden lg:block absolute inset-0 bg-[url('/pescado-inicio.jpg')] bg-no-repeat bg-left-top opacity-50 pointer-events-none" style={{ backgroundSize: '300px' }}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="scroll-m-20 text-3xl md:text-4xl font-bold tracking-tight text-center text-[#0B4F6C] mb-12 md:mb-16">
            Nuestras Categorías
          </h2>

          {loading && categorias.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#0B4F6C]"></div>
            </div>
          ) : (
            /* Carrusel para todos los tamaños de pantalla */
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full max-w-full mx-auto"
            >
              <CarouselContent className="-ml-3 md:-ml-4">
                {categorias.map((category, index) => (
                <CarouselItem
                  key={category.nombre}
                  className="pl-3 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5"
                >
                  <div
                    className="group block cursor-pointer"
                    onClick={() =>
                      router.push(`/menu?categoria=${encodeURIComponent(category.nombre)}`)
                    }
                  >
                    <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-105 rounded-3xl">
                      <CardContent className="p-0">
                        <div className="relative h-64 lg:h-72">
                          <Image
                            src={category.imagen_path}
                            alt={category.nombre}
                            fill
                            priority={index < 5} // Solo las primeras 5 con prioridad
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="bg-[#0B4F6C] py-3 px-3 lg:py-4 lg:px-4">
                          <h3 className="text-base lg:text-xl font-bold text-white text-center">
                            {category.nombre}
                          </h3>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4" />
            <CarouselNext className="hidden md:flex -right-4" />
          </Carousel>
          )}
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}