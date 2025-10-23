import { Card } from "@/components/ui/card"

export function DishCardSkeleton() {
  return (
    <Card className="overflow-hidden border-0 shadow-lg rounded-3xl bg-white animate-pulse">
      {/* Image Skeleton - versión optimizada */}
      <div className="relative w-full aspect-[16/9] bg-gradient-to-br from-gray-200 to-gray-300">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
      
      {/* Name Skeleton */}
      <div className="bg-gray-300 px-3 py-2 rounded-b-3xl">
        <div className="h-5 bg-gray-400 rounded w-3/4"></div>
      </div>
    </Card>
  )
}

export function DishGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-5">
      {Array.from({ length: count }).map((_, i) => (
        <DishCardSkeleton key={i} />
      ))}
    </div>
  )
}
