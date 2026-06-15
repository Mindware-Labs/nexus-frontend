import 'server-only';
import { cookies } from 'next/headers';
import type { SessionUser, TokenPair } from '@/types/auth';

const TOKEN_COOKIE = 'nx_token';
const USER_COOKIE = 'nx_user';
const ACCESS_COOKIE = 'nx_access';

const SEVEN_DAYS = 7 * 24 * 60 * 60;
const FOURTEEN_MIN = 14 * 60; // un minuto menos que el access token (15m) para margen

const BASE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SEVEN_DAYS,
};

export async function createSession(data: TokenPair): Promise<void> {
  const jar = await cookies();
  const { id, name, email, role, tenantId } = data;

  jar.set(TOKEN_COOKIE, data.refreshToken, BASE_OPTS);
  jar.set(ACCESS_COOKIE, data.accessToken, { ...BASE_OPTS, maxAge: FOURTEEN_MIN });
  jar.set(
    USER_COOKIE,
    Buffer.from(JSON.stringify({ id, name, email, role, tenantId })).toString('base64'),
    BASE_OPTS,
  );
}

export async function deleteSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(TOKEN_COOKIE);
  jar.delete(ACCESS_COOKIE);
  jar.delete(USER_COOKIE);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const raw = jar.get(USER_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(Buffer.from(raw, 'base64').toString('utf-8')) as SessionUser;
  } catch {
    return null;
  }
}

export async function getRefreshToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(TOKEN_COOKIE)?.value ?? null;
}

export async function getStoredAccessToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(ACCESS_COOKIE)?.value ?? null;
}

export async function updateStoredAccessToken(accessToken: string): Promise<void> {
  const jar = await cookies();
  jar.set(ACCESS_COOKIE, accessToken, { ...BASE_OPTS, maxAge: FOURTEEN_MIN });
}
