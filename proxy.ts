import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─── Constants ────────────────────────────────────────────────────────────────

const AUTH_COOKIE = 'auth-token';

/** Routes that require an authenticated session */
const PROTECTED_PREFIXES = ['/tickets', '/'];

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

// ─── Proxy (formerly Middleware) ─────────────────────────────────────────────

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const authenticated = isAuthenticated(request);

  // 1. Unauthenticated user → protected route: redirect to /login
  if (isProtectedPath(pathname) && !authenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Authenticated user → /login: redirect to /tickets
  if (isAuthOnlyPath(pathname) && authenticated) {
    return NextResponse.redirect(new URL('/tickets', request.url));
  }

  return NextResponse.next();
}

// ─── Matcher ──────────────────────────────────────────────────────────────────

/**
 * Only run middleware on routes we care about.
 * This keeps Next.js internals and static files unaffected.
 */
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
