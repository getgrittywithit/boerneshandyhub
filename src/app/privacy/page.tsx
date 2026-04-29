import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Boerne\'s Handy Hub',
  description: 'Privacy policy for Boerne\'s Handy Hub - your trusted guide to local home services in Boerne, Texas.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link href="/" className="text-boerne-gold hover:text-boerne-gold-alt text-sm mb-8 inline-block">
          &larr; Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

        <div className="bg-white rounded-xl shadow-sm p-8 space-y-6 text-gray-600">
          <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Information We Collect</h2>
            <p>
              Boerne&apos;s Handy Hub collects information you provide directly to us, such as when you
              subscribe to our newsletter, request a quote, create an account, or contact us for support.
            </p>
            <p className="mt-2">This may include:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Name and email address</li>
              <li>Phone number (when requesting quotes)</li>
              <li>Property information (for Home Tracker users)</li>
              <li>Communication preferences</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>To send you our newsletter with local home maintenance tips</li>
              <li>To connect you with local service providers</li>
              <li>To provide Home Tracker maintenance reminders</li>
              <li>To improve our services and user experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Information Sharing</h2>
            <p>
              We do not sell your personal information. We may share your information with service
              providers only when you explicitly request a quote or contact them through our platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Newsletter &amp; Communications</h2>
            <p>
              You can unsubscribe from our newsletter at any time by clicking the unsubscribe link
              in any email or by contacting us directly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information.
              However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at{' '}
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
