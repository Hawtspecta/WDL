import { auth } from "@/lib/auth/config";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AuthUser } from "./permissions";

export * from "./permissions";

export async function getSession(): Promise<AuthUser | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return null;
    }

    // Get user with role from our extended user table
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { role: true },
    });

    if (!dbUser) {
      return null;
    }

    return {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role?.name ?? "GUEST",
    };
  } catch (error) {
    console.error("Failed to get session:", error);
    return null;
  }
}

export async function requireSession(): Promise<AuthUser> {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function requireRole(allowedRoles: string[]): Promise<AuthUser> {
  const session = await requireSession();

  if (!allowedRoles.includes(session.role)) {
    redirect("/unauthorized");
  }

  return session;
}
