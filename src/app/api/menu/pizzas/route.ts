import { NextResponse } from 'next/server'
import { PIZZAS_URL } from '@/lib/api-config'

export async function GET() {
  try {
    //console.log('Calling pizzas API...')

    const menuUrl = PIZZAS_URL
    
    const response = await fetch(menuUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'DP2-Cevicheria/1.0',
      },
    })

    //console.log('Menu response status:', response.status)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json() as unknown[]
    //console.log('Menu data received:', data)
    
    return NextResponse.json({ 
      success: true, 
      data,
      count: Array.isArray(data) ? data.length : 0,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    //console.error('Error calling menu API:', error)
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
