"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Role, UserSession } from "@/lib/rbac/types";
import { ShieldCheck, UserCheck, UserX, Check, Sparkles, ArrowRight, RefreshCw, KeyRound } from "lucide-react";
import Link from "next/link";

interface RoleSwitcherProps {
  currentRole?: Role;
  compact?: boolean;
  onRoleChanged?: (newRole: Role) => void;
}

export default function RoleSwitcher({
  currentRole: initialRole,
  compact = false,
  onRoleChanged,
}: RoleSwitcherProps) {
  const router = useRouter();
  const [activeRole, setActiveRole] = useState<Role>(initialRole || "GUEST");
  const [session, setSession] = useState<UserSession | null>(null);
  const [loadingRole, setLoadingRole] = useState<Role | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Fetch current session on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/role-session");
        if (res.ok) {
          const data = await res.json();
          if (data.session) {
            setActiveRole(data.session.role);
            setSession(data.session);
          } else {
            setActiveRole("GUEST");
            setSession(null);
          }
        }
      } catch {
        // Fallback to initialRole
      }
    }
    checkSession();
  }, []);

  const handleSwitchRole = async (targetRole: Role) => {
    if (loadingRole) return;
    setLoadingRole(targetRole);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/auth/role-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: targetRole }),
      });

      const data = await res.json();

      if (res.ok) {
        setActiveRole(targetRole);
        setSession(data.session || null);
        setStatusMessage(
          targetRole === "GUEST"
            ? "Session cleared. Active role is now GUEST."
            : `Logged in as ${targetRole} with Edge JWT cookie.`
        );
        if (onRoleChanged) {
          onRoleChanged(targetRole);
        }
        router.refresh();
      } else {
        setStatusMessage(data.error || "Failed to switch role");
      }
    } catch {
      setStatusMessage("Network error while updating session");
    } finally {
      setLoadingRole(null);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 bg-slate-900/90 text-white px-3 py-1.5 rounded-full text-xs shadow-md border border-slate-700">
        <span className="text-slate-400 font-medium">Demo Role:</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleSwitchRole("ADMIN")}
            disabled={loadingRole !== null}
            className={`px-2 py-0.5 rounded font-bold transition-all ${
              activeRole === "ADMIN"
                ? "bg-rose-500 text-white shadow-xs"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            ADMIN
          </button>
          <button
            onClick={() => handleSwitchRole("USER")}
            disabled={loadingRole !== null}
            className={`px-2 py-0.5 rounded font-bold transition-all ${
              activeRole === "USER"
                ? "bg-cyan-500 text-slate-950 shadow-xs"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            USER
          </button>
          <button
            onClick={() => handleSwitchRole("GUEST")}
            disabled={loadingRole !== null}
            className={`px-2 py-0.5 rounded font-bold transition-all ${
              activeRole === "GUEST"
                ? "bg-amber-400 text-slate-950 shadow-xs"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            GUEST
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <KeyRound className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Interactive Role Switcher
            </h3>
            <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
              Edge JWT (jose)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Toggle between roles with signed HTTP-only cookies to test proxy route guards & server verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Active Role:</span>
          <span
            className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${
              activeRole === "ADMIN"
                ? "bg-rose-50 text-rose-700 border-rose-200"
                : activeRole === "USER"
                ? "bg-cyan-50 text-cyan-800 border-cyan-200"
                : "bg-amber-50 text-amber-800 border-amber-200"
            }`}
          >
            {activeRole === "ADMIN" && <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />}
            {activeRole === "USER" && <UserCheck className="w-3.5 h-3.5 text-cyan-600" />}
            {activeRole === "GUEST" && <UserX className="w-3.5 h-3.5 text-amber-600" />}
            {activeRole}
          </span>
        </div>
      </div>

      {/* Role Switcher Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        {/* ADMIN CARD */}
        <button
          onClick={() => handleSwitchRole("ADMIN")}
          disabled={loadingRole !== null}
          className={`text-left p-4 rounded-xl border transition-all cursor-pointer relative ${
            activeRole === "ADMIN"
              ? "bg-gradient-to-br from-rose-50 to-orange-50 border-rose-300 ring-2 ring-rose-400 shadow-sm"
              : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
          }`}
        >
          {activeRole === "ADMIN" && (
            <span className="absolute top-2.5 right-2.5 p-1 bg-rose-600 text-white rounded-full">
              <Check className="w-3 h-3 stroke-[3]" />
            </span>
          )}
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 bg-rose-100 text-rose-700 rounded-md">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-sm font-bold text-slate-900">ADMIN</span>
          </div>
          <p className="text-xs font-medium text-slate-700 mb-1">
            Captain Ahab (Chief Marine Officer)
          </p>
          <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
            Full clearance. Unlocks both <span className="font-semibold text-slate-800">/admin</span> and <span className="font-semibold text-slate-800">/dashboard</span>.
          </p>
          <div className="flex items-center justify-between text-[11px] font-semibold text-rose-700 border-t border-rose-200/60 pt-2">
            <span>Access: /admin + /dashboard</span>
            {loadingRole === "ADMIN" ? (
              <RefreshCw className="w-3 h-3 animate-spin text-rose-600" />
            ) : (
              <span>Select →</span>
            )}
          </div>
        </button>

        {/* USER CARD */}
        <button
          onClick={() => handleSwitchRole("USER")}
          disabled={loadingRole !== null}
          className={`text-left p-4 rounded-xl border transition-all cursor-pointer relative ${
            activeRole === "USER"
              ? "bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-300 ring-2 ring-cyan-400 shadow-sm"
              : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
          }`}
        >
          {activeRole === "USER" && (
            <span className="absolute top-2.5 right-2.5 p-1 bg-cyan-600 text-white rounded-full">
              <Check className="w-3 h-3 stroke-[3]" />
            </span>
          )}
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 bg-cyan-100 text-cyan-700 rounded-md">
              <UserCheck className="w-4 h-4" />
            </span>
            <span className="text-sm font-bold text-slate-900">USER</span>
          </div>
          <p className="text-xs font-medium text-slate-700 mb-1">
            Alex Rivera (Certified Rescue Diver)
          </p>
          <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
            Can access <span className="font-semibold text-slate-800">/dashboard</span>. Attempting <span className="font-semibold text-slate-800">/admin</span> redirects to <span className="font-semibold text-rose-600">/unauthorized</span> (403).
          </p>
          <div className="flex items-center justify-between text-[11px] font-semibold text-cyan-800 border-t border-cyan-200/60 pt-2">
            <span>Access: /dashboard only</span>
            {loadingRole === "USER" ? (
              <RefreshCw className="w-3 h-3 animate-spin text-cyan-600" />
            ) : (
              <span>Select →</span>
            )}
          </div>
        </button>

        {/* GUEST CARD */}
        <button
          onClick={() => handleSwitchRole("GUEST")}
          disabled={loadingRole !== null}
          className={`text-left p-4 rounded-xl border transition-all cursor-pointer relative ${
            activeRole === "GUEST"
              ? "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300 ring-2 ring-amber-400 shadow-sm"
              : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
          }`}
        >
          {activeRole === "GUEST" && (
            <span className="absolute top-2.5 right-2.5 p-1 bg-amber-600 text-white rounded-full">
              <Check className="w-3 h-3 stroke-[3]" />
            </span>
          )}
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 bg-amber-100 text-amber-800 rounded-md">
              <UserX className="w-4 h-4" />
            </span>
            <span className="text-sm font-bold text-slate-900">GUEST</span>
          </div>
          <p className="text-xs font-medium text-slate-700 mb-1">
            Unauthenticated Visitor
          </p>
          <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
            No active session cookie. Protected routes redirect back to <span className="font-semibold text-slate-800">/login</span>.
          </p>
          <div className="flex items-center justify-between text-[11px] font-semibold text-amber-800 border-t border-amber-200/60 pt-2">
            <span>Access: Public only</span>
            {loadingRole === "GUEST" ? (
              <RefreshCw className="w-3 h-3 animate-spin text-amber-600" />
            ) : (
              <span>Clear Session →</span>
            )}
          </div>
        </button>
      </div>

      {statusMessage && (
        <div className="mb-4 p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-800 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            {statusMessage}
          </span>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-[10px] text-indigo-500 hover:text-indigo-800 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Live Route Guard Testing Shortcuts */}
      <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-600">
          <span className="font-semibold text-slate-900">Verify Route Guards:</span> Test how the proxy/middleware responds with your active role:
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link
            href="/dashboard"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            <span>Test /dashboard</span>
            <ArrowRight className="w-3 h-3" />
          </Link>

          <Link
            href="/admin"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            <span>Test /admin</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
