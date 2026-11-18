'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase, Star, CheckCircle, Clock, AlertCircle,
  Loader2, TrendingUp, User as UserIcon, MapPin,
  ShieldCheck, ShieldAlert, Award, FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type MatchedCase = {
  recommendationId: string;
  rank: number;
  matchPercentage: number;
  matchReason: string;
  createdAt: string;
  case: {
    id: string;
    title: string;
    description: string;
    legalCategory: string;
    urgencyLevel: string;
    budgetRange?: string;
    status: string;
    city?: string;
    state?: string;
    createdAt: string;
    client?: { name?: string; city?: string; state?: string };
  };
};

type Stats = {
  totalMatches: number;
  topMatches: number;
  profileCompleteness: number;
  verificationStatus: string;
  rating: number;
  totalCasesCompleted: number;
};

type Profile = {
  bio?: string;
  lawFirm?: string;
  barRegistrationNumber?: string;
  practiceAreas?: string[];
  consultationFee?: number;
  officeAddress?: string;
};

const urgencyColors: Record<string, string> = {
  'Critical': 'bg-red-100 text-red-700',
  'High': 'bg-orange-100 text-orange-700',
  'Normal': 'bg-blue-100 text-blue-700',
  'Low': 'bg-gray-100 text-gray-600',
};

export default function LawyerDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [matchedCases, setMatchedCases] = useState<MatchedCase[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'top'>('all');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('/api/lawyer/dashboard');
        const data = await res.json();
        setStats(data?.stats ?? null);
        setProfile(data?.profile ?? null);
        setMatchedCases(data?.matchedCases ?? []);
      } catch (err) {
        console.error('Failed to fetch lawyer dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
      </div>
    );
  }

  const displayedCases =
    activeTab === 'top'
      ? matchedCases.filter((c) => c.rank === 1)
      : matchedCases;

  const isVerified = stats?.verificationStatus === 'approved';
  const isPending = stats?.verificationStatus === 'pending';
  const isRejected = stats?.verificationStatus === 'rejected';

  const statCards = [
    {
      label: 'Total Matches',
      value: stats?.totalMatches ?? 0,
      icon: Briefcase,
      color: 'text-blue-900',
      bg: 'bg-blue-50',
    },
    {
      label: '#1 Ranked Matches',
      value: stats?.topMatches ?? 0,
      icon: Award,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Rating',
      value: `${(stats?.rating ?? 5).toFixed(1)} / 5`,
      icon: Star,
      color: 'text-green-700',
      bg: 'bg-green-50',
    },
    {
      label: 'Cases Completed',
      value: stats?.totalCasesCompleted ?? 0,
      icon: CheckCircle,
      color: 'text-purple-700',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-blue-900">Lawyer Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Your matched cases and profile overview</p>
        </div>
        <Link href="/dashboard/profile">
          <Button variant="outline" size="sm" className="border-blue-200 text-blue-900 hover:bg-blue-50">
            Edit Profile
          </Button>
        </Link>
      </div>

      {/* Verification Banner */}
      {!isVerified && (
        <div
          className={`flex items-start gap-3 rounded-xl p-4 ${
            isPending
              ? 'border border-amber-200 bg-amber-50'
              : 'border border-red-200 bg-red-50'
          }`}
        >
          {isPending ? (
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          ) : (
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          )}
          <div>
            <p className={`text-sm font-semibold ${isPending ? 'text-amber-800' : 'text-red-800'}`}>
              {isPending ? 'Profile Pending Verification' : 'Profile Not Verified'}
            </p>
            <p className={`mt-0.5 text-xs ${isPending ? 'text-amber-700' : 'text-red-700'}`}>
              {isPending
                ? 'Your profile is under review by our admin team. You will be matched with cases once approved.'
                : 'Your profile was not approved. Please update your credentials and contact support.'}
            </p>
          </div>
        </div>
      )}

      {isVerified && (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
          <ShieldCheck className="h-5 w-5 shrink-0 text-green-600" />
          <p className="text-sm font-medium text-green-800">Your profile is verified and active on Legal Connect.</p>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s, i) => (
          <div key={i} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${s.bg}`}>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="mt-0.5 text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Profile Completeness */}
      {(stats?.profileCompleteness ?? 100) < 100 && (
        <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-900" />
              <span className="text-sm font-semibold text-blue-900">Profile Completeness</span>
            </div>
            <span className="text-sm font-bold text-blue-900">{stats?.profileCompleteness ?? 0}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-blue-900 transition-all duration-500"
              style={{ width: `${stats?.profileCompleteness ?? 0}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Complete your profile to get more case matches.{' '}
            <Link href="/dashboard/profile" className="font-medium text-blue-700 hover:underline">
              Update now →
            </Link>
          </p>
        </div>
      )}

      {/* Matched Cases */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-blue-900">Matched Cases</h2>
          <div className="flex gap-1 rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`rounded px-3 py-1 text-xs font-medium transition ${
                activeTab === 'all' ? 'bg-blue-900 text-white' : 'text-gray-500 hover:text-blue-900'
              }`}
            >
              All ({matchedCases.length})
            </button>
            <button
              onClick={() => setActiveTab('top')}
              className={`rounded px-3 py-1 text-xs font-medium transition ${
                activeTab === 'top' ? 'bg-blue-900 text-white' : 'text-gray-500 hover:text-blue-900'
              }`}
            >
              Top Ranked ({matchedCases.filter((c) => c.rank === 1).length})
            </button>
          </div>
        </div>

        {displayedCases.length === 0 ? (
          <div className="rounded-xl border border-gray-100 bg-white py-16 text-center shadow-sm">
            <Briefcase className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <p className="text-sm text-gray-500">No matched cases yet</p>
            <p className="mt-1 text-xs text-gray-400">
              {isVerified
                ? 'Cases matching your practice areas will appear here as clients submit them.'
                : 'You will be matched with cases once your profile is verified.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedCases.map((rec) => (
              <div
                key={rec.recommendationId}
                className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-blue-900">{rec.case.title}</h3>
                      {rec.rank === 1 && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                          #1 Match
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="rounded-full bg-blue-50 px-2.5 py-0.5 font-medium text-blue-700">
                        {rec.case.legalCategory}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 font-medium ${urgencyColors[rec.case.urgencyLevel] ?? 'bg-gray-100 text-gray-600'}`}
                      >
                        {rec.case.urgencyLevel}
                      </span>
                      {rec.case.city && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {rec.case.city}, {rec.case.state}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-bold text-green-700">
                      {rec.matchPercentage}% Match
                    </span>
                    <span className="text-xs text-gray-400">Rank #{rec.rank}</span>
                  </div>
                </div>

                <p className="mt-3 line-clamp-2 text-sm text-gray-500">{rec.case.description}</p>

                {rec.matchReason && (
                  <div className="mt-3 rounded-lg bg-amber-50 p-3">
                    <p className="text-xs text-amber-700">
                      <span className="font-semibold">Why you matched: </span>
                      {rec.matchReason}
                    </p>
                  </div>
                )}

                {rec.case.client && (
                  <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <UserIcon className="h-3.5 w-3.5" />
                      <span>
                        {rec.case.client.name ?? 'Client'}{' '}
                        {rec.case.client.city && `· ${rec.case.client.city}, ${rec.case.client.state}`}
                      </span>
                    </div>
                    {rec.case.budgetRange && (
                      <span className="text-xs text-gray-400">Budget: {rec.case.budgetRange}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
