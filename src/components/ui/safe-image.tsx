"use client"
import Image from "next/image"
import { useEffect, useState, useRef } from "react"

import { isImageCached, markImageAsCached } from "@/lib/image-cache"

interface SafeImageProps {
  src: string | undefined
  alt: string
  className?: string
  fallbackSrc?: string
  showIndicator?: boolean
  onError?: () => void
  onLoad?: () => void
  width?: number
  height?: number
  priority?: boolean
  quality?: number
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
}

export default function SafeImage({
  src,
  alt,
  className = "",
  fallbackSrc = "/placeholder-image.png",
  onError,
  onLoad,
  width,
  height,
  priority,
  quality,
  objectFit = 'cover'
}: SafeImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isCached, setIsCached] = useState(false)
  const [hasError, setHasError] = useState(false)
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Verificar si la imagen está en caché cuando monta o cuando src cambia
  useEffect(() => {
    if (src && typeof window !== 'undefined') {
      const cached = isImageCached(src)
      setIsCached(cached)
      // Si está en caché, no mostrar skeleton
      if (cached) {
        setImageLoaded(true)
      }
    }
  }, [src])

  // Limpiar timeout cuando src cambia o cuando el componente se desmonta
  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current)
      }
    }
  }, [src])

  // Validar si una URL es válida
  const isValidUrl = (url: string | null | undefined): url is string => {
    if (!url || typeof url !== 'string') return false
    return url.startsWith('/') || url.startsWith('http://') || url.startsWith('https://')
  }

  // Detectar si es URL de Google Drive
  const isGoogleDriveUrl = (url: string | null | undefined): boolean => {
    return url ? url.includes('drive.google.com') : false
  }

  const PLACEHOLDER = fallbackSrc

  const showSkeleton = !imageLoaded && !isCached
  const hasFixedSize = width && height

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: hasFixedSize ? '100%' : 'auto',
    overflow: 'hidden'
  }

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: hasFixedSize ? '100%' : 'auto',
    objectFit,
    objectPosition: 'center center',
    display: 'block'
  }

  return (
    <div style={containerStyle} className={className}>
      {/* Skeleton solo si no está cacheada y no ha cargado */}
      {showSkeleton && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
      )}

      <Image
        src={hasError ? PLACEHOLDER : isValidUrl(src) ? src : PLACEHOLDER}
        alt={alt}
        width={width || 300}
        height={height || 200}
        priority={priority || isGoogleDriveUrl(src)}
        quality={quality}
        loading={priority ? "eager" : "lazy"}
        className={`transition-opacity duration-300 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={imageStyle}
        sizes={hasFixedSize ? `${width}px` : undefined}
        onLoad={() => {
          if (errorTimeoutRef.current) {
            clearTimeout(errorTimeoutRef.current)
            errorTimeoutRef.current = null
          }
          setImageLoaded(true)
          setHasError(false)
          if (src) markImageAsCached(src)
          onLoad?.()
        }}
        onError={() => {
          // Para URLs de Google Drive, esperar más tiempo (5 segundos)
          // porque pueden fallar temporalmente pero luego cargar
          const timeout = isGoogleDriveUrl(src) ? 5000 : 2000

          if (!errorTimeoutRef.current) {
            errorTimeoutRef.current = setTimeout(() => {
              setHasError(true)
              setImageLoaded(true)
              onError?.()
              errorTimeoutRef.current = null
            }, timeout)
          }
        }}
      />
    </div>
  )
}