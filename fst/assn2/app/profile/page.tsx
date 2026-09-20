import { getSession } from '@/lib/authorization';
import { redirect } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Shield, Calendar } from 'lucide-react';

export default async function ProfilePage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  // Get full user details from database
  const prisma = (await import('@/lib/prisma')).prisma;
  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      role: true,
      _count: {
        select: {
          transactions: true,
          auditLogs: true,
        },
      },
    },
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation userRole={session.role} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="mt-2 text-gray-600">Your account information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ProfileItem
                    icon={User}
                    label="Name"
                    value={user.name}
                  />
                  <ProfileItem
                    icon={Mail}
                    label="Email"
                    value={user.email}
                  />
                  <ProfileItem
                    icon={Shield}
                    label="Role"
                    value={user.role.name}
                  />
                  <ProfileItem
                    icon={Calendar}
                    label="Member Since"
                    value={new Date(user.createdAt).toLocaleDateString()}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Account Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatCard
                    title="Transactions"
                    value={user._count.transactions}
                    description="Total transactions"
                  />
                  <StatCard
                    title="Audit Logs"
                    value={user._count.auditLogs}
                    description="Activity records"
                  />
                  <StatCard
                    title="Account Age"
                    value={`${Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days`}
                    description="Days since registration"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Security Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">Add an extra layer of security</p>
                    </div>
                    <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                      Not Enabled
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">Last Login</p>
                      <p className="text-sm text-gray-500">Most recent sign-in</p>
                    </div>
                    <span className="text-sm text-gray-600">
                      {new Date().toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-start space-x-3">
      <Icon className="w-5 h-5 text-gray-400 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm text-gray-600">{label}</p>
        <p className="font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function StatCard({ title, value, description }: { title: string, value: string | number, description: string }) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  );
}
