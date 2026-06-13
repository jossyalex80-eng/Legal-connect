'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Clock, CheckCircle, Loader2, Briefcase, PlusCircle, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MyCasesPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
    submitted: { icon: Clock, color: 'bg-blue-50 text-blue-700', label: 'Submitted' },
    analyzing: { icon: Brain, color: 'bg-amber-50 text-amber-700', label: 'AI Analyzing' },
    recommended: { icon: CheckCircle, color: 'bg-green-50 text-green-700', label: 'Matched' },
    in_progress: { icon: Briefcase, color: 'bg-purple-50 text-purple-700', label: 'In Progress' },
    completed: { icon: CheckCircle, color: 'bg-gray-50 text-gray-700', label: 'Completed' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-blue-900">My Cases</h1>
          <p className="mt-1 text-sm text-gray-500">Track and manage all your submitted cases</p>
        </div>
        <Link href="/dashboard/submit-case">
          <Button className="bg-blue-900 text-white hover:bg-blue-800" size="sm">
            <PlusCircle className="mr-2 h-4 w-4" /> New Case
          </Button>
        </Link>
      </div>

      {(cases?.length ?? 0) === 0 ? (
        <div className="rounded-xl border border-gray-100 bg-white py-20 text-center shadow-sm">
          <FileText className="mx-auto mb-3 h-12 w-12 text-gray-300" />
          <p className="text-gray-500">No cases submitted yet</p>
          <Link href="/dashboard/submit-case">
            <Button className="mt-4 bg-blue-900 text-white hover:bg-blue-800" size="sm">
              Submit Your First Case
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {cases.map((c: any) => {
            const config = statusConfig[c?.status] ?? statusConfig.submitted;
            const StatusIcon = config.icon;
            const recCount = c?.recommendations?.length ?? 0;
            return (
              <Link key={c?.id} href={`/dashboard/my-cases/${c?.id}`}>
                <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-blue-900">{c?.title ?? 'Untitled'}</h3>
                      <p className="mt-1 text-sm text-gray-500">{c?.legalCategory ?? ''} • {c?.urgencyLevel ?? 'Normal'}</p>
                      <p className="mt-2 line-clamp-2 text-sm text-gray-400">{c?.description ?? ''}</p>
                    </div>
                    <span className={`ml-4 flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${config.color}`}>
                      <StatusIcon className="h-3.5 w-3.5" />
                      {config.label}
                    </span>
                  </div>
                  {recCount > 0 && (
                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-xs text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      {recCount} lawyer{recCount > 1 ? 's' : ''} recommended
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
