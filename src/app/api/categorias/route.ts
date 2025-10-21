import { NextResponse } from 'next/server'

// Configuración del segmento de ruta para habilitar cache
export const revalidate = 300 // Revalidar cada 5 minutos
export const dynamic = 'force-static' // Forzar generación estática con cache

export async function GET() {
  try {
    const categoriasUrl = process.env.NEXT_PUBLIC_CATEGORIAS_URL || 'https://back-dp2.onrender.com/api/v1/categorias/productos/cards'
    
    const response = await fetch(`${categoriasUrl}?skip=0&limit=100`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'DineLine-Frontend/1.0',
      },
      next: { 
        revalidate: 300, // Cache por 5 minutos
        tags: ['categorias'] // Tag para revalidación manual si es necesario
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json() as { items: unknown[]; total: number }
    
    // Respuesta con headers de cache mejorados
    return NextResponse.json({ 
      success: true, 
      data,
      count: data.items?.length || 0,
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
