import { NextRequest, NextResponse } from 'next/server'

import { API_BASE_URL } from '@/lib/api-config'

/**
 * Proxy para enviar un pedido al backend
 * POST /api/pedidos/enviar
 *
 * Este endpoint llama al backend:
 * POST /api/v1/pedidos/enviar
 *
 * Body:
 * {
 *   "token_sesion": "string",
 *   "items": [
 *     {
 *       "id_producto": "string",
 *       "cantidad": number,
 *       "opciones": [{ "id_producto_opcion": "string" }],
 *       "notas_personalizacion": "string"
 *     }
 *   ],
 *   "notas_cliente": "string",
 *   "notas_cocina": "string"
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.text()

    // Validar que el body contiene al menos token_sesion
    let parsedBody: unknown
    try {
      parsedBody = JSON.parse(body)
    } catch {
      return NextResponse.json(
        { error: 'El cuerpo de la solicitud debe ser JSON válido' },
        { status: 400 }
      )
    }

    const bodyObj = parsedBody as Record<string, unknown>
    if (!bodyObj.token_sesion) {
      return NextResponse.json(
        { error: 'El parámetro token_sesion es requerido' },
        { status: 400 }
      )
    }

    // Llamar al backend para enviar el pedido
    const backendUrl = `${API_BASE_URL}/api/v1/pedidos/enviar`

    const backendRes = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    })

    const contentType = backendRes.headers.get('content-type')
    const data: unknown = contentType && contentType.includes('application/json')
      ? await backendRes.json()
      : await backendRes.text()

    return NextResponse.json(data, { status: backendRes.status })
  } catch (error: unknown) {
    console.error('Error al enviar pedido:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al enviar pedido' },
      { status: 500 }
    )
  }
}
