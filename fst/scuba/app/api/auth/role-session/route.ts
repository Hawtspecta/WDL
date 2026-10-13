import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSessionToken, SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/rbac/jwt";
import { DEMO_PROFILES, Role } from "@/lib/rbac/types";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);

  return NextResponse.json({
    authenticated: Boolean(session && session.role !== "GUEST"),
    session: session || null,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const targetRole = body?.role as Role;

    if (!targetRole || !["ADMIN", "USER", "GUEST"].includes(targetRole)) {
      return NextResponse.json(
        { error: "Invalid role specified. Supported roles: ADMIN, USER, GUEST" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();

    // If GUEST is selected, delete the cookie
    if (targetRole === "GUEST") {
      cookieStore.delete(SESSION_COOKIE_NAME);
      return NextResponse.json({
        success: true,
        role: "GUEST",
        message: "Switched to GUEST role. Protected access revoked.",
        session: null,
      });
    }

    // Lookup corresponding profile
    const profile = DEMO_PROFILES[targetRole];
    const token = await createSessionToken(profile);

    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return NextResponse.json({
      success: true,
      role: profile.role,
      message: `Successfully switched role to ${profile.role}`,
      session: profile,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to switch role session" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);

  return NextResponse.json({
    success: true,
    message: "Session cookie cleared. Role is now GUEST.",
  });
}
