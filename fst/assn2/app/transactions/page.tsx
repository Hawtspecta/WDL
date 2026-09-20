'use client';

import { useState, useEffect, useCallback } from 'react';
import { authClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, Loader2 } from 'lucide-react';
import { createTransaction } from '@/app/actions/transactions';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  status: string;
  createdAt: string;
  user: { name: string; email: string };
}

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export default function TransactionsPage() {
  const router = useRouter();
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [userRole, setUserRole] = useState<string>('GUEST');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ amount: '', description: '' });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const loadData = useCallback(async () => {
    try {
      const session = await authClient.getSession();
      if (!session?.data?.user) {
        router.push('/login');
        return;
      }
      setSessionUser(session.data.user as SessionUser);

      const response = await fetch('/api/transactions');
      if (response.status === 401) {
        router.push('/login');
        return;
      }
      const data = await response.json();
      if (data.data) {
        setTransactions(data.data);
      }

      const profileResp = await fetch('/api/profile');
      if (profileResp.ok) {
        const profile = await profileResp.json();
        setUserRole(profile.role ?? profile.data?.role ?? 'GUEST');
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setSubmitting(true);

    const fd = new FormData();
    fd.append('amount', formData.amount);
    fd.append('description', formData.description);

    const result = await createTransaction(fd);

    if (result.success) {
      setFormSuccess('Transaction created successfully!');
      setFormData({ amount: '', description: '' });
      setShowCreateForm(false);
      await loadData();
    } else {
      setFormError(result.errors?.join(', ') || 'Failed to create transaction');
    }
    setSubmitting(false);
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = !searchQuery ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusColors: Record<string, string> = {
    COMPLETED: 'bg-emerald-500/20 text-emerald-300',
    PENDING: 'bg-amber-500/20 text-amber-300',
    FAILED: 'bg-red-500/20 text-red-300',
    CANCELLED: 'bg-slate-500/20 text-slate-300',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (!sessionUser) return null;

  return (
    <div className="min-h-screen bg-slate-950">
      <Navigation userRole={userRole} userName={sessionUser.name} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Transactions</h1>
            <p className="mt-1 text-slate-400">Manage and track financial transactions</p>
          </div>
          {userRole !== 'GUEST' && (
            <Button
              id="create-transaction-btn"
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Transaction
            </Button>
          )}
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <Card className="mb-6 bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Create New Transaction</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTransaction} className="space-y-4">
                {formError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    {formError}
                  </div>
                )}
                {formSuccess && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm">
                    {formSuccess}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Amount ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      id="tx-amount"
                      className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="100.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
                    <input
                      type="text"
                      required
                      id="tx-description"
                      className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Payment for services"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    id="submit-transaction"
                    disabled={submitting}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Create Transaction
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by description or user..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="FAILED">Failed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Table */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>All Transactions</span>
              <span className="text-sm font-normal text-slate-400">{filteredTransactions.length} records</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Filter className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No transactions found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 font-medium text-slate-400">ID</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-400">Description</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-400">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-400">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-400">User</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-400">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                        <td className="py-3 px-4 font-mono text-slate-500">{tx.id.slice(0, 8)}…</td>
                        <td className="py-3 px-4 text-slate-300 max-w-xs truncate">{tx.description}</td>
                        <td className="py-3 px-4 text-white font-semibold">${tx.amount.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[tx.status] || 'bg-slate-500/20 text-slate-300'}`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400">{tx.user?.name ?? '—'}</td>
                        <td className="py-3 px-4 text-slate-500">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </td>
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
