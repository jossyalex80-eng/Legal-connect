'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { User, Save, Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { PRACTICE_AREAS } from '@/lib/constants';

export default function ProfilePage() {
  const { data: session } = useSession() || {};
  const role = (session?.user as any)?.role ?? 'client';
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

  const [form, setForm] = useState({
    name: '', phone: '', country: '', state: '', city: '',
    lawFirm: '', barRegistrationNumber: '', yearsExperience: '',
    bio: '', consultationFee: '', officeAddress: '', languagesSpoken: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        const data = await res.json();
        setForm({
          name: data?.name ?? '',
          phone: data?.phone ?? '',
          country: data?.country ?? '',
          state: data?.state ?? '',
          city: data?.city ?? '',
          lawFirm: data?.lawyerProfile?.lawFirm ?? '',
          barRegistrationNumber: data?.lawyerProfile?.barRegistrationNumber ?? '',
          yearsExperience: data?.lawyerProfile?.yearsExperience?.toString?.() ?? '',
          bio: data?.lawyerProfile?.bio ?? '',
          consultationFee: data?.lawyerProfile?.consultationFee?.toString?.() ?? '',
          officeAddress: data?.lawyerProfile?.officeAddress ?? '',
          languagesSpoken: Array.isArray(data?.lawyerProfile?.languagesSpoken)
            ? data.lawyerProfile.languagesSpoken.join(', ')
            : 'English',
        });
        const areas = data?.lawyerProfile?.practiceAreas;
        if (Array.isArray(areas)) setSelectedAreas(areas);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArea = (area: string) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          practiceAreas: selectedAreas,
          languagesSpoken: (form.languagesSpoken ?? '').split(',').map((l: string) => l?.trim()).filter(Boolean),
        }),
      });
      if (res.ok) {
        toast.success('Profile updated successfully!');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-blue-900" /></div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-blue-900">Profile Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Update your personal and professional information</p>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Full Name</Label>
              <Input value={form.name} onChange={(e: any) => updateForm('name', e?.target?.value ?? '')} className="mt-1" />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e: any) => updateForm('phone', e?.target?.value ?? '')} className="mt-1" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label>Country</Label>
              <Input value={form.country} onChange={(e: any) => updateForm('country', e?.target?.value ?? '')} className="mt-1" />
            </div>
            <div>
              <Label>State</Label>
              <Input value={form.state} onChange={(e: any) => updateForm('state', e?.target?.value ?? '')} className="mt-1" />
            </div>
            <div>
              <Label>City</Label>
              <Input value={form.city} onChange={(e: any) => updateForm('city', e?.target?.value ?? '')} className="mt-1" />
            </div>
          </div>

          {role === 'lawyer' && (
            <>
              <div className="border-t border-gray-100 pt-6">
                <h3 className="mb-4 font-display text-lg font-semibold text-blue-900">Professional Information</h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Law Firm</Label>
                  <Input value={form.lawFirm} onChange={(e: any) => updateForm('lawFirm', e?.target?.value ?? '')} className="mt-1" />
                </div>
                <div>
                  <Label>Bar Registration Number</Label>
                  <Input value={form.barRegistrationNumber} onChange={(e: any) => updateForm('barRegistrationNumber', e?.target?.value ?? '')} className="mt-1" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label>Years of Experience</Label>
                  <Input type="number" min="0" value={form.yearsExperience} onChange={(e: any) => updateForm('yearsExperience', e?.target?.value ?? '')} className="mt-1" />
                </div>
                <div>
                  <Label>Consultation Fee (₦)</Label>
                  <Input type="number" min="0" value={form.consultationFee} onChange={(e: any) => updateForm('consultationFee', e?.target?.value ?? '')} className="mt-1" />
                </div>
                <div>
                  <Label>Languages (comma separated)</Label>
                  <Input value={form.languagesSpoken} onChange={(e: any) => updateForm('languagesSpoken', e?.target?.value ?? '')} placeholder="English, Yoruba" className="mt-1" />
                </div>
              </div>

              <div>
                <Label>Office Address</Label>
                <Input value={form.officeAddress} onChange={(e: any) => updateForm('officeAddress', e?.target?.value ?? '')} className="mt-1" />
              </div>

              <div>
                <Label>Bio / About</Label>
                <Textarea value={form.bio} onChange={(e: any) => updateForm('bio', e?.target?.value ?? '')} rows={4} className="mt-1" placeholder="Tell clients about your experience and expertise..." />
              </div>

              <div>
                <Label>Practice Areas</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {PRACTICE_AREAS.map((area) => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => toggleArea(area)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                        selectedAreas.includes(area)
                          ? 'bg-blue-900 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <Button type="submit" disabled={loading} className="bg-blue-900 text-white hover:bg-blue-800">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </div>
    </div>
  );
}
