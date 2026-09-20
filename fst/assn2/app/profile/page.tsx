import { getSession } from '@/lib/authorization';
import { redirect } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Shield, Calendar, Activity, FileText, LucideIcon } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  // Get full user details from database
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

  const roleName = user.role?.name || 'GUEST';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navigation userRole={session.role} userName={session.name} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 border-b border-slate-800 pb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
            <User className="w-3.5 h-3.5" />
            <span>Authenticated User Identity</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Account Profile</h1>
          <p className="mt-1 text-slate-400 text-sm">Personal metadata, security state & activity metrics</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="bg-slate-900/60 border-slate-800 shadow-xl backdrop-blur-xl">
              <CardHeader className="border-b border-slate-800/80 pb-4">
                <CardTitle className="text-lg font-bold text-white flex items-center">
                  <User className="w-5 h-5 mr-2 text-indigo-400" />
                  User Credentials
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <ProfileItem
                  icon={User}
                  label="Full Name"
                  value={user.name}
                />
                <ProfileItem
                  icon={Mail}
                  label="Email Address"
                  value={user.email}
                />
                <ProfileItem
                  icon={Shield}
                  label="System Role"
                  value={roleName}
                  badge
                />
                <ProfileItem
                  icon={Calendar}
                  label="Member Since"
                  value={new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-900/60 border-slate-800 shadow-xl backdrop-blur-xl">
              <CardHeader className="border-b border-slate-800/80 pb-4">
                <CardTitle className="text-lg font-bold text-white flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-emerald-400" />
                  Activity Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatCard
                    title="Created Transactions"
                    value={user._count.transactions}
                    description="Total transactions in database"
                    icon={FileText}
                    color="text-indigo-400"
                  />
                  <StatCard
                    title="Audit Log Events"
                    value={user._count.auditLogs}
                    description="Activity records logged"
                    icon={Activity}
                    color="text-purple-400"
                  />
                  <StatCard
                    title="Account Tenure"
                    value={`${Math.max(1, Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)))} Days`}
                    description="Active registered account"
                    icon={Calendar}
                    color="text-emerald-400"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/60 border-slate-800 shadow-xl backdrop-blur-xl">
              <CardHeader className="border-b border-slate-800/80 pb-4">
                <CardTitle className="text-lg font-bold text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-indigo-400" />
                  Security & Session Context
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between items-center p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div>
                    <p className="font-semibold text-white">Better Auth Middleware Session</p>
                    <p className="text-xs text-slate-400 mt-0.5">Session ID: <span className="font-mono text-slate-300">{session.id}</span></p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold">
                    Authenticated
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div>
                    <p className="font-semibold text-white">RBAC Role Authority</p>
                    <p className="text-xs text-slate-400 mt-0.5">Permissions level assigned to {roleName}</p>
                  </div>
                  <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-xs font-semibold uppercase">
                    {roleName}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileItem({ icon: Icon, label, value, badge }: { icon: LucideIcon, label: string, value: string, badge?: boolean }) {
  return (
    <div className="flex items-start space-x-3 p-3 bg-slate-950/40 rounded-xl border border-slate-800/60">
      <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-indigo-400">
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-slate-400 font-medium">{label}</p>
        {badge ? (
          <span className="inline-block mt-1 px-2.5 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md text-xs font-bold uppercase">
            {value}
          </span>
        ) : (
          <p className="font-semibold text-white text-sm mt-0.5">{value}</p>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, description, icon: Icon, color }: { title: string, value: string | number, description: string, icon: LucideIcon, color: string }) {
  return (
    <div className="p-5 bg-slate-950/60 rounded-xl border border-slate-800">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-400">{title}</p>
        <div className={`p-2 bg-slate-900 rounded-lg border border-slate-800 ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-white mt-2">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{description}</p>
    </div>
  );
}
