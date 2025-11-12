import { NextResponse } from 'next/server'

import { API_BASE_URL } from '@/lib/api-config'

/**
 * Proxy para obtener el historial de pedidos de una sesión
 * GET /api/pedidos/historial/{tokenSesion}
 *
 * Este endpoint llama al backend:
 * GET /api/v1/pedidos/historial/{token_sesion}
 *
 * Path parameters:
 * - tokenSesion: Token de sesión (requerido)
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ tokenSesion: string }> }
) {
  try {
    const { tokenSesion } = await params

    if (!tokenSesion) {
      return NextResponse.json(
        { error: 'El parámetro tokenSesion es requerido' },
        { status: 400 }
      )
    }

    // Llamar al backend para obtener el historial
    const backendUrl = `${API_BASE_URL}/api/v1/pedidos/historial/${tokenSesion}`

    const backendRes = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const contentType = backendRes.headers.get('content-type')
    const data: unknown = contentType && contentType.includes('application/json')
      ? await backendRes.json()
      : await backendRes.text()

    return NextResponse.json(data, { status: backendRes.status })
  } catch (error: unknown) {
    //console.error('Error al obtener historial de pedidos:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al obtener historial' },
      { status: 500 }
    )
  }
}
