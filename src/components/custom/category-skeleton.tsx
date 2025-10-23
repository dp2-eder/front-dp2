import { Card, CardContent } from "@/components/ui/card"

export function CategorySkeleton() {
  return (
    <div className="pl-3 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5">
      <Card className="overflow-hidden border-0 shadow-xl rounded-3xl">
        <CardContent className="p-0">
          <div className="relative h-64 lg:h-72 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
          <div className="bg-gray-700 py-3 px-3 lg:py-4 lg:px-4">
            <div className="h-6 bg-gray-600 rounded animate-pulse mx-auto w-3/4" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function CategoryCarouselSkeleton() {
  return (
    <div className="w-full max-w-full mx-auto">
      <div className="flex -ml-3 md:-ml-4 gap-3 md:gap-4 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <CategorySkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
