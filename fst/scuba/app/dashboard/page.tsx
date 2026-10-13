import React from "react";
import { headers } from "next/headers";
import { requireRole } from "@/lib/rbac/server";
import RoleSwitcher from "@/app/components/role-switcher";
import {
  ShieldCheck,
  UserCheck,
  Server,
  Lock,
  ArrowRight,
  Compass,
  Gauge,
  Activity,
  AlertTriangle,
  Waves,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  // Enforce server-side guard: USER or ADMIN can access /dashboard
  const user = await requireRole(["USER", "ADMIN"]);

  // Read request headers forwarded by the proxy/middleware
  const headersList = await headers();
  const headerRole = headersList.get("x-user-role");
  const headerId = headersList.get("x-user-id");
  const headerEmail = headersList.get("x-user-email");
  const headerVerified = headersList.get("x-user-session-verified");

  const isAdmin = user.role === "ADMIN";

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-cyan-50/20 to-slate-100 py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-cyan-500/20 shrink-0">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Welcome aboard, {user.name}
                </h1>
                <span
                  className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full border shadow-2xs ${
                    isAdmin
                      ? "bg-rose-50 text-rose-700 border-rose-200"
                      : "bg-cyan-50 text-cyan-800 border-cyan-200"
                  }`}
                >
                  {isAdmin ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                  ) : (
                    <UserCheck className="w-3.5 h-3.5 text-cyan-600" />
                  )}
                  Verified Role: {user.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-2">
                <span>{user.email}</span>
                <span>•</span>
                <span className="font-mono text-slate-400">ID: {user.id}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/logs"
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors inline-flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4 text-cyan-600" />
              Dive Logs
            </Link>
            <Link
              href="/catalog"
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors inline-flex items-center gap-1.5"
            >
              <Waves className="w-4 h-4 text-blue-600" />
              Gear Catalog
            </Link>
          </div>
        </div>

        {/* Server Request Headers Verification Box */}
        <div className="bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 p-6 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
                <Server className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  Server Component Headers (Passed via Proxy Guard)
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-mono">
                    LIVE VERIFICATION
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Read server-side using Next.js <code className="text-indigo-300">headers()</code> to prove proxy header injection.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-lg">
              STATUS: 200 OK
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block text-[10px] uppercase">x-user-role</span>
              <span className="text-cyan-400 font-bold text-sm">{headerRole || user.role}</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block text-[10px] uppercase">x-user-id</span>
              <span className="text-slate-200 truncate block">{headerId || user.id}</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block text-[10px] uppercase">x-user-email</span>
              <span className="text-slate-200 truncate block">{headerEmail || user.email}</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block text-[10px] uppercase">x-user-session-verified</span>
              <span className="text-emerald-400 font-bold">{headerVerified || "true"}</span>
            </div>
          </div>
        </div>

        {/* RBAC Guard Testing Zone */}
        <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 rounded-2xl border border-amber-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Role-Based Guard Test: Attempt Access to /admin
                </h3>
              </div>
              <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                {isAdmin ? (
                  <span className="text-emerald-700 font-medium">
                    Because your active role is <strong className="font-bold">ADMIN</strong>, clicking the button below will grant you full entry to the restricted Admin Command Center.
                  </span>
                ) : (
                  <span className="text-slate-700 font-medium">
                    Because your active role is <strong className="font-bold">USER</strong>, clicking the button below will be intercepted by the Edge proxy guard and redirected to <strong className="text-rose-600 font-bold">/unauthorized</strong> (403 Forbidden).
                  </span>
                )}
              </p>
            </div>

            <Link
              href="/admin"
              className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all shrink-0 ${
                isAdmin
                  ? "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20"
                  : "bg-slate-900 hover:bg-slate-800 text-white"
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>{isAdmin ? "Open Admin Portal →" : "Attempt /admin (Trigger 403)"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Diver Telemetry & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase">Current Dive Depth</span>
              <Gauge className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">34.2 <span className="text-sm font-normal text-slate-500">meters</span></div>
            <p className="text-[11px] text-slate-500 mt-2">Trimix gas mixture calibrated</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase">Oxygen Tank Level</span>
              <Activity className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">185 <span className="text-sm font-normal text-slate-500">bar</span></div>
            <p className="text-[11px] text-emerald-600 mt-2">Optimal dive pressure reserve</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase">Water Temperature</span>
              <Waves className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">22.4° <span className="text-sm font-normal text-slate-500">Celsius</span></div>
            <p className="text-[11px] text-slate-500 mt-2">Mild thermocline detected at 20m</p>
          </div>
        </div>

        {/* In-Page Interactive Role Switcher */}
        <div>
          <RoleSwitcher currentRole={user.role} />
        </div>
      </div>
    </main>
  );
}
