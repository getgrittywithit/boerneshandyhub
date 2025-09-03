'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface BusinessClaim {
  id: string;
  business_id: string;
  claimer_email: string;
  claimer_name: string;
  claimer_phone: string;
  business_role: string;
  verification_docs: string[];
  additional_info: string;
  status: 'pending' | 'under_review' | 'verified' | 'rejected';
  admin_notes: string;
  verification_steps: {
    emailSent: boolean;
    phoneCalled: boolean;
    mailSent: boolean;
    documentsReviewed: boolean;
  };
  submitted_at: string;
  business: {
    name: string;
    category: string;
    address: string;
  };
}

export default function ClaimsManagement() {
  const [claims, setClaims] = useState<BusinessClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState<BusinessClaim | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);


  useEffect(() => {
    loadClaims();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadClaims = async () => {
    try {
      const { data, error } = await supabase
        .from('business_claims')
        .select(`
          *,
          business:businesses(name, category, address)
        `)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setClaims(data || []);
    } catch (error) {
      console.error('Failed to load claims:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateClaimStatus = async (claimId: string, status: string, notes: string) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('business_claims')
        .update({
          status,
          admin_notes: notes,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', claimId);

      if (error) throw error;

      // If approved, update business claim_status
      if (status === 'verified') {
        const claim = claims.find(c => c.id === claimId);
        if (claim) {
          await supabase
            .from('businesses')
            .update({ claim_status: 'verified', membership_tier: 'verified' })
            .eq('id', claim.business_id);
        }
      }

      await loadClaims();
      setSelectedClaim(null);
      setAdminNotes('');
    } catch (error) {
      console.error('Failed to update claim:', error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'verified': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-4">
                  <li>
                    <a href="/admin" className="text-gray-500 hover:text-gray-700">Admin</a>
                  </li>
                  <li>
                    <span className="text-gray-500">/</span>
                  </li>
                  <li>
                    <span className="text-gray-900 font-medium">Business Claims</span>
                  </li>
                </ol>
              </nav>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Business Claims</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Pending Claims ({claims.filter(c => c.status === 'pending').length})
            </h3>
          </div>
          
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Claimer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {claims.map((claim) => (
                  <tr key={claim.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {claim.business.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {claim.business.category} • {claim.business.address}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {claim.claimer_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {claim.claimer_email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {claim.business_role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(claim.status)}`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(claim.submitted_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedClaim(claim)}
                        className="text-blue-600 hover:text-blue-500"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Review Modal */}
        {selectedClaim && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Review Claim: {selectedClaim.business.name}
                </h3>
              </div>
              
              <div className="px-6 py-4 space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Claimer Information</h4>
                  <p className="text-sm text-gray-600">
                    {selectedClaim.claimer_name} ({selectedClaim.business_role})
                  </p>
                  <p className="text-sm text-gray-600">{selectedClaim.claimer_email}</p>
                  <p className="text-sm text-gray-600">{selectedClaim.claimer_phone}</p>
                </div>

                {selectedClaim.additional_info && (
                  <div>
                    <h4 className="font-medium text-gray-900">Additional Information</h4>
                    <p className="text-sm text-gray-600">{selectedClaim.additional_info}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-gray-900">Verification Documents</h4>
                  <p className="text-sm text-gray-600">
                    {selectedClaim.verification_docs.length} documents uploaded
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Admin Notes
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Add notes about this review..."
                  />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedClaim(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updateClaimStatus(selectedClaim.id, 'rejected', adminNotes)}
                  disabled={updating}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  Reject
                </button>
                <button
                  onClick={() => updateClaimStatus(selectedClaim.id, 'verified', adminNotes)}
                  disabled={updating}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}