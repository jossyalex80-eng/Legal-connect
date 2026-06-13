'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Message sent successfully!');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error(data?.error ?? 'Failed to send message');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-blue-950 to-blue-800 py-16">
        <div className="mx-auto max-w-[1200px] px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Mail className="mx-auto mb-4 h-12 w-12 text-amber-400" />
            <h1 className="font-display text-4xl font-bold tracking-tight text-white">Contact Us</h1>
            <p className="mx-auto mt-3 max-w-xl text-blue-100/80">Have a question or feedback? We&apos;d love to hear from you.</p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-16">
        <div className="grid gap-12 md:grid-cols-5">
          <div className="md:col-span-3">
            <h2 className="font-display text-2xl font-bold text-blue-900">Send a Message</h2>
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={form.name} onChange={(e: any) => setForm({ ...form, name: e?.target?.value ?? '' })} placeholder="Your name" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e: any) => setForm({ ...form, email: e?.target?.value ?? '' })} placeholder="you@example.com" className="mt-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" value={form.subject} onChange={(e: any) => setForm({ ...form, subject: e?.target?.value ?? '' })} placeholder="What is this about?" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" value={form.message} onChange={(e: any) => setForm({ ...form, message: e?.target?.value ?? '' })} placeholder="Tell us more..." rows={6} className="mt-1" />
              </div>
              <Button type="submit" disabled={loading} className="bg-blue-900 text-white hover:bg-blue-800">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
              <p className="text-xs text-gray-400">Your information is securely stored and never shared with third parties.</p>
            </form>
          </div>
          <div className="md:col-span-2">
            <h2 className="font-display text-2xl font-bold text-blue-900">Get in Touch</h2>
            <div className="mt-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-900">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-blue-900">Email</h3>
                  <p className="text-sm text-gray-500">support@legalconnect.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-900">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-blue-900">Phone</h3>
                  <p className="text-sm text-gray-500">+234 800 123 4567</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-900">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-blue-900">Office</h3>
                  <p className="text-sm text-gray-500">Victoria Island, Lagos, Nigeria</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
