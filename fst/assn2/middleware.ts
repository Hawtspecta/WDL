import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static assets and internal next paths are excluded by matcher config, but extra safety:
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  // Public pages that don't require authentication
  const publicRoutes = ['/', '/login', '/register', '/unauthorized', '/database-demo'];
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith('/api/auth'));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check for Better Auth session cookie
  const sessionToken = 
    request.cookies.get('better-auth.session_token')?.value ||
    request.cookies.get('__Secure-better-auth.session_token')?.value;

  // Protected routes require authentication cookie
  const protectedPaths = ['/dashboard', '/transactions', '/admin', '/audit-logs', '/profile', '/api/transactions', '/api/audit-logs', '/api/profile'];
  const isProtectedRoute = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtectedRoute && !sessionToken) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ data: null, errors: ['Unauthorized'] }, { status: 401 });
    }
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files, images, etc.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
