import { NextRequest, NextResponse } from 'next/server';

import { API_BASE_URL } from '@/lib/api-config';

/**
 * Proxy para el nuevo endpoint de login simplificado: POST /api/v1/login
 *
 * Este endpoint maneja automáticamente en el backend:
 * - Creación de usuario si no existe (validando formato de email)
 * - Actualización del nombre si cambió
 * - Manejo de sesiones de mesa compartidas (mismo token para múltiples usuarios)
 *
 * Query parameters:
 * - id_mesa: ID de la mesa (requerido)
 *
 * Body:
 * {
 *   "email": "string",
 *   "nombre": "string"
 * }
 */
export async function POST(req: NextRequest) {
  try {
    // Obtener id_mesa del query parameter
    const { searchParams } = new URL(req.url);
    const idMesa = searchParams.get('id_mesa');

    if (!idMesa) {
      return NextResponse.json(
        { error: 'El parámetro id_mesa es requerido' },
        { status: 400 }
      );
    }

    const body = await req.text();

    // Llamar al nuevo endpoint /api/v1/login con id_mesa como query parameter
    const backendUrl = new URL(`${API_BASE_URL}/api/v1/login`);
    backendUrl.searchParams.append('id_mesa', idMesa);

    const backendRes = await fetch(backendUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    const contentType = backendRes.headers.get('content-type');
    const data: unknown = contentType && contentType.includes('application/json')
      ? await backendRes.json()
      : await backendRes.text();

    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error en el login' },
      { status: 500 }
    );
  }
}
