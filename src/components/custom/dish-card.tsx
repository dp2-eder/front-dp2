import Image from "next/image"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Root2 } from "@/types/menu"

interface DishCardProps {
  dish: Root2
  showPrice?: boolean
  className?: string
  priority?: boolean // Nuevo prop para controlar prioridad de carga
}

export function DishCard({
  dish,
  className = "",
  priority = false
}: DishCardProps) {
  // Array de imágenes locales como fallback
  const localImages = [
    "/fresh-ceviche-with-red-onions-and-sweet-potato.jpg",
    "/mixed-seafood-ceviche-with-shrimp-and-octopus.jpg",
    "/tiradito-nikkei-with-thin-fish-slices-and-sesame.jpg",
    "/peruvian-seafood-rice-with-cilantro.jpg",
    "/causa-limena-with-yellow-potato-and-avocado.jpg",
    "/leche-de-tigre-with-seafood-and-corn-nuts.jpg",
    "/chaudfa-de-mariscos-500x450.jpg",
    "/maxresdefault.jpg",
    "/6143e231d4bfcf3c4448e32e.jpg",
    "/4.-Rice-with-black-scallops.jpg",
    "/maxresdefault (1).jpg",
    "/HQJJGNr2pPfcKZpbZ-2400-x.jpg"
  ]

  // Función para obtener una imagen local basada en el ID del plato
  const getLocalImage = (dishId: string | number) => {
    // Si es string (UUID), usar un hash simple
    if (typeof dishId === 'string') {
      const hash = dishId.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0)
        return a & a
      }, 0)
      const imageIndex = Math.abs(hash) % localImages.length
      return localImages[imageIndex]
    }
    
    // Si es número, usar la lógica original
    const imageIndex = (dishId - 1) % localImages.length
    return localImages[imageIndex]
  }

  return (
    <Link href={`/plato/${dish.id}`} className={className}>
      <article className="text-center cursor-pointer hover:scale-105 transition-transform duration-200" data-cy="plate-card">
        {/* Image Container */}
        <div className="relative">
          <Image
            src={dish.imagen || getLocalImage(dish.id)}
            alt={dish.nombre || "Imagen no disponible"}
            width={300}
            height={169}
            loading={priority ? "eager" : "lazy"}
            className="w-full object-cover rounded-t-3xl bg-gray-300 aspect-[16/9]"
            data-cy="plate-image"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = getLocalImage(dish.id)
            }}
          />
          {!dish.disponible && (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white text-xs">
              Agotado
            </Badge>
          )}
        </div>

        {/* Dish Name */}
        <h3
          className="bg-[#004166] text-white px-3 py-2 rounded-b-3xl text-sm font-medium truncate whitespace-nowrap overflow-hidden"
          title={dish.nombre}
          data-cy="plate-name"
        >
          {dish.nombre || "Nombre no disponible"}
        </h3>
      </article>
    </Link>
  )
}

export default DishCard