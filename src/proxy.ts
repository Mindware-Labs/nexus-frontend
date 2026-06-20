import { NextRequest, NextResponse } from 'next/server'

const BACKEND = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL ?? ''

const COOKIE_ACCESS   = 'nx_access'
const COOKIE_REFRESH  = 'nx_token'
const COOKIE_USER     = 'nx_user'

const COOKIE_OPTS = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path:     '/',
  maxAge:   8 * 60 * 60,
} as const

/** Decode a JWT payload and check the `exp` claim.
 *  Returns true if the token is missing, malformed, or already expired.
 *  Adds a 10-second buffer so we refresh slightly before actual expiry. */
function isExpired(token: string | undefined): boolean {
  if (!token) return true
  try {
    const raw    = token.split('.')[1]
    const padded = raw + '='.repeat((4 - (raw.length % 4)) % 4)
    const b64    = padded.replace(/-/g, '+').replace(/_/g, '/')
    const payload: { exp?: number } = JSON.parse(atob(b64))
    if (typeof payload.exp !== 'number') return true
    return payload.exp < Date.now() / 1000 + 10 // 10s early buffer
  } catch {
    return true
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const accessToken  = req.cookies.get(COOKIE_ACCESS)?.value
  const refreshToken = req.cookies.get(COOKIE_REFRESH)?.value
  const userCookie   = req.cookies.get(COOKIE_USER)?.value

  // ── /login: redirect to home if already authenticated ──────────────────────
  if (pathname.startsWith('/login')) {
    if (refreshToken && userCookie && !isExpired(accessToken)) {
      try {
        const raw   = userCookie
        const padded = raw + '='.repeat((4 - (raw.length % 4)) % 4)
        const user: { role?: string } = JSON.parse(atob(padded))
        const dest = user.role === 'owner' ? '/dashboard' : '/panel'
        return NextResponse.redirect(new URL(dest, req.url))
      } catch { /* fall through to login page */ }
    }
    return NextResponse.next()
  }

  // ── Protected routes (/dashboard, /panel) ──────────────────────────────────

  // No session at all → go to login
  if (!refreshToken || !userCookie) {
    return redirectToLogin(req)
  }

  // Access token still valid → fast path, no network call needed
  if (!isExpired(accessToken)) {
    return NextResponse.next()
  }

  // Access token expired → attempt silent refresh
  try {
    const refreshRes = await fetch(`${BACKEND}/auth/refresh`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ refreshToken }),
      cache:   'no-store',
    })

    if (!refreshRes.ok) throw new Error(`refresh ${refreshRes.status}`)

    const { accessToken: newToken } = await refreshRes.json()
    if (typeof newToken !== 'string') throw new Error('no token in refresh response')

    // Continue the request with the new access token set in the response cookie
    const response = NextResponse.next()
    response.cookies.set(COOKIE_ACCESS, newToken, COOKIE_OPTS)
    return response
  } catch {
    // Refresh token invalid / network error → wipe cookies and go to login
    return redirectToLogin(req, true)
  }
}

function redirectToLogin(req: NextRequest, clearCookies = false): NextResponse {
  const res = NextResponse.redirect(new URL('/login', req.url))
  if (clearCookies) {
    res.cookies.delete(COOKIE_ACCESS)
    res.cookies.delete(COOKIE_REFRESH)
    res.cookies.delete(COOKIE_USER)
  }
  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/panel/:path*', '/login'],
}
