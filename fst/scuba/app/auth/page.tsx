"use client";

import React, { useState } from "react";
import { signIn, signOut, useSession } from "@/lib/auth-client";
import Image from "next/image";

export default function AuthPage() {
  const { data: session, isPending, error } = useSession();
  const [authError, setAuthError] = useState<string | null>(null);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleSocialSignIn = async (provider: "google" | "github") => {
    try {
      setAuthError(null);
      setLoadingProvider(provider);
      await signIn.social({
        provider,
        callbackURL: "/auth",
      });
    } catch (err: any) {
      setAuthError(err?.message || `Failed to sign in with ${provider}`);
      setLoadingProvider(null);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.reload();
          },
        },
      });
    } catch (err: any) {
      setAuthError(err?.message || "Failed to sign out");
    }
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mb-3">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {session?.user ? "Your Profile" : "Sign In to Scuba"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {session?.user
              ? "Manage your account and social session"
              : "Next.js + Better Auth with Google & GitHub"}
          </p>
        </div>

        {/* Errors */}
        {(authError || error) && (
          <div className="mb-6 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {authError || error?.message || "An authentication error occurred"}
          </div>
        )}

        {/* Loading State */}
        {isPending ? (
          <div className="py-8 flex flex-col items-center justify-center text-gray-500">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-sm">Checking session...</p>
          </div>
        ) : session?.user ? (
          /* Profile Card (Authenticated) */
          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User Avatar"}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500"
                  unoptimized
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xl">
                  {session.user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold text-gray-900 truncate">
                  {session.user.name || "Unnamed User"}
                </h2>
                <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                <span className="inline-flex items-center px-2 py-0.5 mt-1.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-800">
                  ● Authenticated
                </span>
              </div>
            </div>

            <div className="text-xs text-gray-500 space-y-2 border-t border-gray-100 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-400">User ID</span>
                <span className="font-mono text-gray-700 truncate max-w-[200px]">
                  {session.user.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email Verified</span>
                <span className="text-gray-700">
                  {session.user.emailVerified ? "Yes" : "No"}
                </span>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium rounded-xl text-sm border border-rose-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign Out
            </button>
          </div>
        ) : (
          /* Sign In Buttons (Unauthenticated) */
          <div className="space-y-3">
            {/* Google Sign In */}
            <button
              onClick={() => handleSocialSignIn("google")}
              disabled={loadingProvider !== null}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {loadingProvider === "google" ? (
                <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              Continue with Google
            </button>

            {/* GitHub Sign In */}
            <button
              onClick={() => handleSocialSignIn("github")}
              disabled={loadingProvider !== null}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {loadingProvider === "github" ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
              )}
              Continue with GitHub
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
