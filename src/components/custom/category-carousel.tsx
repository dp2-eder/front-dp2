"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface Category {
  nombre: string
  imagen_path: string
}

interface CategoryCarouselProps {
  categories: Category[]
}

export function CategoryCarousel({ categories }: CategoryCarouselProps) {
  const router = useRouter()
  const [loadedImages, setLoadedImages] = useState<Set<number>>(
    new Set(Array.from({ length: Math.min(categories.length, 6) }, (_, i) => i))
  )

  // Precargar todas las imágenes progresivamente después de la carga inicial
  useEffect(() => {
    if (categories.length > 6) {
      const loadRemainingImages = async () => {
        // Esperar 1 segundo antes de empezar a precargar el resto
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Cargar de a 3 imágenes cada 500ms
        for (let i = 6; i < categories.length; i += 3) {
          await new Promise(resolve => setTimeout(resolve, 500))
          setLoadedImages(prev => {
            const newSet = new Set(prev)
            for (let j = i; j < Math.min(i + 3, categories.length); j++) {
              newSet.add(j)
            }
            return newSet
          })
        }
      }
      
      void loadRemainingImages()
    }
  }, [categories.length])

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full max-w-full mx-auto"
    >
      <CarouselContent className="-ml-3 md:-ml-4">
        {categories.map((category, index) => (
          <CarouselItem
            key={`${category.nombre}-${index}`}
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
                  <div className="relative h-64 lg:h-72 bg-gradient-to-br from-gray-200 to-gray-300">
                    {loadedImages.has(index) ? (
                      <Image
                        src={category.imagen_path}
                        alt={category.nombre}
                        fill
                        priority={index < 3}
                        loading={index < 3 ? "eager" : "lazy"}
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          // Si falla, intentar con una imagen placeholder local
                          if (!target.src.includes('placeholder')) {
                            target.src = '/placeholder-image.png'
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse">
                        <div className="text-gray-400 text-4xl font-bold">
                          {category.nombre.charAt(0)}
                        </div>
                      </div>
                    )}
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
  )
}
