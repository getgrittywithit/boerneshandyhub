'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  ExternalLink,
  AlertTriangle,
  Globe,
  Filter
} from 'lucide-react';
import type { Website } from '@/lib/websites/types';

type WebsiteWithBusiness = Website & {
  business: {
    id: string;
    name: string;
    phone: string | null;
    email: string | null;
  };
};

const statusTabs = [
  { key: 'pending_review', label: 'Pending Review', icon: Clock },
  { key: 'live', label: 'Live', icon: Globe },
  { key: 'flagged', label: 'Flagged', icon: AlertTriangle },
  { key: 'all', label: 'All', icon: Filter },
];

export default function AdminWebsitesPage() {
  const [websites, setWebsites] = useState<WebsiteWithBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending_review');
  const [selectedWebsite, setSelectedWebsite] = useState<WebsiteWithBusiness | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchWebsites();
  }, [activeTab]);

  const fetchWebsites = async () => {
    setLoading(true);
    try {
      const params = activeTab === 'all' ? '' : `?status=${activeTab}`;
      const res = await fetch(`/api/admin/websites${params}`);
      if (res.ok) {
        const data = await res.json();
        setWebsites(data);
      }
    } catch (error) {
      console.error('Error fetching websites:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveWebsite = async (websiteId: string) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/websites/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ website_id: websiteId }),
      });

      if (res.ok) {
        fetchWebsites();
        setSelectedWebsite(null);
      }
    } catch (error) {
      console.error('Error approving website:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const rejectWebsite = async (websiteId: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/websites/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          website_id: websiteId,
          reason: rejectionReason,
        }),
      });

      if (res.ok) {
        fetchWebsites();
        setSelectedWebsite(null);
        setRejectionReason('');
      }
    } catch (error) {
      console.error('Error rejecting website:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const pendingCount = websites.filter(w => w.status === 'pending_review').length;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Website Management</h1>
          <p className="text-gray-600">Review and manage business websites</p>
        </div>
        {pendingCount > 0 && activeTab !== 'pending_review' && (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
            {pendingCount} pending review
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {statusTabs.map((tab) => {
          const Icon = tab.icon;
          const count = tab.key === 'all'
            ? websites.length
            : websites.filter(w => w.status === tab.key).length;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-boerne-navy text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Icon size={16} />
              {tab.label}
              {tab.key === 'pending_review' && count > 0 && (
                <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                  activeTab === tab.key ? 'bg-white/20' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Website List */}
      <div className="bg-white rounded-lg shadow-sm">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-boerne-navy mx-auto"></div>
          </div>
        ) : websites.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No websites found
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {websites.map((website) => (
              <div
                key={website.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900">
                        {website.business?.name || 'Unknown Business'}
                      </h3>
                      <StatusBadge status={website.status} />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      /{website.slug} • {website.template} template
                    </p>
                    {website.submitted_at && (
                      <p className="text-xs text-gray-400 mt-1">
                        Submitted {new Date(website.submitted_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/site/${website.slug}`}
                      target="_blank"
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Preview"
                    >
                      <Eye size={18} />
                    </Link>
                    {website.status === 'pending_review' && (
                      <button
                        onClick={() => setSelectedWebsite(website)}
                        className="px-3 py-1.5 bg-boerne-navy text-white text-sm rounded-lg hover:bg-boerne-navy/90"
                      >
                        Review
                      </button>
                    )}
                    {website.status === 'live' && (
                      <a
                        href={`/site/${website.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-gray-600"
                        title="View Live"
                      >
                        <ExternalLink size={18} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedWebsite && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Review Website</h2>
                <button
                  onClick={() => {
                    setSelectedWebsite(null);
                    setRejectionReason('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Business Info */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Business</h3>
                <p className="text-gray-700">{selectedWebsite.business?.name}</p>
                <p className="text-sm text-gray-500">
                  {selectedWebsite.business?.phone} • {selectedWebsite.business?.email}
                </p>
              </div>

              {/* Website Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Template</p>
                  <p className="font-medium">{selectedWebsite.template}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Slug</p>
                  <p className="font-medium">/{selectedWebsite.slug}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Services</p>
                  <p className="font-medium">{selectedWebsite.services?.length || 0} listed</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Testimonials</p>
                  <p className="font-medium">{selectedWebsite.testimonials?.length || 0} added</p>
                </div>
              </div>

              {/* Preview Link */}
              <div className="mb-6">
                <Link
                  href={`/site/${selectedWebsite.slug}`}
                  target="_blank"
                  className="flex items-center gap-2 text-boerne-navy hover:underline"
                >
                  <Eye size={16} />
                  Preview Website
                </Link>
              </div>

              {/* Tagline */}
              {selectedWebsite.tagline && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Tagline</p>
                  <p className="font-medium">{selectedWebsite.tagline}</p>
                </div>
              )}

              {/* About */}
              {selectedWebsite.about_text && (
                <div className="mb-6">
                  <p className="text-sm text-gray-500">About Text</p>
                  <p className="text-gray-700 mt-1 whitespace-pre-line">
                    {selectedWebsite.about_text}
                  </p>
                </div>
              )}

              {/* Rejection Reason */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rejection Reason (required to reject)
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Explain what needs to be changed..."
                  rows={3}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => approveWebsite(selectedWebsite.id)}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  <CheckCircle2 size={18} />
                  Approve & Publish
                </button>
                <button
                  onClick={() => rejectWebsite(selectedWebsite.id)}
                  disabled={actionLoading || !rejectionReason.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  <XCircle size={18} />
                  Request Changes
                </button>
                <button
                  onClick={() => {
                    setSelectedWebsite(null);
                    setRejectionReason('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; color: string }> = {
    draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700' },
    pending_review: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
    changes_requested: { label: 'Changes Requested', color: 'bg-orange-100 text-orange-700' },
    approved: { label: 'Approved', color: 'bg-blue-100 text-blue-700' },
    live: { label: 'Live', color: 'bg-green-100 text-green-700' },
    flagged: { label: 'Flagged', color: 'bg-red-100 text-red-700' },
    suspended: { label: 'Suspended', color: 'bg-red-100 text-red-700' },
    archived: { label: 'Archived', color: 'bg-gray-100 text-gray-500' },
  };

  const { label, color } = config[status] || { label: status, color: 'bg-gray-100 text-gray-700' };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {label}
    </span>
  );
}
