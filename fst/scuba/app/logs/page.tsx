import React from 'react';
import { getLogs } from '@/app/lib/db';
import { createLogAction, deleteLogAction } from '@/app/actions/logs';
import { Compass, Trash2, Calendar, MapPin, Activity } from 'lucide-react';

export default function LogsPage() {
  // Server Component directly accesses the DB
  const logs = getLogs();

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12 text-slate-800">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <header className="flex items-center gap-3">
          <div className="p-3 bg-cyan-600 rounded-xl shadow-xs text-white">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dive Logs</h1>
            <p className="text-sm text-slate-500">Manage your underwater adventures with Server Actions.</p>
          </div>
        </header>

        {/* Create Log Form leveraging Server Actions */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold mb-4 text-slate-800">Log a New Dive</h2>
          <form action={createLogAction} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="flex flex-col gap-1.5">
              <label htmlFor="location" className="text-xs font-semibold text-slate-500">Location</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  id="location" 
                  name="location" 
                  required 
                  className="pl-9 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="e.g. Great Barrier Reef"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="depth" className="text-xs font-semibold text-slate-500">Depth (meters)</label>
              <div className="relative">
                <Activity className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="number" 
                  id="depth" 
                  name="depth" 
                  required 
                  min="0"
                  className="pl-9 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="e.g. 18"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="duration" className="text-xs font-semibold text-slate-500">Duration (mins)</label>
              <div className="relative">
                <Activity className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="number" 
                  id="duration" 
                  name="duration" 
                  required 
                  min="1"
                  className="pl-9 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="e.g. 45"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="date" className="text-xs font-semibold text-slate-500">Date</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="date" 
                  id="date" 
                  name="date" 
                  required 
                  className="pl-9 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-end mt-2">
              <button 
                type="submit" 
                className="bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold py-2 px-6 rounded-xl transition-all shadow-sm"
              >
                Add Dive Log
              </button>
            </div>
          </form>
        </section>

        {/* Logs Display List */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-800">Recent Logs</h2>
          {logs.length === 0 ? (
            <div className="bg-slate-100 border border-slate-200 border-dashed rounded-2xl p-8 text-center text-slate-500 text-sm">
              No dive logs found. Add one above to get started!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {logs.map((log) => (
                <div key={log.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-start group">
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-cyan-600" />
                      {log.location}
                    </h3>
                    <div className="flex gap-4 text-xs font-medium text-slate-500">
                      <span className="flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5" />
                        {log.depth}m
                      </span>
                      <span className="flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5" />
                        {log.duration} mins
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(log.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <form action={deleteLogAction}>
                    <input type="hidden" name="id" value={log.id} />
                    <button 
                      type="submit"
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      title="Delete Log"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
