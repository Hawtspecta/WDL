'use client';

import { useState, useEffect, useCallback } from 'react';
import { authClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Shield, Activity, RefreshCw } from 'lucide-react';
import { canViewAuditLogs } from '@/lib/authorization/permissions';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuditLogEntry {
  id: string;
  action: string;
  entityType: string;
  entityId?: string;
  createdAt: string;
  ipAddress?: string;
  user?: {
    name?: string;
    email?: string;
  };
}

export default function AuditLogsPage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  const loadAuditLogs = useCallback(async () => {
    try {
      const response = await fetch('/api/audit-logs');
      if (response.ok) {
        const data = await response.json();
        setAuditLogs(data.data || []);
      }
    } catch (error) {
      console.error('Error loading audit logs:', error);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    async function initSession() {
      try {
        const { data: session } = await authClient.getSession();
        if (!session) {
          router.push('/login');
          return;
        }

        const profileRes = await fetch('/api/profile');
        if (!profileRes.ok) {
          router.push('/login');
          return;
        }

        const profile: UserProfile = await profileRes.json();
        if (!canViewAuditLogs({ id: profile.id, email: profile.email, name: profile.name, role: profile.role })) {
          router.push('/unauthorized');
          return;
        }

        if (mounted) {
          setUserProfile(profile);
          const response = await fetch('/api/audit-logs');
          if (response.ok) {
            const data = await response.json();
            setAuditLogs(data.data || []);
          }
        }
      } catch (error) {
        console.error('Error loading session:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    initSession();
    return () => { mounted = false; };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-300">
        <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading audit log records...</span>
        </div>
      </div>
    );
  }

  if (!userProfile) return null;

  const filteredLogs = auditLogs.filter(log => 
    log.action?.toLowerCase().includes(searchFilter.toLowerCase()) ||
    log.entityType?.toLowerCase().includes(searchFilter.toLowerCase()) ||
    log.user?.name?.toLowerCase().includes(searchFilter.toLowerCase()) ||
    log.user?.email?.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navigation userRole={userProfile.role} userName={userProfile.name} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 mb-8 border-b border-slate-800 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
              <Shield className="w-3.5 h-3.5" />
              <span>Immutable System Audit Trail</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Audit Event Logs</h1>
            <p className="mt-1 text-slate-400 text-sm">Security events, mutations & API action history tracked automatically</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              onClick={loadAuditLogs}
              variant="outline" 
              className="border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filter Input */}
        <div className="mb-6 relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search by action, user, or entity..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        <Card className="bg-slate-900/60 border-slate-800 shadow-xl backdrop-blur-xl">
          <CardHeader className="border-b border-slate-800/80 pb-4">
            <CardTitle className="text-lg font-bold text-white flex items-center">
              <Activity className="w-5 h-5 mr-2 text-indigo-400" />
              System Event History ({filteredLogs.length} events)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Shield className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                <p className="font-semibold">No audit logs found</p>
                <p className="text-xs text-slate-500 mt-1">System activity will be logged here as transactions are created and updated.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                      <th className="py-3 px-4 font-semibold">Timestamp</th>
                      <th className="py-3 px-4 font-semibold">Actor / User</th>
                      <th className="py-3 px-4 font-semibold">Action Performed</th>
                      <th className="py-3 px-4 font-semibold">Target Entity</th>
                      <th className="py-3 px-4 font-semibold">Entity ID</th>
                      <th className="py-3 px-4 font-semibold">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-sm">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-4 text-xs font-mono text-slate-400">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <div>
                            <p className="font-semibold text-slate-200">{log.user?.name || 'System'}</p>
                            <p className="text-xs text-slate-500">{log.user?.email || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            log.action === 'CREATE_TRANSACTION' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                            log.action === 'UPDATE_TRANSACTION' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            log.action === 'DELETE_TRANSACTION' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                            'bg-slate-800 text-slate-300'
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-xs text-slate-300">{log.entityType}</td>
                        <td className="py-3.5 px-4 text-xs font-mono text-slate-500">
                          {log.entityId ? log.entityId.slice(0, 10) + '...' : '-'}
                        </td>
                        <td className="py-3.5 px-4 text-xs font-mono text-slate-400">{log.ipAddress || '127.0.0.1'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
