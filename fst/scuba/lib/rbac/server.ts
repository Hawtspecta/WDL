import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, verifySessionToken } from "./jwt";
import { Role, UserSession, SensitiveAdminData } from "./types";

/**
 * Extracts verified user details injected by the proxy/middleware into request headers.
 */
export async function getVerifiedUserFromHeaders(): Promise<UserSession | null> {
  try {
    const headersList = await headers();
    const isVerified = headersList.get("x-user-session-verified");
    const role = headersList.get("x-user-role") as Role | null;
    const id = headersList.get("x-user-id");
    const email = headersList.get("x-user-email");
    const name = headersList.get("x-user-name");

    if (isVerified === "true" && role && id && email) {
      return {
        id,
        email,
        name: name || email,
        role,
        permissions: [],
      };
    }
  } catch {
    // Falls through to cookie check if headers context is unavailable
  }
  return null;
}

/**
 * Extracts and cryptographically verifies user session from HTTP-only cookie.
 */
export async function getVerifiedUserFromCookies(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

/**
 * Unified Server Component helper:
 * First attempts to read proxy-forwarded request headers, then falls back to cookie verification.
 */
export async function getVerifiedUser(): Promise<UserSession | null> {
  const userFromHeaders = await getVerifiedUserFromHeaders();
  if (userFromHeaders) {
    // Optionally augment with avatar/permissions if needed from cookie or profile
    const userFromCookie = await getVerifiedUserFromCookies();
    return {
      ...userFromHeaders,
      avatar: userFromCookie?.avatar,
      permissions: userFromCookie?.permissions || [],
    };
  }
  return await getVerifiedUserFromCookies();
}

/**
 * Enforces server-side route access control.
 * Redirects guests to login and unauthorized roles to /unauthorized.
 */
export async function requireRole(allowedRoles: Role[]): Promise<UserSession> {
  const user = await getVerifiedUser();

  if (!user || user.role === "GUEST") {
    redirect("/login?reason=unauthenticated");
  }

  if (!allowedRoles.includes(user.role)) {
    redirect(
      `/unauthorized?required=${encodeURIComponent(
        allowedRoles.join(",")
      )}&current=${encodeURIComponent(user.role)}`
    );
  }

  return user;
}

/**
 * Sensitive server-side data provider.
 * Strictly verifies ADMIN privileges directly on the server before yielding classified data.
 */
export async function getSensitiveAdminData(): Promise<SensitiveAdminData> {
  const user = await getVerifiedUser();

  if (!user || user.role !== "ADMIN") {
    throw new Error(
      `403 Forbidden: Access to classified naval data requires ADMIN clearance. Current role: ${
        user?.role || "GUEST"
      }`
    );
  }

  return {
    classifiedReefCoordinates: [
      {
        site: "Mariana Trench Trench-Alpha Outpost",
        coordinates: "11°21′N 142°12′E",
        depthMeters: 10984,
        securityClearance: "TOP_SECRET_NAVY",
      },
      {
        site: "Bermuda Blue Hole Sector 7",
        coordinates: "25°00′N 71°00′W",
        depthMeters: 412,
        securityClearance: "RESTRICTED_RESEARCH",
      },
      {
        site: "Galapagos Volcanic Hydrothermal Vent 4",
        coordinates: "00°45′S 90°19′W",
        depthMeters: 2450,
        securityClearance: "COVERT_EXPEDITION",
      },
    ],
    sonarEncryptionKey: "ECDH-P521-SEC-NAV-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
    transceiverNetworkId: "SCUBA-NAV-MESH-v4.9",
    telemetryAuditLog: [
      {
        id: "AUD-8021",
        action: "DEEP_DIVE_TELEMETRY_SYNC",
        actor: user.name,
        timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        status: "SUCCESS",
      },
      {
        id: "AUD-8020",
        action: "SONAR_BEACON_FREQUENCY_HOPPING",
        actor: "System Automated Agent",
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        status: "SUCCESS",
      },
      {
        id: "AUD-8019",
        action: "UNAUTHORIZED_PROBE_BLOCKED",
        actor: "Guest IP 192.168.1.104",
        timestamp: new Date(Date.now() - 1000 * 60 * 92).toISOString(),
        status: "WARNING",
      },
    ],
    systemStatus: {
      satelliteLink: "ONLINE",
      emergencyBeacon: "STANDBY",
      activeSubmarines: 3,
    },
  };
}
