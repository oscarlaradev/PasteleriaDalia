import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas señuelo que los atacantes / bots escanean por defecto
const BANNED_PATTERNS = [
  /^\/admin(\/.*)?$/,
  /^\/wp-admin(\/.*)?$/,
  /^\/administrator(\/.*)?$/,
  /^\/cpanel(\/.*)?$/,
  /^\/panel(\/.*)?$/,
  /^\/backend(\/.*)?$/,
  /^\/login(\/.*)?$/,
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Detección de escaneos y sondas a rutas predecibles
  for (const pattern of BANNED_PATTERNS) {
    if (pattern.test(pathname)) {
      // Falso 404: engaña a cualquier escáner haciéndole creer que la ruta no existe
      return new NextResponse('Not Found', {
        status: 404,
        headers: {
          'Content-Type': 'text/plain',
          'X-Robots-Tag': 'noindex, nofollow, noarchive',
        },
      });
    }
  }

  // 2. Respuesta normal con inyección de cabeceras de seguridad
  const response = NextResponse.next();

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Si acceden a la ruta secreta, prohibimos que Google o bots la indexen
  if (pathname.startsWith('/gestor-dalia-x94k')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Aplica a todas las rutas excepto archivos estáticos de Next.js e imágenes
     */
    '/((?!_next/static|_next/image|favicon.ico|assets/).*)',
  ],
};
