'use client';

import { motion } from 'framer-motion';
import { Scale, Shield, Target, Users, Zap, Award } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-950 to-blue-800 py-20">
        <div className="mx-auto max-w-[1200px] px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Scale className="mx-auto mb-4 h-12 w-12 text-amber-400" />
            <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">About Legal Connect</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100/80">
              Bridging the gap between legal professionals and those who need them, powered by cutting-edge AI technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-[1200px] px-4 py-20">
        <div className="grid gap-12 md:grid-cols-2">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">Our Mission</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-blue-900">Making Legal Help Accessible</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Legal Connect was founded with a simple mission: to make quality legal representation accessible to everyone. We believe that finding the right lawyer shouldn&apos;t be a matter of luck or connections — it should be a matter of technology matching you with the best professional for your specific needs.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Our AI-powered platform analyzes your legal needs and connects you with verified lawyers who have the exact expertise, experience, and location to handle your case effectively.
            </p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">Our Vision</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-blue-900">The Future of Legal Services</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              We envision a world where anyone facing a legal challenge can quickly and confidently find the right legal professional. Where lawyers can focus on what they do best — practicing law — while we handle the client matching.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed">
              By leveraging artificial intelligence, we aim to create a seamless, transparent, and efficient legal marketplace that benefits both clients and legal professionals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-[1200px] px-4">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">Why Choose Us</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-blue-900">Our Core Values</h2>
          </div>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Zap, title: 'Speed & Efficiency', desc: 'Get matched with the right lawyer in minutes, not weeks. Our AI works fast so you can focus on what matters.' },
              { icon: Shield, title: 'Trust & Security', desc: 'All lawyers are verified. Your data is encrypted and protected with industry-standard security measures.' },
              { icon: Target, title: 'Precision Matching', desc: 'Our AI considers practice area, experience, location, ratings, and budget for accurate lawyer recommendations.' },
              { icon: Users, title: 'Community First', desc: 'We build connections between clients and lawyers that lead to successful outcomes and lasting relationships.' },
              { icon: Award, title: 'Quality Assurance', desc: 'We maintain high standards for lawyers on our platform through verification and continuous quality monitoring.' },
              { icon: Scale, title: 'Fair & Transparent', desc: 'Clear pricing, honest recommendations, and no hidden fees. We believe in transparency at every step.' },
            ].map((v, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-900">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold text-blue-900">{v.title}</h3>
                <p className="text-sm text-gray-500">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
