"use client"
import { useState } from "react"

interface SafeImageProps {
  src: string | undefined
  alt: string
  className?: string
  fallbackSrc?: string
  showIndicator?: boolean
  onError?: () => void
}

export default function SafeImage({ 
  src, 
  alt, 
  className = "",
  fallbackSrc = "/placeholder-image.png",
  showIndicator = false,
  onError
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false)

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
  const isPlaceholder = validSrc === fallbackSrc || hasError

  const handleError = () => {
    if (!hasError && validSrc !== fallbackSrc) {
      setHasError(true)
      onError?.()
    }
  }

  return (
    <div className="relative">
      <img
        src={hasError ? fallbackSrc : validSrc}
        alt={alt}
        className={className}
        onError={handleError}
      />
      
      {/* Indicador cuando se usa placeholder */}
      
    </div>
  )
}