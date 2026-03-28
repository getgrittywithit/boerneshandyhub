import type { Metadata } from 'next';
import Link from 'next/link';
import BusinessRegistrationForm from '@/components/BusinessRegistrationForm';

export const metadata: Metadata = {
  title: "Register Your Business | Boerne's Handy Hub",
  description: 'Register your home service business on Boerne\'s Handy Hub. Reach local homeowners in the Texas Hill Country and grow your business.',
  keywords: ['register business boerne', 'list business boerne', 'home services boerne'],
  openGraph: {
    title: "Register Your Business | Boerne's Handy Hub",
    description: 'Register your home service business on Boerne\'s Handy Hub.',
    type: 'website',
    url: 'https://boerneshandyhub.com/business/register',
  },
  alternates: {
    canonical: '/business/register',
  },
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/business" className="text-sm text-boerne-gold hover:underline">
            ← Back to Business Info
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-2">
            Register Your Business
          </h1>
          <p className="text-gray-600">
            Join the trusted directory for Boerne home service providers
          </p>
        </div>

        {/* Form */}
        <BusinessRegistrationForm />

        {/* Already Listed */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Already see your business listed?{' '}
            <Link href="/services" className="text-boerne-gold hover:underline">
              Find and claim it
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
