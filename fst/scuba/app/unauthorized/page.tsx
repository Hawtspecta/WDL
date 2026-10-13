"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ShieldX, ShieldCheck, ArrowLeft, ArrowRight, Lock, KeyRound, Sparkles, RefreshCw } from "lucide-react";
import Link from "next/link";
import RoleSwitcher from "@/app/components/role-switcher";
import { Role } from "@/lib/rbac/types";

function UnauthorizedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const from = searchParams.get("from") || "/admin";
  const required = searchParams.get("required") || "ADMIN";
  const current = (searchParams.get("current") as Role) || "USER";

  const [elevating, setElevating] = useState(false);
  const [elevateError, setElevateError] = useState<string | null>(null);

  const handleElevateToAdmin = async () => {
    setElevating(true);
    setElevateError(null);
    try {
      const res = await fetch("/api/auth/role-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "ADMIN" }),
      });
      if (res.ok) {
        router.push(from);
        router.refresh();
      } else {
        const data = await res.json();
        setElevateError(data.error || "Failed to switch role");
        setElevating(false);
      }
    } catch {
      setElevateError("Network error");
      setElevating(false);
    }
  };

  return (
    <main className="min-h-[85vh] bg-gradient-to-b from-slate-900 via-rose-950/40 to-slate-950 text-white flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full space-y-8">
        {/* 403 Card */}
        <div className="bg-slate-900/90 border border-rose-800/60 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-md relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 border-b border-slate-800 pb-6 mb-6">
            <div className="p-4 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-2xl shrink-0">
              <ShieldX className="w-10 h-10" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold bg-rose-900/80 text-rose-300 border border-rose-700 px-2.5 py-0.5 rounded-full">
                  HTTP 403 FORBIDDEN
                </span>
                <span className="text-xs text-rose-400 font-semibold">
                  Proxy Guard Intercepted
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Access Denied: Insufficient Role Clearance
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                You do not have the required permissions to view this protected resource.
              </p>
            </div>
          </div>

          {/* Diagnostics Box */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-3 font-mono text-xs mb-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <span className="text-slate-500 uppercase text-[11px]">Attempted Route:</span>
              <span className="text-rose-400 font-bold">{from}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <span className="text-slate-500 uppercase text-[11px]">Current Verified Role:</span>
              <span className="text-cyan-400 font-bold bg-cyan-950/60 border border-cyan-800/80 px-2 py-0.5 rounded">
                {current}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 uppercase text-[11px]">Required Minimum Role:</span>
              <span className="text-rose-400 font-bold bg-rose-950/60 border border-rose-800/80 px-2 py-0.5 rounded">
                {required}
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-300 leading-relaxed mb-8 bg-slate-800/40 p-4 rounded-xl border border-slate-800">
            <p className="font-semibold text-white mb-1">Why am I seeing this page?</p>
            The route <code className="text-rose-300 font-mono">{from}</code> is strictly restricted to users with <code className="text-rose-300 font-mono">ADMIN</code> role. While your Edge JWT session is authentic and valid, your current role is <code className="text-cyan-300 font-mono">{current}</code>. Next.js Edge proxy halted the request before sensitive server components or data could be accessed.
          </div>

          {elevateError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs">
              {elevateError}
            </div>
          )}

          {/* Quick Resolution Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleElevateToAdmin}
              disabled={elevating}
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-900/30 transition-all cursor-pointer"
            >
              {elevating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Elevating Session to ADMIN...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Elevate Role to ADMIN & Retry Access
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors border border-slate-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to /dashboard
            </Link>
          </div>
        </div>

        {/* In-page Interactive Role Switcher */}
        <div className="bg-slate-900/70 rounded-2xl border border-slate-800 p-2">
          <RoleSwitcher currentRole={current} />
        </div>
      </div>
    </main>
  );
}

export default function UnauthorizedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center text-white">
          <div className="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <UnauthorizedContent />
    </Suspense>
  );
}
