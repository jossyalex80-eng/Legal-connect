'use client';

import { useState, useEffect } from 'react';
import { FileText, Clock, Loader2, Star, MapPin, User as UserIcon } from 'lucide-react';

export default function CaseMatchesPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await fetch('/api/cases');
        const data = await res.json();
        setCases(data?.cases ?? []);
      } catch (err) {
        console.error('Failed to fetch case matches:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-blue-900" /></div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-blue-900">Case Matches</h1>
        <p className="mt-1 text-sm text-gray-500">Cases matched to your expertise by our AI system</p>
      </div>

      {(cases?.length ?? 0) === 0 ? (
        <div className="rounded-xl border border-gray-100 bg-white py-20 text-center shadow-sm">
          <FileText className="mx-auto mb-3 h-12 w-12 text-gray-300" />
          <p className="text-gray-500">No case matches yet</p>
          <p className="mt-2 text-sm text-gray-400">When clients submit cases matching your expertise, they will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {cases.map((c: any, i: number) => (
            <div key={c?.id ?? i} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-blue-900">{c?.title ?? 'Untitled'}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">{c?.legalCategory ?? ''}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{c?.urgencyLevel ?? 'Normal'}</span>
                    {c?.city && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{c.city}, {c?.state ?? ''}</span>}
                  </div>
                </div>
                {c?.matchPercentage && (
                  <div className="rounded-full bg-green-50 px-3 py-1 text-sm font-bold text-green-700">
                    {c.matchPercentage}% Match
                  </div>
                )}
              </div>
              <p className="mt-3 line-clamp-3 text-sm text-gray-500">{c?.description ?? ''}</p>
              {c?.matchReason && (
                <div className="mt-3 rounded-lg bg-amber-50 p-3">
                  <p className="text-xs text-amber-700"><strong>Match reason:</strong> {c.matchReason}</p>
                </div>
              )}
              {c?.client && (
                <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3 text-xs text-gray-500">
                  <UserIcon className="h-3.5 w-3.5" />
                  <span>{c.client?.name ?? 'Anonymous'} • {c.client?.city ?? ''}, {c.client?.state ?? ''}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
