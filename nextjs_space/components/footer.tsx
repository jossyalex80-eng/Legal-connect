'use client';

import Link from 'next/link';
import { Scale } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-slate-50">
      <div className="mx-auto max-w-[1200px] px-4 py-10">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-900">
              <Scale className="h-4 w-4 text-amber-400" />
            </div>
            <span className="font-display text-lg font-bold text-blue-900">Legal<span className="text-amber-500">Connect</span></span>
          </div>
          <nav className="flex flex-wrap items-center gap-4">
            <Link href="/about" className="text-sm text-gray-500 transition hover:text-blue-900">About</Link>
            <Link href="/contact" className="text-sm text-gray-500 transition hover:text-blue-900">Contact</Link>
            <Link href="/privacy" className="text-sm text-gray-500 transition hover:text-blue-900">Privacy</Link>
            <Link href="/terms" className="text-sm text-gray-500 transition hover:text-blue-900">Terms</Link>
          </nav>
        </div>
        <div className="mt-6 border-t border-gray-200 pt-6 text-center">
          <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} Legal Connect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
