import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'next/link';
import { Database, Users, FileText, Activity, Mail, ArrowLeft } from 'lucide-react';

export default async function DatabaseDemoPage() {
  // Fetch all data from the database to demonstrate it's real
  const [roles, users, transactions, auditLogs, emailEvents] = await Promise.all([
    prisma.role.findMany(),
    prisma.user.findMany({
      include: { role: true },
    }),
    prisma.transaction.findMany({
      include: { user: true },
      take: 20,
    }),
    prisma.auditLog.findMany({
      include: { user: true },
      take: 20,
    }),
    prisma.emailEvent.findMany({
      take: 20,
    }),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Database Demonstration</h1>
          <p className="mt-2 text-gray-600">
            This page displays actual records from the PostgreSQL database, demonstrating that the seeding process created real persisted data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <DatabaseStatCard
            title="Roles"
            count={roles.length}
            icon={Users}
            description="User roles in system"
          />
          <DatabaseStatCard
            title="Users"
            count={users.length}
            icon={Users}
            description="Registered users"
          />
          <DatabaseStatCard
            title="Transactions"
            count={transactions.length}
            icon={FileText}
            description="Total transactions"
          />
          <DatabaseStatCard
            title="Audit Logs"
            count={auditLogs.length}
            icon={Activity}
            description="System activity logs"
          />
          <DatabaseStatCard
            title="Email Events"
            count={emailEvents.length}
            icon={Mail}
            description="Email delivery events"
          />
          <DatabaseStatCard
            title="Database Status"
            count={1}
            icon={Database}
            description="PostgreSQL Connected"
          />
        </div>

        <div className="space-y-6">
          <DataTable
            title="Roles"
            icon={Users}
            data={roles}
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'name', label: 'Name' },
              { key: 'createdAt', label: 'Created', format: (date: Date) => new Date(date).toLocaleDateString() },
            ]}
          />

          <DataTable
            title="Users"
            icon={Users}
            data={users}
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'name', label: 'Name' },
              { key: 'email', label: 'Email' },
              { key: 'role', label: 'Role', format: (role: any) => role.name },
              { key: 'createdAt', label: 'Created', format: (date: Date) => new Date(date).toLocaleDateString() },
            ]}
          />

          <DataTable
            title="Transactions (Recent 20)"
            icon={FileText}
            data={transactions}
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'description', label: 'Description' },
              { key: 'amount', label: 'Amount', format: (amount: number) => `$${amount.toFixed(2)}` },
              { key: 'status', label: 'Status' },
              { key: 'user', label: 'User', format: (user: any) => user.name },
              { key: 'createdAt', label: 'Created', format: (date: Date) => new Date(date).toLocaleDateString() },
            ]}
          />

          <DataTable
            title="Audit Logs (Recent 20)"
            icon={Activity}
            data={auditLogs}
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'action', label: 'Action' },
              { key: 'entityType', label: 'Entity Type' },
              { key: 'user', label: 'User', format: (user: any) => user.name },
              { key: 'createdAt', label: 'Created', format: (date: Date) => new Date(date).toLocaleString() },
            ]}
          />

          <DataTable
            title="Email Events (Recent 20)"
            icon={Mail}
            data={emailEvents}
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'eventType', label: 'Event Type' },
              { key: 'recipient', label: 'Recipient' },
              { key: 'subject', label: 'Subject' },
              { key: 'timestamp', label: 'Timestamp', format: (date: Date) => new Date(date).toLocaleString() },
            ]}
          />
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> All data displayed above is fetched in real-time from the PostgreSQL database using Prisma ORM. 
            This demonstrates that the database seeding process successfully created persisted relational data with proper foreign key relationships.
          </p>
        </div>
      </div>
    </div>
  );
}

function DatabaseStatCard({ title, count, icon: Icon, description }: any) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{count}</p>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          </div>
          <Icon className="w-8 h-8 text-indigo-600" />
        </div>
      </CardContent>
    </Card>
  );
}

function DataTable({ title, icon: Icon, data, columns }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon className="w-5 h-5 mr-2" />
          {title} ({data.length} records)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No records found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  {columns.map((col: any) => (
                    <th key={col.key} className="text-left py-2 px-3 font-medium text-gray-600">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row: any, index: number) => (
                  <tr key={row.id || index} className="border-b hover:bg-gray-50">
                    {columns.map((col: any) => (
                      <td key={col.key} className="py-2 px-3">
                        {col.format ? col.format(row[col.key]) : String(row[col.key]?.toString?.() || row[col.key] || '-')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
