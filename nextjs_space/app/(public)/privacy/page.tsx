import { Shield } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-blue-950 to-blue-800 py-16">
        <div className="mx-auto max-w-[1200px] px-4 text-center">
          <Shield className="mx-auto mb-4 h-12 w-12 text-amber-400" />
          <h1 className="font-display text-4xl font-bold tracking-tight text-white">Privacy Policy</h1>
          <p className="mx-auto mt-3 max-w-xl text-blue-100/80">Last updated: June 2026</p>
        </div>
      </section>
      <section className="mx-auto max-w-[800px] px-4 py-16">
        <div className="prose prose-blue max-w-none text-gray-600">
          <h2 className="font-display text-xl font-bold text-blue-900">1. Information We Collect</h2>
          <p>We collect information you provide when creating an account, submitting a case, or contacting us. This includes your name, email, phone number, location, and case details. For lawyers, we also collect professional credentials and practice information.</p>

          <h2 className="mt-8 font-display text-xl font-bold text-blue-900">2. How We Use Your Information</h2>
          <p>Your information is used to provide our AI-powered lawyer matching services, manage your account, communicate with you about our services, and improve our platform. Case details are analyzed by our AI system to match you with appropriate legal professionals.</p>

          <h2 className="mt-8 font-display text-xl font-bold text-blue-900">3. Information Sharing</h2>
          <p>We share your case information only with lawyers who are matched with your case. We do not sell your personal information to third parties. We may share anonymized, aggregated data for analytics purposes.</p>

          <h2 className="mt-8 font-display text-xl font-bold text-blue-900">4. Data Security</h2>
          <p>We implement industry-standard security measures including encryption, secure servers, and access controls to protect your personal information and case details from unauthorized access.</p>

          <h2 className="mt-8 font-display text-xl font-bold text-blue-900">5. Your Rights</h2>
          <p>You have the right to access, update, or delete your personal information at any time through your account settings. You may also request a copy of all data we hold about you.</p>

          <h2 className="mt-8 font-display text-xl font-bold text-blue-900">6. Cookies</h2>
          <p>We use essential cookies for authentication and session management. We may also use analytics cookies to understand how our platform is used and improve our services.</p>

          <h2 className="mt-8 font-display text-xl font-bold text-blue-900">7. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us at support@legalconnect.com.</p>
        </div>
      </section>
    </div>
  );
}
