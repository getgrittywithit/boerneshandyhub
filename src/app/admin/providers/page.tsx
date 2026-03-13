'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { serviceBuckets, serviceCategories, membershipTiers, MembershipTier } from '@/data/serviceCategories';
import serviceProvidersData from '@/data/serviceProviders.json';

interface Provider {
  id: string;
  name: string;
  category: string;
  membershipTier: string;
  claimStatus: string;
  rating: number;
  reviewCount: number;
  phone: string;
  email: string;
  description: string;
}

export default function ProvidersManagement() {
  const [providers] = useState<Provider[]>(serviceProvidersData.providers as Provider[]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBucket, setSelectedBucket] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [selectedClaimStatus, setSelectedClaimStatus] = useState<string>('all');

  // Modal state
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get categories for selected bucket
  const filteredCategories = useMemo(() => {
    if (selectedBucket === 'all') return serviceCategories;
    return serviceCategories.filter(c => c.bucket === selectedBucket);
  }, [selectedBucket]);

  // Filter providers
  const filteredProviders = useMemo(() => {
    return providers.filter(provider => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!provider.name.toLowerCase().includes(query) &&
            !provider.email?.toLowerCase().includes(query) &&
            !provider.phone?.includes(query)) {
          return false;
        }
      }

      // Bucket filter
      if (selectedBucket !== 'all') {
        const category = serviceCategories.find(c => c.slug === provider.category);
        if (category?.bucket !== selectedBucket) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && provider.category !== selectedCategory) {
        return false;
      }

      // Tier filter
      if (selectedTier !== 'all' && provider.membershipTier !== selectedTier) {
        return false;
      }

      // Claim status filter
      if (selectedClaimStatus !== 'all' && provider.claimStatus !== selectedClaimStatus) {
        return false;
      }

      return true;
    });
  }, [providers, searchQuery, selectedBucket, selectedCategory, selectedTier, selectedClaimStatus]);

  const getTierBadge = (tier: string) => {
    const tierInfo = membershipTiers[tier as MembershipTier];
    if (!tierInfo) return null;
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${tierInfo.color}`}>
        {tierInfo.badge} {tierInfo.name}
      </span>
    );
  };

  const getClaimStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Verified</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">Pending</span>;
      case 'unclaimed':
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">Unclaimed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Providers</h1>
          <p className="text-gray-500">Manage service provider listings</p>
        </div>
        <button
          onClick={() => {
            setEditingProvider(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors"
        >
          + Add Provider
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
            />
          </div>

          {/* Bucket Filter */}
          <select
            value={selectedBucket}
            onChange={(e) => {
              setSelectedBucket(e.target.value);
              setSelectedCategory('all');
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
          >
            <option value="all">All Buckets</option>
            {serviceBuckets.map(bucket => (
              <option key={bucket.id} value={bucket.slug}>{bucket.icon} {bucket.name}</option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {filteredCategories.map(cat => (
              <option key={cat.id} value={cat.slug}>{cat.icon} {cat.name}</option>
            ))}
          </select>

          {/* Tier Filter */}
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
          >
            <option value="all">All Tiers</option>
            <option value="elite">Elite</option>
            <option value="premium">Premium</option>
            <option value="verified">Verified</option>
            <option value="basic">Basic</option>
          </select>

          {/* Claim Status Filter */}
          <select
            value={selectedClaimStatus}
            onChange={(e) => setSelectedClaimStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="unclaimed">Unclaimed</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredProviders.length} of {providers.length} providers
      </div>

      {/* Providers Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Provider
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProviders.map((provider) => {
              const category = serviceCategories.find(c => c.slug === provider.category);
              const bucket = serviceBuckets.find(b => b.slug === category?.bucket);

              return (
                <tr key={provider.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{category?.icon}</div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{provider.name}</div>
                        <div className="text-sm text-gray-500">{provider.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{category?.name}</div>
                    <div className="text-xs text-gray-500">{bucket?.icon} {bucket?.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTierBadge(provider.membershipTier)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getClaimStatusBadge(provider.claimStatus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span className="text-sm font-medium">{provider.rating}</span>
                      <span className="text-sm text-gray-400 ml-1">({provider.reviewCount})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{provider.phone}</div>
                    <div className="text-xs text-gray-500">{provider.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setEditingProvider(provider);
                        setIsModalOpen(true);
                      }}
                      className="text-boerne-gold hover:text-boerne-gold-alt mr-4"
                    >
                      Edit
                    </button>
                    <Link
                      href={`/services/${provider.category}/${provider.id}`}
                      className="text-gray-500 hover:text-gray-700"
                      target="_blank"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredProviders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No providers found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <ProviderModal
          provider={editingProvider}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProvider(null);
          }}
          onSave={(provider) => {
            console.log('Saving provider:', provider);
            setIsModalOpen(false);
            setEditingProvider(null);
            alert('Provider data would be saved to database. Currently using JSON file.');
          }}
        />
      )}
    </div>
  );
}

// Provider Edit/Add Modal Component
function ProviderModal({
  provider,
  onClose,
  onSave,
}: {
  provider: Provider | null;
  onClose: () => void;
  onSave: (provider: Partial<Provider>) => void;
}) {
  const [formData, setFormData] = useState({
    name: provider?.name || '',
    category: provider?.category || '',
    membershipTier: provider?.membershipTier || 'basic',
    claimStatus: provider?.claimStatus || 'unclaimed',
    phone: provider?.phone || '',
    email: provider?.email || '',
    description: provider?.description || '',
    rating: provider?.rating || 0,
    reviewCount: provider?.reviewCount || 0,
  });

  const [selectedBucket, setSelectedBucket] = useState<string>(() => {
    if (provider?.category) {
      const cat = serviceCategories.find(c => c.slug === provider.category);
      return cat?.bucket || 'home';
    }
    return 'home';
  });

  const filteredCategories = serviceCategories.filter(c => c.bucket === selectedBucket);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {provider ? 'Edit Provider' : 'Add New Provider'}
          </h2>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          onSave(formData);
        }}>
          <div className="p-6 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
              />
            </div>

            {/* Bucket & Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bucket *
                </label>
                <select
                  value={selectedBucket}
                  onChange={(e) => {
                    setSelectedBucket(e.target.value);
                    setFormData({ ...formData, category: '' });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                >
                  {serviceBuckets.map(bucket => (
                    <option key={bucket.id} value={bucket.slug}>{bucket.icon} {bucket.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {filteredCategories.map(cat => (
                    <option key={cat.id} value={cat.slug}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tier & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Membership Tier
                </label>
                <select
                  value={formData.membershipTier}
                  onChange={(e) => setFormData({ ...formData, membershipTier: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                >
                  <option value="basic">Basic (Free)</option>
                  <option value="verified">Verified ($29/mo)</option>
                  <option value="premium">Premium ($79/mo)</option>
                  <option value="elite">Elite ($149/mo)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Claim Status
                </label>
                <select
                  value={formData.claimStatus}
                  onChange={(e) => setFormData({ ...formData, claimStatus: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                >
                  <option value="unclaimed">Unclaimed</option>
                  <option value="pending">Pending Verification</option>
                  <option value="verified">Verified</option>
                </select>
              </div>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                  placeholder="(830) 555-0000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                  placeholder="contact@business.com"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                placeholder="Brief description of the business..."
              />
            </div>

            {/* Rating (for editing existing) */}
            {provider && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Review Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.reviewCount}
                    onChange={(e) => setFormData({ ...formData, reviewCount: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors"
            >
              {provider ? 'Save Changes' : 'Add Provider'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
