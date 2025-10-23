import { NextRequest, NextResponse } from 'next/server'

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
    
    // Fetch de la imagen desde Google Drive u otra fuente
    const response = await fetch(decodedUrl, {
      next: { 
        revalidate: 3600 * 24 * 7 // Cache por 1 semana, las imágenes de categorías no cambian frecuentemente
      }
    })

    if (!response.ok) {
      return new NextResponse('Failed to fetch image', { status: response.status })
    }

    const imageBuffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'image/jpeg'

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=604800, immutable', // 1 semana
      },
    })
  } catch (error) {
    //console.error('Image proxy error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
