'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { serviceCategories } from '@/data/serviceCategories';
import serviceProvidersData from '@/data/serviceProviders.json';

interface BusinessClaim {
  id: string;
  businessId: string;
  businessName: string;
  category: string;
  claimerName: string;
  claimerEmail: string;
  claimerPhone: string;
  businessRole: string;
  verificationMethod: string;
  additionalInfo?: string;
  status: 'pending' | 'under_review' | 'verified' | 'rejected';
  adminNotes?: string;
  submittedAt: string;
}

// Sample claim data for demonstration
const sampleClaims: BusinessClaim[] = [
  {
    id: 'claim1',
    businessId: 'hill-country-plumbing',
    businessName: 'Hill Country Plumbing',
    category: 'plumbing',
    claimerName: 'Robert Martinez',
    claimerEmail: 'robert@hillcountryplumbing.com',
    claimerPhone: '(830) 555-0101',
    businessRole: 'Owner',
    verificationMethod: 'Business License',
    additionalInfo: 'I have owned this business for 25 years. Happy to provide any documentation needed.',
    status: 'pending',
    submittedAt: '2024-01-15T09:00:00Z',
  },
  {
    id: 'claim2',
    businessId: 'texas-spark-electric',
    businessName: 'Texas Spark Electric',
    category: 'electrical',
    claimerName: 'Jennifer Chen',
    claimerEmail: 'jchen@texasspark.com',
    claimerPhone: '(830) 555-0202',
    businessRole: 'Manager',
    verificationMethod: 'Phone Verification',
    status: 'pending',
    submittedAt: '2024-01-14T14:30:00Z',
  },
  {
    id: 'claim3',
    businessId: 'cool-breeze-hvac',
    businessName: 'Cool Breeze HVAC',
    category: 'hvac',
    claimerName: 'Michael Thompson',
    claimerEmail: 'mthompson@coolbreeze.com',
    claimerPhone: '(830) 555-0303',
    businessRole: 'Owner',
    verificationMethod: 'Business License',
    status: 'verified',
    adminNotes: 'Verified via business license. Owner confirmed via phone call.',
    submittedAt: '2024-01-10T11:00:00Z',
  },
  {
    id: 'claim4',
    businessId: 'boerne-pest-control',
    businessName: 'Boerne Pest Control',
    category: 'pest-control',
    claimerName: 'David Wilson',
    claimerEmail: 'david@fakeemail.com',
    claimerPhone: '(830) 555-0404',
    businessRole: 'Employee',
    verificationMethod: 'Email Verification',
    status: 'rejected',
    adminNotes: 'Could not verify ownership. Email domain does not match business.',
    submittedAt: '2024-01-08T16:45:00Z',
  },
];

export default function ClaimsManagement() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [claims, setClaims] = useState<BusinessClaim[]>(sampleClaims);
  const [selectedClaim, setSelectedClaim] = useState<BusinessClaim | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    checkAuth();
    loadClaims();
  }, []);

  const checkAuth = async () => {
    try {
      if (!supabase) {
        setLoading(false);
        return;
      }
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        setIsAdmin(profile?.role === 'admin');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadClaims = async () => {
    // Try to load from Supabase if available
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('business_claims')
          .select('*')
          .order('submitted_at', { ascending: false });

        if (!error && data && data.length > 0) {
          // Transform Supabase data to our format
          setClaims(data.map((claim: Record<string, unknown>) => ({
            id: claim.id as string,
            businessId: claim.business_id as string,
            businessName: (claim.business_name as string) || 'Unknown Business',
            category: (claim.category as string) || 'general',
            claimerName: claim.claimer_name as string,
            claimerEmail: claim.claimer_email as string,
            claimerPhone: claim.claimer_phone as string,
            businessRole: claim.business_role as string,
            verificationMethod: (claim.verification_method as string) || 'Email Verification',
            additionalInfo: claim.additional_info as string | undefined,
            status: claim.status as BusinessClaim['status'],
            adminNotes: claim.admin_notes as string | undefined,
            submittedAt: claim.submitted_at as string,
          })));
          return;
        }
      } catch (error) {
        console.log('Using sample claims data');
      }
    }
    // Use sample data if Supabase not available or no data
    setClaims(sampleClaims);
  };

  const updateClaimStatus = async (claimId: string, status: BusinessClaim['status']) => {
    setUpdating(true);
    try {
      // Try Supabase update first
      if (supabase) {
        const { error } = await supabase
          .from('business_claims')
          .update({
            status,
            admin_notes: adminNotes,
            reviewed_at: new Date().toISOString()
          })
          .eq('id', claimId);

        if (!error) {
          await loadClaims();
          setSelectedClaim(null);
          setAdminNotes('');
          setUpdating(false);
          return;
        }
      }

      // Fallback to local state update
      setClaims(claims.map(c =>
        c.id === claimId ? { ...c, status, adminNotes: adminNotes || c.adminNotes } : c
      ));
      if (selectedClaim?.id === claimId) {
        setSelectedClaim(null);
      }
      setAdminNotes('');
    } catch (error) {
      console.error('Failed to update claim:', error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">Pending</span>;
      case 'under_review':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">Under Review</span>;
      case 'verified':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Verified</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">Rejected</span>;
      default:
        return null;
    }
  };

  const filteredClaims = statusFilter === 'all'
    ? claims
    : claims.filter(c => c.status === statusFilter);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Count unclaimed businesses
  const unclaimedCount = serviceProvidersData.providers.filter(p => p.claimStatus === 'unclaimed').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-boerne-navy"></div>
      </div>
    );
  }

  if (!user && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Access Required</h1>
          <p className="text-gray-600 mb-6">Please sign in to access claims management.</p>
          <Link href="/admin" className="text-boerne-gold hover:text-boerne-gold-alt">
            ← Back to Admin Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-boerne-navy shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <div className="flex items-center gap-3">
                <Link href="/admin" className="text-white/70 hover:text-white">
                  ← Dashboard
                </Link>
                <span className="text-white/30">/</span>
                <h1 className="text-2xl font-bold text-white">Business Claims</h1>
              </div>
              <p className="mt-1 text-boerne-gold text-sm">Review and verify business claim requests</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-2xl font-bold text-yellow-600">{claims.filter(c => c.status === 'pending').length}</p>
            <p className="text-xs text-gray-500">Pending</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-2xl font-bold text-blue-600">{claims.filter(c => c.status === 'under_review').length}</p>
            <p className="text-xs text-gray-500">Under Review</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-2xl font-bold text-green-600">{claims.filter(c => c.status === 'verified').length}</p>
            <p className="text-xs text-gray-500">Verified</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-2xl font-bold text-red-600">{claims.filter(c => c.status === 'rejected').length}</p>
            <p className="text-xs text-gray-500">Rejected</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-2xl font-bold text-orange-600">{unclaimedCount}</p>
            <p className="text-xs text-gray-500">Unclaimed</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Claims List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow">
            <div className="px-4 py-3 border-b border-gray-200">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Claims ({claims.length})</option>
                <option value="pending">Pending ({claims.filter(c => c.status === 'pending').length})</option>
                <option value="under_review">Under Review ({claims.filter(c => c.status === 'under_review').length})</option>
                <option value="verified">Verified ({claims.filter(c => c.status === 'verified').length})</option>
                <option value="rejected">Rejected ({claims.filter(c => c.status === 'rejected').length})</option>
              </select>
            </div>

            <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
              {filteredClaims.map((claim) => {
                const category = serviceCategories.find(c => c.slug === claim.category);
                const isSelected = selectedClaim?.id === claim.id;

                return (
                  <button
                    key={claim.id}
                    onClick={() => {
                      setSelectedClaim(claim);
                      setAdminNotes(claim.adminNotes || '');
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                      isSelected ? 'bg-boerne-gold/10 border-l-4 border-boerne-gold' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{claim.businessName}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm">{category?.icon}</span>
                          <span className="text-sm text-gray-500">{category?.name}</span>
                        </div>
                      </div>
                      {getStatusBadge(claim.status)}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Claimed by: {claim.claimerName} ({claim.businessRole})
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(claim.submittedAt)}</p>
                  </button>
                );
              })}

              {filteredClaims.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No claims found
                </div>
              )}
            </div>
          </div>

          {/* Claim Detail */}
          <div className="lg:col-span-2">
            {selectedClaim ? (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedClaim.businessName}</h2>
                    <p className="text-sm text-gray-500">Claim submitted {formatDate(selectedClaim.submittedAt)}</p>
                  </div>
                  {getStatusBadge(selectedClaim.status)}
                </div>

                <div className="p-6 space-y-6">
                  {/* Business Info */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Business Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-500">Business ID</label>
                        <p className="text-gray-900 font-mono text-sm">{selectedClaim.businessId}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">Category</label>
                        <div className="flex items-center gap-2">
                          <span>{serviceCategories.find(c => c.slug === selectedClaim.category)?.icon}</span>
                          <span className="text-gray-900">
                            {serviceCategories.find(c => c.slug === selectedClaim.category)?.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Claimant Info */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Claimant Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-500">Name</label>
                        <p className="text-gray-900">{selectedClaim.claimerName}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">Role</label>
                        <p className="text-gray-900">{selectedClaim.businessRole}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">Email</label>
                        <a href={`mailto:${selectedClaim.claimerEmail}`} className="text-boerne-gold hover:underline">
                          {selectedClaim.claimerEmail}
                        </a>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">Phone</label>
                        <a href={`tel:${selectedClaim.claimerPhone}`} className="text-boerne-gold hover:underline">
                          {selectedClaim.claimerPhone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Verification Method */}
                  <div>
                    <label className="text-xs font-medium text-gray-500">Verification Method</label>
                    <p className="text-gray-900 mt-1 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      {selectedClaim.verificationMethod}
                    </p>
                  </div>

                  {/* Additional Info */}
                  {selectedClaim.additionalInfo && (
                    <div>
                      <label className="text-xs font-medium text-gray-500">Additional Information</label>
                      <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">
                        {selectedClaim.additionalInfo}
                      </p>
                    </div>
                  )}

                  {/* Existing Admin Notes (for reviewed claims) */}
                  {selectedClaim.adminNotes && selectedClaim.status !== 'pending' && (
                    <div>
                      <label className="text-xs font-medium text-gray-500">Previous Review Notes</label>
                      <p className="text-gray-900 mt-1 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        {selectedClaim.adminNotes}
                      </p>
                    </div>
                  )}

                  {/* Review Actions */}
                  {(selectedClaim.status === 'pending' || selectedClaim.status === 'under_review') && (
                    <div className="border-t pt-6">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Review Claim</h3>

                      <div className="mb-4">
                        <label className="text-xs font-medium text-gray-500">Admin Notes</label>
                        <textarea
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          rows={3}
                          placeholder="Add notes about this review decision..."
                          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                        />
                      </div>

                      <div className="flex gap-3">
                        {selectedClaim.status === 'pending' && (
                          <button
                            onClick={() => updateClaimStatus(selectedClaim.id, 'under_review')}
                            disabled={updating}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                          >
                            Mark Under Review
                          </button>
                        )}
                        <button
                          onClick={() => updateClaimStatus(selectedClaim.id, 'verified')}
                          disabled={updating}
                          className="flex-1 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateClaimStatus(selectedClaim.id, 'rejected')}
                          disabled={updating}
                          className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="flex gap-3 pt-4 border-t">
                    <a
                      href={`mailto:${selectedClaim.claimerEmail}?subject=Re: Your business claim on Boerne Handy Hub`}
                      className="flex-1 px-4 py-2 bg-boerne-gold text-boerne-navy font-semibold rounded-lg text-center hover:bg-boerne-gold-alt transition-colors"
                    >
                      Email Claimant
                    </a>
                    <a
                      href={`tel:${selectedClaim.claimerPhone}`}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg text-center hover:bg-gray-50 transition-colors"
                    >
                      Call
                    </a>
                    <Link
                      href={`/services/${selectedClaim.category}/${selectedClaim.businessId}`}
                      target="_blank"
                      className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg text-center hover:bg-gray-50 transition-colors"
                    >
                      View Listing
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow h-full flex items-center justify-center text-gray-500 min-h-[400px]">
                <div className="text-center">
                  <span className="text-4xl">✅</span>
                  <p className="mt-2">Select a claim to review</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex gap-3">
            <span className="text-blue-500 text-xl">ℹ️</span>
            <div>
              <h3 className="font-medium text-blue-900">Business Claims Verification Process</h3>
              <p className="text-sm text-blue-700 mt-1">
                <strong>Step 1:</strong> Mark as "Under Review" to indicate you're working on it.<br />
                <strong>Step 2:</strong> Verify identity through business license, phone call to business number, or email domain verification.<br />
                <strong>Step 3:</strong> Approve or reject with notes explaining your decision.<br />
                <strong>Note:</strong> Once approved, update the provider's claim status in the Providers section.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
