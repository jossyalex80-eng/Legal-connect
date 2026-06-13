'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Scale, Menu, X, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const { data: session, status } = useSession() || {};
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const isLoggedIn = status === 'authenticated';
  const role = (session?.user as any)?.role;

  return (
    <header className="sticky top-0 z-50 border-b border-blue-100/50 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-900">
            <Scale className="h-5 w-5 text-amber-400" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-blue-900">Legal<span className="text-amber-500">Connect</span></span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link href="/" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-blue-50 hover:text-blue-900">Home</Link>
          <Link href="/lawyers" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-blue-50 hover:text-blue-900">Find Lawyers</Link>
          <Link href="/about" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-blue-50 hover:text-blue-900">About</Link>
          <Link href="/contact" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-blue-50 hover:text-blue-900">Contact</Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-900 text-xs text-white">
                  {session?.user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
                </div>
                <span className="max-w-[120px] truncate">{session?.user?.name ?? 'Account'}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
                  >
                    <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                    <Link href="/dashboard/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                      <User className="h-4 w-4" /> Profile
                    </Link>
                    <button onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: '/' }); }} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="outline" size="sm" className="border-blue-200 text-blue-900 hover:bg-blue-50">Log In</Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm" className="bg-blue-900 text-white hover:bg-blue-800">Register</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-gray-100 md:hidden"
          >
            <div className="space-y-1 px-4 py-3">
              <Link href="/" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-blue-50">Home</Link>
              <Link href="/lawyers" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-blue-50">Find Lawyers</Link>
              <Link href="/about" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-blue-50">About</Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-blue-50">Contact</Link>
              <div className="border-t border-gray-100 pt-2">
                {isLoggedIn ? (
                  <>
                    <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-blue-50">Dashboard</Link>
                    <button onClick={() => { setMobileOpen(false); signOut({ callbackUrl: '/' }); }} className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50">Sign Out</button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="flex-1">
                      <Button variant="outline" className="w-full border-blue-200">Log In</Button>
                    </Link>
                    <Link href="/auth/register" onClick={() => setMobileOpen(false)} className="flex-1">
                      <Button className="w-full bg-blue-900">Register</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
