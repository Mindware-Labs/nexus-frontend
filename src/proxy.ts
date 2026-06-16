import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const TOKEN_COOKIE = 'nx_token';
const USER_COOKIE = 'nx_user';
const BACKEND = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL;

type PartialUser = { role: string };

function parseUserCookie(value: string | undefined): PartialUser | null {
  if (!value) return null;
  try {
    return JSON.parse(Buffer.from(value, 'base64').toString('utf-8')) as PartialUser;
  } catch {
    return null;
  }
}

async function handleWidgetRoute(request: NextRequest, clientId: string) {
  if (!BACKEND) {
    const res = NextResponse.next();
    res.headers.set('Content-Security-Policy', "frame-ancestors 'none'");
    return res;
  }

  try {
    const backendRes = await fetch(
      `${BACKEND}/bot/widget/${clientId}/config`,
      { cache: 'no-store' },
    );

    const response = NextResponse.next();

    if (backendRes.ok) {
      const config = await backendRes.json();
      const websiteUrl = (config.websiteUrl as string | undefined)?.trim();
      const frameAncestors = websiteUrl ? `'self' ${websiteUrl}` : "'none'";
      response.headers.set('Content-Security-Policy', `frame-ancestors ${frameAncestors}`);
    } else {
      response.headers.set('Content-Security-Policy', "frame-ancestors 'none'");
    }

    return response;
  } catch {
    // Error de red: dejar pasar sin bloquear para no romper el widget.
    return NextResponse.next();
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const widgetMatch = pathname.match(/^\/widget\/([^/]+)$/);
  if (widgetMatch) {
    return handleWidgetRoute(request, widgetMatch[1]);
  }

  const isAuthenticated = !!request.cookies.get(TOKEN_COOKIE)?.value;
  const user = parseUserCookie(request.cookies.get(USER_COOKIE)?.value);
  const role = user?.role ?? null;

  const isOwnerRoute = pathname.startsWith('/dashboard');
  const isCustomerRoute = pathname.startsWith('/panel');
  const isLoginRoute = pathname === '/login';

  /* Redirect unauthenticated users to login */
  if (!isAuthenticated && (isOwnerRoute || isCustomerRoute)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  /* Redirect authenticated users away from login */
  if (isAuthenticated && isLoginRoute) {
    const dest = role === 'owner' ? '/dashboard' : '/panel';
    return NextResponse.redirect(new URL(dest, request.url));
  }

  /* Role-based access: customers can't access owner routes and vice-versa */
  if (isAuthenticated && role) {
    if (isOwnerRoute && role !== 'owner') {
      return NextResponse.redirect(new URL('/panel', request.url));
    }
    if (isCustomerRoute && role !== 'customer') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/panel/:path*', '/login', '/widget/:clientId*'],
};
