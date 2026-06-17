import 'server-only'
import { redirect } from 'next/navigation'
import { deleteSession, getRefreshToken, getStoredAccessToken, updateStoredAccessToken } from '@/lib/session'

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

export async function getAccessToken(): Promise<string> {
  // Primero intentar usar el access token ya cacheado en la sesión
  const stored = await getStoredAccessToken()
  if (stored && !isTokenExpired(stored)) {
    return stored
  }

  // Token ausente o expirado — renovar usando el refresh token
  const refreshed = await refreshAccessToken()
  if (refreshed) return refreshed

  // Sin token válido ni refresh posible: sesión expirada, redirigir a login.
  await deleteSession()
  redirect('/login')
}

function buildHeaders(token: string, extra?: RequestInit['headers']): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    ...(extra as Record<string, string> | undefined),
    Authorization: `Bearer ${token}`,
  }
}

// Variante para uploads multipart — no fija Content-Type (el boundary lo pone el runtime).
export async function backendFetchFormData(path: string, body: FormData): Promise<Response> {
  const accessToken = await getAccessToken()

  const doFetch = (token: string) =>
    fetch(`${BACKEND}${path}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body,
      cache: 'no-store',
    })

  const res = await doFetch(accessToken)
  if (res.status !== 401) return res

  // Reintento tras refresh (el backend puede rechazar el token por race condition).
  const newToken = await refreshAccessToken()
  if (!newToken) {
    await deleteSession()
    redirect('/login')
  }
  return doFetch(newToken)
}

export async function backendFetch(path: string, init?: RequestInit): Promise<Response> {
  const accessToken = await getAccessToken()

  const res = await fetch(`${BACKEND}${path}`, {
    ...init,
    headers: buildHeaders(accessToken, init?.headers),
    cache: 'no-store',
  })

  // Si el backend rechaza el token, intentar un refresh y reintentar.
  if (res.status === 401) {
    const newToken = await refreshAccessToken()
    if (!newToken) {
      await deleteSession()
      redirect('/login')
    }
    return fetch(`${BACKEND}${path}`, {
      ...init,
      headers: buildHeaders(newToken, init?.headers),
      cache: 'no-store',
    })
  }

  return res
}
