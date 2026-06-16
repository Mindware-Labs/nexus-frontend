import 'server-only'
import { getRefreshToken, getStoredAccessToken, updateStoredAccessToken } from '@/lib/session'

const BACKEND = process.env.BACKEND_URL!

function isTokenExpired(token: string): boolean {
  try {
    const [, payloadB64] = token.split('.')
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8')) as {
      exp?: number
    }
    // Considera expirado si quedan menos de 60 segundos
    return !payload.exp || Date.now() >= (payload.exp * 1000) - 60_000
  } catch {
    return true
  }
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await getRefreshToken()
  if (!refreshToken) return null

  try {
    const res = await fetch(`${BACKEND}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      cache: 'no-store',
    })
    if (!res.ok) return null

    const data = await res.json()
    const accessToken = data.accessToken as string | undefined
    if (!accessToken) return null

    // Intentar cachear el nuevo access token en la cookie.
    // En Server Components esto lanzará una excepción (solo lectura);
    // en Server Actions funcionará correctamente.
    try {
      await updateStoredAccessToken(accessToken)
    } catch {
      // Contexto de Server Component — no se pueden escribir cookies, se ignora.
    }

    return accessToken
  } catch {
    return null
  }
}

export async function getAccessToken(): Promise<string | null> {
  // Primero intentar usar el access token ya cacheado en la sesión
  const stored = await getStoredAccessToken()
  if (stored && !isTokenExpired(stored)) {
    return stored
  }

  // Token ausente o expirado — renovar usando el refresh token
  return refreshAccessToken()
}

function buildHeaders(token: string, extra?: RequestInit['headers']): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    ...(extra as Record<string, string> | undefined),
    Authorization: `Bearer ${token}`,
  }
}

export async function backendFetch(path: string, init?: RequestInit): Promise<Response> {
  const accessToken = await getAccessToken()
  if (!accessToken) {
    return new Response(JSON.stringify({ message: 'No autenticado' }), { status: 401 })
  }

  const res = await fetch(`${BACKEND}${path}`, {
    ...init,
    headers: buildHeaders(accessToken, init?.headers),
    cache: 'no-store',
  })

  // If the backend still rejects the token, attempt one refresh + retry.
  if (res.status === 401) {
    const newToken = await refreshAccessToken()
    if (!newToken) return res
    return fetch(`${BACKEND}${path}`, {
      ...init,
      headers: buildHeaders(newToken, init?.headers),
      cache: 'no-store',
    })
  }

  return res
}
