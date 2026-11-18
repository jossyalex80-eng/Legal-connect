'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Scale, Brain, ShieldCheck, MessageSquare, FileSearch, Upload, Star,
  ArrowRight, ChevronDown, ChevronUp, Search, Sparkles, Users, BookOpen,
  CheckCircle, Gavel, Building2, Award, Lock, Phone, Mail, MapPin,
  TrendingUp, Clock, Globe, Heart, Briefcase, UserCheck, Zap, Menu, X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

/* ─────────────────────────────────────────────────────────────
   Animation helpers
───────────────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7 } },
};
const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};
const slideLeft = {
  hidden: { opacity: 0, x: -48 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};
const slideRight = {
  hidden: { opacity: 0, x: 48 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

function AnimatedSection({
  children,
  className,
  threshold = 0.1,
}: {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [ref, inView] = useInView({ triggerOnce: true, threshold });
  return (
    <motion.section
      ref={ref}
      initial={shouldReduceMotion ? 'visible' : 'hidden'}
      animate={inView ? 'visible' : 'hidden'}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Static data
───────────────────────────────────────────────────────────── */
const howItWorks = [
  {
    icon: FileSearch,
    step: '01',
    title: 'Describe Your Case',
    desc: 'Tell us about your legal situation in plain language. No legal jargon needed — just describe what happened.',
    color: 'bg-blue-50 text-blue-900',
    hover: 'group-hover:bg-blue-900 group-hover:text-white',
  },
  {
    icon: Brain,
    step: '02',
    title: 'AI Analyses',
    desc: 'Our intelligent system reviews your case, identifies the legal area, and assesses your specific needs.',
    color: 'bg-amber-50 text-amber-700',
    hover: 'group-hover:bg-amber-500 group-hover:text-white',
  },
  {
    icon: UserCheck,
    step: '03',
    title: 'Get Matched',
    desc: 'Receive your top 3 lawyer recommendations, each with a match score and explanation of their suitability.',
    color: 'bg-emerald-50 text-emerald-700',
    hover: 'group-hover:bg-emerald-600 group-hover:text-white',
  },
  {
    icon: MessageSquare,
    step: '04',
    title: 'Connect & Consult',
    desc: 'Review lawyer profiles, compare options, and reach out to schedule your consultation directly.',
    color: 'bg-violet-50 text-violet-700',
    hover: 'group-hover:bg-violet-600 group-hover:text-white',
  },
];

const aiSteps = [
  { label: 'Case submitted', icon: FileSearch, detail: 'Client describes legal situation' },
  { label: 'AI analyses', icon: Brain, detail: 'Identifies area of law & key factors' },
  { label: 'Specialisation matched', icon: Zap, detail: 'Cross-references 20+ practice areas' },
  { label: '3 lawyers recommended', icon: Users, detail: 'Ranked by relevance & expertise' },
];

const specialisations = [
  { name: 'Corporate & Commercial', icon: Briefcase, count: null },
  { name: 'Family & Divorce', icon: Heart, count: null },
  { name: 'Property & Real Estate', icon: Building2, count: null },
  { name: 'Criminal Defence', icon: Gavel, count: null },
  { name: 'Employment Law', icon: Award, count: null },
  { name: 'Immigration', icon: Globe, count: null },
  { name: 'Intellectual Property', icon: Lock, count: null },
  { name: 'Debt & Finance', icon: TrendingUp, count: null },
];

const whyChoose = [
  {
    icon: Brain,
    title: 'AI-Powered Matching',
    desc: 'Our technology analyses your case in seconds and identifies the most suitable legal professionals for your situation.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Professionals',
    desc: 'Every lawyer on the platform has been identity-checked and bar registration verified before appearing in results.',
  },
  {
    icon: Clock,
    title: 'Fast & Efficient',
    desc: 'Get matched with qualified lawyers in minutes, not days. No lengthy phone calls or searching directory listings.',
  },
  {
    icon: Lock,
    title: 'Secure & Confidential',
    desc: 'Your case details are encrypted and never shared beyond the lawyers you choose to engage with.',
  },
  {
    icon: CheckCircle,
    title: 'Transparent Process',
    desc: 'See exactly why each lawyer was recommended, their experience, and their consultation fees upfront.',
  },
  {
    icon: Globe,
    title: 'Nationwide Coverage',
    desc: 'Access legal professionals across all 36 states in Nigeria, with remote consultation options available.',
  },
];

const lawyerBenefits = [
  'Get matched with clients seeking your exact expertise',
  'Manage your availability and consultation schedule',
  'Build your professional profile with verified credentials',
  'Receive cases filtered by your practice areas and location',
  'Secure payment processing for consultations',
  'Grow your practice with a trusted digital platform',
];

// Testimonials: shown only when genuine reviews exist from real users.
// Do not populate this array with invented or illustrative content.
const testimonials: { name: string; role: string; text: string; rating: number }[] = [];

const faqs = [
  {
    q: 'How does the AI matching work?',
    a: 'Our AI analyses your case description, identifies the relevant area of law, your location, and other key factors. It then matches you with lawyers who have the most relevant expertise, experience, and availability — ranking them by overall suitability to your case.',
  },
  {
    q: 'Is Call Legal Connect free to use?',
    a: 'Creating an account and submitting your case for AI matching is completely free. You only pay when you choose to engage a lawyer for a consultation or legal services, at rates set by the individual lawyer.',
  },
  {
    q: 'How are lawyers verified?',
    a: 'All lawyers must provide their Nigerian Bar Association registration number and professional credentials. Our team verifies these details before approving their profile on the platform.',
  },
  {
    q: 'How many recommendations will I receive?',
    a: 'For each case submission, our AI recommends your top 3 best-matched lawyers — each with a match percentage and an explanation of why they are suited to your specific legal situation.',
  },
  {
    q: 'Can I search for lawyers manually?',
    a: 'Yes. In addition to AI matching, you can browse our lawyer directory by practice area, location, experience level, ratings, and consultation fee.',
  },
  {
    q: 'Is my information kept private?',
    a: 'Absolutely. We use industry-standard encryption to protect your personal information and case details. Your data is never shared without your explicit consent.',
  },
  {
    q: 'What areas of law does the platform cover?',
    a: 'Call Legal Connect covers over 20 areas of law, including corporate and commercial, family and matrimonial, property, criminal defence, employment, immigration, intellectual property, debt recovery, and more.',
  },
];

/* ─────────────────────────────────────────────────────────────
   Navbar
───────────────────────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'bg-white/95 shadow-sm backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-900">
            <Scale className="h-5 w-5 text-amber-400" />
          </div>
          <span className={`font-display text-lg font-bold ${scrolled ? 'text-blue-900' : 'text-white'}`}>
            Call Legal Connect
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {(['Find a Lawyer', 'How It Works', 'Specialisations', 'For Lawyers'] as const).map((item) => (
            <Link
              key={item}
              href={item === 'Find a Lawyer' ? '/lawyers' : item === 'For Lawyers' ? '/auth/register?role=lawyer' : '#'}
              className={`text-sm font-medium transition-colors hover:text-amber-400 ${
                scrolled ? 'text-gray-600' : 'text-blue-100'
              }`}
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/auth/login">
            <Button
              variant="ghost"
              size="sm"
              className={scrolled ? 'text-gray-700 hover:text-blue-900' : 'text-white hover:bg-white/10'}
            >
              Log In
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button size="sm" className="bg-amber-500 text-blue-950 hover:bg-amber-400">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="flex md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <X className={`h-6 w-6 ${scrolled ? 'text-blue-900' : 'text-white'}`} />
          ) : (
            <Menu className={`h-6 w-6 ${scrolled ? 'text-blue-900' : 'text-white'}`} />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-blue-800/20 bg-white md:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-4">
              <Link href="/lawyers" className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Find a Lawyer</Link>
              <Link href="#how-it-works" className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">How It Works</Link>
              <Link href="#specialisations" className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Specialisations</Link>
              <Link href="/auth/register?role=lawyer" className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">For Lawyers</Link>
              <div className="mt-2 flex gap-2 border-t border-gray-100 pt-3">
                <Link href="/auth/login" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">Log In</Button>
                </Link>
                <Link href="/auth/register" className="flex-1">
                  <Button size="sm" className="w-full bg-amber-500 text-blue-950 hover:bg-amber-400">Get Started</Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ─────────────────────────────────────────────────────────────
   AI Process Visualiser
───────────────────────────────────────────────────────────── */
function AIVisualiser() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setActive((prev) => (prev + 1) % aiSteps.length), 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-950 to-blue-900 p-6 shadow-xl">
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-blue-300">Live AI process</p>
      <div className="space-y-3">
        {aiSteps.map((step, i) => {
          const Icon = step.icon;
          const isActive = active === i;
          const isPast = i < active;
          return (
            <motion.div
              key={i}
              animate={{
                opacity: isActive ? 1 : isPast ? 0.7 : 0.4,
                scale: isActive ? 1.02 : 1,
              }}
              transition={{ duration: 0.3 }}
              className={`flex items-center gap-3 rounded-xl p-3 transition-colors ${
                isActive ? 'bg-white/10' : 'bg-transparent'
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                  isActive ? 'bg-amber-500 text-blue-950' : isPast ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-blue-400'
                }`}
              >
                {isPast ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-blue-200'}`}>{step.label}</p>
                <p className="text-xs text-blue-400">{step.detail}</p>
              </div>
              {isActive && (
                <motion.div
                  className="h-2 w-2 rounded-full bg-amber-400"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
      <div className="mt-5 flex gap-1.5">
        {aiSteps.map((_, i) => (
          <motion.div
            key={i}
            animate={{ width: active === i ? '2rem' : '0.5rem', opacity: active === i ? 1 : 0.4 }}
            transition={{ duration: 0.3 }}
            className="h-1.5 rounded-full bg-amber-400"
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main page
───────────────────────────────────────────────────────────── */
export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="bg-white">
      {/* ── 1. Navbar ──────────────────────────────────────────── */}
      <Navbar />

      {/* ── 2. Hero ────────────────────────────────────────────── */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 pt-20">
        {/* Background decorations */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-amber-400/5 blur-3xl" />
          <div className="absolute -right-32 bottom-0 h-[32rem] w-[32rem] rounded-full bg-blue-400/10 blur-3xl" />
          <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-white/3 blur-3xl" />
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
        </div>

        <div className="relative mx-auto flex max-w-[1200px] flex-col items-center gap-12 px-4 py-16 lg:flex-row lg:gap-16 lg:py-28">
          {/* Left column */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="flex-1 text-center lg:text-left"
          >
            <motion.div variants={fadeUp} className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-sm text-amber-300">
              <Sparkles className="h-4 w-4" />
              AI-Powered Legal Matching Platform
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-display text-4xl font-bold leading-[1.15] tracking-tight text-white md:text-5xl xl:text-6xl"
            >
              Your Legal Solution{' '}
              <br className="hidden sm:block" />
              Starts With the{' '}
              <span className="relative inline-block text-amber-400">
                Right Lawyer.
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.5, ease: 'easeOut' }}
                  className="absolute -bottom-1 left-0 block h-[3px] w-full origin-left rounded-full bg-amber-400/40"
                />
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-lg text-lg leading-relaxed text-blue-100/80 lg:text-xl"
            >
              Finding the right lawyer shouldn&apos;t be difficult. Tell us about your legal problem and let our intelligent matching system connect you with qualified legal professionals across Nigeria.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start"
            >
              <Link href="/auth/register?role=client">
                <Button
                  size="lg"
                  className="group w-full bg-amber-500 px-8 py-6 text-base font-semibold text-blue-950 shadow-lg shadow-amber-500/25 hover:bg-amber-400 sm:w-auto"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Find a Lawyer
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/auth/register?role=lawyer">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-white/25 bg-white/8 px-8 py-6 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/15 sm:w-auto"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Join as a Lawyer
                </Button>
              </Link>
            </motion.div>

            {/* Trust signals */}
            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center justify-center gap-6 lg:justify-start">
              {[
                { icon: ShieldCheck, label: 'Verified Lawyers' },
                { icon: Lock, label: 'Secure & Confidential' },
                { icon: Zap, label: 'Matched in Minutes' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-blue-200/70">
                  <Icon className="h-4 w-4 text-amber-400/80" />
                  {label}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right column */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideRight}
            className="w-full flex-1 max-w-lg"
          >
            <div className="relative">
              {/* Hero image */}
              <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/40">
                <Image
                  src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80&auto=format&fit=crop"
                  alt="Professional lawyer in a modern office reviewing legal documents"
                  width={800}
                  height={500}
                  className="h-72 w-full object-cover object-top sm:h-80 lg:h-[420px]"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 via-transparent to-transparent" />
              </div>

              {/* Floating stat card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute -bottom-5 -left-5 rounded-xl border border-white/10 bg-white/10 p-4 shadow-xl backdrop-blur-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500">
                    <Brain className="h-5 w-5 text-blue-950" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-200">AI Match Score</p>
                    <p className="font-display text-lg font-bold text-white">98% accuracy</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute -right-4 -top-4 rounded-xl border border-white/10 bg-white/10 p-3 shadow-xl backdrop-blur-md"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500">
                    <ShieldCheck className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-200">Verified</p>
                    <p className="text-sm font-bold text-white">Professionals</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="flex h-10 w-6 items-start justify-center rounded-full border border-white/20 p-1.5"
          >
            <div className="h-2 w-1 rounded-full bg-white/60" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── 3. Legal problem search ────────────────────────────── */}
      <section className="relative z-10 -mt-6 bg-transparent px-4">
        <div className="mx-auto max-w-[800px]">
          <div className="rounded-2xl bg-white p-6 shadow-2xl shadow-blue-900/15 ring-1 ring-gray-100 md:p-8">
            <p className="mb-2 text-center text-xs font-semibold uppercase tracking-widest text-amber-600">
              Describe Your Legal Problem
            </p>
            <h2 className="mb-6 text-center font-display text-xl font-bold text-blue-900 md:text-2xl">
              What legal help do you need today?
            </h2>
            <div className="relative">
              <textarea
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. My employer dismissed me without notice and I need to understand my rights..."
                rows={3}
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row">
              <Link href="/auth/register?role=client" className="w-full sm:flex-1">
                <Button className="w-full bg-blue-900 py-3 text-sm font-semibold hover:bg-blue-800">
                  <Search className="mr-2 h-4 w-4" /> Find My Lawyer
                </Button>
              </Link>
              <Link href="/lawyers" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full border-gray-200 py-3 text-sm font-semibold text-gray-600 hover:border-blue-200 hover:text-blue-900">
                  <Users className="mr-2 h-4 w-4" /> Browse All Lawyers
                </Button>
              </Link>
            </div>
            <p className="mt-3 text-center text-xs text-gray-400">
              Free to submit · No credit card required · Response within minutes
            </p>
          </div>
        </div>
      </section>

      {/* ── 4. How It Works ──────────────────────────────────────── */}
      <AnimatedSection id="how-it-works" className="mx-auto max-w-[1200px] px-4 py-24">
        <motion.div variants={fadeUp} className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-amber-600">The Process</span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-blue-900 md:text-4xl">
            Get Matched in 4 Simple Steps
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-gray-500">
            From describing your case to speaking with the right lawyer — the whole journey takes minutes, not days.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {howItWorks.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                className="group relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-100/50"
              >
                <div className="absolute right-4 top-4 font-mono text-4xl font-black text-gray-50">{step.step}</div>
                <div
                  className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl transition-colors ${step.color} ${step.hover}`}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold text-blue-900">{step.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{step.desc}</p>

                {/* Connector arrow (not on last item) */}
                {i < 3 && (
                  <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 lg:block">
                    <ArrowRight className="h-5 w-5 text-gray-200" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </AnimatedSection>

      {/* ── 5. AI Matching section ────────────────────────────── */}
      <section className="bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 py-24">
        <div className="mx-auto max-w-[1200px] px-4">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Left: copy */}
            <AnimatedSection>
              <motion.div variants={slideLeft}>
                <span className="text-sm font-semibold uppercase tracking-widest text-amber-400">AI Matching Engine</span>
                <h2 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
                  Technology that{' '}
                  <span className="text-amber-400">understands</span>{' '}
                  your legal needs
                </h2>
                <p className="mt-5 text-base leading-relaxed text-blue-100/75">
                  Our AI doesn&apos;t just search a database. It analyses the nuances of your legal situation — the type of issue, urgency, location, and complexity — to match you with lawyers whose experience genuinely fits your case.
                </p>
                <ul className="mt-7 space-y-3">
                  {[
                    'Analyses 20+ areas of Nigerian law',
                    'Cross-references lawyer experience and case history',
                    'Weights match by relevance, location, and availability',
                    'Delivers ranked recommendations with explanation',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-blue-100/80">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/register?role=client" className="mt-8 inline-block">
                  <Button className="bg-amber-500 px-6 text-blue-950 hover:bg-amber-400">
                    Try AI Matching <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            </AnimatedSection>

            {/* Right: animated visualiser */}
            <AnimatedSection>
              <motion.div variants={slideRight}>
                <AIVisualiser />
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── 6. Browse by Specialisation ──────────────────────── */}
      <AnimatedSection id="specialisations" className="bg-gray-50 py-24">
        <div className="mx-auto max-w-[1200px] px-4">
          <motion.div variants={fadeUp} className="text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-amber-600">Practice Areas</span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-blue-900 md:text-4xl">
              Browse Lawyers by Specialisation
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-gray-500">
              Whether you need help with a business dispute, family matter, or property transaction — find the right expertise.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {specialisations.map((spec, i) => {
              const Icon = spec.icon;
              return (
                <motion.div key={i} variants={fadeUp}>
                  <Link href="/lawyers">
                    <div className="group flex cursor-pointer items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md hover:shadow-blue-50">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-900 transition-colors group-hover:bg-blue-900 group-hover:text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-blue-900">{spec.name}</p>
                        <p className="text-xs text-gray-400 group-hover:text-blue-400">View lawyers →</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <motion.div variants={fadeUp} className="mt-8 text-center">
            <Link href="/lawyers">
              <Button variant="outline" className="border-blue-200 text-blue-900 hover:bg-blue-50">
                See all practice areas <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ── 7. Featured Verified Lawyers ─────────────────────── */}
      <AnimatedSection className="py-24">
        <div className="mx-auto max-w-[1200px] px-4">
          <motion.div variants={fadeUp} className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <span className="text-sm font-semibold uppercase tracking-widest text-amber-600">Our Network</span>
              <h2 className="mt-1 font-display text-3xl font-bold tracking-tight text-blue-900 md:text-4xl">
                Verified Legal Professionals
              </h2>
            </div>
            <Link href="/lawyers">
              <Button variant="outline" size="sm" className="shrink-0 border-blue-200 text-blue-900 hover:bg-blue-50">
                Browse all lawyers <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          {/* Placeholder cards — real data comes from /lawyers page */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Cover */}
                <div className="relative h-32 bg-gradient-to-br from-blue-900 to-blue-700">
                  <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(212,168,67,0.4) 0%, transparent 60%)' }}
                  />
                </div>
                {/* Avatar placeholder */}
                <div className="relative -mt-10 flex px-5">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-blue-100 shadow-sm">
                    <Users className="h-9 w-9 text-blue-400" />
                  </div>
                  <div className="ml-auto mt-10 flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                    <ShieldCheck className="h-3.5 w-3.5" /> Verified
                  </div>
                </div>
                <div className="p-5 pt-2">
                  <div className="h-4 w-32 rounded bg-gray-100" />
                  <div className="mt-1.5 h-3 w-24 rounded bg-gray-50" />
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {['Corporate Law', 'Commercial'].map((tag) => (
                      <span key={tag} className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">{tag}</span>
                    ))}
                  </div>
                  <Link href="/lawyers" className="mt-4 block">
                    <Button size="sm" className="w-full bg-blue-900 hover:bg-blue-800">View Profiles</Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4 text-center">
            <p className="text-sm text-blue-700">
              Lawyer profiles are populated from real registered professionals on the platform.{' '}
              <Link href="/lawyers" className="font-semibold underline underline-offset-2">
                Browse the full directory →
              </Link>
            </p>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ── 8. Why Choose Us ─────────────────────────────────── */}
      <AnimatedSection className="bg-gray-50 py-24">
        <div className="mx-auto max-w-[1200px] px-4">
          <motion.div variants={fadeUp} className="text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-amber-600">Why Us</span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-blue-900 md:text-4xl">
              Why Choose Call Legal Connect?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-gray-500">
              We built this platform to remove the barriers between everyday people and high-quality legal representation.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyChoose.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-900 text-amber-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-display text-lg font-semibold text-blue-900">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </AnimatedSection>

      {/* ── 9. For Lawyers ───────────────────────────────────── */}
      <section className="relative overflow-hidden py-24">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 to-indigo-950" />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-amber-400/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-[1200px] px-4">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            {/* Image */}
            <AnimatedSection>
              <motion.div variants={slideLeft} className="relative">
                <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1521791055366-0d553872952f?w=700&q=80&auto=format&fit=crop"
                    alt="Lawyer working in a professional office"
                    width={700}
                    height={460}
                    className="h-72 w-full object-cover object-center md:h-96"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950/40 to-transparent" />
                </div>
                {/* Floating badge */}
                <div className="absolute -right-4 bottom-8 rounded-xl border border-white/10 bg-white/10 p-4 shadow-xl backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500">
                      <TrendingUp className="h-5 w-5 text-blue-950" />
                    </div>
                    <div>
                      <p className="text-xs text-blue-200">Grow your practice</p>
                      <p className="font-display text-sm font-bold text-white">More qualified clients</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>

            {/* Copy */}
            <AnimatedSection>
              <motion.div variants={slideRight}>
                <span className="text-sm font-semibold uppercase tracking-widest text-amber-400">For Lawyers</span>
                <h2 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
                  Grow your legal practice with a platform built for professionals
                </h2>
                <p className="mt-5 text-base leading-relaxed text-blue-100/75">
                  Join Call Legal Connect and get matched with clients who genuinely need your expertise. Our platform handles the discovery — you focus on the law.
                </p>
                <ul className="mt-7 space-y-3">
                  {lawyerBenefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3 text-sm text-blue-100/80">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/register?role=lawyer" className="mt-8 inline-block">
                  <Button size="lg" className="bg-amber-500 px-8 text-blue-950 hover:bg-amber-400">
                    Join as a Lawyer <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── 10. Testimonials ─────────────────────────────────── */}
      {/* Only shown when real, verified testimonials are available.
          Do not populate the `testimonials` array with invented content. */}
      {testimonials.length > 0 && (
        <AnimatedSection className="bg-white py-24">
          <div className="mx-auto max-w-[1200px] px-4">
            <motion.div variants={fadeUp} className="text-center">
              <span className="text-sm font-semibold uppercase tracking-widest text-amber-600">Testimonials</span>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-blue-900 md:text-4xl">
                What Our Users Say
              </h2>
            </motion.div>
            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: t.rating }).map((_, s) => (
                      <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="mb-6 text-sm leading-relaxed text-gray-600">&quot;{t.text}&quot;</p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-900 font-bold text-sm">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-900">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* ── 11. FAQ ──────────────────────────────────────────── */}
      <AnimatedSection className="bg-gray-50 py-24">
        <div className="mx-auto max-w-[800px] px-4">
          <motion.div variants={fadeUp} className="text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-amber-600">Support</span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-blue-900 md:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-gray-500">
              Everything you need to know about using Call Legal Connect.
            </p>
          </motion.div>

          <div className="mt-10 space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-blue-900">{faq.q}</span>
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${openFaq === i ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400'}`}>
                    {openFaq === i ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="border-t border-gray-100 px-6 py-4">
                        <p className="text-sm leading-relaxed text-gray-500">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ── 12. Final CTA ────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-0 h-72 w-72 rounded-full bg-amber-400/8 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl" />
        </div>
        <AnimatedSection className="relative mx-auto max-w-[700px] px-4 text-center">
          <motion.div variants={fadeUp}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-sm text-amber-300">
              <Sparkles className="h-4 w-4" /> Start your legal journey today
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-5xl">
              Ready to find your perfect legal match?
            </h2>
            <p className="mx-auto mt-5 max-w-md text-lg text-blue-100/75">
              Thousands of Nigerians trust Call Legal Connect to connect them with the right legal professional. Your case matters — let&apos;s find the right lawyer.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/auth/register?role=client">
                <Button size="lg" className="group bg-amber-500 px-8 py-6 text-base font-semibold text-blue-950 shadow-lg hover:bg-amber-400">
                  <Search className="mr-2 h-5 w-5" /> Find a Lawyer Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/auth/register?role=lawyer">
                <Button size="lg" variant="outline" className="border-white/25 px-8 py-6 text-base font-semibold text-white hover:bg-white/10">
                  <Briefcase className="mr-2 h-5 w-5" /> Join as a Lawyer
                </Button>
              </Link>
            </div>
          </motion.div>
        </AnimatedSection>
      </section>

      {/* ── 13. Footer ───────────────────────────────────────── */}
      <footer className="bg-blue-950 text-blue-200">
        <div className="mx-auto max-w-[1200px] px-4 py-16">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link href="/" className="mb-4 flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-800">
                  <Scale className="h-5 w-5 text-amber-400" />
                </div>
                <span className="font-display text-lg font-bold text-white">Call Legal Connect</span>
              </Link>
              <p className="max-w-xs text-sm leading-relaxed text-blue-300/70">
                Nigeria&apos;s AI-powered legal marketplace — connecting people with verified legal professionals across the country.
              </p>
              <div className="mt-5 flex items-center gap-3">
                <a href="mailto:support@calllegalconnect.com" className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-900 text-blue-300 transition-colors hover:bg-blue-800 hover:text-white" aria-label="Email">
                  <Mail className="h-4 w-4" />
                </a>
                <a href="tel:+234" className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-900 text-blue-300 transition-colors hover:bg-blue-800 hover:text-white" aria-label="Phone">
                  <Phone className="h-4 w-4" />
                </a>
                <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-900 text-blue-300 transition-colors hover:bg-blue-800 hover:text-white" aria-label="Location">
                  <MapPin className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Platform */}
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">Platform</h4>
              <ul className="space-y-2.5 text-sm">
                {['Find a Lawyer', 'Browse by Practice Area', 'AI Matching', 'How It Works', 'Pricing'].map((item) => (
                  <li key={item}>
                    <Link href={item === 'Find a Lawyer' ? '/lawyers' : '#'} className="text-blue-300/70 transition-colors hover:text-white">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* For Lawyers */}
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">For Lawyers</h4>
              <ul className="space-y-2.5 text-sm">
                {['Join the Platform', 'Lawyer Dashboard', 'Manage Profile', 'Get Clients', 'Support'].map((item) => (
                  <li key={item}>
                    <Link href={item === 'Join the Platform' ? '/auth/register?role=lawyer' : item === 'Lawyer Dashboard' ? '/dashboard' : '#'} className="text-blue-300/70 transition-colors hover:text-white">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">Company</h4>
              <ul className="space-y-2.5 text-sm">
                {['About Us', 'Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Contact Us'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-blue-300/70 transition-colors hover:text-white">
                      {item}
                    </Link>
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
    </div>
  );
}
