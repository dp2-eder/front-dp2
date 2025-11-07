/**
 * Sistema de caché de imágenes en localStorage
 * Rastrea qué imágenes ya han sido cargadas para evitar mostrar skeleton
 */

interface ImageCacheEntry {
  timestamp: number
}

const CACHE_KEY = 'imageCache'
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 horas

export function isImageCached(imageUrl: string | null | undefined): boolean {
  if (!imageUrl) return false

  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}') as Record<string, ImageCacheEntry>
    const entry = cache[imageUrl]

    if (!entry) return false

    // Verificar si el caché sigue siendo válido
    const age = Date.now() - entry.timestamp
    if (age > CACHE_DURATION) {
      // El caché expiró, eliminarlo
      delete cache[imageUrl]
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
      return false
    }

    return true
  } catch {
    return false
  }
}

export function markImageAsCached(imageUrl: string | null | undefined): void {
  if (!imageUrl) return

  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}') as Record<string, ImageCacheEntry>
    cache[imageUrl] = {
      timestamp: Date.now()
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch {
    // Silenciar errores de localStorage (podría estar lleno)
  }
}

export function clearImageCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY)
  } catch {
    // Silenciar errores
  }
}

export function getImageCacheStats(): { total: number; size: string } {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}') as Record<string, ImageCacheEntry>
    const total = Object.keys(cache).length

    // Estimar tamaño aproximado (clave + timestamp)
    const sizeBytes = JSON.stringify(cache).length
    const sizeKB = (sizeBytes / 1024).toFixed(2)

    return { total, size: `${sizeKB} KB` }
  } catch {
    return { total: 0, size: '0 KB' }
  }
}

/**
 * Limpia localStorage preservando el caché de imágenes
 * Útil para limpiar datos de sesión sin perder el caché optimizado
 */
export function clearLocalStoragePreservingImageCache(): void {
  try {
    // Guardar el caché de imágenes antes de limpiar
    const imageCache = localStorage.getItem(CACHE_KEY)

    // Limpiar todo
    localStorage.clear()

    // Restaurar el caché de imágenes
    if (imageCache) {
      localStorage.setItem(CACHE_KEY, imageCache)
    }
  } catch {
    // Si hay error, solo limpiar localStorage normalmente
    try {
      localStorage.clear()
    } catch {
      // Silenciar errores de localStorage
    }
  }
}
