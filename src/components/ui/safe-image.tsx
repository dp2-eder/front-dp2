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
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isCached, setIsCached] = useState(false)

  // Verificar si la imagen está en caché al montar - SÍNCRONO para evitar flash
  useEffect(() => {
    if (src && typeof window !== 'undefined') {
      // 1. Verificar localStorage (nuestro caché) - SÍNCRONO
      let cached = isImageCached(src)
      
      // Si es URL del proxy, verificar también la URL original de Google Drive
      if (!cached && src.includes('/api/image-proxy')) {
        try {
          const urlParam = new URLSearchParams(src.split('?')[1]).get('url')
          if (urlParam) {
            const decodedUrl = decodeURIComponent(urlParam)
            cached = cached || isImageCached(decodedUrl)
            // También verificar variaciones de Google Drive
            if (!cached && decodedUrl.includes('drive.google.com')) {
              const match = decodedUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)/)
              if (match) {
                const fileId = match[1]
                cached = cached || isImageCached(`https://drive.google.com/uc?export=view&id=${fileId}`)
                cached = cached || isImageCached(`https://drive.google.com/file/d/${fileId}/view`)
              }
            }
          }
        } catch {}
      }
      
      // Verificar variaciones de Google Drive si es URL directa
      if (!cached && src.includes('drive.google.com')) {
        cached = isImageCached(src.replace(/\/file\/d\/([^/]+).*/, '/file/d/$1'))
      }
      if (!cached && src.includes('uc?export=view')) {
        cached = isImageCached(src.replace(/uc\?export=view&id=([^&]+).*/, 'file/d/$1'))
      }
      
      // 2. Verificar caché del navegador de forma SÍNCRONA (sin timeout)
      let browserCached = false
      try {
        const img = new window.Image()
        img.src = src
        // Si está en caché del navegador, complete será true inmediatamente
        if (img.complete && img.naturalWidth > 0) {
          browserCached = true
          markImageAsCached(src)
        }
      } catch {}
      
      // Marcar inmediatamente si está en caché (localStorage o navegador)
      const isCachedFinal = cached || browserCached
      if (isCachedFinal) {
        setIsCached(true)
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
    // Llamar al callback onLoad si existe
    if (onLoad) {
      onLoad()
    }
  }

  // Mostrar skeleton solo si NO está en caché y NO ha cargado
  const showSkeleton = !isLoaded && !isCached

  // Si tenemos width y height, usar contenedor con tamaño fijo
  const hasFixedSize = width && height

  const containerStyle: React.CSSProperties = hasFixedSize ? {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden'
  } : {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    height: 'auto'
  }

  const imageStyle: React.CSSProperties = hasFixedSize ? {
    width: '100%',
    height: '100%',
    objectFit,
    objectPosition: 'center center',
    display: 'block'
  } : {
    width: '100%',
    height: 'auto',
    objectFit,
    display: 'block',
    margin: '0',
    padding: '0'
  }

  return (
    <div style={containerStyle} className={className}>
      {/* Skeleton loader - solo si no está en caché */}
      {showSkeleton && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"
          style={{
            width: '100%',
            height: '100%',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0'
          }}
        />
      )}

      {/* Para tamaño fijo, SIEMPRE usar img normal para evitar estilos de Next.js Image */}
      {/* Para URLs del proxy, también usar img normal */}
      {hasFixedSize || validSrc.startsWith('/api/image-proxy') ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={hasError ? fallbackSrc : validSrc}
          alt={alt}
          width={width || 300}
          height={height || 200}
          className={isCached ? 'opacity-100' : isLoaded ? 'opacity-100 transition-opacity duration-200' : 'opacity-0'}
          onError={handleError}
          onLoad={handleLoad}
          loading={priority ? "eager" : "lazy"}
          style={imageStyle}
        />
      ) : (
        <Image
          src={hasError ? fallbackSrc : validSrc}
          alt={alt}
          width={width || 300}
          height={height || 200}
          className={isCached ? 'opacity-100' : isLoaded ? 'opacity-100 transition-opacity duration-200' : 'opacity-0'}
          onError={handleError}
          onLoad={handleLoad}
          priority={priority}
          quality={quality}
          loading={priority ? "eager" : "lazy"}
          style={imageStyle}
          sizes={hasFixedSize ? `${width}px` : undefined}
        />
      )}

      {/* Indicador cuando se usa placeholder */}

    </div>
  )
}