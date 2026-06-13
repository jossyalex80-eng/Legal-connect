import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-blue-950 to-blue-800 py-16">
        <div className="mx-auto max-w-[1200px] px-4 text-center">
          <FileText className="mx-auto mb-4 h-12 w-12 text-amber-400" />
          <h1 className="font-display text-4xl font-bold tracking-tight text-white">Terms & Conditions</h1>
          <p className="mx-auto mt-3 max-w-xl text-blue-100/80">Last updated: June 2026</p>
        </div>
      </section>
      <section className="mx-auto max-w-[800px] px-4 py-16">
        <div className="prose prose-blue max-w-none text-gray-600">
          <div className="mb-8 rounded-xl border-l-4 border-amber-500 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-800">Important Disclaimer</p>
            <p className="mt-1 text-sm text-amber-700">Legal Connect is a technology platform that connects clients with lawyers. We do not directly provide legal advice, represent clients in legal matters, or guarantee legal outcomes. All legal services are provided by independent legal professionals registered on our platform.</p>
          </div>

          <h2 className="font-display text-xl font-bold text-blue-900">1. Acceptance of Terms</h2>
          <p>By accessing and using Legal Connect, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our platform.</p>

          <h2 className="mt-8 font-display text-xl font-bold text-blue-900">2. Our Services</h2>
          <p>Legal Connect provides an AI-powered platform that matches clients with verified lawyers based on their legal needs. Our services include case submission, AI-based lawyer matching, lawyer directory search, and facilitated connection between clients and lawyers.</p>

          <h2 className="mt-8 font-display text-xl font-bold text-blue-900">3. Account Registration</h2>
          <p>You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials. Lawyers must provide valid professional credentials for verification.</p>

          <h2 className="mt-8 font-display text-xl font-bold text-blue-900">4. AI Matching</h2>
          <p>Our AI matching system provides recommendations based on available data. Match percentages and recommendations are suggestions and do not guarantee the quality or outcome of legal services. Clients should independently verify a lawyer&apos;s credentials and suitability.</p>

          <h2 className="mt-8 font-display text-xl font-bold text-blue-900">5. Limitation of Liability</h2>
          <p>Legal Connect is not liable for any legal outcomes, the quality of legal services provided by lawyers on the platform, or any disputes between clients and lawyers. Our role is limited to facilitating connections between parties.</p>

          <h2 className="mt-8 font-display text-xl font-bold text-blue-900">6. Intellectual Property</h2>
          <p>All content, design, and technology on Legal Connect are our intellectual property. You may not reproduce, distribute, or create derivative works without our written permission.</p>

          <h2 className="mt-8 font-display text-xl font-bold text-blue-900">7. Changes to Terms</h2>
          <p>We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the updated terms.</p>
        </div>
      </section>
    </div>
  );
}
