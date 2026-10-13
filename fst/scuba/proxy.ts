import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "./lib/rbac/jwt";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(cookie);

  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isDashboardRoute =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  // 1. Guests trying to access any protected route get redirected to login
  if (!session || session.role === "GUEST") {
    if (isAdminRoute || isDashboardRoute) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      loginUrl.searchParams.set("reason", "unauthenticated");
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Only ADMIN can access /admin; unauthorized users go to /unauthorized
  if (isAdminRoute) {
    if (session?.role !== "ADMIN") {
      const unauthorizedUrl = new URL("/unauthorized", request.url);
      unauthorizedUrl.searchParams.set("from", pathname);
      unauthorizedUrl.searchParams.set("required", "ADMIN");
      unauthorizedUrl.searchParams.set("current", session?.role || "GUEST");
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  // 3. Pass verified user details to server components through request headers
  const requestHeaders = new Headers(request.headers);
  if (session && session.role !== "GUEST") {
    requestHeaders.set("x-user-id", session.id);
    requestHeaders.set("x-user-role", session.role);
    requestHeaders.set("x-user-email", session.email);
    requestHeaders.set("x-user-name", session.name);
    requestHeaders.set("x-user-session-verified", "true");
  } else {
    // Sanitize any incoming forged header from the client
    requestHeaders.delete("x-user-id");
    requestHeaders.delete("x-user-role");
    requestHeaders.delete("x-user-email");
    requestHeaders.delete("x-user-name");
    requestHeaders.set("x-user-session-verified", "false");
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export default proxy;

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/dashboard",
    "/dashboard/:path*",
  ],
};
