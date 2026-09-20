import { getSession } from '@/lib/authorization';
import { redirect } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, DollarSign, Users, FileText, LucideIcon } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  // Get statistics based on user role
  const stats = await getDashboardStats(session);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation userRole={session.role} userName={session.name} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back, {session.name}!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Transactions"
            value={stats.totalTransactions}
            icon={FileText}
            description="All transactions"
          />
          <StatCard
            title="Total Amount"
            value={`$${stats.totalAmount.toFixed(2)}`}
            icon={DollarSign}
            description="Transaction volume"
          />
          <StatCard
            title="Active Users"
            value={stats.totalUsers}
            icon={Users}
            description="Registered users"
          />
          <StatCard
            title="Recent Activity"
            value={stats.recentActivity}
            icon={Activity}
            description="Last 24 hours"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.recentTransactions.length === 0 ? (
                <p className="text-gray-500">No recent transactions</p>
              ) : (
                <div className="space-y-4">
                  {stats.recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-500">{transaction.user.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${transaction.amount.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">{transaction.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <StatusItem label="Database" status="connected" />
                <StatusItem label="Email Service" status={stats.emailConfigured ? "configured" : "not configured"} />
                <StatusItem label="Authentication" status="active" />
                <StatusItem label="Your Role" status={session.role} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

async function getDashboardStats(session: { id: string; role: string; name: string; email: string }) {
  const where = session.role === 'ADMIN' ? {} : { userId: session.id };

  const [totalTransactions, totalAmount, totalUsers, recentTransactions] = await Promise.all([
    prisma.transaction.count({ where }),
    prisma.transaction.aggregate({
      where,
      _sum: { amount: true },
    }),
    prisma.user.count(),
    prisma.transaction.findMany({
      where,
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ]);

  const recentActivity = await prisma.auditLog.count({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    },
  });

  return {
    totalTransactions,
    totalAmount: totalAmount._sum.amount || 0,
    totalUsers,
    recentActivity,
    recentTransactions,
    emailConfigured: !!process.env.RESEND_API_KEY,
  };
}

function StatCard({ title, value, icon: Icon, description }: { title: string; value: string | number; icon: LucideIcon; description: string }) {
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

function StatusItem({ label, status }: { label: string; status: string }) {
  const isActive = status === 'connected' || status === 'active' || status === 'configured';
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`text-sm font-medium ${isActive ? 'text-green-600' : 'text-red-600'}`}>
        {status}
      </span>
    </div>
  );
}
