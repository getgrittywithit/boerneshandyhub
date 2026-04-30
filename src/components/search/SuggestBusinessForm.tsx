'use client';

import { useState } from 'react';
import { submitVendorLead } from '@/lib/search/client';

interface SuggestBusinessFormProps {
  searchQuery?: string;
  onSuccess?: () => void;
}

export default function SuggestBusinessForm({
  searchQuery = '',
  onSuccess,
}: SuggestBusinessFormProps) {
  const [formData, setFormData] = useState({
    suggestedName: '',
    contactEmail: '',
    contactPhone: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await submitVendorLead({
        query: searchQuery,
        suggested_name: formData.suggestedName,
        contact_email: formData.contactEmail || undefined,
        contact_phone: formData.contactPhone || undefined,
        notes: formData.notes || undefined,
      });

      setIsSubmitted(true);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="p-6 text-center">
        <div className="text-4xl mb-3">✓</div>
        <h3 className="text-lg font-semibold text-boerne-navy mb-2">
          Thanks for the suggestion!
        </h3>
        <p className="text-sm text-gray-600">
          We&apos;ll look into adding this business to BoernesHandyHub.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-boerne-light-gray rounded-lg">
      <h3 className="text-lg font-semibold text-boerne-navy mb-2">
        Can&apos;t find what you&apos;re looking for?
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Suggest a business and we&apos;ll work on adding it to our directory.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Name *
          </label>
          <input
            type="text"
            required
            value={formData.suggestedName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, suggestedName: e.target.value }))
            }
            placeholder="e.g., Joe's Plumbing"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-boerne-gold focus:border-boerne-gold"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Email
            </label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, contactEmail: e.target.value }))
              }
              placeholder="Optional"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-boerne-gold focus:border-boerne-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Phone
            </label>
            <input
              type="tel"
              value={formData.contactPhone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, contactPhone: e.target.value }))
              }
              placeholder="Optional"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-boerne-gold focus:border-boerne-gold"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, notes: e.target.value }))
            }
            placeholder="Any additional info about this business"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-boerne-gold focus:border-boerne-gold resize-none"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-boerne-gold text-boerne-navy text-sm font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Suggest This Business'}
        </button>
      </form>
    </div>
  );
}
