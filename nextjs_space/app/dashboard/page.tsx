'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileText, PlusCircle, Users, ArrowRight, Briefcase, Clock, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const role = (session?.user as any)?.role ?? 'client';

  // Role-based redirect: lawyers and admins have dedicated dashboard pages
  useEffect(() => {
    if (status === 'loading') return;
    if (role === 'admin') {
      router.replace('/dashboard/admin');
    } else if (role === 'lawyer') {
      router.replace('/dashboard/lawyer');
    }
  }, [role, status, router]);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await fetch('/api/cases');
        const data = await res.json();
        setCases(data?.cases ?? []);
      } catch (err) {
        console.error('Failed to fetch cases:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

  const statusCounts = {
    submitted: (cases ?? []).filter((c: any) => c?.status === 'submitted')?.length ?? 0,
    analyzing: (cases ?? []).filter((c: any) => c?.status === 'analyzing')?.length ?? 0,
    recommended: (cases ?? []).filter((c: any) => c?.status === 'recommended')?.length ?? 0,
    total: cases?.length ?? 0,
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'analyzing': return <Loader2 className="h-4 w-4 animate-spin text-amber-500" />;
      case 'recommended': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress': return <Briefcase className="h-4 w-4 text-purple-500" />;
      default: return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  const statusLabel = (status: string) => {
    const labels: Record<string, string> = {
      submitted: 'Submitted', analyzing: 'AI Analyzing', recommended: 'Lawyers Recommended',
      in_progress: 'In Progress', completed: 'Completed',
    };
    return labels[status] ?? status;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-blue-900">
          Welcome back, {session?.user?.name?.split(' ')?.[0] ?? 'there'}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {role === 'lawyer' ? 'Manage your case matches and profile' : 'Manage your cases and find lawyers'}
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Cases', value: statusCounts.total, icon: FileText, color: 'bg-blue-50 text-blue-900' },
          { label: 'Submitted', value: statusCounts.submitted, icon: Clock, color: 'bg-amber-50 text-amber-700' },
          { label: 'Analyzing', value: statusCounts.analyzing, icon: AlertTriangle, color: 'bg-orange-50 text-orange-700' },
          { label: 'Matched', value: statusCounts.recommended, icon: CheckCircle, color: 'bg-green-50 text-green-700' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-blue-900">{stat.value}</p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      {role === 'client' && (
        <div className="mb-8 flex flex-wrap gap-3">
          <Link href="/dashboard/submit-case">
            <Button className="bg-blue-900 text-white hover:bg-blue-800">
              <PlusCircle className="mr-2 h-4 w-4" /> Submit New Case
            </Button>
          </Link>
          <Link href="/lawyers">
            <Button variant="outline" className="border-blue-200 text-blue-900">
              <Users className="mr-2 h-4 w-4" /> Browse Lawyers
            </Button>
          </Link>
        </div>
      )}

      {/* Recent Cases */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <h2 className="font-display text-lg font-semibold text-blue-900">Recent Cases</h2>
          <Link href={role === 'lawyer' ? '/dashboard/case-matches' : '/dashboard/my-cases'} className="text-sm text-blue-600 hover:text-blue-700">
            View All <ArrowRight className="ml-1 inline h-4 w-4" />
          </Link>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
          </div>
        ) : (cases?.length ?? 0) === 0 ? (
          <div className="py-16 text-center">
            <FileText className="mx-auto mb-3 h-12 w-12 text-gray-300" />
            <p className="text-gray-500">No cases yet</p>
            {role === 'client' && (
              <Link href="/dashboard/submit-case">
                <Button className="mt-4 bg-blue-900 text-white hover:bg-blue-800" size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" /> Submit Your First Case
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {(cases ?? []).slice(0, 5).map((c: any) => (
              <Link
                key={c?.id}
                href={role === 'lawyer' ? '/dashboard/case-matches' : `/dashboard/my-cases/${c?.id}`}
                className="flex items-center gap-4 px-5 py-4 transition hover:bg-gray-50"
              >
                {statusIcon(c?.status)}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">{c?.title ?? 'Untitled Case'}</p>
                  <p className="text-xs text-gray-500">{c?.legalCategory ?? 'Uncategorized'}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  c?.status === 'recommended' ? 'bg-green-50 text-green-700' :
                  c?.status === 'analyzing' ? 'bg-amber-50 text-amber-700' :
                  'bg-blue-50 text-blue-700'
                }`}>
                  {statusLabel(c?.status)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
