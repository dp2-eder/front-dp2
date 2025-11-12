import { NextRequest, NextResponse } from 'next/server'

// Caché en memoria para evitar múltiples requests al mismo tiempo
const pendingFetches = new Map<string, Promise<ArrayBuffer>>()

// Caché de resultados (solo en desarrollo, en producción Next.js maneja el caché)
const imageCache = new Map<string, { buffer: ArrayBuffer; contentType: string; timestamp: number }>()
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000 // 1 semana

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const imageUrl = searchParams.get('url')
    
    if (!imageUrl) {
      return new NextResponse('Missing image URL', { status: 400 })
    }

    // Decodificar la URL
    const decodedUrl = decodeURIComponent(imageUrl)
    
    // Validar que sea una URL absoluta
    if (!decodedUrl.startsWith('http://') && !decodedUrl.startsWith('https://')) {
      return new NextResponse('Invalid image URL - must be absolute URL', { status: 400 })
    }
    
    // Verificar caché en memoria primero
    const cached = imageCache.get(decodedUrl)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return new NextResponse(cached.buffer, {
        headers: {
          'Content-Type': cached.contentType,
          'Cache-Control': 'public, max-age=604800, immutable', // 1 semana
          'X-Cache': 'HIT',
        },
      })
    }
    
    // Si ya hay un fetch en curso para esta URL, esperar a que termine
    const pendingFetch = pendingFetches.get(decodedUrl)
    if (pendingFetch) {
      // El pendingFetch solo tiene el buffer, necesitamos el contentType del caché o default
      const cachedForContentType = imageCache.get(decodedUrl)
      const contentType = cachedForContentType?.contentType || 'image/jpeg'
      const imageBuffer = await pendingFetch
      
      return new NextResponse(imageBuffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=604800, immutable',
          'X-Cache': 'PENDING',
        },
      })
    }
    
    // Crear nuevo fetch
    const fetchPromise = fetch(decodedUrl, {
      next: { 
        revalidate: 3600 * 24 * 7 // Cache por 1 semana en Next.js
      }
    }).then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`)
      }
      const buffer = await response.arrayBuffer()
      const contentType = response.headers.get('content-type') || 'image/jpeg'
      return { buffer, contentType }
    }).finally(() => {
      // Limpiar el fetch pendiente
      pendingFetches.delete(decodedUrl)
    })
    
    // Guardar el fetch pendiente
    pendingFetches.set(decodedUrl, fetchPromise.then(r => r.buffer))
    
    const { buffer: imageBuffer, contentType } = await fetchPromise
    
    // Guardar en caché en memoria
    imageCache.set(decodedUrl, {
      buffer: imageBuffer,
      contentType,
      timestamp: Date.now()
    })
    
    // Limpiar caché viejo (mantener solo las últimas 100 imágenes)
    if (imageCache.size > 100) {
      const entries = Array.from(imageCache.entries())
      entries.sort((a, b) => b[1].timestamp - a[1].timestamp)
      const toKeep = entries.slice(0, 100)
      imageCache.clear()
      toKeep.forEach(([url, data]) => imageCache.set(url, data))
    }

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=604800, immutable, stale-while-revalidate=86400', // 1 semana + stale-while-revalidate
        'X-Cache': 'MISS',
      },
    })
  } catch (error) {
    //console.error('Image proxy error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
