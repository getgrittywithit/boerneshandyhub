'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useBusinessDashboard } from '../layout';
import { membershipTiers } from '@/data/serviceCategories';

interface ProfileFormData {
  name: string;
  description: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  services: string[];
  serviceArea: string[];
}

export default function BusinessProfilePage() {
  const { business, refreshBusiness } = useBusinessDashboard();
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    description: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    services: [],
    serviceArea: [],
  });
  const [newService, setNewService] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (business) {
      setFormData({
        name: business.name || '',
        description: business.description || '',
        phone: business.phone || '',
        email: business.email || '',
        website: business.website || '',
        address: business.address || '',
        services: (business as any).services || [],
        serviceArea: (business as any).service_area || [],
      });
    }
  }, [business]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;

    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/business/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: business.id,
          ...formData,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update profile');
      }

      setSuccess(true);
      await refreshBusiness();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const addService = () => {
    if (newService.trim() && !formData.services.includes(newService.trim())) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, newService.trim()],
      }));
      setNewService('');
    }
  };

  const removeService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(s => s !== service),
    }));
  };

  if (!business) {
    return (
      <div className="p-8">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit My Listing</h1>
        <p className="text-gray-500">Update your business information</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {/* Success/Error Messages */}
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700">Profile updated successfully!</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                  placeholder="Tell potential customers about your business..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.length}/500 characters
                </p>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            {(() => {
              const tier = business.membership_tier as keyof typeof membershipTiers;
              const tierConfig = membershipTiers[tier];
              const categoryLimit = tierConfig.categoryLimit;
              const subcategories = (business as any).subcategories || [];
              const currentCount = subcategories.length;
              const isAtLimit = categoryLimit !== Infinity && currentCount >= categoryLimit;
              const limitDisplay = categoryLimit === Infinity ? 'Unlimited' : categoryLimit;

              return (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
                      <p className="text-sm text-gray-500">
                        {currentCount} of {limitDisplay} categories used
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${tierConfig.color}`}>
                      {tierConfig.name} Plan
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {subcategories.map((cat: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-2 bg-boerne-gold/20 text-boerne-navy rounded-lg text-sm font-medium"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  {subcategories.length === 0 && (
                    <p className="text-gray-500 text-sm mb-4">No categories assigned</p>
                  )}

                  {isAtLimit && tier !== 'elite' && (
                    <div className="p-4 bg-boerne-gold/10 border border-boerne-gold/20 rounded-lg">
                      <p className="text-sm text-boerne-navy">
                        <strong>Want to list in more categories?</strong>{' '}
                        <Link href="/business/dashboard/settings" className="text-boerne-gold hover:underline">
                          Upgrade your plan
                        </Link>
                        {' '}to appear in up to {tier === 'basic' ? '2' : tier === 'verified' ? '5' : 'unlimited'} categories.
                      </p>
                    </div>
                  )}

                  <p className="text-xs text-gray-400 mt-4">
                    Contact support to change your categories
                  </p>
                </>
              );
            })()}
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Contact Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                  placeholder="https://www.example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Services Offered</h2>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                placeholder="Add a service..."
              />
              <button
                type="button"
                onClick={addService}
                className="px-6 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.services.map((service, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm"
                >
                  {service}
                  <button
                    type="button"
                    onClick={() => removeService(service)}
                    className="text-gray-400 hover:text-red-500 ml-1"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>

            {formData.services.length === 0 && (
              <p className="text-gray-500 text-sm mt-2">No services added yet</p>
            )}
          </div>

          {/* Service Areas */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Service Areas</h2>

            <div className="flex flex-wrap gap-2">
              {formData.serviceArea.map((area, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-2 bg-boerne-gold/20 text-boerne-navy rounded-lg text-sm"
                >
                  {area}
                </span>
              ))}
            </div>

            {formData.serviceArea.length === 0 && (
              <p className="text-gray-500 text-sm">No service areas specified</p>
            )}

            <p className="text-xs text-gray-400 mt-4">
              Contact support to update your service areas
            </p>
          </div>

          {/* Photos - Coming Soon */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Photos</h2>
            <p className="text-gray-500 text-sm mb-4">Showcase your work with photos</p>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="text-4xl mb-2">📷</div>
              <p className="text-gray-500">Photo upload coming soon</p>
              <p className="text-xs text-gray-400 mt-1">
                You'll be able to upload photos of your work
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-boerne-navy text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
