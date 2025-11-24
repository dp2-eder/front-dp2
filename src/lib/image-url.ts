import { API_BASE_URL } from './api-config'

/**
 * Transforma URLs de imagen para que sean renderizables
 * Maneja:
 * - Google Drive URLs (extrae ID y convierte a formato directo)
 * - URLs HTTP/HTTPS (devuelve tal cual)
 * - Rutas relativas (agrega base URL del API)
 */
export const getProductImageUrl = (imagePath: string | null | undefined): string | null => {
  if (!imagePath) return null

  // Si es Google Drive
  if (imagePath.includes('drive.google.com')) {
    // Si ya está convertida, retornarla tal cual
    if (imagePath.includes('export=view')) {
      return imagePath
    }

    // Extraer el ID del formato /d/ID/
    const idMatch = imagePath.match(/\/d\/([a-zA-Z0-9-_]+)/)
    if (idMatch && idMatch[1]) {
      return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`
    }

    return imagePath
  }

  // Si es URL completa (http/https), retornarla tal cual
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }

  // Si es ruta relativa, agregar base URL
  if (API_BASE_URL) {
    return `${API_BASE_URL}/static/${imagePath}`
  }

  return imagePath
}
