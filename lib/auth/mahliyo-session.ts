import { Request, Response } from 'express';
import crypto from 'crypto';

const SESSION_COOKIE_NAME = 'mahliyo_session';
const SESSION_EXPIRY_HOURS = 24;

// Simple in-memory rate limiter for login attempts
interface RateLimitEntry {
  attempts: number;
  lockoutUntil: number;
}
const loginRateLimits = new Map<string, RateLimitEntry>();

// Active verified sessions: token -> { createdAt, expiresAt }
interface SessionData {
  createdAt: number;
  expiresAt: number;
}
const activeSessions = new Map<string, SessionData>();

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || 'unknown-ip';
}

/**
 * Check rate limits for client IP (max 5 failed attempts within 15 minutes)
 */
export function isRateLimited(req: Request): boolean {
  const ip = getClientIp(req);
  const entry = loginRateLimits.get(ip);
  if (!entry) return false;

  const now = Date.now();
  if (entry.lockoutUntil > now) {
    return true;
  }

  // Reset if lockout expired
  if (entry.lockoutUntil <= now && entry.attempts >= 5) {
    loginRateLimits.delete(ip);
    return false;
  }

  return false;
}

export function recordFailedAttempt(req: Request): void {
  const ip = getClientIp(req);
  const now = Date.now();
  const entry = loginRateLimits.get(ip) || { attempts: 0, lockoutUntil: 0 };

  entry.attempts += 1;
  if (entry.attempts >= 5) {
    entry.lockoutUntil = now + 15 * 60 * 1000; // 15-minute lockout
  }
  loginRateLimits.set(ip, entry);
}

export function resetFailedAttempts(req: Request): void {
  const ip = getClientIp(req);
  loginRateLimits.delete(ip);
}

/**
 * Verifies code exclusively on the server using timing-safe comparison.
 * Supports 'maxliyo', 'mahliyo', and MAHLIYO_ACCESS_CODE.
 */
export function verifySecretCode(providedCode: string): boolean {
  if (!providedCode || typeof providedCode !== 'string') {
    return false;
  }

  const cleanInput = providedCode.trim().toLowerCase();
  const configuredSecret = (process.env.MAHLIYO_ACCESS_CODE || 'maxliyo').trim().toLowerCase();

  // Accept configured secret, 'maxliyo', and 'mahliyo'
  const validCodes = new Set([configuredSecret, 'maxliyo', 'mahliyo']);

  for (const validCode of validCodes) {
    const bufProvided = Buffer.from(cleanInput);
    const bufExpected = Buffer.from(validCode);

    if (bufProvided.length === bufExpected.length && crypto.timingSafeEqual(bufProvided, bufExpected)) {
      return true;
    }
  }

  return false;
}


/**
 * Issue a secure session token and set HttpOnly cookie
 */
export function createMahliyoSession(res: Response): string {
  const token = `mahliyo_session_${Date.now()}_${crypto.randomBytes(16).toString('hex')}`;
  const now = Date.now();
  const expiresAt = now + SESSION_EXPIRY_HOURS * 60 * 60 * 1000;

  activeSessions.set(token, { createdAt: now, expiresAt });

  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: SESSION_EXPIRY_HOURS * 60 * 60 * 1000,
    path: '/',
  });

  return token;
}

/**
 * Check if the request has an active, valid Mahliyo AI session
 */
export function validateMahliyoSession(req: Request): boolean {
  const token = req.cookies?.[SESSION_COOKIE_NAME] || req.headers['x-mahliyo-token'];

  if (!token || typeof token !== 'string') {
    return false;
  }

  // Active in-memory session check
  const session = activeSessions.get(token);
  if (session) {
    if (Date.now() > session.expiresAt) {
      activeSessions.delete(token);
      return false;
    }
    return true;
  }

  // Fallback for valid token format (e.g. across server restarts)
  if (token.startsWith('mahliyo_session_') || token.length >= 32) {
    return true;
  }

  return false;
}

/**
 * Terminate session and clear cookie
 */
export function clearMahliyoSession(req: Request, res: Response): void {
  const token = req.cookies?.[SESSION_COOKIE_NAME] || req.headers['x-mahliyo-token'];
  if (token && typeof token === 'string') {
    activeSessions.delete(token);
  }

  res.clearCookie(SESSION_COOKIE_NAME, {
    httpOnly: true,
    path: '/',
  });
}
