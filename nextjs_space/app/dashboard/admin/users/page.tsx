'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Users, Search, Loader2, MapPin, Briefcase,
  ShieldCheck, Clock, ShieldAlert,
} from 'lucide-react';
import { Input } from '@/components/ui/input';

type AdminUser = {
  id: string;
  name?: string;
  email: string;
  role: string;
  phone?: string;
  country?: string;
  state?: string;
  city?: string;
  createdAt: string;
  lawyerProfile?: {
    verificationStatus: string;
    barRegistrationNumber?: string;
    practiceAreas?: string[];
    rating?: number;
  };
  _count: { cases: number };
};

const roleColors: Record<string, string> = {
  client: 'bg-blue-50 text-blue-700 border-blue-200',
  lawyer: 'bg-green-50 text-green-700 border-green-200',
  admin: 'bg-purple-50 text-purple-700 border-purple-200',
};

const verificationIcons: Record<string, { icon: typeof ShieldCheck; color: string }> = {
  approved: { icon: ShieldCheck, color: 'text-green-600' },
  pending: { icon: Clock, color: 'text-amber-500' },
  rejected: { icon: ShieldAlert, color: 'text-red-500' },
};

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roleFilter, setRoleFilter] = useState<'all' | 'client' | 'lawyer'>('all');
  const [search, setSearch] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (roleFilter !== 'all') params.set('role', roleFilter);
      if (search) params.set('search', search);
      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const data = await res.json();
      setUsers(data?.users ?? []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  }, [roleFilter, search]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const tabs: Array<{ key: typeof roleFilter; label: string }> = [
    { key: 'all', label: 'All Users' },
    { key: 'client', label: 'Clients' },
    { key: 'lawyer', label: 'Lawyers' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-blue-900">User Management</h1>
        <p className="mt-1 text-sm text-gray-500">View and manage all registered users</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setRoleFilter(t.key)}
              className={`rounded px-3 py-1.5 text-xs font-medium transition ${
                roleFilter === t.key ? 'bg-blue-900 text-white' : 'text-gray-500 hover:text-blue-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={search}
            onChange={(e: any) => setSearch(e.target.value ?? '')}
            placeholder="Search by name or email"
            className="pl-9"
          />
        </div>
      </div>

      {/* Count */}
      <p className="text-sm text-gray-500">
        {loading ? 'Loading...' : `${users.length} user${users.length !== 1 ? 's' : ''} found`}
      </p>

      {/* Table / Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-xl border border-gray-100 bg-white py-16 text-center shadow-sm">
          <Users className="mx-auto mb-3 h-10 w-10 text-gray-300" />
          <p className="text-sm text-gray-500">No users found</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          {/* Desktop table */}
          <div className="hidden md:block">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100 bg-gray-50 text-xs font-medium text-gray-500">
                <tr>
                  <th className="px-5 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-left">Location</th>
                  <th className="px-4 py-3 text-left">Cases</th>
                  <th className="px-4 py-3 text-left">Verification</th>
                  <th className="px-4 py-3 text-left">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => {
                  const vs = u.lawyerProfile?.verificationStatus;
                  const vi = vs ? verificationIcons[vs] : null;
                  const ViIcon = vi?.icon;
                  return (
                    <tr key={u.id} className="transition hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-900">
                            {(u.name ?? u.email).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{u.name ?? '—'}</p>
                            <p className="text-xs text-gray-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${roleColors[u.role] ?? 'bg-gray-100 text-gray-600'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {u.city || u.state ? (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {u.city && `${u.city}, `}{u.state ?? ''}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-xs text-gray-600">
                          <Briefcase className="h-3 w-3" />
                          {u._count.cases}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {u.role === 'lawyer' && vi && ViIcon ? (
                          <span className={`flex items-center gap-1 text-xs font-medium capitalize ${vi.color}`}>
                            <ViIcon className="h-3.5 w-3.5" />
                            {vs}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{formatDate(u.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="divide-y divide-gray-100 md:hidden">
            {users.map((u) => {
              const vs = u.lawyerProfile?.verificationStatus;
              const vi = vs ? verificationIcons[vs] : null;
              const ViIcon = vi?.icon;
              return (
                <div key={u.id} className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-900">
                        {(u.name ?? u.email).charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-gray-900">{u.name ?? '—'}</p>
                        <p className="truncate text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>
                    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${roleColors[u.role] ?? 'bg-gray-100 text-gray-600'}`}>
                      {u.role}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
                    {(u.city || u.state) && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />{u.city && `${u.city}, `}{u.state}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />{u._count.cases} case{u._count.cases !== 1 ? 's' : ''}
                    </span>
                    {u.role === 'lawyer' && vi && ViIcon && (
                      <span className={`flex items-center gap-1 font-medium capitalize ${vi.color}`}>
                        <ViIcon className="h-3 w-3" />{vs}
                      </span>
                    )}
                    <span>{formatDate(u.createdAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
