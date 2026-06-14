import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const TOKEN_COOKIE = 'nx_token';
const USER_COOKIE = 'nx_user';

type PartialUser = { role: string };

function parseUserCookie(value: string | undefined): PartialUser | null {
  if (!value) return null;
  try {
    return JSON.parse(Buffer.from(value, 'base64').toString('utf-8')) as PartialUser;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
  matcher: ['/dashboard/:path*', '/panel/:path*', '/login'],
};
