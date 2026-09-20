'use client';

import { useState, useEffect } from 'react';
import { getSession, canViewAuditLogs } from '@/lib/authorization';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Filter, Shield } from 'lucide-react';

export default function AuditLogsPage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadSessionAndData();
  }, []);

  const loadSessionAndData = async () => {
    try {
      const currentSession = await getSession();
      if (!currentSession) {
        router.push('/login');
        return;
      }

      if (!canViewAuditLogs(currentSession)) {
        router.push('/unauthorized');
        return;
      }

      setSession(currentSession);
      await loadAuditLogs();
    } catch (error) {
      console.error('Error loading session:', error);
    }
  };

  const loadAuditLogs = async () => {
    try {
      const response = await fetch('/api/audit-logs');
      const data = await response.json();
      if (data.data) {
        setAuditLogs(data.data);
      }
    } catch (error) {
      console.error('Error loading audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation userRole={session.role} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
            <p className="mt-2 text-gray-600">System activity and security events</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {auditLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No audit logs found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Timestamp</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">User</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Action</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Entity</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Entity ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">IP Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div>
                            <p className="font-medium">{log.user.name}</p>
                            <p className="text-xs text-gray-500">{log.user.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            log.action === 'CREATE_TRANSACTION' ? 'bg-blue-100 text-blue-800' :
                            log.action === 'UPDATE_TRANSACTION' ? 'bg-yellow-100 text-yellow-800' :
                            log.action === 'DELETE_TRANSACTION' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">{log.entityType}</td>
                        <td className="py-3 px-4 text-sm font-mono text-xs">
                          {log.entityId.slice(0, 8)}...
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">{log.ipAddress}</td>
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
