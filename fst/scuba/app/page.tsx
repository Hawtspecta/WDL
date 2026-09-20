  0......"0use client000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";    

import React, { useState } from "react";
import DashboardOcean from "./components/dashboard-ocean";
import DashboardMinimal from "./components/dashboard-minimal";
import { LayoutDashboard, Sparkles, Compass, Sun, Columns, Database } from "lucide-react";
import Link from "next/link";

export default function Home() {
  // Mode switcher: "ocean" (Light Design 1) | "minimal" (Light Design 2) | "split" (Side by side comparison)
  const [activeDashboard, setActiveDashboard] = useState<"ocean" | "minimal" | "split">("ocean");

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Universal Top Dashboard Selector Header (Light Mode) */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 rounded-xl shadow-xs text-white">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Scuba Dashboard Explorer
                <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full font-mono font-semibold">
                  2 Light Designs
                </span>
              </h1>
              <p className="text-[11px] text-slate-500">Sahana & Labdhi • Switch between 2 unique light-themed dashboard layouts</p>
            </div>
          </div>

          {/* Design Switcher Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveDashboard("ocean")}
              className={`flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all ${
                activeDashboard === "ocean"
                  ? "bg-cyan-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Design 1: Ocean Fresh Light</span>
            </button>

            <button
              onClick={() => setActiveDashboard("minimal")}
              className={`flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all ${
                activeDashboard === "minimal"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Design 2: Minimal Slate Light</span>
            </button>

            <button
              onClick={() => setActiveDashboard("split")}
              className={`flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all ${
                activeDashboard === "split"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split Comparison</span>
            </button>

            <Link
              href="/logs"
              className="flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all text-slate-600 hover:text-slate-900 hover:bg-white/60 ml-2 border-l border-slate-300 pl-4"
            >
              <Database className="w-3.5 h-3.5 text-cyan-600" />
              <span>Dive Logs CRUD</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main View Area */}
      <div className="flex-1">
        {activeDashboard === "ocean" && <DashboardOcean />}
        {activeDashboard === "minimal" && <DashboardMinimal />}
        {activeDashboard === "split" && (
          <div className="grid grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x divide-slate-200">
            <div className="overflow-hidden bg-slate-50">
              <div className="bg-cyan-50 text-cyan-800 font-bold px-4 py-2 text-xs uppercase tracking-wider border-b border-cyan-200 flex items-center justify-between">
                <span>Design 1: Ocean Fresh Light Theme</span>
                <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              </div>
              <DashboardOcean />
            </div>

            <div className="overflow-hidden bg-slate-50">
              <div className="bg-indigo-50 text-indigo-800 font-bold px-4 py-2 text-xs uppercase tracking-wider border-b border-indigo-200 flex items-center justify-between">
                <span>Design 2: Minimalist Slate Light Theme</span>
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <DashboardMinimal />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
