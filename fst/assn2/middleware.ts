import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth/config';

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register', '/unauthorized'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // API routes that are public
  const publicApiRoutes = ['/api/auth'];
  const isPublicApiRoute = publicApiRoutes.some(route => pathname.startsWith(route));

  if (isPublicRoute || isPublicApiRoute) {
    return NextResponse.next();
  }

  // Protected routes require authentication
  if (!session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based protection for specific routes
  const protectedRoutes = {
    '/admin': ['ADMIN'],
    '/dashboard': ['ADMIN', 'MEMBER', 'GUEST'],
    '/transactions': ['ADMIN', 'MEMBER'],
    '/audit-logs': ['ADMIN'],
  };

  for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(route)) {
      // Get user role from session (we'll need to fetch this from DB)
      // For now, we'll let the page-level authorization handle this
      // This middleware is a first layer of security
      break;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
