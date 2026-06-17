import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BACKEND = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL;

const AUTH_PAGES = ['/login', '/forgot-password', '/reset-password'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Widget: validar CSP frame-ancestors contra config del backend ──────
  const widgetMatch = pathname.match(/^\/widget\/([^/]+)$/);
  if (widgetMatch) {
    const res = NextResponse.next();
    if (!BACKEND) {
      res.headers.set('Content-Security-Policy', "frame-ancestors 'none'");
      return res;
    }
    try {
      const backendRes = await fetch(
        `${BACKEND}/bot/widget/${widgetMatch[1]}/config`,
        { cache: 'no-store' },
      );
      if (backendRes.ok) {
        const cfg = await backendRes.json();
        const origin = (cfg.websiteUrl as string | undefined)?.trim();
        res.headers.set(
          'Content-Security-Policy',
          `frame-ancestors ${origin ? `'self' ${origin}` : "'none'"}`,
        );
      } else {
        res.headers.set('Content-Security-Policy', "frame-ancestors 'none'");
      }
    } catch {
      // Error de red: no bloquear el widget.
    }
    return res;
  }

  // ── Leer y decodificar tokens ─────────────────────────────────────────
  const refreshToken = request.cookies.get('nx_token')?.value ?? null;
  const accessToken  = request.cookies.get('nx_access')?.value ?? null;

  let role: string | null = null;
  let sessionExpired = false;

  if (refreshToken) {
    try {
      const payloadPart = refreshToken.split('.')[1];
      if (payloadPart) {
        const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
        const padded  = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
        const payload = JSON.parse(atob(padded)) as { exp?: number };
        if (payload.exp && Date.now() >= payload.exp * 1000) {
          sessionExpired = true;
        }
      }
    } catch {
      sessionExpired = true;
    }
  }

  // El role viaja en el access token (sub, email, role, tenantId, type:"access")
  if (accessToken && !sessionExpired) {
    try {
      const payloadPart = accessToken.split('.')[1];
      if (payloadPart) {
        const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
        const padded  = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
        const payload = JSON.parse(atob(padded)) as { role?: string };
        role = payload.role ?? null;
      }
    } catch {
      role = null;
    }
  }

  // Si el access token expiró pero el refresh no, leer el role desde nx_user
  // (el refresh token no lleva role en el payload)
  if (!role && refreshToken && !sessionExpired) {
    try {
      const raw = request.cookies.get('nx_user')?.value;
      if (raw) {
        const user = JSON.parse(atob(raw)) as { role?: string };
        role = user.role ?? null;
      }
    } catch {
      role = null;
    }
  }

  const isAuthenticated = !!refreshToken && !sessionExpired;

  // ── Sesión expirada fuera de páginas públicas: limpiar y redirigir ────
  if (sessionExpired && !AUTH_PAGES.includes(pathname)) {
    const loginUrl = new URL('/login', request.url);
    const res = NextResponse.redirect(loginUrl);
    res.cookies.delete('nx_token');
    res.cookies.delete('nx_user');
    res.cookies.delete('nx_access');
    return res;
  }

  // ── Rutas protegidas sin sesión ───────────────────────────────────────
  if (!isAuthenticated && (pathname.startsWith('/dashboard') || pathname.startsWith('/panel'))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ── Con sesión válida fuera de páginas auth ───────────────────────────
  if (isAuthenticated && AUTH_PAGES.includes(pathname)) {
    const dest = role === 'customer' ? '/panel' : '/dashboard';
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // ── Control de acceso por rol ─────────────────────────────────────────
  if (isAuthenticated && role) {
    if (pathname.startsWith('/dashboard') && role !== 'owner') {
      return NextResponse.redirect(new URL('/panel', request.url));
    }
    if (pathname.startsWith('/panel') && role !== 'customer') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};
