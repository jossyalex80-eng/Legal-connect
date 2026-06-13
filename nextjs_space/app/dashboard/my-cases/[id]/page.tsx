'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FileText, Clock, CheckCircle, Loader2, Star, MapPin, Briefcase, ArrowLeft, Brain, RotateCw, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function CaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);

  const fetchCase = async () => {
    try {
      const res = await fetch(`/api/cases/${params?.id}`);
      const data = await res.json();
      setCaseData(data?.case ?? null);
    } catch (err) {
      console.error('Failed to fetch case:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params?.id) fetchCase();
  }, [params?.id]);

  const triggerMatching = async () => {
    setMatching(true);
    try {
      const res = await fetch(`/api/cases/${params?.id}/match`, { method: 'POST' });
      if (res.ok && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let partialRead = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          partialRead += decoder.decode(value, { stream: true });
          const lines = partialRead.split('\n');
          partialRead = lines.pop() ?? '';

          for (const line of lines) {
            if (line?.startsWith('data: ')) {
              try {
                const parsed = JSON.parse(line.slice(6));
                if (parsed?.status === 'completed') {
                  toast.success('AI matching complete!');
                  await fetchCase();
                  setMatching(false);
                  return;
                } else if (parsed?.status === 'error') {
                  toast.error(parsed?.message ?? 'Matching failed');
                }
              } catch (e) { /* skip */ }
            }
          }
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData?.error ?? 'Matching failed');
      }
    } catch (err) {
      toast.error('AI matching error');
    } finally {
      setMatching(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-blue-900" /></div>;
  }

  if (!caseData) {
    return <div className="py-20 text-center"><p className="text-gray-500">Case not found</p></div>;
  }

  const recommendations = caseData?.recommendations ?? [];

  return (
    <div>
      <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-blue-900">
        <ArrowLeft className="h-4 w-4" /> Back to Cases
      </button>

      <div className="mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-blue-900">{caseData?.title ?? 'Untitled'}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">{caseData?.legalCategory ?? ''}</span>
              <span>{caseData?.urgencyLevel ?? 'Normal'} Priority</span>
              {caseData?.budgetRange && <span>Budget: {caseData.budgetRange}</span>}
            </div>
          </div>
          {(caseData?.status === 'submitted' || recommendations?.length === 0) && (
            <Button onClick={triggerMatching} disabled={matching} className="bg-amber-500 text-blue-950 hover:bg-amber-400">
              {matching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4" />}
              {matching ? 'AI Matching...' : 'Run AI Matching'}
            </Button>
          )}
        </div>
      </div>

      {/* Case Details */}
      <div className="mb-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-3 font-display text-lg font-semibold text-blue-900">Case Description</h2>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600">{caseData?.description ?? ''}</p>
        <div className="mt-4 grid gap-4 border-t border-gray-100 pt-4 sm:grid-cols-3">
          <div><p className="text-xs text-gray-400">Location</p><p className="text-sm text-gray-700">{[caseData?.city, caseData?.state, caseData?.country].filter(Boolean).join(', ') || 'Not specified'}</p></div>
          <div><p className="text-xs text-gray-400">Consultation</p><p className="text-sm text-gray-700">{caseData?.preferredConsultationMethod ?? 'Any'}</p></div>
          <div><p className="text-xs text-gray-400">Status</p><p className="text-sm font-medium capitalize text-blue-700">{(caseData?.status ?? '').replace('_', ' ')}</p></div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations?.length > 0 && (
        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-blue-900">AI Recommended Lawyers</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {recommendations.map((rec: any, i: number) => {
              const lawyer = rec?.lawyer;
              const profile = rec?.lawyerProfile;
              const matchPct = rec?.matchPercentage ?? 0;
              const areas: string[] = Array.isArray(profile?.practiceAreas) ? profile.practiceAreas : [];

              return (
                <div key={rec?.id ?? i} className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-lg">
                  {/* Match Badge */}
                  <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-4 py-3 text-center">
                    <span className="text-2xl font-bold text-amber-400">{matchPct}%</span>
                    <span className="ml-1 text-sm text-blue-200">Match</span>
                    <div className="mt-1 text-xs text-blue-200/70">Rank #{rec?.rank ?? i + 1}</div>
                  </div>

                  <div className="p-5">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-900">
                        {profile?.profilePhotoUrl ? (
                          <div className="relative h-12 w-12 overflow-hidden rounded-full">
                            <Image src={profile.profilePhotoUrl} alt={lawyer?.name ?? 'Lawyer'} fill className="object-cover" />
                          </div>
                        ) : (
                          <User className="h-6 w-6" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-900">{lawyer?.name ?? 'Unknown'}</h3>
                        <p className="text-xs text-gray-500">{profile?.lawFirm ?? 'Independent'}</p>
                      </div>
                    </div>

                    <div className="mb-3 flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{profile?.rating?.toFixed?.(1) ?? '5.0'}</span>
                      <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{profile?.yearsExperience ?? 0}y exp</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{lawyer?.city ?? lawyer?.state ?? ''}</span>
                    </div>

                    <div className="mb-3 flex flex-wrap gap-1">
                      {areas.slice(0, 3).map((a: string, j: number) => (
                        <span key={j} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">{a}</span>
                      ))}
                    </div>

                    <div className="mb-4 rounded-lg bg-amber-50 p-3">
                      <p className="text-xs font-medium text-amber-800">Why this match:</p>
                      <p className="mt-1 text-xs text-amber-700">{rec?.matchReason ?? 'Good match based on expertise and location'}</p>
                    </div>

                    {profile?.consultationFee && (
                      <p className="mb-3 text-sm font-semibold text-blue-900">₦{Number(profile.consultationFee).toLocaleString()} <span className="text-xs font-normal text-gray-500">consultation</span></p>
                    )}

                    <Link href={`/lawyers/${lawyer?.id}`}>
                      <Button variant="outline" size="sm" className="w-full border-blue-200 text-blue-900">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {matching && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-8 text-center">
          <Loader2 className="mx-auto mb-3 h-10 w-10 animate-spin text-amber-600" />
          <h3 className="font-display text-lg font-semibold text-amber-800">AI is analyzing your case...</h3>
          <p className="mt-2 text-sm text-amber-600">This may take a moment. Our AI is finding the best lawyers for you.</p>
        </div>
      )}
    </div>
  );
}
