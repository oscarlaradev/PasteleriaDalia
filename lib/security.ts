// Blindaje de Seguridad Integral y Validación Canónica de Dalia Repostería
import crypto from 'crypto';
import { CATALOGO_DALIA_PRODUCTOS } from './catalogoProductos';

export const ADMIN_SECRET_PATH = '/gestor-dalia-x94k';
const MASTER_SECRET_SEED = process.env.ADMIN_SESSION_SECRET || 'dalia_artesanal_secret_key_8333186010_tampico';
export const DEFAULT_ADMIN_PIN = process.env.ADMIN_MASTER_PIN || 'Dalia2026!Tampico';

// Memoria segura de intentos fallidos (Anti Fuerza Bruta)
interface AttemptRecord {
  count: number;
  lockedUntil: number;
}
const failedAttemptsMap = new Map<string, AttemptRecord>();

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutos

export function checkRateLimit(clientIp: string): { allowed: boolean; remaining: number; lockedUntil?: number } {
  const now = Date.now();
  const record = failedAttemptsMap.get(clientIp);

  if (!record) {
    return { allowed: true, remaining: MAX_ATTEMPTS };
  }

  if (record.lockedUntil > now) {
    return { allowed: false, remaining: 0, lockedUntil: record.lockedUntil };
  }

  // Si ya pasó el bloqueo, reseteamos
  if (record.lockedUntil > 0 && record.lockedUntil <= now) {
    failedAttemptsMap.delete(clientIp);
    return { allowed: true, remaining: MAX_ATTEMPTS };
  }

  return { allowed: true, remaining: Math.max(0, MAX_ATTEMPTS - record.count) };
}

export function recordFailedAttempt(clientIp: string): { remaining: number; isLocked: boolean } {
  const now = Date.now();
  const record = failedAttemptsMap.get(clientIp) || { count: 0, lockedUntil: 0 };
  record.count += 1;

  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_MS;
    failedAttemptsMap.set(clientIp, record);
    return { remaining: 0, isLocked: true };
  }

  failedAttemptsMap.set(clientIp, record);
  return { remaining: MAX_ATTEMPTS - record.count, isLocked: false };
}

export function recordSuccessfulAttempt(clientIp: string) {
  failedAttemptsMap.delete(clientIp);
}

// Generación de Token de Sesión Criptográficamente Seguro
export function generateAdminSessionToken(): string {
  const timestamp = Date.now();
  const payload = `dalia-admin-session:${timestamp}:${Math.random()}`;
  const signature = crypto.createHmac('sha256', MASTER_SECRET_SEED).update(payload).digest('hex');
  return Buffer.from(JSON.stringify({ payload, signature, timestamp })).toString('base64');
}

export function verifyAdminSessionToken(tokenString: string): boolean {
  try {
    const raw = Buffer.from(tokenString, 'base64').toString('utf-8');
    const { payload, signature, timestamp } = JSON.parse(raw);

    // Validez de 12 horas
    if (Date.now() - timestamp > 12 * 60 * 60 * 1000) {
      return false;
    }

    const expected = crypto.createHmac('sha256', MASTER_SECRET_SEED).update(payload).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export { getCanonicalProductPrice } from './canonicalPricing';

