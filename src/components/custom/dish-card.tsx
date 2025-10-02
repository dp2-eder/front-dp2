import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  rating: number
  prepTime: string
  image: string
  category: string
  popular: boolean
}

interface DishCardProps {
  dish: MenuItem
  showPrice?: boolean
  isApiData?: boolean
  className?: string
}

export function DishCard({
  dish,
  showPrice = false,
  isApiData = false,
  className = ""
}: DishCardProps) {
  return (
    <Link href={`/plato/${dish.id}`} className={className}>
      <article className="text-center cursor-pointer hover:scale-105 transition-transform duration-200">
        {/* Image Container */}
        <div className="relative">
          <img
            src={dish.image || "/placeholder.svg"}
            alt={dish.name || "Imagen no disponible"}
            className="w-full object-cover rounded-t-3xl bg-gray-300 aspect-[16/9]"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.jpg"
            }}
          />
          {dish.popular && (
            <Badge className="absolute top-2 left-2 bg-yellow-500 hover:bg-yellow-600 text-white text-xs">
              Popular
            </Badge>
          )}
        </div>

        {/* Dish Name */}
        <h3
          className="bg-[#004166] text-white px-3 py-2 rounded-b-3xl text-sm font-medium truncate whitespace-nowrap overflow-hidden"
          title={dish.name} // tooltip con nombre completo
        >
          {dish.name || "Nombre no disponible"}
        </h3>
        {/* Price - Optional */}
        {showPrice && (
          <p className="mt-2 text-sm font-bold text-gray-800">
            {isApiData ? `$${dish.price.toFixed(2)}` : `S/ ${dish.price.toFixed(2)}`}
          </p>
        )}
      </article>
    </Link>
  )
}

export default DishCard



/* 
<div className="mt-8 p-6 bg-white rounded-xl border border-gray-200">
  <h3 className="text-lg font-semibold text-gray-900 mb-4">Test DishCard:</h3>
    <div className="w-64">
      <DishCard
      dish={localMenuItems[5]}
      showPrice={true}
      isApiData={false}
      />
  </div>
</div> 
*/