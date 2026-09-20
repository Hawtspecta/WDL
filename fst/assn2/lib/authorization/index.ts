import { auth } from "@/lib/auth/config";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function getSession(): Promise<AuthUser | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return null;
    }

    // Get user with role from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { role: true },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.name,
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

export function hasPermission(user: AuthUser, requiredRole: string): boolean {
  const roleHierarchy: Record<string, number> = {
    'ADMIN': 3,
    'MEMBER': 2,
    'GUEST': 1,
  };
  
  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
}

export function canAccessResource(user: AuthUser, resourceOwnerId: string): boolean {
  // Admins can access any resource
  if (user.role === 'ADMIN') {
    return true;
  }
  
  // Members can access their own resources
  if (user.role === 'MEMBER') {
    return user.id === resourceOwnerId;
  }
  
  // Guests have limited access
  return false;
}

export function canCreateTransaction(user: AuthUser): boolean {
  return user.role === UserRole.ADMIN || user.role === UserRole.MEMBER;
}

export function canViewAuditLogs(user: AuthUser): boolean {
  return user.role === UserRole.ADMIN;
}

export function canManageUsers(user: AuthUser): boolean {
  return user.role === UserRole.ADMIN;
}
