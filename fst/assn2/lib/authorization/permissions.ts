export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function hasPermission(user: AuthUser, requiredRole: string): boolean {
  const roleHierarchy: Record<string, number> = {
    ADMIN: 3,
    MEMBER: 2,
    GUEST: 1,
  };

  return (roleHierarchy[user.role] ?? 0) >= (roleHierarchy[requiredRole] ?? 99);
}

export function canAccessResource(
  user: AuthUser,
  resourceOwnerId: string
): boolean {
  if (user.role === "ADMIN") return true;
  if (user.role === "MEMBER") return user.id === resourceOwnerId;
  return false;
}

export function canCreateTransaction(user: AuthUser): boolean {
  return user.role === "ADMIN" || user.role === "MEMBER";
}

export function canViewAuditLogs(user: AuthUser): boolean {
  return user.role === "ADMIN";
}

export function canManageUsers(user: AuthUser): boolean {
  return user.role === "ADMIN";
}
