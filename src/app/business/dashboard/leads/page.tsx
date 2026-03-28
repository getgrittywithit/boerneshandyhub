'use client';

import { useState, useEffect } from 'react';
import { useBusinessDashboard } from '../layout';
import { supabase } from '@/lib/supabase';

interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  created_at: string;
  status: 'new' | 'contacted' | 'completed';
}

export default function LeadsPage() {
  const { business } = useBusinessDashboard();
  const [leads, setLeads] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'completed'>('all');
  const [selectedLead, setSelectedLead] = useState<QuoteRequest | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (business) {
      fetchLeads();
    }
  }, [business]);

  const fetchLeads = async () => {
    if (!supabase || !business) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('quote_requests')
      .select('*')
      .eq('business_id', business.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setLeads(data as QuoteRequest[]);
    }

    setLoading(false);
  };

  const updateLeadStatus = async (leadId: string, newStatus: QuoteRequest['status']) => {
    if (!supabase) return;

    setUpdatingStatus(true);

    const { error } = await supabase
      .from('quote_requests')
      .update({ status: newStatus })
      .eq('id', leadId);

    if (!error) {
      setLeads(prev =>
        prev.map(lead =>
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        )
      );
      if (selectedLead?.id === leadId) {
        setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
      }
    }

    setUpdatingStatus(false);
  };

  const filteredLeads = filter === 'all'
    ? leads
    : leads.filter(lead => lead.status === filter);

  const statusCounts = {
    all: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    completed: leads.filter(l => l.status === 'completed').length,
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
        <h1 className="text-2xl font-bold text-gray-900">Leads & Quotes</h1>
        <p className="text-gray-500">Manage customer inquiries and quote requests</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'new', 'contacted', 'completed'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filter === status
                ? 'bg-boerne-navy text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/20">
              {statusCounts[status]}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-boerne-navy mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading leads...</p>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-4xl mb-4">📭</div>
                <p className="text-gray-500">
                  {filter === 'all'
                    ? 'No leads yet'
                    : `No ${filter} leads`}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  When customers request quotes, they'll appear here
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedLead?.id === lead.id ? 'bg-boerne-gold/5 border-l-4 border-boerne-gold' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{lead.name}</p>
                          <p className="text-sm text-gray-500">{lead.service}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                          lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {lead.status}
                        </span>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {lead.message && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {lead.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Lead Detail */}
        <div className="lg:col-span-1">
          {selectedLead ? (
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Lead Details</h3>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">Name</label>
                  <p className="text-gray-900 font-medium">{selectedLead.name}</p>
                </div>

                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">Service</label>
                  <p className="text-gray-900">{selectedLead.service}</p>
                </div>

                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">Contact</label>
                  <div className="space-y-1">
                    <a
                      href={`mailto:${selectedLead.email}`}
                      className="block text-boerne-gold hover:underline"
                    >
                      {selectedLead.email}
                    </a>
                    <a
                      href={`tel:${selectedLead.phone}`}
                      className="block text-boerne-gold hover:underline"
                    >
                      {selectedLead.phone}
                    </a>
                  </div>
                </div>

                {selectedLead.message && (
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide">Message</label>
                    <p className="text-gray-600 text-sm whitespace-pre-wrap">{selectedLead.message}</p>
                  </div>
                )}

                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">Received</label>
                  <p className="text-gray-600">
                    {new Date(selectedLead.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <label className="text-xs text-gray-500 uppercase tracking-wide mb-2 block">
                    Update Status
                  </label>
                  <div className="flex gap-2">
                    {(['new', 'contacted', 'completed'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => updateLeadStatus(selectedLead.id, status)}
                        disabled={updatingStatus || selectedLead.status === status}
                        className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                          selectedLead.status === status
                            ? status === 'new' ? 'bg-blue-100 text-blue-700' :
                              status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        } disabled:opacity-50`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex gap-2">
                    <a
                      href={`mailto:${selectedLead.email}?subject=Re: Quote Request - ${business.name}`}
                      className="flex-1 px-4 py-2 bg-boerne-navy text-white text-sm font-medium rounded-lg text-center hover:bg-opacity-90 transition-colors"
                    >
                      Send Email
                    </a>
                    <a
                      href={`tel:${selectedLead.phone}`}
                      className="flex-1 px-4 py-2 border border-boerne-navy text-boerne-navy text-sm font-medium rounded-lg text-center hover:bg-boerne-navy/5 transition-colors"
                    >
                      Call
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="text-4xl mb-2">👈</div>
              <p className="text-gray-500">Select a lead to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
