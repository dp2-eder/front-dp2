import { NextResponse } from 'next/server'

export async function GET() {
  try {
    //console.log('Calling external menu API...')
    
    const menuUrl = process.env.NEXT_PUBLIC_MENU_URL || 'https://backend-mockup.onrender.com/api/menu/items'
    
    const response = await fetch(menuUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'DineLine-Frontend/1.0',
      },
      // Agregar cache para mejorar performance
      next: { revalidate: 300 } // Cache por 5 minutos
    })

    //console.log('External API response status:', response.status)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json() as unknown[]
    //console.log('Menu data received:', data.length, 'items')
    
    return NextResponse.json({ 
      success: true, 
      data,
      count: Array.isArray(data) ? data.length : 0,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    //console.error('Error calling external menu API:', error)
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
