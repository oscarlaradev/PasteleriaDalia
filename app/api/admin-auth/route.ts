import { NextRequest, NextResponse } from 'next/server';
import {
  DEFAULT_ADMIN_PIN,
  checkRateLimit,
  recordFailedAttempt,
  recordSuccessfulAttempt,
  generateAdminSessionToken,
  verifyAdminSessionToken,
} from '@/lib/security';

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') || '127.0.0.1';
}

// 1. Validar si la sesión actual es válida
export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get('dalia_obrador_session')?.value;

  if (sessionCookie && verifyAdminSessionToken(sessionCookie)) {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}

// 2. Intento de inicio de sesión con PIN / Clave Maestra
export async function POST(req: NextRequest) {
  const clientIp = getClientIp(req);

  // Verificación de bloqueo anti-fuerza bruta
  const rateStatus = checkRateLimit(clientIp);
  if (!rateStatus.allowed) {
    const minutesLeft = rateStatus.lockedUntil
      ? Math.ceil((rateStatus.lockedUntil - Date.now()) / 60000)
      : 15;
    return NextResponse.json(
      {
        error: `Acceso bloqueado por seguridad tras múltiples intentos fallidos. Intente de nuevo en ${minutesLeft} minutos.`,
        isLocked: true,
      },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const pin = (body.pin || '').trim();

    if (!pin) {
      return NextResponse.json({ error: 'Ingrese la Clave Maestra del Obrador.' }, { status: 400 });
    }

    // Comprobación de la clave
    if (pin === DEFAULT_ADMIN_PIN) {
      recordSuccessfulAttempt(clientIp);
      const token = generateAdminSessionToken();

      const res = NextResponse.json({
        success: true,
        message: 'Acceso concedido al panel del Obrador Dalia.',
      });

      // Cookie de sesión ultra-segura HttpOnly
      res.cookies.set('dalia_obrador_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 12 * 60 * 60, // 12 horas
      });

      return res;
    } else {
      const failStatus = recordFailedAttempt(clientIp);
      if (failStatus.isLocked) {
        return NextResponse.json(
          {
            error: 'Demasiados intentos fallidos. El acceso ha sido bloqueado por 15 minutos.',
            isLocked: true,
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          error: `Clave Maestra incorrecta. Le quedan ${failStatus.remaining} intentos antes del bloqueo.`,
          remaining: failStatus.remaining,
        },
        { status: 401 }
      );
    }
  } catch {
    return NextResponse.json({ error: 'Petición inválida.' }, { status: 400 });
  }
}

// 3. Cierre de sesión seguro
export async function DELETE() {
  const res = NextResponse.json({ success: true, message: 'Sesión cerrada exitosamente.' });
  res.cookies.set('dalia_obrador_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
  return res;
}
