import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const alergenosUrl = `https://back-dp2.onrender.com/api/v1/productos/${id}/alergenos`
    
    const response = await fetch(alergenosUrl, {
      next: { revalidate: 300 } // Cache por 5 minutos
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json() as unknown[]
    
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

