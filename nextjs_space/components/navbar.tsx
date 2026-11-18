'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import {
  Scale, Menu, X, User, LogOut, LayoutDashboard, ChevronDown,
  Search, BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const { data: session, status } = useSession() || {};
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isLoggedIn = status === 'authenticated';
  const role = (session?.user as any)?.role;
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // On the homepage: start transparent, turn white on scroll.
  // On all other pages: always white.
  const transparent = isHome && !scrolled;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        transparent
          ? 'bg-transparent border-transparent'
          : 'bg-white/95 backdrop-blur-md border-b border-blue-100/50 shadow-sm'
      }`}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3.5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-900">
            <Scale className="h-5 w-5 text-amber-400" />
          </div>
          <span className={`font-display text-xl font-bold tracking-tight transition-colors ${transparent ? 'text-white' : 'text-blue-900'}`}>
            Legal<span className="text-amber-500">Connect</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {[
            { label: 'Home', href: '/' },
            { label: 'Find Lawyers', href: '/lawyers' },
            { label: 'How It Works', href: '/#how-it-works' },
            { label: 'About', href: '/about' },
            { label: 'Contact', href: '/contact' },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                transparent
                  ? 'text-blue-100 hover:bg-white/10 hover:text-white'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-900'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  transparent
                    ? 'border-white/25 text-white hover:bg-white/10'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
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
                    className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-gray-200 bg-white py-1 shadow-xl"
                  >
                    <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50">
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                    <Link href="/dashboard/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50">
                      <User className="h-4 w-4" /> Profile
                    </Link>
                    <button
                      onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className={transparent ? 'text-blue-100 hover:bg-white/10 hover:text-white' : 'text-gray-700 hover:text-blue-900'}
                >
                  Log In
                </Button>
              </Link>
              <Link href="/auth/register?role=client">
                <Button size="sm" className="bg-amber-500 text-blue-950 hover:bg-amber-400">
                  <Search className="mr-1.5 h-3.5 w-3.5" /> Find a Lawyer
                </Button>
              </Link>
              <Link href="/auth/register?role=lawyer">
                <Button
                  size="sm"
                  variant="outline"
                  className={transparent ? 'border-white/25 text-white hover:bg-white/10' : 'border-blue-200 text-blue-900 hover:bg-blue-50'}
                >
                  <BookOpen className="mr-1.5 h-3.5 w-3.5" /> Join as Lawyer
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="flex md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen
            ? <X className={`h-6 w-6 ${transparent ? 'text-white' : 'text-gray-700'}`} />
            : <Menu className={`h-6 w-6 ${transparent ? 'text-white' : 'text-gray-700'}`} />
          }
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-gray-100 bg-white md:hidden"
          >
            <nav className="space-y-1 px-4 py-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'Find Lawyers', href: '/lawyers' },
                { label: 'How It Works', href: '/#how-it-works' },
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' },
              ].map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-900"
                >
                  {label}
                </Link>
              ))}
              <div className="border-t border-gray-100 pt-3">
                {isLoggedIn ? (
                  <>
                    <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-blue-50">Dashboard</Link>
                    <button
                      onClick={() => { setMobileOpen(false); signOut({ callbackUrl: '/' }); }}
                      className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link href="/auth/register?role=client" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full bg-amber-500 text-blue-950 hover:bg-amber-400">
                        <Search className="mr-2 h-4 w-4" /> Find a Lawyer
                      </Button>
                    </Link>
                    <div className="flex gap-2">
                      <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="flex-1">
                        <Button variant="outline" className="w-full border-blue-200 text-blue-900">Log In</Button>
                      </Link>
                      <Link href="/auth/register?role=lawyer" onClick={() => setMobileOpen(false)} className="flex-1">
                        <Button variant="outline" className="w-full border-blue-200 text-blue-900">Join as Lawyer</Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
