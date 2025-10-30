import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const backendRes = await fetch('https://back-dp2.onrender.com/api/v1/pedidos/completo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    const contentType = backendRes.headers.get('content-type');
    const data = contentType && contentType.includes('application/json')
      ? await backendRes.json()
      : await backendRes.text();

    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error en el proxy de pedidos' }, { status: 500 });
  }
}
