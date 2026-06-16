import { NextRequest, NextResponse } from 'next/server'

const BACKEND = process.env.BACKEND_URL

export async function middleware(req: NextRequest) {
  const match = req.nextUrl.pathname.match(/^\/widget\/([^/]+)$/)
  if (!match) return NextResponse.next()

  const clientId = match[1]

  if (!BACKEND) {
    const res = NextResponse.next()
    res.headers.set('Content-Security-Policy', "frame-ancestors 'none'")
    return res
  }

  try {
    const backendRes = await fetch(
      `${BACKEND}/api/v1/bot/widget/${clientId}/config`,
      { cache: 'no-store' },
    )

    const response = NextResponse.next()

    if (backendRes.ok) {
      const config = await backendRes.json()
      const websiteUrl = (config.websiteUrl as string | undefined)?.trim()
      const frameAncestors = websiteUrl ? `'self' ${websiteUrl}` : "'none'"
      response.headers.set('Content-Security-Policy', `frame-ancestors ${frameAncestors}`)
    } else {
      // Bot no encontrado o error: bloquear embedding por seguridad.
      response.headers.set('Content-Security-Policy', "frame-ancestors 'none'")
    }

    return response
  } catch {
    // Error de red: dejar pasar sin bloquear para no romper el widget.
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/widget/:clientId*'],
}
