'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Scale, Mail, Lock, User, Phone, MapPin, Building, Briefcase, Eye, EyeOff, Loader2, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { PRACTICE_AREAS } from '@/lib/constants';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState<'client' | 'lawyer'>('client');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '',
    country: 'Nigeria', state: '', city: '',
    lawFirm: '', barRegistrationNumber: '', yearsExperience: '',
    bio: '', consultationFee: '',
  });

  useEffect(() => {
    const r = searchParams?.get('role');
    if (r === 'lawyer') setRole('lawyer');
  }, [searchParams]);

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
    if (!form.fullName || !form.email || !form.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (role === 'lawyer' && selectedAreas.length === 0) {
      toast.error('Please select at least one practice area');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          role,
          practiceAreas: selectedAreas,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? 'Registration failed');
        setLoading(false);
        return;
      }

      // Auto login after signup
      const loginResult = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (loginResult?.ok) {
        toast.success('Account created successfully!');
        router.replace('/dashboard');
      } else {
        toast.success('Account created! Please sign in.');
        router.replace('/auth/login');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg">
      <div className="max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500">
              <Scale className="h-6 w-6 text-blue-950" />
            </div>
            <span className="font-display text-xl font-bold text-white">Legal<span className="text-amber-400">Connect</span></span>
          </Link>
          <h1 className="mt-4 font-display text-2xl font-bold text-white">Create Account</h1>
        </div>

        {/* Role Toggle */}
        <div className="mb-6 flex rounded-xl bg-white/10 p-1">
          <button
            onClick={() => setRole('client')}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition ${role === 'client' ? 'bg-amber-500 text-blue-950' : 'text-blue-200 hover:text-white'}`}
          >
            Client
          </button>
          <button
            onClick={() => setRole('lawyer')}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition ${role === 'lawyer' ? 'bg-amber-500 text-blue-950' : 'text-blue-200 hover:text-white'}`}
          >
            Lawyer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-blue-100">Full Name *</Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input value={form.fullName} onChange={(e: any) => updateForm('fullName', e?.target?.value ?? '')} placeholder="Your full name" className="border-white/20 bg-white/10 pl-10 text-white placeholder:text-gray-400" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-blue-100">Email *</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input type="email" value={form.email} onChange={(e: any) => updateForm('email', e?.target?.value ?? '')} placeholder="you@example.com" className="border-white/20 bg-white/10 pl-10 text-white placeholder:text-gray-400" />
              </div>
            </div>
            <div>
              <Label className="text-blue-100">Phone</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input value={form.phone} onChange={(e: any) => updateForm('phone', e?.target?.value ?? '')} placeholder="+234 ..." className="border-white/20 bg-white/10 pl-10 text-white placeholder:text-gray-400" />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label className="text-blue-100">Country</Label>
              <Input value={form.country} onChange={(e: any) => updateForm('country', e?.target?.value ?? '')} placeholder="Nigeria" className="mt-1 border-white/20 bg-white/10 text-white placeholder:text-gray-400" />
            </div>
            <div>
              <Label className="text-blue-100">State</Label>
              <Input value={form.state} onChange={(e: any) => updateForm('state', e?.target?.value ?? '')} placeholder="Lagos" className="mt-1 border-white/20 bg-white/10 text-white placeholder:text-gray-400" />
            </div>
            <div>
              <Label className="text-blue-100">City</Label>
              <Input value={form.city} onChange={(e: any) => updateForm('city', e?.target?.value ?? '')} placeholder="Lagos" className="mt-1 border-white/20 bg-white/10 text-white placeholder:text-gray-400" />
            </div>
          </div>

          {role === 'lawyer' && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-blue-100">Law Firm</Label>
                  <div className="relative mt-1">
                    <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input value={form.lawFirm} onChange={(e: any) => updateForm('lawFirm', e?.target?.value ?? '')} placeholder="Firm name" className="border-white/20 bg-white/10 pl-10 text-white placeholder:text-gray-400" />
                  </div>
                </div>
                <div>
                  <Label className="text-blue-100">Bar Registration No.</Label>
                  <div className="relative mt-1">
                    <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input value={form.barRegistrationNumber} onChange={(e: any) => updateForm('barRegistrationNumber', e?.target?.value ?? '')} placeholder="BAR-XXXXX" className="border-white/20 bg-white/10 pl-10 text-white placeholder:text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-blue-100">Years of Experience</Label>
                  <div className="relative mt-1">
                    <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input type="number" min="0" value={form.yearsExperience} onChange={(e: any) => updateForm('yearsExperience', e?.target?.value ?? '')} placeholder="5" className="border-white/20 bg-white/10 pl-10 text-white placeholder:text-gray-400" />
                  </div>
                </div>
                <div>
                  <Label className="text-blue-100">Consultation Fee (₦)</Label>
                  <Input type="number" min="0" value={form.consultationFee} onChange={(e: any) => updateForm('consultationFee', e?.target?.value ?? '')} placeholder="50000" className="mt-1 border-white/20 bg-white/10 text-white placeholder:text-gray-400" />
                </div>
              </div>
              <div>
                <Label className="text-blue-100">Practice Areas *</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {PRACTICE_AREAS.map((area) => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => toggleArea(area)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                        selectedAreas.includes(area)
                          ? 'bg-amber-500 text-blue-950'
                          : 'bg-white/10 text-blue-200 hover:bg-white/20'
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-blue-100">Password *</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e: any) => updateForm('password', e?.target?.value ?? '')}
                  placeholder="Min 6 characters"
                  className="border-white/20 bg-white/10 pl-10 pr-10 text-white placeholder:text-gray-400"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <Label className="text-blue-100">Confirm Password *</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input type="password" value={form.confirmPassword} onChange={(e: any) => updateForm('confirmPassword', e?.target?.value ?? '')} placeholder="Confirm" className="border-white/20 bg-white/10 pl-10 text-white placeholder:text-gray-400" />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-amber-500 text-blue-950 hover:bg-amber-400">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? 'Creating Account...' : `Register as ${role === 'lawyer' ? 'Lawyer' : 'Client'}`}
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/20" />
          <span className="text-xs text-blue-200/50">OR</span>
          <div className="h-px flex-1 bg-white/20" />
        </div>

        <Button
          variant="outline"
          className="w-full border-white/20 bg-white/10 text-white hover:bg-white/20"
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
        >
          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </Button>

        <p className="mt-4 text-center text-sm text-blue-200/60">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-amber-400 hover:text-amber-300">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
