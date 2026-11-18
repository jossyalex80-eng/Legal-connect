'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  UserCheck, Shield, ShieldAlert, ShieldCheck, Loader2,
  MapPin, Star, Briefcase, CheckCircle, XCircle, Clock,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

type LawyerUser = {
  id: string;
  name?: string;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
  country?: string;
  createdAt: string;
  lawyerProfile?: {
    id: string;
    barRegistrationNumber?: string;
    lawFirm?: string;
    yearsExperience?: number;
    practiceAreas?: string[];
    bio?: string;
    consultationFee?: number;
    rating?: number;
    totalCasesCompleted?: number;
    verificationStatus: string;
  };
};

const statusConfig: Record<string, { label: string; icon: typeof ShieldCheck; color: string; bg: string }> = {
  pending: { label: 'Pending', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  approved: { label: 'Approved', icon: ShieldCheck, color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
  rejected: { label: 'Rejected', icon: ShieldAlert, color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
};

export default function AdminLawyersPage() {
  const [loading, setLoading] = useState(true);
  const [lawyers, setLawyers] = useState<LawyerUser[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [search, setSearch] = useState('');
  const [verifying, setVerifying] = useState<string | null>(null);

  const fetchLawyers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.set('status', filter);
      const res = await fetch(`/api/admin/lawyers?${params.toString()}`);
      const data = await res.json();
      setLawyers(data?.lawyers ?? []);
    } catch (err) {
      console.error('Failed to fetch lawyers:', err);
      toast.error('Failed to load lawyer list');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchLawyers();
  }, [fetchLawyers]);

  const handleVerify = async (lawyerId: string, action: 'approve' | 'reject') => {
    setVerifying(lawyerId);
    try {
      const res = await fetch(`/api/admin/lawyers/${lawyerId}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(
          action === 'approve' ? 'Lawyer profile approved!' : 'Lawyer profile rejected.'
        );
        // Update in-place without full reload
        setLawyers((prev) =>
          prev.map((l) =>
            l.id === lawyerId && l.lawyerProfile
              ? { ...l, lawyerProfile: { ...l.lawyerProfile, verificationStatus: data.verificationStatus } }
              : l
          )
        );
      } else {
        toast.error(data?.error ?? 'Action failed');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setVerifying(null);
    }
  };

  const filtered = lawyers.filter((l) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      l.name?.toLowerCase().includes(q) ||
      l.email?.toLowerCase().includes(q) ||
      l.lawyerProfile?.barRegistrationNumber?.toLowerCase().includes(q) ||
      l.lawyerProfile?.lawFirm?.toLowerCase().includes(q)
    );
  });

  const tabs: Array<{ key: typeof filter; label: string }> = [
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
    { key: 'all', label: 'All' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-blue-900">Lawyer Verification</h1>
        <p className="mt-1 text-sm text-gray-500">Review and verify lawyer profiles before they go live</p>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`rounded px-3 py-1.5 text-xs font-medium transition ${
                filter === t.key ? 'bg-blue-900 text-white' : 'text-gray-500 hover:text-blue-900'
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
            placeholder="Search by name, email, bar no."
            className="pl-9"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-gray-100 bg-white py-16 text-center shadow-sm">
          <UserCheck className="mx-auto mb-3 h-10 w-10 text-gray-300" />
          <p className="text-sm text-gray-500">No lawyers found</p>
          {filter === 'pending' && (
            <p className="mt-1 text-xs text-gray-400">No lawyers are waiting for verification.</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((lawyer) => {
            const profile = lawyer.lawyerProfile;
            const vs = profile?.verificationStatus ?? 'pending';
            const sc = statusConfig[vs] ?? statusConfig.pending;
            const StatusIcon = sc.icon;
            const isVerifyingThis = verifying === lawyer.id;
            const areas = Array.isArray(profile?.practiceAreas) ? (profile.practiceAreas as string[]) : [];

            return (
              <div key={lawyer.id} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  {/* Lawyer Info */}
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-base font-bold text-blue-900">
                      {(lawyer.name ?? lawyer.email).charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-blue-900">{lawyer.name ?? '—'}</h3>
                        <span className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${sc.bg} ${sc.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {sc.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{lawyer.email}</p>
                      {lawyer.phone && <p className="text-xs text-gray-400">{lawyer.phone}</p>}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {vs === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        disabled={isVerifyingThis}
                        onClick={() => handleVerify(lawyer.id, 'approve')}
                        className="bg-green-600 text-white hover:bg-green-700"
                      >
                        {isVerifyingThis ? (
                          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                        )}
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isVerifyingThis}
                        onClick={() => handleVerify(lawyer.id, 'reject')}
                        className="border-red-200 text-red-700 hover:bg-red-50"
                      >
                        <XCircle className="mr-1.5 h-3.5 w-3.5" />
                        Reject
                      </Button>
                    </div>
                  )}

                  {vs === 'approved' && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isVerifyingThis}
                      onClick={() => handleVerify(lawyer.id, 'reject')}
                      className="border-red-200 text-red-700 hover:bg-red-50"
                    >
                      <XCircle className="mr-1.5 h-3.5 w-3.5" />
                      Revoke
                    </Button>
                  )}

                  {vs === 'rejected' && (
                    <Button
                      size="sm"
                      disabled={isVerifyingThis}
                      onClick={() => handleVerify(lawyer.id, 'approve')}
                      className="bg-green-600 text-white hover:bg-green-700"
                    >
                      <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                      Re-approve
                    </Button>
                  )}
                </div>

                {/* Profile Details */}
                {profile && (
                  <div className="mt-4 grid gap-3 border-t border-gray-100 pt-4 sm:grid-cols-2 lg:grid-cols-3">
                    {profile.barRegistrationNumber && (
                      <div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Bar Number</p>
                        <p className="mt-0.5 text-sm font-mono text-gray-700">{profile.barRegistrationNumber}</p>
                      </div>
                    )}
                    {profile.lawFirm && (
                      <div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Law Firm</p>
                        <p className="mt-0.5 text-sm text-gray-700">{profile.lawFirm}</p>
                      </div>
                    )}
                    {lawyer.state && (
                      <div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Location</p>
                        <p className="mt-0.5 flex items-center gap-1 text-sm text-gray-700">
                          <MapPin className="h-3.5 w-3.5" />
                          {lawyer.city && `${lawyer.city}, `}{lawyer.state}
                        </p>
                      </div>
                    )}
                    {profile.yearsExperience !== undefined && profile.yearsExperience > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Experience</p>
                        <p className="mt-0.5 text-sm text-gray-700">{profile.yearsExperience} years</p>
                      </div>
                    )}
                    {profile.consultationFee && (
                      <div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Fee</p>
                        <p className="mt-0.5 text-sm text-gray-700">₦{profile.consultationFee.toLocaleString()}</p>
                      </div>
                    )}
                    {profile.rating && (
                      <div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Rating</p>
                        <p className="mt-0.5 flex items-center gap-1 text-sm text-gray-700">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          {profile.rating}/5
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {areas.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {areas.map((area) => (
                      <span key={area} className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                        {area}
                      </span>
                    ))}
                  </div>
                )}

                {profile?.bio && (
                  <p className="mt-3 line-clamp-2 text-xs text-gray-500">{profile.bio}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
