'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import serviceProvidersData from '@/data/serviceProviders.json';
import { getSubcategory, getAllSubcategories } from '@/data/serviceCategories';

interface Provider {
  id: string;
  name: string;
  category: string;
  address: string;
  phone: string;
  website?: string;
  claimStatus: string;
}

export default function ClaimBusinessPage() {
  const params = useParams();
  const router = useRouter();
  const providerId = params.providerId as string;

  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    claimerName: '',
    claimerEmail: '',
    claimerPhone: '',
    businessRole: 'owner',
    verificationMethod: 'phone',
    additionalInfo: '',
  });

  useEffect(() => {
    const found = serviceProvidersData.providers.find(p => p.id === providerId);
    if (found) {
      setProvider(found as Provider);
    }
    setLoading(false);
  }, [providerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: provider?.id,
          businessName: provider?.name,
          category: provider?.category,
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit claim');
      }

      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit claim. Please try again or contact us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  // Find the top category for this provider's subcategory
  const allSubs = getAllSubcategories();
  const subcategoryInfo = allSubs.find(s => s.slug === provider?.category);
  const topCategorySlug = subcategoryInfo?.topCategory || 'home';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Business Not Found</h1>
          <Link href="/services" className="text-boerne-gold hover:underline">
            Browse all services
          </Link>
        </div>
      </div>
    );
  }

  if (provider.claimStatus !== 'unclaimed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="text-4xl mb-4">
            {provider.claimStatus === 'verified' ? '✅' : '⏳'}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {provider.claimStatus === 'verified'
              ? 'Business Already Claimed'
              : 'Claim Pending Review'}
          </h1>
          <p className="text-gray-600 mb-6">
            {provider.claimStatus === 'verified'
              ? `${provider.name} has already been claimed and verified.`
              : `A claim for ${provider.name} is currently being reviewed.`}
          </p>
          <Link
            href={`/services/${topCategorySlug}/${provider.category}/${provider.id}`}
            className="text-boerne-gold hover:underline"
          >
            View business listing
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✅</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Claim Submitted!</h1>
          <p className="text-gray-600 mb-6">
            We've received your claim for <strong>{provider.name}</strong>.
            Our team will review it and contact you within 1-2 business days.
          </p>
          <div className="space-y-3">
            <Link
              href={`/services/${topCategorySlug}/${provider.category}/${provider.id}`}
              className="block w-full px-6 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors"
            >
              View Your Listing
            </Link>
            <Link
              href="/"
              className="block w-full px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Claim Your Business
          </h1>
          <p className="text-gray-600">
            Verify ownership to manage your listing on Boerne's Handy Hub
          </p>
        </div>

        {/* Business Info Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-sm font-medium text-gray-500 mb-3">You're claiming:</h2>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-boerne-gold/10 rounded-lg flex items-center justify-center text-2xl">
              {subcategoryInfo?.icon || '🏢'}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{provider.name}</h3>
              <p className="text-gray-500">{subcategoryInfo?.name || provider.category}</p>
              <p className="text-sm text-gray-400 mt-1">{provider.address}</p>
            </div>
          </div>
        </div>

        {/* Claim Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Your Information</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.claimerName}
                onChange={(e) => setFormData({ ...formData, claimerName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                placeholder="John Smith"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.claimerEmail}
                onChange={(e) => setFormData({ ...formData, claimerEmail: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                placeholder="john@yourbusiness.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                Using your business email domain helps verify ownership faster
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.claimerPhone}
                onChange={(e) => setFormData({ ...formData, claimerPhone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                placeholder="(830) 555-0000"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Role *
              </label>
              <select
                required
                value={formData.businessRole}
                onChange={(e) => setFormData({ ...formData, businessRole: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
              >
                <option value="owner">Owner</option>
                <option value="manager">Manager</option>
                <option value="authorized">Authorized Representative</option>
              </select>
            </div>

            {/* Verification Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Verification Method *
              </label>
              <select
                required
                value={formData.verificationMethod}
                onChange={(e) => setFormData({ ...formData, verificationMethod: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
              >
                <option value="phone">Phone Call to Business Number</option>
                <option value="email">Email Verification</option>
                <option value="license">Business License Documentation</option>
                <option value="mail">Postcard to Business Address</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                We'll use this to confirm you're authorized to manage this listing
              </p>
            </div>

            {/* Additional Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Information (Optional)
              </label>
              <textarea
                value={formData.additionalInfo}
                onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                placeholder="Anything else that might help us verify your ownership..."
              />
            </div>
          </div>

          {/* Submit */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-4 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Claim'}
            </button>
          </div>

          {/* Benefits */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Once verified, you can:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Update your business information</li>
              <li>✓ Add photos and special offers</li>
              <li>✓ Respond to customer inquiries</li>
              <li>✓ Get the "Verified" badge on your listing</li>
            </ul>
          </div>
        </form>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link
            href={`/services/${topCategorySlug}/${provider.category}/${provider.id}`}
            className="text-gray-500 hover:text-gray-700"
          >
            ← Back to listing
          </Link>
        </div>
      </div>
    </div>
  );
}
