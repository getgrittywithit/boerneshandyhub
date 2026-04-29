import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | Boerne\'s Handy Hub',
  description: 'Terms of service for Boerne\'s Handy Hub - your trusted guide to local home services in Boerne, Texas.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link href="/" className="text-boerne-gold hover:text-boerne-gold-alt text-sm mb-8 inline-block">
          &larr; Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>

        <div className="bg-white rounded-xl shadow-sm p-8 space-y-6 text-gray-600">
          <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Acceptance of Terms</h2>
            <p>
              By accessing and using Boerne&apos;s Handy Hub, you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Description of Service</h2>
            <p>
              Boerne&apos;s Handy Hub is a directory and resource platform that connects Boerne, Texas
              residents with local home service providers. We provide information, guides, and tools
              to help homeowners maintain their properties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Service Provider Listings</h2>
            <p>
              We strive to provide accurate information about listed service providers. However,
              Boerne&apos;s Handy Hub does not guarantee the quality, safety, or legality of services
              offered by listed providers.
            </p>
            <p className="mt-2">
              Users are responsible for verifying provider credentials, licenses, and insurance
              before engaging their services. We recommend getting multiple quotes and checking
              references.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">User Accounts</h2>
            <p>
              Some features require creating an account. You are responsible for maintaining the
              confidentiality of your account credentials and for all activities under your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Limitation of Liability</h2>
            <p>
              Boerne&apos;s Handy Hub is not liable for any damages arising from your use of our
              platform or from services provided by listed businesses. We are a directory service
              and do not employ or control the service providers listed on our site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Content and Intellectual Property</h2>
            <p>
              All content on Boerne&apos;s Handy Hub, including text, graphics, logos, and guides,
              is our property and protected by copyright laws. You may not reproduce or distribute
              our content without permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Changes to Terms</h2>
            <p>
              We may update these terms from time to time. Continued use of our services after
              changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact Us</h2>
            <p>
              If you have questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:hello@boerneshandyhub.com" className="text-boerne-gold hover:text-boerne-gold-alt">
                hello@boerneshandyhub.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
