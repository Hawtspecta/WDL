"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ShieldCheck, UserCheck, UserX, Waves, Sparkles, ArrowRight, Lock, Check, ChevronDown, ChevronUp } from "lucide-react";
import { DEMO_PROFILES, Role } from "@/lib/rbac/types";
import Link from "next/link";
import AuthPage from "@/app/auth/page";

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const from = searchParams.get("from") || "/dashboard";
  const reason = searchParams.get("reason");

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSocialAuth, setShowSocialAuth] = useState(false);
  const [activeSessionRole, setActiveSessionRole] = useState<Role>("GUEST");

  useEffect(() => {
    async function loadCurrentRole() {
      try {
        const res = await fetch("/api/auth/role-session");
        if (res.ok) {
          const data = await res.json();
          if (data.session) {
            setActiveSessionRole(data.session.role);
          }
        }
      } catch {
        // ignore
      }
    }
    loadCurrentRole();
  }, []);

  const handleQuickSignIn = async (role: Role) => {
    setSelectedRole(role);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/role-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      const data = await res.json();

      if (res.ok) {
        // Redirect to intended route or default
        const destination =
          role === "ADMIN" && from.startsWith("/admin")
            ? from
            : role === "USER" && from.startsWith("/admin")
            ? "/dashboard"
            : from;

        router.push(destination);
        router.refresh();
      } else {
        setError(data.error || "Failed to establish session");
        setLoading(false);
      }
    } catch {
      setError("Network communication failure");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[85vh] bg-gradient-to-b from-slate-50 via-cyan-50/20 to-slate-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full">
        {/* Redirect Notice Banner */}
        {reason === "unauthenticated" && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 shadow-xs flex items-start gap-3">
            <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg shrink-0 mt-0.5">
              <Lock className="w-4 h-4" />
            </span>
            <div className="text-xs">
              <p className="font-bold text-amber-950 text-sm">Authentication Required</p>
              <p className="mt-0.5 text-amber-800">
                You attempted to access <span className="font-mono font-semibold bg-amber-100/80 px-1.5 py-0.5 rounded">{from}</span> as a <span className="font-semibold">GUEST</span>. The Edge proxy guard intercepted your request and redirected you here. Select a role below to proceed.
              </p>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-cyan-950 text-white p-8 text-center relative">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 mb-4 backdrop-blur-md">
              <Waves className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Scuba RBAC Login Demo</h1>
            <p className="text-slate-300 text-xs mt-1.5 max-w-md mx-auto">
              Select a pre-configured role below. Signed Edge JWT session tokens with HTTP-only cookies are automatically generated.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-[11px] backdrop-blur-xs border border-white/15">
              <span className="text-slate-300">Active Session:</span>
              <span className="font-bold text-cyan-300">{activeSessionRole}</span>
            </div>
          </div>

          {/* Role Selection Body */}
          <div className="p-8 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider text-xs">
                Select Sign-In Role
              </h2>
              <span className="text-[11px] text-slate-400">One-click instant authentication</span>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                {error}
              </div>
            )}

            {/* ADMIN Role Button */}
            <div
              onClick={() => handleQuickSignIn("ADMIN")}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative hover:shadow-md ${
                selectedRole === "ADMIN" && loading
                  ? "bg-rose-50 border-rose-300 ring-2 ring-rose-400"
                  : "bg-gradient-to-r from-rose-50/50 to-orange-50/30 border-rose-200/80 hover:border-rose-400"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-rose-100 text-rose-700 rounded-xl shrink-0 mt-0.5">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        Sign in as ADMIN
                      </span>
                      <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                        Chief Diver
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {DEMO_PROFILES.ADMIN.name} • {DEMO_PROFILES.ADMIN.email}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-2">
                      Full access clearance to <span className="font-semibold text-slate-800">/admin</span> (classified naval data) and <span className="font-semibold text-slate-800">/dashboard</span>.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={loading}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-xs shrink-0 flex items-center gap-1"
                >
                  {selectedRole === "ADMIN" && loading ? "Logging in..." : "Select"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* USER Role Button */}
            <div
              onClick={() => handleQuickSignIn("USER")}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative hover:shadow-md ${
                selectedRole === "USER" && loading
                  ? "bg-cyan-50 border-cyan-300 ring-2 ring-cyan-400"
                  : "bg-gradient-to-r from-cyan-50/50 to-blue-50/30 border-cyan-200/80 hover:border-cyan-400"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-cyan-100 text-cyan-700 rounded-xl shrink-0 mt-0.5">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        Sign in as USER
                      </span>
                      <span className="text-[10px] font-bold bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full">
                        Rescue Diver
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {DEMO_PROFILES.USER.name} • {DEMO_PROFILES.USER.email}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-2">
                      Access to <span className="font-semibold text-slate-800">/dashboard</span>. Attempting <span className="font-semibold text-slate-800">/admin</span> will trigger a 403 redirect to <span className="font-semibold text-rose-600">/unauthorized</span>.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={loading}
                  className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold rounded-xl shadow-xs shrink-0 flex items-center gap-1"
                >
                  {selectedRole === "USER" && loading ? "Logging in..." : "Select"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* GUEST Role Button */}
            <div
              onClick={() => handleQuickSignIn("GUEST")}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative hover:shadow-md ${
                selectedRole === "GUEST" && loading
                  ? "bg-amber-50 border-amber-300 ring-2 ring-amber-400"
                  : "bg-slate-50 border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl shrink-0 mt-0.5">
                    <UserX className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        Continue as GUEST
                      </span>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                        Public Visitor
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Unauthenticated session (clears HTTP-only session cookie)
                    </p>
                    <p className="text-[11px] text-slate-500 mt-2">
                      Public browsing only. Protected routes will redirect back here.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={loading}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-xs shrink-0 flex items-center gap-1"
                >
                  {selectedRole === "GUEST" && loading ? "Clearing..." : "Select"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Alternative: Better-Auth Social sign in collapsible */}
            <div className="pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowSocialAuth(!showSocialAuth)}
                className="w-full flex items-center justify-between text-xs font-medium text-slate-500 hover:text-slate-800 py-2 cursor-pointer"
              >
                <span>Or use Better Auth Social Login (Google / GitHub)</span>
                {showSocialAuth ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {showSocialAuth && (
                <div className="mt-4 pt-4 border-t border-dashed border-slate-200">
                  <AuthPage />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
