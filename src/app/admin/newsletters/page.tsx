'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { NewsletterDraft, SubscriberBreakdown } from '@/types/newsletter';

interface DashboardStats {
  total_subscribers: number;
  subscribers_this_month: number;
  breakdown: SubscriberBreakdown;
}

export default function NewslettersAdminPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [drafts, setDrafts] = useState<NewsletterDraft[]>([]);
  const [sentNewsletters, setSentNewsletters] = useState<NewsletterDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load subscribers stats
      const subsResponse = await fetch('/api/newsletters/subscribers?limit=1');
      const subsData = await subsResponse.json();

      setStats({
        total_subscribers: subsData.stats?.total || 0,
        subscribers_this_month: subsData.stats?.total || 0, // TODO: Calculate actual monthly
        breakdown: {
          homeowners: subsData.stats?.homeowners || 0,
          realtors: subsData.stats?.realtors || 0,
          businesses: subsData.stats?.businesses || 0,
          total: subsData.stats?.total || 0,
        },
      });

      // Load drafts
      const draftsResponse = await fetch('/api/newsletters/drafts');
      if (draftsResponse.ok) {
        const draftsData = await draftsResponse.json();
        setDrafts(draftsData.drafts?.filter((d: NewsletterDraft) => d.status === 'draft') || []);
        setSentNewsletters(draftsData.drafts?.filter((d: NewsletterDraft) => d.status === 'sent') || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDraft = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/newsletters/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to editor
        window.location.href = `/admin/newsletters/${data.draft.id}`;
      } else {
        alert('Failed to generate newsletter. Please try again.');
      }
    } catch (error) {
      console.error('Error generating draft:', error);
      alert('Failed to generate newsletter. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="grid grid-cols-3 gap-6">
            <div className="h-32 bg-gray-200 rounded-xl"></div>
            <div className="h-32 bg-gray-200 rounded-xl"></div>
            <div className="h-32 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Newsletters</h1>
          <p className="text-gray-600 mt-1">Manage email campaigns and subscribers</p>
        </div>
        <button
          onClick={handleGenerateDraft}
          disabled={generating}
          className="px-4 py-2 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {generating ? (
            <>
              <span className="animate-spin">⚙️</span>
              Generating...
            </>
          ) : (
            <>
              <span>✨</span>
              Generate Newsletter
            </>
          )}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Subscribers</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats?.total_subscribers || 0}
              </p>
            </div>
            <div className="text-3xl">📧</div>
          </div>
          <Link
            href="/admin/newsletters/subscribers"
            className="text-sm text-boerne-gold hover:text-boerne-gold-alt mt-4 inline-block"
          >
            View all →
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Homeowners</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats?.breakdown.homeowners || 0}
              </p>
            </div>
            <div className="text-3xl">🏠</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Realtors</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats?.breakdown.realtors || 0}
              </p>
            </div>
            <div className="text-3xl">🏢</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Businesses</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats?.breakdown.businesses || 0}
              </p>
            </div>
            <div className="text-3xl">💼</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Drafts Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>📝</span>
            Drafts
          </h2>

          {drafts.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-gray-500 mb-4">No drafts yet</p>
              <button
                onClick={handleGenerateDraft}
                disabled={generating}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Generate First Newsletter
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {drafts.map((draft) => (
                <Link
                  key={draft.id}
                  href={`/admin/newsletters/${draft.id}`}
                  className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{draft.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Created {formatDate(draft.created_at)}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                      Draft
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Sent Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>✅</span>
            Sent
          </h2>

          {sentNewsletters.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">📬</div>
              <p className="text-gray-500">No newsletters sent yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Generate and approve a newsletter to get started
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sentNewsletters.map((newsletter) => (
                <div
                  key={newsletter.id}
                  className="p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{newsletter.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Sent {formatDate(newsletter.sent_at || newsletter.created_at)}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      Sent
                    </span>
                  </div>
                  {newsletter.send_stats && (
                    <div className="mt-3 flex gap-4 text-sm">
                      <span className="text-gray-600">
                        Opens: {newsletter.send_stats.open_rate || 0}%
                      </span>
                      <span className="text-gray-600">
                        Clicks: {newsletter.send_stats.click_rate || 0}%
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <Link
            href="/admin/newsletters/subscribers"
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-2xl">👥</span>
            <div>
              <p className="font-medium text-gray-900">Manage Subscribers</p>
              <p className="text-sm text-gray-500">View, export, manage list</p>
            </div>
          </Link>

          <Link
            href="/admin/newsletters/templates"
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-2xl">📋</span>
            <div>
              <p className="font-medium text-gray-900">Templates</p>
              <p className="text-sm text-gray-500">Edit newsletter templates</p>
            </div>
          </Link>

          <Link
            href="/admin/settings"
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-2xl">⚙️</span>
            <div>
              <p className="font-medium text-gray-900">Email Settings</p>
              <p className="text-sm text-gray-500">Configure Resend, scheduling</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
