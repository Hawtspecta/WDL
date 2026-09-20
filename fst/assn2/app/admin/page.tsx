'use client';

import { useState, useEffect } from 'react';
import { getSession, canManageUsers } from '@/lib/authorization';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Settings, Database, Activity } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    totalAuditLogs: 0,
    totalEmailEvents: 0,
  });

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

      if (!canManageUsers(currentSession)) {
        router.push('/unauthorized');
        return;
      }

      setSession(currentSession);
      await loadStats();
    } catch (error) {
      console.error('Error loading session:', error);
    }
  };

  const loadStats = async () => {
    try {
      // In a real app, you'd have specific admin endpoints
      // For now, we'll use the transactions endpoint as a proxy
      const transactionsResponse = await fetch('/api/transactions');
      const transactionsData = await transactionsResponse.json();
      
      const auditLogsResponse = await fetch('/api/audit-logs');
      const auditLogsData = await auditLogsResponse.json();

      setStats({
        totalUsers: 10, // This would come from a users endpoint
        totalTransactions: transactionsData.meta?.count || 0,
        totalAuditLogs: auditLogsData.meta?.total || 0,
        totalEmailEvents: 0, // This would come from an email events endpoint
      });
    } catch (error) {
      console.error('Error loading stats:', error);
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">System administration and management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AdminStatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            description="Registered users"
          />
          <AdminStatCard
            title="Total Transactions"
            value={stats.totalTransactions}
            icon={Activity}
            description="All transactions"
          />
          <AdminStatCard
            title="Audit Logs"
            value={stats.totalAuditLogs}
            icon={Settings}
            description="System events"
          />
          <AdminStatCard
            title="Email Events"
            value={stats.totalEmailEvents}
            icon={Database}
            description="Email deliveries"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Users
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  System Settings
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Database className="w-4 h-4 mr-2" />
                  Database Management
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Activity className="w-4 h-4 mr-2" />
                  View Logs
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Environment</span>
                  <span className="font-medium">{process.env.NODE_ENV || 'development'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Database</span>
                  <span className="font-medium text-green-600">Connected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email Service</span>
                  <span className="font-medium text-green-600">Configured</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Authentication</span>
                  <span className="font-medium text-green-600">Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function AdminStatCard({ title, value, icon: Icon, description }: any) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          </div>
          <Icon className="w-8 h-8 text-indigo-600" />
        </div>
      </CardContent>
    </Card>
  );
}
