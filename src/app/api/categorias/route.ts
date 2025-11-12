import { NextResponse } from 'next/server'

import { API_BASE_URL } from '@/lib/api-config';

// Configuración del segmento de ruta para habilitar cache
export const revalidate = 300 // Revalidar cada 5 minutos
export const dynamic = 'force-static' // Forzar generación estática con cache

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') || '100' // Aumentado a 100 para cargar todas las categorías (hay 23)
    const skip = searchParams.get('skip') || '0'
    const activasOnly = searchParams.get('activas_only') || 'false'

    // ✅ CORREGIDO: Usar el endpoint correcto del backend
    const categoriasUrl = `${API_BASE_URL}/api/v1/categorias`
    
    const response = await fetch(`${categoriasUrl}?skip=${skip}&limit=${limit}&activas_only=${activasOnly}`, {
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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = await response.json()
    
    // El backend devuelve un array directamente, no un objeto con items
    // Verificar si es array o tiene estructura { items, total }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const isArray = Array.isArray(data)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const items = isArray ? data : (data?.items || [])
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const total = isArray ? data.length : (data?.total || items.length)
    
    // Respuesta con headers de cache mejorados
    return NextResponse.json({ 
      success: true, 
      data: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        items,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        total
      },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      count: items.length,
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
