'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, Star, MapPin, Briefcase, Filter, X, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PRACTICE_AREAS } from '@/lib/constants';

export default function LawyersPage() {
  const [lawyers, setLawyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [practiceArea, setPracticeArea] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchLawyers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (practiceArea) params.set('practiceArea', practiceArea);
      params.set('sortBy', sortBy);
      const res = await fetch(`/api/lawyers?${params.toString()}`);
      const data = await res.json();
      setLawyers(data?.lawyers ?? []);
      setTotal(data?.total ?? 0);
    } catch (err) {
      console.error('Failed to fetch lawyers:', err);
    } finally {
      setLoading(false);
    }
  }, [search, practiceArea, sortBy]);

  useEffect(() => {
    const timer = setTimeout(fetchLawyers, 300);
    return () => clearTimeout(timer);
  }, [fetchLawyers]);

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-950 to-blue-800 py-16">
        <div className="mx-auto max-w-[1200px] px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl font-bold tracking-tight text-white">Find a Lawyer</h1>
            <p className="mx-auto mt-3 max-w-xl text-blue-100/80">Browse our directory of verified legal professionals</p>
            <div className="mx-auto mt-6 max-w-lg">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e?.target?.value ?? '')}
                  placeholder="Search by name, firm, or keyword..."
                  className="w-full rounded-xl border-0 bg-white/10 py-3.5 pl-12 pr-4 text-white placeholder:text-blue-200/50 backdrop-blur-sm focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-10">
        {/* Filters */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="border-gray-200"
          >
            <Filter className="mr-2 h-4 w-4" /> Filters
          </Button>

          <select
            value={practiceArea}
            onChange={(e) => setPracticeArea(e?.target?.value ?? '')}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
          >
            <option value="">All Practice Areas</option>
            {PRACTICE_AREAS.map((area) => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e?.target?.value ?? 'rating')}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
          >
            <option value="rating">Highest Rated</option>
            <option value="experience">Most Experienced</option>
            <option value="fee_low">Lowest Fee</option>
            <option value="newest">Newest</option>
          </select>

          <span className="ml-auto text-sm text-gray-500">{total} lawyer{total !== 1 ? 's' : ''} found</span>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
          </div>
        ) : (lawyers?.length ?? 0) === 0 ? (
          <div className="py-20 text-center">
            <User className="mx-auto mb-3 h-12 w-12 text-gray-300" />
            <p className="text-gray-500">No lawyers found matching your criteria</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lawyers.map((lawyer: any, i: number) => {
              const profile = lawyer?.lawyerProfile;
              const areas: string[] = Array.isArray(profile?.practiceAreas) ? profile.practiceAreas : [];

              return (
                <motion.div
                  key={lawyer?.id ?? i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/lawyers/${lawyer?.id}`}>
                    <div className="group rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-lg">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
                          {profile?.profilePhotoUrl ? (
                            <div className="relative h-14 w-14 overflow-hidden rounded-full">
                              <Image src={profile.profilePhotoUrl} alt={lawyer?.name ?? 'Lawyer'} fill className="object-cover" />
                            </div>
                          ) : (
                            <User className="h-7 w-7 text-blue-900" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-semibold text-blue-900 group-hover:text-amber-600">{lawyer?.name ?? 'Unknown'}</h3>
                          <p className="truncate text-xs text-gray-500">{profile?.lawFirm ?? 'Independent Lawyer'}</p>
                        </div>
                      </div>

                      <div className="mb-3 flex flex-wrap gap-1">
                        {areas.slice(0, 3).map((a: string, j: number) => (
                          <span key={j} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">{a}</span>
                        ))}
                        {areas.length > 3 && (
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">+{areas.length - 3}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{profile?.rating?.toFixed?.(1) ?? '5.0'}</span>
                        <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{profile?.yearsExperience ?? 0}y</span>
                        {lawyer?.city && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{lawyer.city}</span>}
                      </div>

                      {profile?.consultationFee && (
                        <div className="mt-3 border-t border-gray-100 pt-3">
                          <p className="text-sm font-semibold text-blue-900">₦{Number(profile.consultationFee).toLocaleString()} <span className="text-xs font-normal text-gray-500">/ consultation</span></p>
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
