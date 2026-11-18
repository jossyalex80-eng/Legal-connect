'use client';

import Link from 'next/link';
import { Scale, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-blue-950 text-blue-200">
      <div className="mx-auto max-w-[1200px] px-4 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-800">
                <Scale className="h-5 w-5 text-amber-400" />
              </div>
              <span className="font-display text-lg font-bold text-white">
                Legal<span className="text-amber-500">Connect</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-blue-300/70">
              Nigeria&apos;s AI-powered legal marketplace — connecting people with verified legal professionals across the country.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a href="mailto:support@calllegalconnect.com" aria-label="Email"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-900 text-blue-300 transition-colors hover:bg-blue-800 hover:text-white">
                <Mail className="h-4 w-4" />
              </a>
              <a href="tel:+234" aria-label="Phone"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-900 text-blue-300 transition-colors hover:bg-blue-800 hover:text-white">
                <Phone className="h-4 w-4" />
              </a>
              <a href="/contact" aria-label="Location"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-900 text-blue-300 transition-colors hover:bg-blue-800 hover:text-white">
                <MapPin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Find a Lawyer', href: '/lawyers' },
                { label: 'Browse by Practice Area', href: '/lawyers' },
                { label: 'AI Matching', href: '/#how-it-works' },
                { label: 'How It Works', href: '/#how-it-works' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-blue-300/70 transition-colors hover:text-white">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Lawyers */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">For Lawyers</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Join the Platform', href: '/auth/register?role=lawyer' },
                { label: 'Lawyer Dashboard', href: '/dashboard' },
                { label: 'Manage Profile', href: '/dashboard/profile' },
                { label: 'Get Clients', href: '/auth/register?role=lawyer' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-blue-300/70 transition-colors hover:text-white">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">Company</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Contact Us', href: '/contact' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-blue-300/70 transition-colors hover:text-white">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-blue-900 pt-8 text-xs text-blue-400/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Call Legal Connect. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Call Legal Connect is a technology platform. It is not a law firm and does not provide legal advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
