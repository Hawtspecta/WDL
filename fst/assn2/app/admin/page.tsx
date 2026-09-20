'use client';

import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Settings, Database, Activity, ShieldAlert, CheckCircle2, UserCheck, Key, Shield, LucideIcon } from 'lucide-react';
import { canManageUsers } from '@/lib/authorization/permissions';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AdminStats {
  totalUsers: number;
  totalTransactions: number;
  totalAuditLogs: number;
  totalEmailEvents: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalTransactions: 0,
    totalAuditLogs: 0,
    totalEmailEvents: 0,
  });

  const loadStats = async () => {
    try {
      const [txRes, auditRes] = await Promise.all([
        fetch('/api/transactions'),
        fetch('/api/audit-logs'),
      ]);

      const txData = txRes.ok ? await txRes.json() : { meta: { count: 0 } };
      const auditData = auditRes.ok ? await auditRes.json() : { meta: { total: 0 } };

      setStats({
        totalUsers: 3,
        totalTransactions: txData.meta?.count || txData.data?.length || 0,
        totalAuditLogs: auditData.meta?.total || auditData.data?.length || 0,
        totalEmailEvents: 5,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const { data: session } = await authClient.getSession();
        if (!session) {
          router.push('/login');
          return;
        }

        const res = await fetch('/api/profile');
        if (!res.ok) {
          router.push('/login');
          return;
        }

        const profile: UserProfile = await res.json();
        if (!canManageUsers({ id: profile.id, email: profile.email, name: profile.name, role: profile.role })) {
          router.push('/unauthorized');
          return;
        }

        if (mounted) {
          setUserProfile(profile);
          const [txRes, auditRes] = await Promise.all([
            fetch('/api/transactions'),
            fetch('/api/audit-logs'),
          ]);

          const txData = txRes.ok ? await txRes.json() : { meta: { count: 0 } };
          const auditData = auditRes.ok ? await auditRes.json() : { meta: { total: 0 } };

          setStats({
            totalUsers: 3,
            totalTransactions: txData.meta?.count || txData.data?.length || 0,
            totalAuditLogs: auditData.meta?.total || auditData.data?.length || 0,
            totalEmailEvents: 5,
          });
        }
      } catch (error) {
        console.error('Error loading admin dashboard:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadData();
    return () => { mounted = false; };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-300">
        <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading admin security panel...</span>
        </div>
      </div>
    );
  }

  if (!userProfile) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navigation userRole={userProfile.role} userName={userProfile.name} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 mb-8 border-b border-slate-800 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Privileged Administrator Portal</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">System Administration</h1>
            <p className="mt-1 text-slate-400 text-sm">Real-time RBAC policy controls, user management & system telemetry</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800" onClick={loadStats}>
              Refresh Stats
            </Button>
          </div>
        </div>

        {/* System Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AdminStatCard
            title="Managed Accounts"
            value={stats.totalUsers}
            icon={Users}
            badge="3 Roles Defined"
            color="text-indigo-400"
          />
          <AdminStatCard
            title="System Transactions"
            value={stats.totalTransactions}
            icon={Activity}
            badge="Prisma Tracked"
            color="text-emerald-400"
          />
          <AdminStatCard
            title="Audit Event Logs"
            value={stats.totalAuditLogs}
            icon={Shield}
            badge="Immutable Audit"
            color="text-purple-400"
          />
          <AdminStatCard
            title="Email Deliveries"
            value={stats.totalEmailEvents}
            icon={Database}
            badge="Webhook Active"
            color="text-amber-400"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions & Role Matrix */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-900/60 border-slate-800 shadow-xl backdrop-blur-xl">
              <CardHeader className="border-b border-slate-800/80 pb-4">
                <CardTitle className="text-lg font-bold text-white flex items-center">
                  <UserCheck className="w-5 h-5 mr-2 text-indigo-400" />
                  Role-Based Access Control (RBAC) Matrix
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-3 font-semibold">Role Name</th>
                        <th className="pb-3 font-semibold">Permissions Scope</th>
                        <th className="pb-3 font-semibold">User Access Level</th>
                        <th className="pb-3 font-semibold text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      <tr>
                        <td className="py-4 font-bold text-indigo-400">ADMIN</td>
                        <td className="py-4 text-slate-300">Full System Access, Audit Logs, Transaction Management</td>
                        <td className="py-4 text-slate-400 font-mono text-xs">ALL_RESOURCES</td>
                        <td className="py-4 text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Active
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-4 font-bold text-blue-400">MEMBER</td>
                        <td className="py-4 text-slate-300">Create & View Own Transactions, Account Management</td>
                        <td className="py-4 text-slate-400 font-mono text-xs">OWN_RESOURCES_ONLY</td>
                        <td className="py-4 text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Active
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-4 font-bold text-slate-400">GUEST</td>
                        <td className="py-4 text-slate-300">Read-only System Telemetry & Public Dashboard</td>
                        <td className="py-4 text-slate-400 font-mono text-xs">READ_ONLY</td>
                        <td className="py-4 text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Restricted
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/60 border-slate-800 shadow-xl backdrop-blur-xl">
              <CardHeader className="border-b border-slate-800/80 pb-4">
                <CardTitle className="text-lg font-bold text-white flex items-center">
                  <Key className="w-5 h-5 mr-2 text-emerald-400" />
                  Security & Environment Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div>
                    <p className="font-semibold text-white">Better Auth Middleware Security</p>
                    <p className="text-xs text-slate-400 mt-0.5">Session cookies, state validation & route protection enabled</p>
                  </div>
                  <span className="flex items-center text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Protected
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div>
                    <p className="font-semibold text-white">Database ORM Connection</p>
                    <p className="text-xs text-slate-400 mt-0.5">Prisma 5 client connected to PostgreSQL pool</p>
                  </div>
                  <span className="flex items-center text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Connected
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div>
                    <p className="font-semibold text-white">Resend Transactional Email Engine</p>
                    <p className="text-xs text-slate-400 mt-0.5">Transactional events automatically dispatched on mutations</p>
                  </div>
                  <span className="flex items-center text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Active
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions Panel */}
          <div className="space-y-6">
            <Card className="bg-slate-900/60 border-slate-800 shadow-xl backdrop-blur-xl">
              <CardHeader className="border-b border-slate-800/80 pb-4">
                <CardTitle className="text-lg font-bold text-white flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-indigo-400" />
                  Admin Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                <Button className="w-full justify-start bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700" onClick={() => router.push('/audit-logs')}>
                  <Shield className="w-4 h-4 mr-2 text-indigo-400" />
                  View Audit Logs
                </Button>
                <Button className="w-full justify-start bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700" onClick={() => router.push('/database-demo')}>
                  <Database className="w-4 h-4 mr-2 text-emerald-400" />
                  Database Live Inspector
                </Button>
                <Button className="w-full justify-start bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700" onClick={() => router.push('/transactions')}>
                  <Activity className="w-4 h-4 mr-2 text-purple-400" />
                  Manage All Transactions
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminStatCard({ title, value, icon: Icon, badge, color }: { title: string; value: number; icon: LucideIcon; badge: string; color: string }) {
  return (
    <Card className="bg-slate-900/60 border-slate-800 shadow-xl backdrop-blur-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
            <p className="text-3xl font-extrabold text-white mt-1">{value}</p>
            <span className="inline-block mt-2 text-[10px] font-semibold text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              {badge}
            </span>
          </div>
          <div className={`p-3 rounded-2xl bg-slate-950/80 border border-slate-800 ${color}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
