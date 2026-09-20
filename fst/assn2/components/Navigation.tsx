'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, Shield, User, LogOut, Database, Menu, X } from 'lucide-react';
import { authClient } from '@/lib/auth/client';
import { useState } from 'react';

export default function Navigation({ userRole, userName }: { userRole: string; userName?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'MEMBER', 'GUEST'] },
    { href: '/transactions', label: 'Transactions', icon: FileText, roles: ['ADMIN', 'MEMBER'] },
    { href: '/audit-logs', label: 'Audit Logs', icon: Shield, roles: ['ADMIN'] },
    { href: '/admin', label: 'Admin', icon: Shield, roles: ['ADMIN'] },
    { href: '/database-demo', label: 'DB Demo', icon: Database, roles: ['ADMIN', 'MEMBER', 'GUEST'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push('/login');
    router.refresh();
  };

  const roleBadgeColor: Record<string, string> = {
    ADMIN: 'bg-red-500/20 text-red-300 border-red-500/30',
    MEMBER: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    GUEST: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  };

  return (
    <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-semibold text-sm hidden sm:block">SecurePortal</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-300'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <span className={`hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${roleBadgeColor[userRole] || roleBadgeColor.GUEST}`}>
              {userRole}
            </span>
            <Link
              href="/profile"
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:block">{userName || 'Profile'}</span>
            </Link>
            <button
              onClick={handleSignOut}
              id="signout-btn"
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">Sign Out</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden text-slate-400 hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden py-2 border-t border-slate-700/50">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${
                    isActive ? 'text-indigo-300' : 'text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
