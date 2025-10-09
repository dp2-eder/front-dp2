import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const productosUrl = process.env.NEXT_PUBLIC_PRODUCTOS_URL || 'https://back-dp2.onrender.com/api/v1/productos/cards?skip=0&limit=300'
    
    const response = await fetch(productosUrl)
    const data = await response.json() as unknown
    
    return NextResponse.json({ 
      success: true, 
      data,
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
