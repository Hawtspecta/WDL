"use client";

import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Target,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Search,
  SlidersHorizontal,
  Plus,
  Briefcase,
  Layers,
  CircleAlert
} from "lucide-react";

export default function DashboardMinimal() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [taskFilter, setTaskFilter] = useState("All");

  const stats = [
    {
      label: "Total Monthly Revenue",
      value: "$84,230",
      target: "$90,000",
      pct: 93,
      growth: "+18.4%",
      isPositive: true,
      color: "bg-indigo-600"
    },
    {
      label: "Active Memberships",
      value: "3,420",
      target: "3,500",
      pct: 97,
      growth: "+12.1%",
      isPositive: true,
      color: "bg-emerald-600"
    },
    {
      label: "Course Completion Rate",
      value: "94.8%",
      target: "95.0%",
      pct: 99,
      growth: "+3.2%",
      isPositive: true,
      color: "bg-blue-600"
    },
    {
      label: "Customer Satisfaction Score",
      value: "4.9 / 5.0",
      target: "4.8",
      pct: 100,
      growth: "+0.3",
      isPositive: true,
      color: "bg-violet-600"
    }
  ];

  const tasks = [
    {
      id: "TSK-101",
      title: "Update Scuba Safety Protocol Handbook v4",
      assignee: "Sahana Nayak",
      category: "Operations",
      dueDate: "Aug 12, 2026",
      priority: "High",
      status: "In Progress"
    },
    {
      id: "TSK-102",
      title: "Quarterly Compressor & Nitrox Station Audit",
      assignee: "Labdhi Shah",
      category: "Maintenance",
      dueDate: "Aug 15, 2026",
      priority: "Urgent",
      status: "Pending"
    },
    {
      id: "TSK-103",
      title: "Launch Advanced Open Water Certification Drive",
      assignee: "Alex Rivera",
      category: "Marketing",
      dueDate: "Aug 18, 2026",
      priority: "Medium",
      status: "Completed"
    },
    {
      id: "TSK-104",
      title: "Sync GPS telemetry with underwater drone logs",
      assignee: "Tech Team",
      category: "Engineering",
      dueDate: "Aug 20, 2026",
      priority: "High",
      status: "In Progress"
    }
  ];

  const filteredTasks = taskFilter === "All"
    ? tasks
    : tasks.filter(t => t.status === taskFilter);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 sm:p-6 md:p-8 space-y-6">
      {/* Executive Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h1>
            <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full">
              Design 2 • Minimalist Light
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">High-level performance, goals, and team deliverables</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            {["Overview", "Performance", "Reports"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === tab
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl shadow-sm transition-all">
            <Plus className="w-4 h-4" />
            <span>Add Goal</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-xs font-medium text-slate-500">{s.label}</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                {s.growth}
              </span>
            </div>

            <div>
              <div className="text-2xl font-bold text-slate-900">{s.value}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Target: {s.target}</div>
            </div>

            <div className="space-y-1 pt-1">
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className={`${s.color} h-full rounded-full`} style={{ width: `${s.pct}%` }} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>Progress</span>
                <span>{s.pct}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Goal Breakdown & Team Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Goal Tracking Progress */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-600" />
              Quarterly Key Results
            </h2>
            <button className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {[
              { title: "Marine Certification Enrollments", target: "500 Divers", current: "468 Divers", pct: 93.6 },
              { title: "Equipment Rental Fleet Upgrade", target: "100 Regulators", current: "85 Regulators", pct: 85.0 },
              { title: "Reef Conservation Sponsorship", target: "$50,000 Raised", current: "$42,500 Raised", pct: 85.0 },
              { title: "Customer Renewal Rate", target: "90% Retention", current: "92% Retention", pct: 100 }
            ].map((kr, i) => (
              <div key={i} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-800">
                  <span>{kr.title}</span>
                  <span className="text-indigo-600">{kr.pct}%</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Current: {kr.current}</span>
                  <span>Goal: {kr.target}</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${kr.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Deliverables & Tasks */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                Team Action Items
              </h2>
              <p className="text-xs text-slate-500">Milestone deliverables and operational priorities</p>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
              {["All", "In Progress", "Pending", "Completed"].map((st) => (
                <button
                  key={st}
                  onClick={() => setTaskFilter(st)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    taskFilter === st
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Task List */}
          <div className="divide-y divide-slate-100">
            {filteredTasks.map((t) => (
              <div key={t.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 px-2 rounded-xl transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400 font-semibold">{t.id}</span>
                    <span className="text-xs font-semibold text-slate-900">{t.title}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-400" />
                      {t.assignee}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      Due {t.dueDate}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                      {t.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      t.priority === "Urgent"
                        ? "bg-rose-50 text-rose-600 border border-rose-200"
                        : t.priority === "High"
                        ? "bg-amber-50 text-amber-600 border border-amber-200"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {t.priority}
                  </span>

                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      t.status === "Completed"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : t.status === "In Progress"
                        ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
