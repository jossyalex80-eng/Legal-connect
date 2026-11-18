'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Scale, LayoutDashboard, FileText, Users, User, Settings, LogOut, Menu, X, PlusCircle, Briefcase, Shield, UserCheck } from 'lucide-react';

export function DashboardSidebar() {
  const { data: session } = useSession() || {};
  const pathname = usePathname() ?? '';
  const [mobileOpen, setMobileOpen] = useState(false);
  const role = (session?.user as any)?.role ?? 'client';

  const clientLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/submit-case', label: 'Submit Case', icon: PlusCircle },
    { href: '/dashboard/my-cases', label: 'My Cases', icon: FileText },
    { href: '/dashboard/profile', label: 'Profile Settings', icon: Settings },
  ];

  const lawyerLinks = [
    { href: '/dashboard/lawyer', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/case-matches', label: 'Case Matches', icon: Briefcase },
    { href: '/dashboard/profile', label: 'Profile Settings', icon: Settings },
  ];

  const adminLinks = [
    { href: '/dashboard/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/admin/lawyers', label: 'Lawyer Verification', icon: UserCheck },
    { href: '/dashboard/admin/users', label: 'User Management', icon: Users },
  ];

  const links = role === 'admin' ? adminLinks : role === 'lawyer' ? lawyerLinks : clientLinks;

  const NavContent = () => (
    <>
      <div className="mb-8 flex items-center gap-2 px-2">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-900">
            <Scale className="h-5 w-5 text-amber-400" />
          </div>
          <span className="font-display text-lg font-bold text-blue-900">Legal<span className="text-amber-500">Connect</span></span>
        </Link>
        {role === 'admin' && (
          <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-amber-700">Admin</span>
        )}
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-blue-900 text-white'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-900'
              }`}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 pt-4">
        <div className="mb-3 flex items-center gap-3 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-900 text-sm font-semibold text-white">
            {session?.user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900">{session?.user?.name ?? 'Account'}</p>
            <p className="truncate text-xs text-gray-500">{session?.user?.email ?? ''}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-md lg:hidden"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-gray-200 bg-white p-4 transition-transform lg:static lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <NavContent />
      </aside>
    </>
  );
}
