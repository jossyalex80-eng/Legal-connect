'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users, Briefcase, UserCheck, AlertCircle,
  Loader2, TrendingUp, CheckCircle, Clock,
  FileText, ChevronRight, Scale,
} from 'lucide-react';

type AdminStats = {
  users: { total: number; clients: number; lawyers: number };
  lawyers: { pending: number; approved: number };
  cases: { total: number; submitted: number; analyzing: number; recommended: number };
  totalRecommendations: number;
  recentCases: Array<{
    id: string;
    title: string;
    legalCategory: string;
    status: string;
    createdAt: string;
    client?: { name?: string; email?: string };
  }>;
  recentUsers: Array<{
    id: string;
    name?: string;
    email: string;
    role: string;
    createdAt: string;
  }>;
};

const statusColors: Record<string, string> = {
  submitted: 'bg-blue-100 text-blue-700',
  analyzing: 'bg-amber-100 text-amber-700',
  recommended: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-600',
};

const roleColors: Record<string, string> = {
  client: 'bg-blue-50 text-blue-700',
  lawyer: 'bg-green-50 text-green-700',
  admin: 'bg-purple-50 text-purple-700',
};

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Users',
      value: stats?.users.total ?? 0,
      sub: `${stats?.users.clients ?? 0} clients · ${stats?.users.lawyers ?? 0} lawyers`,
      icon: Users,
      color: 'text-blue-900',
      bg: 'bg-blue-50',
      href: '/dashboard/admin/users',
    },
    {
      label: 'Pending Verification',
      value: stats?.lawyers.pending ?? 0,
      sub: `${stats?.lawyers.approved ?? 0} approved lawyers`,
      icon: UserCheck,
      color: stats?.lawyers.pending ?? 0 > 0 ? 'text-amber-600' : 'text-green-700',
      bg: stats?.lawyers.pending ?? 0 > 0 ? 'bg-amber-50' : 'bg-green-50',
      href: '/dashboard/admin/lawyers',
    },
    {
      label: 'Total Cases',
      value: stats?.cases.total ?? 0,
      sub: `${stats?.cases.recommended ?? 0} with recommendations`,
      icon: Briefcase,
      color: 'text-purple-700',
      bg: 'bg-purple-50',
      href: null,
    },
    {
      label: 'AI Matches Made',
      value: stats?.totalRecommendations ?? 0,
      sub: `${stats?.cases.analyzing ?? 0} currently analyzing`,
      icon: TrendingUp,
      color: 'text-green-700',
      bg: 'bg-green-50',
      href: null,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-blue-900">Admin Overview</h1>
        <p className="mt-1 text-sm text-gray-500">Platform statistics and activity</p>
      </div>

      {/* Pending lawyer alert */}
      {(stats?.lawyers.pending ?? 0) > 0 && (
        <Link href="/dashboard/admin/lawyers?status=pending">
          <div className="flex cursor-pointer items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 transition hover:bg-amber-100">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800">
                {stats?.lawyers.pending} lawyer{stats?.lawyers.pending !== 1 ? 's' : ''} waiting for verification
              </p>
              <p className="text-xs text-amber-600">Review their credentials and approve or reject their profiles</p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-amber-600" />
          </div>
        </Link>
      )}

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s, i) => {
          const inner = (
            <div
              className={`rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition ${s.href ? 'hover:shadow-md' : ''}`}
            >
              <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${s.bg}`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="mt-0.5 text-sm font-medium text-gray-700">{s.label}</p>
              <p className="mt-0.5 text-xs text-gray-400">{s.sub}</p>
            </div>
          );
          return s.href ? (
            <Link key={i} href={s.href}>
              {inner}
            </Link>
          ) : (
            <div key={i}>{inner}</div>
          );
        })}
      </div>

      {/* Case Status Breakdown */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-display text-base font-semibold text-blue-900">Case Status Breakdown</h2>
        <div className="grid gap-3 sm:grid-cols-4">
          {[
            { label: 'Submitted', value: stats?.cases.submitted ?? 0, icon: FileText, color: 'text-blue-700' },
            { label: 'Analyzing', value: stats?.cases.analyzing ?? 0, icon: Clock, color: 'text-amber-600' },
            { label: 'Recommended', value: stats?.cases.recommended ?? 0, icon: CheckCircle, color: 'text-green-700' },
            {
              label: 'Other',
              value: (stats?.cases.total ?? 0) - (stats?.cases.submitted ?? 0) - (stats?.cases.analyzing ?? 0) - (stats?.cases.recommended ?? 0),
              icon: Scale,
              color: 'text-gray-500',
            },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <item.icon className={`h-5 w-5 shrink-0 ${item.color}`} />
              <div>
                <p className="text-lg font-bold text-gray-900">{Math.max(0, item.value)}</p>
                <p className="text-xs text-gray-500">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Cases */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-display text-base font-semibold text-blue-900">Recent Cases</h2>
          {(stats?.recentCases?.length ?? 0) === 0 ? (
            <p className="py-6 text-center text-sm text-gray-400">No cases yet</p>
          ) : (
            <div className="space-y-3">
              {stats?.recentCases.map((c) => (
                <div key={c.id} className="flex items-start justify-between gap-3 border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{c.title}</p>
                    <p className="text-xs text-gray-500">
                      {c.client?.name ?? 'Unknown client'} · {c.legalCategory}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[c.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-blue-900">Recent Signups</h2>
            <Link href="/dashboard/admin/users" className="text-xs font-medium text-blue-700 hover:underline">
              View all →
            </Link>
          </div>
          {(stats?.recentUsers?.length ?? 0) === 0 ? (
            <p className="py-6 text-center text-sm text-gray-400">No users yet</p>
          ) : (
            <div className="space-y-3">
              {stats?.recentUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between gap-3 border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-900">
                      {(u.name ?? u.email).charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">{u.name ?? '—'}</p>
                      <p className="truncate text-xs text-gray-500">{u.email}</p>
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${roleColors[u.role] ?? 'bg-gray-100 text-gray-600'}`}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
