import React from "react";
import { headers } from "next/headers";
import { requireRole, getSensitiveAdminData } from "@/lib/rbac/server";
import RoleSwitcher from "@/app/components/role-switcher";
import {
  ShieldAlert,
  ShieldCheck,
  Server,
  Lock,
  Key,
  Radio,
  FileText,
  Activity,
  Layers,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default async function AdminPage() {
  // 1. Server-side role guard assertion: only ADMIN allowed
  const user = await requireRole(["ADMIN"]);

  // 2. Fetch sensitive data with server-side privilege validation
  const sensitiveData = await getSensitiveAdminData();

  // 3. Read proxy-injected headers
  const headersList = await headers();
  const headerRole = headersList.get("x-user-role");
  const headerId = headersList.get("x-user-id");
  const headerEmail = headersList.get("x-user-email");
  const headerVerified = headersList.get("x-user-session-verified");

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Restricted Clearance Banner */}
        <div className="bg-gradient-to-r from-rose-950/80 via-slate-900 to-amber-950/60 border border-rose-800/80 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-rose-600/20 text-rose-400 border border-rose-500/30 rounded-2xl shrink-0">
              <ShieldAlert className="w-10 h-10" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[11px] font-mono font-bold bg-rose-900/80 text-rose-300 border border-rose-700 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Level 5 Security Clearance
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Role: {user.role}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Naval Command & Classified Administration
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Authenticated as <strong className="text-slate-200">{user.name}</strong> ({user.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors border border-slate-700"
            >
              ← Back to /dashboard
            </Link>
          </div>
        </div>

        {/* Server Headers Inspector */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 bg-cyan-500/20 text-cyan-400 rounded-lg">
                <Server className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  Verified Request Headers (Injected by Proxy Guard)
                  <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded-full font-mono">
                    EDGE → SERVER COMPONENT
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  These verified claims were set by <code className="text-cyan-300">proxy.ts</code> and verified server-side.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-lg">
              ADMIN AUTHORIZED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">x-user-role</span>
              <span className="text-rose-400 font-bold text-sm">{headerRole || user.role}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">x-user-id</span>
              <span className="text-slate-300 truncate block">{headerId || user.id}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">x-user-email</span>
              <span className="text-slate-300 truncate block">{headerEmail || user.email}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">x-user-session-verified</span>
              <span className="text-emerald-400 font-bold">{headerVerified || "true"}</span>
            </div>
          </div>
        </div>

        {/* Sensitive Data Module 1: Classified Coordinates */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-md">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-bold text-white">
                Sensitive Server-Side Data: Classified Reef Exploration Sites
              </h3>
            </div>
            <span className="text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-800 px-2.5 py-0.5 rounded-full">
              RESTRICTED DISCLOSURE
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/70 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3 font-semibold">Site Destination</th>
                  <th className="px-5 py-3 font-semibold">Coordinates</th>
                  <th className="px-5 py-3 font-semibold">Depth</th>
                  <th className="px-5 py-3 font-semibold">Clearance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {sensitiveData.classifiedReefCoordinates.map((site, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/50">
                    <td className="px-5 py-3.5 font-medium text-white flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-cyan-400" />
                      {site.site}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-cyan-300">{site.coordinates}</td>
                    <td className="px-5 py-3.5 font-mono text-amber-300">{site.depthMeters.toLocaleString()} m</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950/80 text-rose-300 border border-rose-800">
                        {site.securityClearance}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sensitive Data Module 2: Sonar Keys & Audit Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Hardware Security Tokens */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              Active Encryption Keys
            </h4>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs space-y-1">
              <span className="text-[10px] text-slate-500 uppercase block">Sonar Key</span>
              <span className="text-amber-400 break-all">{sensitiveData.sonarEncryptionKey}</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs space-y-1">
              <span className="text-[10px] text-slate-500 uppercase block">Mesh Transceiver</span>
              <span className="text-cyan-400">{sensitiveData.transceiverNetworkId}</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
              <span className="text-[10px] text-slate-500 uppercase block">Fleet Status</span>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Satellite Link</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Radio className="w-3 h-3" />
                  {sensitiveData.systemStatus.satelliteLink}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Active Submarines</span>
                <span className="text-white font-bold">{sensitiveData.systemStatus.activeSubmarines} vessels</span>
              </div>
            </div>
          </div>

          {/* Real-time Telemetry Audit Log */}
          <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              Confidential Telemetry Audit Trail
            </h4>

            <div className="space-y-2.5">
              {sensitiveData.telemetryAuditLog.map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-start gap-2.5">
                    {log.status === "SUCCESS" && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    {log.status === "WARNING" && (
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-mono font-bold text-white text-xs">{log.action}</p>
                      <p className="text-[11px] text-slate-400">Actor: {log.actor}</p>
                    </div>
                  </div>

                  <div className="text-right sm:shrink-0 font-mono text-[10px] text-slate-500">
                    <div>{log.id}</div>
                    <div>{new Date(log.timestamp).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* In-Page Role Switcher */}
        <div className="bg-slate-900/50 p-1 rounded-2xl border border-slate-800">
          <RoleSwitcher currentRole={user.role} />
        </div>
      </div>
    </main>
  );
}
