import Link from 'next/link';
import { Search, ArrowLeft } from 'lucide-react';

export default function SiteNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={32} className="text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            This listing is no longer active
          </h1>
          <p className="text-gray-600">
            The business you&apos;re looking for may have moved or is no longer available on our directory.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/services"
            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-boerne-navy text-white rounded-lg font-medium hover:bg-boerne-navy/90 transition-colors"
          >
            <Search size={18} />
            Browse All Services
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Are you the owner of this business?{' '}
          <Link href="/business" className="text-boerne-gold hover:underline">
            Claim your listing
          </Link>
        </p>
      </div>
    </div>
  );
}
