import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { prefetchAlergenos } from "@/hooks/use-alergenos"
import { prefetchProducto } from "@/hooks/use-producto"
import { isImageCached, markImageAsCached } from "@/lib/image-cache"
import { getProductImageUrl } from "@/lib/image-url"
import { Root2 } from "@/types/menu"
import { Producto } from "@/types/productos"

interface DishCardProps {
  dish: Root2 | Producto
  showPrice?: boolean
  className?: string
  priority?: boolean // Nuevo prop para controlar prioridad de carga
  disableAnimation?: boolean // Nuevo prop para desactivar animación
}

export function DishCard({
  dish,
  className = "",
  priority = false,
  disableAnimation = false
}: DishCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isCached, setIsCached] = useState(false)

  // Helper: obtener la imagen correcta del tipo Root2 o Producto
  const getImageUrl = () => {
    if ('imagen' in dish) return (dish).imagen
    if ('imagen_path' in dish) return (dish).imagen_path
    return null
  }

  // Helper: obtener disponibilidad
  const getDisponible = () => {
    if ('disponible' in dish) return (dish).disponible
    return true // Por defecto asumimos disponible si no hay propiedad
  }

  const rawImagenUrl = getImageUrl()
  const imagenUrl = getProductImageUrl(rawImagenUrl) || rawImagenUrl

  // Verificar si la imagen está en caché
  // Se ejecuta cuando el componente monta O cuando la imagen cambia
  useEffect(() => {
    if (imagenUrl) {
      const cached = isImageCached(imagenUrl)
      setIsCached(cached)
      // Si está en caché, no mostrar skeleton
      if (cached) {
        setImageLoaded(true)
      }
    }
  }, [imagenUrl])

  // Verificar caché nuevamente cuando el componente se hace visible (para navegaciones)
  useEffect(() => {
    const checkCacheOnVisibility = () => {
      if (imagenUrl) {
        const cached = isImageCached(imagenUrl)
        if (cached && !imageLoaded) {
          setIsCached(true)
          setImageLoaded(true)
        }
      }
    }

    // Verificar cuando la pestaña se vuelve visible
    document.addEventListener('visibilitychange', checkCacheOnVisibility)

    // Verificar después de un pequeño delay (para navegaciones)
    // Primera verificación rápida
    const timeout1 = setTimeout(checkCacheOnVisibility, 100)

    // Segunda verificación más agresiva como fallback (en caso de que el dato haya llegado tarde)
    const timeout2 = setTimeout(checkCacheOnVisibility, 500)

    return () => {
      document.removeEventListener('visibilitychange', checkCacheOnVisibility)
      clearTimeout(timeout1)
      clearTimeout(timeout2)
    }
  }, [imagenUrl, imageLoaded])
  
  // Placeholder genérico cuando no hay imagen
  const PLACEHOLDER_IMAGE = '/placeholder-image.png'

  // Validar si una string es una URL válida (relativa o absoluta)
  const isValidUrl = (url: string | null | undefined): url is string => {
    if (!url || typeof url !== 'string') return false
    // Aceptar rutas relativas (/) o URLs absolutas (http://, https://)
    return url.startsWith('/') || url.startsWith('http://') || url.startsWith('https://')
  }

  // Prefetch de datos cuando el usuario hace hover (precarga silenciosa)
  const handleMouseEnter = () => {
    // Usar las funciones de prefetch que guardan en caché
    // Esto evita llamadas duplicadas cuando el componente se monta
    // Si ya está en caché o hay un request pendiente, no hace nada
    void prefetchProducto(dish.id)
    void prefetchAlergenos(dish.id)
    
    // Precargar imagen también (usar window.Image para evitar conflicto con Next.js Image)
    if (isValidUrl(imagenUrl) && typeof window !== 'undefined') {
      const img = new window.Image()
      img.src = imagenUrl
    }
  }

  return (
    <Link 
      href={`/plato/${dish.id}`} 
      className={className}
      onMouseEnter={handleMouseEnter}
      prefetch={true}
    >
      <article
        className={`text-center cursor-pointer transition-transform duration-200 hover:scale-105 ${
          disableAnimation ? "opacity-100" : "animate-fade-in"
        }`}
        data-cy="plate-card"
      >
        {/* Contenedor de imagen */}
        <div className="relative">
          {/* 🔸 Skeleton solo si no está cacheado ni se desactivó animación */}
          {!disableAnimation && !imageLoaded && !isCached && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-t-3xl flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          <Image
            src={isValidUrl(imagenUrl) ? imagenUrl : PLACEHOLDER_IMAGE}
            alt={dish.nombre || "Imagen no disponible"}
            width={300}
            height={169}
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            className={`w-full object-cover rounded-t-3xl bg-gray-300 aspect-[16/9] ${
              disableAnimation
                ? "opacity-100 transition-none"
                : `transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`
            }`}
            data-cy="plate-image"
            onLoad={() => {
              setImageLoaded(true)
              if (imagenUrl) markImageAsCached(imagenUrl)
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = PLACEHOLDER_IMAGE
              setImageLoaded(true)
            }}
          />

          {/* Badge de disponibilidad */}
          {!getDisponible() && (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white text-xs">
              Agotado
            </Badge>
          )}
        </div>

        {/* Nombre del plato */}
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