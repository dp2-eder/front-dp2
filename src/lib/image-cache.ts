/**
 * Sistema de caché de imágenes en localStorage
 * Rastrea qué imágenes ya han sido cargadas para evitar mostrar skeleton
 */

interface ImageCacheEntry {
  timestamp: number
}

const CACHE_KEY = 'imageCache'
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 horas

// Función auxiliar para normalizar URLs de Google Drive
function normalizeImageUrl(url: string): string[] {
  const urls = [url]
  
  // Si es URL de Google Drive, generar variaciones
  if (url.includes('drive.google.com')) {
    // Formato: /file/d/ID
    const match1 = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/)
    if (match1) {
      const fileId = match1[1]
      // Agregar formato convertido
      urls.push(`https://drive.google.com/uc?export=view&id=${fileId}`)
      // Agregar formato original completo
      urls.push(`https://drive.google.com/file/d/${fileId}/view`)
    }
    
    // Si es formato uc?export=view, generar formato /file/d/
    const match2 = url.match(/uc\?export=view&id=([a-zA-Z0-9-_]+)/)
    if (match2) {
      const fileId = match2[1]
      urls.push(`https://drive.google.com/file/d/${fileId}/view`)
      urls.push(`https://drive.google.com/file/d/${fileId}`)
    }
  }
  
  return urls
}

export function isImageCached(imageUrl: string | null | undefined): boolean {
  if (!imageUrl) return false

  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}') as Record<string, ImageCacheEntry>
    
    // Verificar URL exacta
    let entry = cache[imageUrl]
    
    // Si no está, verificar variaciones de Google Drive
    if (!entry) {
      const normalizedUrls = normalizeImageUrl(imageUrl)
      for (const normalizedUrl of normalizedUrls) {
        entry = cache[normalizedUrl]
        if (entry) break
      }
    }
    
    if (!entry) return false

    // Verificar si el caché sigue siendo válido
    const age = Date.now() - entry.timestamp
    if (age > CACHE_DURATION) {
      // El caché expiró, eliminarlo
      const normalizedUrls = normalizeImageUrl(imageUrl)
      normalizedUrls.forEach(url => {
        if (cache[url]) {
          delete cache[url]
        }
      })
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
    const timestamp = Date.now()
    
    // Marcar URL exacta
    cache[imageUrl] = { timestamp }
    
    // Si es URL de Google Drive, marcar también las variaciones
    const normalizedUrls = normalizeImageUrl(imageUrl)
    normalizedUrls.forEach(url => {
      cache[url] = { timestamp }
    })
    
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
