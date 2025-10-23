import { Card } from "@/components/ui/card"

export function CategorySectionSkeleton() {
  return (
    <div className="mb-8">
      <div className="bg-gray-200 rounded-lg p-6 animate-pulse">
        {/* Header skeleton */}
        <div className="flex items-center mb-4">
          <div className="flex-1 flex justify-center">
            <div className="h-7 bg-gray-300 rounded w-48"></div>
          </div>
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  )
}

export function MenuPageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Title skeleton */}
      <div className="h-10 bg-gray-200 rounded w-64 mx-auto animate-pulse"></div>
      
      {/* Search skeleton */}
      <div className="h-12 bg-gray-200 rounded-lg w-full md:w-1/2 mx-auto animate-pulse"></div>
      
      {/* Categories skeleton */}
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 rounded-full w-24 animate-pulse"></div>
        ))}
      </div>
      
      {/* Category sections skeleton */}
      <div className="hidden md:block">
        {Array.from({ length: 3 }).map((_, i) => (
          <CategorySectionSkeleton key={i} />
        ))}
      </div>
      
      {/* Mobile grid skeleton */}
      <div className="md:hidden grid grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="h-64 bg-gray-200 animate-pulse rounded-lg"></Card>
        ))}
      </div>
    </div>
  )
}
