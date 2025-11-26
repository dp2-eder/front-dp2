import { NextRequest, NextResponse } from 'next/server'

/**
 * Middleware de Autenticación
 * Protege las rutas de cliente que requieren token_sesion
 * Redirige a /login/{id_mesa} si no hay token
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Rutas que requieren autenticación
  const protectedRoutes = [
    '/menu',
    '/carta',
    '/plato',
    '/pago',
    '/about',
  ]

  // Verificar si la ruta actual necesita protección
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(`/(cliente)${route}`) ||
    pathname.startsWith(route)
  )

  // Si no es una ruta protegida, dejar pasar
  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Verificar si hay token_sesion en las cookies
  const token = request.cookies.get('token_sesion')?.value

  // Si hay token, dejar pasar
  if (token) {
    return NextResponse.next()
  }

  // Si no hay token y es una ruta protegida, redirigir a login
  // Obtener id_mesa del query param o de un cookie (fallback)
  const idMesa = request.nextUrl.searchParams.get('mesa') ||
                 request.cookies.get('mesaId')?.value ||
                 'sin-mesa'

  // Redirigir a /login/[id_mesa]
  return NextResponse.redirect(
    new URL(`/login/${idMesa}`, request.url)
  )
}

// Configurar qué rutas deben pasar por el middleware
export const config = {
  matcher: [
    // Rutas cliente que requieren autenticación
    '/(cliente)/:path*',
    '/menu/:path*',
    '/carta/:path*',
    '/plato/:path*',
    '/pago/:path*',
    '/about/:path*',
  ],
}
