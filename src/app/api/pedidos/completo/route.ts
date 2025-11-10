import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/api-config';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const backendRes = await fetch(`${API_BASE_URL}/api/v1/pedidos/completo`, {
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
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Error en el proxy de pedidos' }, { status: 500 });
  }
}
