"use client";

import React, { useState } from "react";
import {
  Anchor,
  Compass,
  Waves,
  TrendingUp,
  Users,
  Calendar,
  Filter,
  Plus,
  ArrowUpRight,
  ChevronDown,
  Activity,
  Award,
  ShieldCheck
} from "lucide-react";

export default function DashboardOcean() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [timeRange, setTimeRange] = useState("This Month");

  const metrics = [
    {
      title: "Active Divers",
      value: "1,248",
      change: "+14.2%",
      isPositive: true,
      icon: Users,
      color: "bg-cyan-500 text-white shadow-cyan-200",
      subtext: "28 currently underwater"
    },
    {
      title: "Expeditions Logged",
      value: "432",
      change: "+8.7%",
      isPositive: true,
      icon: Compass,
      color: "bg-blue-600 text-white shadow-blue-200",
      subtext: "Across 14 dive sites"
    },
    {
      title: "Water Visibility Index",
      value: "28m",
      change: "Optimal",
      isPositive: true,
      icon: Waves,
      color: "bg-teal-500 text-white shadow-teal-200",
      subtext: "Temp: 24°C / 75°F"
    },
    {
      title: "Equipment Revenue",
      value: "$34,890",
      change: "+22.5%",
      isPositive: true,
      icon: TrendingUp,
      color: "bg-sky-500 text-white shadow-sky-200",
      subtext: "Rental return rate 99.1%"
    }
  ];

  const expeditions = [
    {
      id: "EXP-9041",
      location: "Blue Hole Sanctuary",
      type: "Deep Sea",
      maxDepth: "38m",
      guide: "Captain Marcus",
      date: "Today, 10:30 AM",
      status: "Completed",
      divers: 6
    },
    {
      id: "EXP-9042",
      location: "Coral Reef Wall",
      type: "Coastal",
      maxDepth: "18m",
      guide: "Elena Vance",
      date: "Today, 02:00 PM",
      status: "In Progress",
      divers: 8
    },
    {
      id: "EXP-9043",
      location: "Sunken Galleon Wreck",
      type: "Wreck Dive",
      maxDepth: "29m",
      guide: "Leo Sterling",
      date: "Tomorrow, 08:30 AM",
      status: "Scheduled",
      divers: 4
    },
    {
      id: "EXP-9044",
      location: "Shark Cavern Tunnel",
      type: "Deep Sea",
      maxDepth: "42m",
      guide: "Captain Marcus",
      date: "Tomorrow, 01:15 PM",
      status: "Scheduled",
      divers: 5
    }
  ];

  const filteredExpeditions = selectedFilter === "All" 
    ? expeditions 
    : expeditions.filter(e => e.type === selectedFilter);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 sm:p-6 md:p-8 space-y-6">
      {/* Top Banner / Header - Ocean Fresh Light */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-xl shadow-md text-white">
            <Anchor className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">Oceanic Dive Ops</h1>
              <span className="text-[10px] font-semibold tracking-wider uppercase bg-cyan-50 text-cyan-700 border border-cyan-200 px-2 py-0.5 rounded-full">
                Design 1 • Ocean Fresh Light
              </span>
            </div>
            <p className="text-xs text-slate-500">Real-time marine conditions & scuba expedition management</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button className="flex items-center gap-2 text-xs bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-2 rounded-xl text-slate-700 font-medium transition-colors">
            <Calendar className="w-3.5 h-3.5 text-cyan-600" />
            <span>{timeRange}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          <button className="flex items-center gap-2 text-xs font-semibold bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-xl shadow-sm transition-all">
            <Plus className="w-4 h-4" />
            <span>New Expedition</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((item, index) => {
          const IconComp = item.icon;
          return (
            <div
              key={index}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{item.title}</span>
                <div className={`p-2.5 rounded-xl ${item.color} shadow-sm`}>
                  <IconComp className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{item.value}</div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-slate-500">{item.subtext}</span>
                  <span className="text-xs font-semibold text-cyan-700 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded-md">
                    {item.change}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dive Depth & Traffic Chart (Interactive Light SVG) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-600" />
                Weekly Dive Volume & Water Conditions
              </h2>
              <p className="text-xs text-slate-500">Depth averages and total diver count per day</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-cyan-600 text-white font-medium shadow-sm">Weekly</span>
              <span className="px-2.5 py-1 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer">Monthly</span>
            </div>
          </div>

          {/* SVG Custom Bar & Line Chart for Light Mode */}
          <div className="h-64 w-full pt-4">
            <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="barGradLight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0891b2" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.15" />
                </linearGradient>
                <linearGradient id="lineGradLight" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#0D9488" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f5f9" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="#f1f5f9" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="#f1f5f9" strokeWidth="2" strokeDasharray="4 4" />

              {/* Bars */}
              <rect x="25" y="80" width="30" height="90" rx="6" fill="url(#barGradLight)" />
              <rect x="95" y="50" width="30" height="120" rx="6" fill="url(#barGradLight)" />
              <rect x="165" y="100" width="30" height="70" rx="6" fill="url(#barGradLight)" />
              <rect x="235" y="30" width="30" height="140" rx="6" fill="url(#barGradLight)" />
              <rect x="305" y="70" width="30" height="100" rx="6" fill="url(#barGradLight)" />
              <rect x="375" y="40" width="30" height="130" rx="6" fill="url(#barGradLight)" />
              <rect x="445" y="90" width="30" height="80" rx="6" fill="url(#barGradLight)" />

              {/* Line Trend Overlay */}
              <path
                d="M 40 70 Q 110 30, 180 90 T 320 50 T 460 75"
                fill="none"
                stroke="url(#lineGradLight)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Dots */}
              <circle cx="40" cy="70" r="4" fill="#0284c7" />
              <circle cx="110" cy="30" r="4" fill="#0284c7" />
              <circle cx="180" cy="90" r="4" fill="#0284c7" />
              <circle cx="250" cy="45" r="4" fill="#0D9488" />
              <circle cx="320" cy="50" r="4" fill="#0D9488" />
              <circle cx="390" cy="35" r="4" fill="#0D9488" />
              <circle cx="460" cy="75" r="4" fill="#0D9488" />
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        {/* Safety & Gear Status Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Equipment & Safety
              </h2>
              <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                100% Passed
              </span>
            </div>

            <div className="space-y-3">
              {[
                { label: "Oxygen Tank Pressure Logs", status: "Optimal (200 Bar)", value: 96 },
                { label: "BCDs & Regulators Inspected", status: "Verified 48 Units", value: 100 },
                { label: "Emergency Beacon Signal", status: "Active & Synced", value: 92 },
                { label: "Decompression Computers", status: "Calibrated", value: 98 }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-800">{item.label}</span>
                    <span className="text-slate-500 text-[11px]">{item.status}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-600 to-teal-500 h-full rounded-full"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-cyan-50 border border-cyan-100 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-600" />
              <span className="text-cyan-900 font-medium">PADI Dive Center Grade: A+</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-cyan-700 cursor-pointer hover:text-cyan-900" />
          </div>
        </div>
      </div>

      {/* Recent Expeditions Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Scuba Expeditions</h2>
            <p className="text-xs text-slate-500">Live operational log and dive team schedules</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            {["All", "Deep Sea", "Coastal", "Wreck Dive"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                  selectedFilter === filter
                    ? "bg-cyan-600 border-cyan-600 text-white font-semibold shadow-sm"
                    : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3">Expedition ID</th>
                <th className="p-3">Site Location</th>
                <th className="p-3">Type</th>
                <th className="p-3">Max Depth</th>
                <th className="p-3">Dive Master</th>
                <th className="p-3">Date & Time</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpeditions.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-mono text-cyan-700 font-semibold">{exp.id}</td>
                  <td className="p-3 font-semibold text-slate-900">{exp.location}</td>
                  <td className="p-3">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200 text-slate-700 font-medium">
                      {exp.type}
                    </span>
                  </td>
                  <td className="p-3 text-slate-700">{exp.maxDepth}</td>
                  <td className="p-3">{exp.guide}</td>
                  <td className="p-3 text-slate-500">{exp.date}</td>
                  <td className="p-3 text-right">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                        exp.status === "Completed"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                          : exp.status === "In Progress"
                          ? "bg-cyan-50 border-cyan-200 text-cyan-700"
                          : "bg-slate-100 border-slate-200 text-slate-600"
                      }`}
                    >
                      {exp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
