'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star, MapPin, Briefcase, ArrowLeft, User, Globe, Phone, Mail, Building, Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LawyerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [lawyer, setLawyer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLawyer = async () => {
      try {
        const res = await fetch(`/api/lawyers/${params?.id}`);
        const data = await res.json();
        setLawyer(data);
      } catch (err) {
        console.error('Failed to fetch lawyer:', err);
      } finally {
        setLoading(false);
      }
    };
    if (params?.id) fetchLawyer();
  }, [params?.id]);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-blue-900" /></div>;
  if (!lawyer) return <div className="py-20 text-center"><p className="text-gray-500">Lawyer not found</p></div>;

  const profile = lawyer?.lawyerProfile;
  const areas: string[] = Array.isArray(profile?.practiceAreas) ? profile.practiceAreas : [];
  const languages: string[] = Array.isArray(profile?.languagesSpoken) ? profile.languagesSpoken : ['English'];

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-blue-950 to-blue-800 py-16">
        <div className="mx-auto max-w-[1200px] px-4">
          <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-sm text-blue-200 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <div className="flex flex-col items-center gap-6 md:flex-row">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-800 ring-4 ring-amber-400/30">
              {profile?.profilePhotoUrl ? (
                <div className="relative h-24 w-24 overflow-hidden rounded-full">
                  <Image src={profile.profilePhotoUrl} alt={lawyer?.name ?? ''} fill className="object-cover" />
                </div>
              ) : (
                <User className="h-12 w-12 text-blue-200" />
              )}
            </div>
            <div className="text-center md:text-left">
              <h1 className="font-display text-3xl font-bold text-white">{lawyer?.name ?? 'Unknown'}</h1>
              <p className="mt-1 text-blue-200">{profile?.lawFirm ?? 'Independent Lawyer'}</p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-sm text-blue-200/80 md:justify-start">
                <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{profile?.rating?.toFixed?.(1) ?? '5.0'} rating</span>
                <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" />{profile?.yearsExperience ?? 0} years</span>
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{[lawyer?.city, lawyer?.state, lawyer?.country].filter(Boolean).join(', ')}</span>
                <span className="flex items-center gap-1"><Shield className="h-4 w-4 text-green-400" />Verified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            {profile?.bio && (
              <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="mb-3 font-display text-lg font-semibold text-blue-900">About</h2>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600">{profile.bio}</p>
              </div>
            )}

            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-display text-lg font-semibold text-blue-900">Practice Areas</h2>
              <div className="flex flex-wrap gap-2">
                {areas.map((a: string, i: number) => (
                  <span key={i} className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">{a}</span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-display text-lg font-semibold text-blue-900">Professional Details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><p className="text-xs text-gray-400">Bar Registration</p><p className="text-sm font-medium text-gray-700">{profile?.barRegistrationNumber ?? 'On file'}</p></div>
                <div><p className="text-xs text-gray-400">Cases Completed</p><p className="text-sm font-medium text-gray-700">{profile?.totalCasesCompleted ?? 0}</p></div>
                <div><p className="text-xs text-gray-400">Languages</p><p className="text-sm font-medium text-gray-700">{languages.join(', ')}</p></div>
                {profile?.officeAddress && <div><p className="text-xs text-gray-400">Office</p><p className="text-sm font-medium text-gray-700">{profile.officeAddress}</p></div>}
              </div>
            </div>
          </div>

          <div>
            <div className="sticky top-24 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              {profile?.consultationFee && (
                <div className="mb-4 text-center">
                  <p className="text-sm text-gray-500">Consultation Fee</p>
                  <p className="text-3xl font-bold text-blue-900">₦{Number(profile.consultationFee).toLocaleString()}</p>
                </div>
              )}
              <Button className="w-full bg-blue-900 text-white hover:bg-blue-800" size="lg" onClick={() => router.push('/auth/register?role=client')}>
                Contact Lawyer
              </Button>
              <p className="mt-3 text-center text-xs text-gray-400">Create an account to connect with this lawyer</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
