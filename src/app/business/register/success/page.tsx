import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Registration Submitted | Boerne's Handy Hub",
  description: 'Your business registration has been submitted successfully.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegistrationSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Content */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Registration Submitted!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for registering your business with Boerne's Handy Hub.
          </p>

          {/* What's Next */}
          <div className="bg-gray-50 rounded-xl p-6 text-left mb-6">
            <h2 className="font-semibold text-gray-900 mb-3">What happens next?</h2>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-boerne-gold font-bold">1.</span>
                <span>Our team will review your listing within 1-2 business days</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-boerne-gold font-bold">2.</span>
                <span>You'll receive an email confirmation with your listing details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-boerne-gold font-bold">3.</span>
                <span>Once approved, your business will be live in our directory</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-boerne-gold font-bold">4.</span>
                <span>You can upgrade to a paid plan anytime for more visibility</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <p className="text-sm text-gray-500 mb-6">
            Questions? Contact us at{' '}
            <a href="mailto:support@boerneshandyhub.com" className="text-boerne-gold hover:underline">
              support@boerneshandyhub.com
            </a>
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full px-6 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors"
            >
              Back to Home
            </Link>
            <Link
              href="/services"
              className="block w-full px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Browse Directory
            </Link>
          </div>
        </div>

        {/* Additional CTA */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Know another local business?{' '}
            <Link href="/business/register" className="text-boerne-gold hover:underline">
              Refer them to us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
