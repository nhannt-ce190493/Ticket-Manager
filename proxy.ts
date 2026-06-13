import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─── Constants ────────────────────────────────────────────────────────────────

const AUTH_COOKIE = 'auth-token';

/**
 * Route prefixes that require a valid session.
 * NOTE: '/' is intentionally excluded here — it is handled separately below
 * to avoid matching every route (including /login) via startsWith('/').
 */
const PROTECTED_PREFIXES = ['/tickets'];

/** Routes only accessible to unauthenticated users */
const AUTH_ONLY_PATHS = ['/login'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  return typeof token === 'string' && token.trim().length > 0;
}

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function isAuthOnlyPath(pathname: string): boolean {
  return AUTH_ONLY_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

// ─── Proxy ────────────────────────────────────────────────────────────────────

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const authenticated = isAuthenticated(request);

  // 1. Root path — redirect to appropriate destination
  if (pathname === '/') {
    const dest = authenticated ? '/tickets' : '/login';
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // 2. Unauthenticated user → protected route: redirect to /login
  if (isProtectedPath(pathname) && !authenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Authenticated user → /login: redirect to /tickets
  if (isAuthOnlyPath(pathname) && authenticated) {
    return NextResponse.redirect(new URL('/tickets', request.url));
  }

  return NextResponse.next();
}

// ─── Matcher ──────────────────────────────────────────────────────────────────

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static  (static files)
     * - _next/image   (image optimisation)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
