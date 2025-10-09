import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const categoriasUrl = process.env.NEXT_PUBLIC_CATEGORIAS_URL || 'https://back-dp2.onrender.com/api/v1/categorias/productos/cards'
    
    const response = await fetch(`${categoriasUrl}?skip=0&limit=100`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'DineLine-Frontend/1.0',
      },
      next: { revalidate: 300 } // Cache por 5 minutos
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json() as { items: unknown[]; total: number }
    
    return NextResponse.json({ 
      success: true, 
      data,
      count: data.items?.length || 0,
      timestamp: new Date().toISOString()
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
