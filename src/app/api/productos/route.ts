import { NextResponse } from 'next/server'

// Configuración del segmento de ruta para habilitar cache
export const revalidate = 300 // Revalidar cada 5 minutos
export const dynamic = 'force-static' // Forzar generación estática con cache

export async function GET() {
  try {
    const productosUrl = process.env.NEXT_PUBLIC_PRODUCTOS_URL || 'https://back-dp2.onrender.com/api/v1/productos/cards?skip=0&limit=300'
    
    const response = await fetch(productosUrl, {
      next: { 
        revalidate: 300, // Cache por 5 minutos
        tags: ['productos'] // Tag para revalidación manual si es necesario
      }
    })
    
    const data = await response.json() as unknown
    
    // Respuesta con headers de cache mejorados
    return NextResponse.json({ 
      success: true, 
      data,
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      }
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
