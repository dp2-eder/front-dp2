import Header from "@/components/layout/header"
import { Skeleton } from "@/components/ui/skeleton"

export function PlatoSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAFCFE] flex flex-col">
      <Header showFullNavigation={true} />
      <main className="flex-1">
        <div className="max-w-[1110px] mx-auto px-4 py-8">
          {/* Botón volver skeleton */}
          <div className="mb-6">
            <Skeleton className="h-7 w-7 rounded" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Columna izquierda - Información */}
            <div className="order-2 lg:order-1 space-y-6">
              {/* Nombre */}
              <Skeleton className="h-10 w-3/4 mx-auto lg:mx-0" />
              
              {/* Descripción */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>

              {/* Precio y botón */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center justify-center md:justify-start">
                <Skeleton className="h-8 w-40 mx-auto md:mx-0" />
                <Skeleton className="h-12 w-32 mx-auto md:mx-0 rounded-xl" />
              </div>

              {/* Alergenos skeleton */}
              <div className="mt-6">
                <Skeleton className="h-6 w-64 mb-4 hidden md:block" />
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col items-center">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-3 w-12 mt-1" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Columna derecha - Imagen */}
            <div className="order-1 lg:order-2">
              <Skeleton className="h-64 lg:h-96 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

