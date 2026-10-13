export type Role = "ADMIN" | "USER" | "GUEST";

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
  permissions: string[];
}

export interface SensitiveAdminData {
  classifiedReefCoordinates: {
    site: string;
    coordinates: string;
    depthMeters: number;
    securityClearance: string;
  }[];
  sonarEncryptionKey: string;
  transceiverNetworkId: string;
  telemetryAuditLog: {
    id: string;
    action: string;
    actor: string;
    timestamp: string;
    status: "SUCCESS" | "WARNING" | "CRITICAL";
  }[];
  systemStatus: {
    satelliteLink: "ONLINE" | "DEGRADED" | "OFFLINE";
    emergencyBeacon: "STANDBY" | "ACTIVE";
    activeSubmarines: number;
  };
}

export const DEMO_PROFILES: Record<Role, UserSession> = {
  ADMIN: {
    id: "scuba-admin-01",
    email: "captain.ahab@scuba.dive",
    name: "Captain Ahab (Chief Marine Officer)",
    role: "ADMIN",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    permissions: [
      "read:dashboard",
      "read:admin",
      "write:dive_logs",
      "manage:personnel",
      "access:classified_sonar",
      "system:diagnostics",
    ],
  },
  USER: {
    id: "scuba-user-02",
    email: "alex.diver@scuba.dive",
    name: "Alex Rivera (Rescue Diver)",
    role: "USER",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    permissions: [
      "read:dashboard",
      "read:catalog",
      "write:dive_logs",
      "use:timer",
    ],
  },
  GUEST: {
    id: "scuba-guest-00",
    email: "guest@scuba.dive",
    name: "Guest Explorer",
    role: "GUEST",
    permissions: ["read:public_catalog"],
  },
};
