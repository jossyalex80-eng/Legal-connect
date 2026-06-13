'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Scale, Brain, ShieldCheck, MessageSquare, FileSearch, Upload, Star,
  ArrowRight, ChevronDown, ChevronUp, Search, Sparkles, Users, BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.section>
  );
}

const howItWorks = [
  { icon: FileSearch, title: 'Submit Your Case', desc: 'Describe your legal issue with details about your situation and needs.' },
  { icon: Brain, title: 'AI Analyzes', desc: 'Our AI engine analyzes your case and identifies the best legal expertise needed.' },
  { icon: Users, title: 'Get 3 Recommendations', desc: 'Receive your top 3 matched lawyers with match scores and reasons.' },
  { icon: MessageSquare, title: 'Connect & Consult', desc: 'Contact your matched lawyers and schedule a consultation.' },
];

const features = [
  { icon: Brain, title: 'AI Lawyer Matching', desc: 'Advanced AI analyzes your case to find the perfect lawyer match.' },
  { icon: ShieldCheck, title: 'Verified Lawyers', desc: 'All lawyers are verified with valid bar registration numbers.' },
  { icon: MessageSquare, title: 'Secure Messaging', desc: 'Communicate securely with your matched lawyers. (Coming soon)' },
  { icon: FileSearch, title: 'Case Tracking', desc: 'Track your case status from submission to resolution.' },
  { icon: Upload, title: 'Document Uploads', desc: 'Securely upload and share supporting documents for your case.' },
  { icon: Star, title: 'Reviews & Ratings', desc: 'Make informed choices with verified lawyer ratings. (Coming soon)' },
];

const testimonials = [
  { name: 'Chukwuemeka Obi', role: 'Business Owner', image: 'https://cdn.abacus.ai/images/f44cc483-8e8e-4d9e-bc69-66d4872c7571.png', text: 'Legal Connect matched me with a corporate lawyer in under 5 minutes. The AI recommendation was spot-on and saved me weeks of searching.', rating: 5 },
  { name: 'Amina Ibrahim', role: 'Entrepreneur', image: 'https://cdn.abacus.ai/images/c8bb69f9-615b-4445-880f-cd9f7a0ebadb.png', text: 'I was dealing with a property dispute and needed urgent help. The platform connected me with an excellent property lawyer near my location.', rating: 5 },
  { name: 'David Adeyemi', role: 'Tech Professional', image: 'https://cdn.abacus.ai/images/700e9606-508f-4d95-a742-f2a89e689218.png', text: 'The AI matching system is incredibly accurate. It understood my intellectual property needs and recommended lawyers with the exact specialization.', rating: 5 },
];

const faqs = [
  { q: 'How does the AI matching work?', a: 'Our AI analyzes your case description, legal category, location, and budget to match you with lawyers who have the most relevant expertise and experience. It scores each lawyer based on practice area match, experience, location proximity, and ratings.' },
  { q: 'Is Legal Connect free to use?', a: 'Creating an account and submitting your case for AI matching is completely free. You only pay when you decide to engage a lawyer for consultation or legal services, at rates set by the individual lawyer.' },
  { q: 'How are lawyers verified?', a: 'All lawyers on Legal Connect must provide their bar registration number and professional credentials. Our team verifies these credentials before approving their profile on the platform.' },
  { q: 'How many lawyer recommendations will I get?', a: 'For each case you submit, our AI will recommend the top 3 best-matched lawyers, each with a match percentage and an explanation of why they are a good fit for your case.' },
  { q: 'Can I search for lawyers manually?', a: 'Yes! In addition to AI matching, you can browse and search our directory of lawyers by practice area, location, experience, rating, and consultation fee.' },
  { q: 'Is my information secure?', a: 'Absolutely. We use industry-standard encryption and security measures to protect all your personal information and case details. Your data is never shared without your explicit consent.' },
];

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, rgba(212,168,67,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)' }} />
        </div>
        <div className="relative mx-auto flex max-w-[1200px] flex-col items-center gap-8 px-4 py-20 md:flex-row md:py-28">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex-1 text-center md:text-left"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-sm text-amber-300">
              <Sparkles className="h-4 w-4" /> AI-Powered Legal Matching
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
              Find the Right <span className="text-amber-400">Lawyer</span> in Minutes with AI
            </h1>
            <p className="mt-5 max-w-lg text-lg text-blue-100/80">
              Describe your legal issue and get matched with verified lawyers best suited to your case.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
              <Link href="/auth/register?role=client">
                <Button size="lg" className="w-full bg-amber-500 text-blue-950 hover:bg-amber-400 sm:w-auto">
                  <Search className="mr-2 h-5 w-5" /> Find a Lawyer
                </Button>
              </Link>
              <Link href="/auth/register?role=lawyer">
                <Button size="lg" variant="outline" className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20 sm:w-auto">
                  <BookOpen className="mr-2 h-5 w-5" /> Register as Lawyer
                </Button>
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex-1"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/10 shadow-2xl">
              <Image
                src="https://cdn.abacus.ai/images/df998e04-798e-4a70-a643-1a76e985bfb4.png"
                alt="Professional legal office with gavel, law books and scales of justice"
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <AnimatedSection className="mx-auto max-w-[1200px] px-4 py-20">
        <motion.div variants={fadeUp} className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">How It Works</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-blue-900 md:text-4xl">Get Matched in 4 Simple Steps</h2>
        </motion.div>
        <div className="mt-14 grid gap-8 md:grid-cols-4">
          {howItWorks.map((step, i) => (
            <motion.div key={i} variants={fadeUp} className="group relative rounded-xl bg-slate-50 p-6 text-center transition hover:shadow-lg hover:shadow-blue-100">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-900 text-white transition group-hover:bg-amber-500 group-hover:text-blue-950">
                <step.icon className="h-7 w-7" />
              </div>
              <div className="mb-2 font-mono text-xs text-amber-600">Step {i + 1}</div>
              <h3 className="mb-2 font-display text-lg font-semibold text-blue-900">{step.title}</h3>
              <p className="text-sm text-gray-500">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* Features */}
      <AnimatedSection className="bg-slate-50 py-20">
        <div className="mx-auto max-w-[1200px] px-4">
          <motion.div variants={fadeUp} className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">Features</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-blue-900 md:text-4xl">Everything You Need for Legal Solutions</h2>
          </motion.div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div key={i} variants={fadeUp} className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-900">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold text-blue-900">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Lawyer CTA */}
      <AnimatedSection className="bg-gradient-to-r from-blue-900 to-blue-800 py-20">
        <div className="mx-auto max-w-[1200px] px-4 text-center">
          <motion.div variants={fadeUp}>
            <Scale className="mx-auto mb-4 h-12 w-12 text-amber-400" />
            <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl">Are You a Lawyer?</h2>
            <p className="mx-auto mt-4 max-w-xl text-blue-100/80">
              Grow your practice with Legal Connect. Get matched with clients who need your exact expertise. Join hundreds of verified lawyers on the platform.
            </p>
            <Link href="/auth/register?role=lawyer">
              <Button size="lg" className="mt-8 bg-amber-500 text-blue-950 hover:bg-amber-400">
                Register as Lawyer <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Testimonials */}
      <AnimatedSection className="mx-auto max-w-[1200px] px-4 py-20">
        <motion.div variants={fadeUp} className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">Testimonials</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-blue-900 md:text-4xl">What Clients Say</h2>
        </motion.div>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div key={i} variants={fadeUp} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="mb-4 flex gap-1">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mb-6 text-sm leading-relaxed text-gray-600">&quot;{t.text}&quot;</p>
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                  <Image src={t.image} alt={t.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* FAQ */}
      <AnimatedSection className="bg-slate-50 py-20">
        <div className="mx-auto max-w-[800px] px-4">
          <motion.div variants={fadeUp} className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">FAQ</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-blue-900 md:text-4xl">Frequently Asked Questions</h2>
          </motion.div>
          <div className="mt-10 space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} variants={fadeUp} className="rounded-xl bg-white shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left"
                >
                  <span className="pr-4 text-sm font-semibold text-blue-900">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="h-5 w-5 shrink-0 text-amber-500" /> : <ChevronDown className="h-5 w-5 shrink-0 text-gray-400" />}
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-4">
                      <p className="text-sm leading-relaxed text-gray-500">{faq.a}</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
