'use client';

import { useState } from 'react';
import { serviceCategories } from '@/data/serviceCategories';

interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  message: string;
  providerId?: string;
  providerName?: string;
  status: 'new' | 'contacted' | 'converted' | 'closed';
  createdAt: string;
}

// Sample quote data for demonstration
const sampleQuotes: QuoteRequest[] = [
  {
    id: 'q1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '(830) 555-1234',
    serviceType: 'plumbing',
    message: 'I have a leaky faucet in my kitchen that needs repair. Water is dripping constantly.',
    providerId: 'hill-country-plumbing',
    providerName: 'Hill Country Plumbing',
    status: 'new',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'q2',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '(830) 555-5678',
    serviceType: 'electrical',
    message: 'Need to install a new ceiling fan in the master bedroom. Also interested in adding some recessed lighting.',
    providerId: 'texas-spark-electric',
    providerName: 'Texas Spark Electric',
    status: 'contacted',
    createdAt: '2024-01-14T14:15:00Z',
  },
  {
    id: 'q3',
    name: 'Mike Williams',
    email: 'mwilliams@email.com',
    phone: '(830) 555-9012',
    serviceType: 'hvac',
    message: 'AC not cooling properly. House is staying around 80 degrees even with AC running all day.',
    status: 'new',
    createdAt: '2024-01-15T08:45:00Z',
  },
  {
    id: 'q4',
    name: 'Emily Davis',
    email: 'emily.d@email.com',
    phone: '(830) 555-3456',
    serviceType: 'landscaping',
    message: 'Looking for regular lawn maintenance service. About 1/2 acre lot.',
    providerId: 'texas-lawn-masters',
    providerName: 'Texas Lawn Masters',
    status: 'converted',
    createdAt: '2024-01-12T16:20:00Z',
  },
];

export default function QuotesInbox() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>(sampleQuotes);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const updateQuoteStatus = (quoteId: string, newStatus: QuoteRequest['status']) => {
    setQuotes(quotes.map(q =>
      q.id === quoteId ? { ...q, status: newStatus } : q
    ));
    if (selectedQuote?.id === quoteId) {
      setSelectedQuote({ ...selectedQuote, status: newStatus });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">New</span>;
      case 'contacted':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">Contacted</span>;
      case 'converted':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Converted</span>;
      case 'closed':
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">Closed</span>;
      default:
        return null;
    }
  };

  const filteredQuotes = statusFilter === 'all'
    ? quotes
    : quotes.filter(q => q.status === statusFilter);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Quote Requests</h1>
        <p className="text-gray-500">Manage incoming quote requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm text-center">
          <p className="text-2xl font-bold text-blue-600">{quotes.filter(q => q.status === 'new').length}</p>
          <p className="text-xs text-gray-500">New</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm text-center">
          <p className="text-2xl font-bold text-yellow-600">{quotes.filter(q => q.status === 'contacted').length}</p>
          <p className="text-xs text-gray-500">Contacted</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm text-center">
          <p className="text-2xl font-bold text-green-600">{quotes.filter(q => q.status === 'converted').length}</p>
          <p className="text-xs text-gray-500">Converted</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm text-center">
          <p className="text-2xl font-bold text-gray-600">{quotes.filter(q => q.status === 'closed').length}</p>
          <p className="text-xs text-gray-500">Closed</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quotes List */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Quotes ({quotes.length})</option>
              <option value="new">New ({quotes.filter(q => q.status === 'new').length})</option>
              <option value="contacted">Contacted ({quotes.filter(q => q.status === 'contacted').length})</option>
              <option value="converted">Converted ({quotes.filter(q => q.status === 'converted').length})</option>
              <option value="closed">Closed ({quotes.filter(q => q.status === 'closed').length})</option>
            </select>
          </div>

          <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
            {filteredQuotes.map((quote) => {
              const category = serviceCategories.find(c => c.slug === quote.serviceType);
              const isSelected = selectedQuote?.id === quote.id;

              return (
                <button
                  key={quote.id}
                  onClick={() => setSelectedQuote(quote)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                    isSelected ? 'bg-boerne-gold/10 border-l-4 border-boerne-gold' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{quote.name}</span>
                        {quote.status === 'new' && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm">{category?.icon}</span>
                        <span className="text-sm text-gray-500">{category?.name}</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{formatDate(quote.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{quote.message}</p>
                </button>
              );
            })}

            {filteredQuotes.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No quotes found
              </div>
            )}
          </div>
        </div>

        {/* Quote Detail */}
        <div className="lg:col-span-2">
          {selectedQuote ? (
            <div className="bg-white rounded-xl shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedQuote.name}</h2>
                  <p className="text-sm text-gray-500">{formatDate(selectedQuote.createdAt)}</p>
                </div>
                {getStatusBadge(selectedQuote.status)}
              </div>

              <div className="p-6 space-y-6">
                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Email</label>
                    <p className="text-gray-900">
                      <a href={`mailto:${selectedQuote.email}`} className="text-boerne-gold hover:underline">
                        {selectedQuote.email}
                      </a>
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Phone</label>
                    <p className="text-gray-900">
                      <a href={`tel:${selectedQuote.phone}`} className="text-boerne-gold hover:underline">
                        {selectedQuote.phone}
                      </a>
                    </p>
                  </div>
                </div>

                {/* Service & Provider */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Service Type</label>
                    <div className="flex items-center gap-2">
                      <span>{serviceCategories.find(c => c.slug === selectedQuote.serviceType)?.icon}</span>
                      <span className="text-gray-900">
                        {serviceCategories.find(c => c.slug === selectedQuote.serviceType)?.name}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Requested Provider</label>
                    <p className="text-gray-900">
                      {selectedQuote.providerName || 'Any provider'}
                    </p>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Message</label>
                  <p className="text-gray-900 mt-1 p-4 bg-gray-50 rounded-lg">
                    {selectedQuote.message}
                  </p>
                </div>

                {/* Actions */}
                <div className="border-t pt-6">
                  <label className="text-xs font-medium text-gray-500 uppercase mb-3 block">Update Status</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => updateQuoteStatus(selectedQuote.id, 'new')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedQuote.status === 'new'
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      New
                    </button>
                    <button
                      onClick={() => updateQuoteStatus(selectedQuote.id, 'contacted')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedQuote.status === 'contacted'
                          ? 'bg-yellow-600 text-white'
                          : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      }`}
                    >
                      Contacted
                    </button>
                    <button
                      onClick={() => updateQuoteStatus(selectedQuote.id, 'converted')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedQuote.status === 'converted'
                          ? 'bg-green-600 text-white'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      Converted
                    </button>
                    <button
                      onClick={() => updateQuoteStatus(selectedQuote.id, 'closed')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedQuote.status === 'closed'
                          ? 'bg-gray-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Closed
                    </button>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-3">
                  <a
                    href={`mailto:${selectedQuote.email}?subject=Re: Your quote request on Boerne's Handy Hub`}
                    className="flex-1 px-4 py-2 bg-boerne-gold text-boerne-navy font-semibold rounded-lg text-center hover:bg-boerne-gold-alt transition-colors"
                  >
                    Send Email
                  </a>
                  <a
                    href={`tel:${selectedQuote.phone}`}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg text-center hover:bg-gray-50 transition-colors"
                  >
                    Call
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm h-full flex items-center justify-center text-gray-500 min-h-[400px]">
              <div className="text-center">
                <span className="text-4xl">📩</span>
                <p className="mt-2">Select a quote to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex gap-3">
          <span className="text-blue-500 text-xl">ℹ️</span>
          <div>
            <h3 className="font-medium text-blue-900">Quote Management</h3>
            <p className="text-sm text-blue-700 mt-1">
              This is sample data for demonstration. When the quote API is connected to a database,
              real quote requests will appear here. You'll be able to track leads, contact customers,
              and measure conversion rates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
