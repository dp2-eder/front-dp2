"use client"
import Image from "next/image"
import { useEffect, useState } from "react"
import { isImageCached, markImageAsCached } from "@/lib/image-cache"

interface SafeImageProps {
  src: string | undefined
  alt: string
  className?: string
  fallbackSrc?: string
  showIndicator?: boolean
  onError?: () => void
  width?: number
  height?: number
  priority?: boolean
  quality?: number
}

export default function SafeImage({
  src,
  alt,
  className = "",
  fallbackSrc = "/placeholder-image.png",
  onError,
  width,
  height,
  priority,
  quality
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isCached, setIsCached] = useState(false)

  // Verificar si la imagen está en caché al montar
  useEffect(() => {
    if (src) {
      const cached = isImageCached(src)
      setIsCached(cached)
      // Si está en caché, no mostrar loading
      if (cached) {
        setIsLoaded(true)
      }
    }
  }, [src])

  // Función para validar URL de imagen
  const getValidImageSrc = (imageUrl: string | undefined): string => {
    if (!imageUrl) return fallbackSrc

    // Lista de dominios "malos" que deben usar placeholder
    const invalidDomains = [
      'example.com',
      'placeholder.com',
      'test.com',
      'dummy.com'
    ]

    // Verificar si la URL contiene algún dominio inválido
    const hasInvalidDomain = invalidDomains.some(domain => imageUrl.includes(domain))

    if (hasInvalidDomain) {
      return fallbackSrc
    }

    return imageUrl
  }

  const validSrc = getValidImageSrc(src)

  const handleError = () => {
    if (!hasError && validSrc !== fallbackSrc) {
      setHasError(true)
      onError?.()
    }
  }

  const handleLoad = () => {
    setIsLoaded(true)
    // Marcar imagen como cacheada cuando se carga
    if (validSrc !== fallbackSrc) {
      markImageAsCached(validSrc)
    }
  }

  // Mostrar skeleton solo si NO está en caché y NO ha cargado
  const showSkeleton = !isLoaded && !isCached

  return (
    <div className="relative">
      {/* Skeleton loader - solo si no está en caché */}
      {showSkeleton && (
        <div
          className={`${className} absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded`}
          style={{
            width: width ? `${width}px` : undefined,
            height: height ? `${height}px` : undefined
          }}
        />
      )}

      <Image
        src={hasError ? fallbackSrc : validSrc}
        alt={alt}
        width={width || 300}
        height={height || 200}
        className={className}
        onError={handleError}
        onLoad={handleLoad}
        priority={priority}
        quality={quality}
      />

      {/* Indicador cuando se usa placeholder */}

    </div>
  )
}