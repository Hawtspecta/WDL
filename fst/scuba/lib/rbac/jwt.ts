import { SignJWT, jwtVerify } from "jose";
import { UserSession } from "./types";

export const SESSION_COOKIE_NAME = "scuba_rbac_session";

/**
 * Derives the signing key in an Edge-safe manner using Web Crypto APIs.
 * Prevents hard-coded production secrets by enforcing process.env values in production.
 */
function getSigningSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET || process.env.BETTER_AUTH_SECRET;

  if (process.env.NODE_ENV === "production" && (!secret || secret.length < 32)) {
    throw new Error(
      "CRITICAL SECURITY: In production, SESSION_SECRET must be set and at least 32 characters long."
    );
  }

  // Safe development fallback with clear notice
  const effectiveSecret =
    secret || "scuba_dev_jwt_edge_compatible_secret_key_32_chars_min!";

  return new TextEncoder().encode(effectiveSecret);
}

/**
 * Signs a new Edge-compatible JWT containing the user's role and session details.
 */
export async function createSessionToken(user: UserSession): Promise<string> {
  const secretKey = getSigningSecret();

  return await new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
    permissions: user.permissions,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .setIssuer("scuba:rbac")
    .setAudience("scuba:app")
    .sign(secretKey);
}

/**
 * Verifies an Edge-compatible JWT and returns the verified session, or null if invalid/expired.
 */
export async function verifySessionToken(token?: string | null): Promise<UserSession | null> {
  if (!token) return null;

  try {
    const secretKey = getSigningSecret();
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
      issuer: "scuba:rbac",
      audience: "scuba:app",
    });

    if (!payload || typeof payload !== "object") {
      return null;
    }

    const role = payload.role as UserSession["role"];
    if (role !== "ADMIN" && role !== "USER" && role !== "GUEST") {
      return null;
    }

    return {
      id: String(payload.id || ""),
      email: String(payload.email || ""),
      name: String(payload.name || ""),
      role,
      avatar: payload.avatar ? String(payload.avatar) : undefined,
      permissions: Array.isArray(payload.permissions)
        ? (payload.permissions as string[])
        : [],
    };
  } catch {
    return null;
  }
}
