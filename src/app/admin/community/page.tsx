'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  type Contribution,
  type Contributor,
  type ContributionAsset,
  REJECTION_REASONS,
} from '@/lib/community/types';
import { formatDisplayName } from '@/lib/community/client';

interface QueueItem extends Omit<Contribution, 'contributor' | 'assets'> {
  contributor: Contributor | null;
  assets: ContributionAsset[];
}

type TabType = 'queue' | 'decisions' | 'contributors';

export default function AdminCommunityPage() {
  const [activeTab, setActiveTab] = useState<TabType>('queue');
  const [items, setItems] = useState<QueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [customRejectText, setCustomRejectText] = useState('');
  const [filter, setFilter] = useState<'all' | 'ai_flag' | 'ai_clear'>('all');

  // Fetch queue items
  const fetchQueue = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/community/queue?tab=${activeTab}&filter=${filter}`);
      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      console.error('Failed to fetch queue:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, filter]);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showRejectModal) return;

      switch (e.key) {
        case 'j':
          setSelectedIndex((i) => Math.min(i + 1, items.length - 1));
          break;
        case 'k':
          setSelectedIndex((i) => Math.max(i - 1, 0));
          break;
        case ' ':
          e.preventDefault();
          if (items[selectedIndex]) {
            setExpandedId((id) =>
              id === items[selectedIndex].id ? null : items[selectedIndex].id
            );
          }
          break;
        case 'a':
          if (items[selectedIndex]) {
            handleApprove(items[selectedIndex].id);
          }
          break;
        case 'r':
          if (items[selectedIndex]) {
            setRejectingId(items[selectedIndex].id);
            setShowRejectModal(true);
          }
          break;
        case 'Escape':
          setShowRejectModal(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, selectedIndex, showRejectModal]);

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch('/api/admin/community/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contribution_id: id }),
      });

      if (response.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error('Failed to approve:', error);
    }
  };

  const handleReject = async () => {
    if (!rejectingId) return;

    const reason = REJECTION_REASONS.find((r) => r.id === rejectReason);
    const message =
      rejectReason === 'other'
        ? customRejectText
        : reason?.message || customRejectText;

    try {
      const response = await fetch('/api/admin/community/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contribution_id: rejectingId,
          reason: rejectReason,
          message,
        }),
      });

      if (response.ok) {
        setItems((prev) => prev.filter((item) => item.id !== rejectingId));
        setShowRejectModal(false);
        setRejectingId(null);
        setRejectReason('');
        setCustomRejectText('');
      }
    } catch (error) {
      console.error('Failed to reject:', error);
    }
  };

  const getAIBadge = (item: QueueItem) => {
    if (!item.ai_verdict) return null;
    const verdict = (item.ai_verdict as { verdict: string }).verdict;

    switch (verdict) {
      case 'ai_clear':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            AI Clear
          </span>
        );
      case 'ai_flag':
        return (
          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
            AI Flagged
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
            Pending
          </span>
        );
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'feedback':
        return '📨';
      case 'photo':
        return '📷';
      case 'story':
        return '📖';
      case 'tip':
        return '💡';
      default:
        return '📄';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-gray-500 hover:text-gray-700"
              >
                ← Admin
              </Link>
              <h1 className="text-xl font-bold text-gray-900">
                Community Contributions
              </h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <kbd className="px-1.5 py-0.5 bg-gray-100 border rounded">J/K</kbd>
              Navigate
              <kbd className="px-1.5 py-0.5 bg-gray-100 border rounded ml-2">Space</kbd>
              Expand
              <kbd className="px-1.5 py-0.5 bg-gray-100 border rounded ml-2">A</kbd>
              Approve
              <kbd className="px-1.5 py-0.5 bg-gray-100 border rounded ml-2">R</kbd>
              Reject
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 mt-4">
        <div className="flex gap-1 bg-white rounded-lg p-1 shadow-sm w-fit">
          {(['queue', 'decisions', 'contributors'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-boerne-navy text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab === 'queue'
                ? `Queue (${items.length})`
                : tab === 'decisions'
                ? 'Recent Decisions'
                : 'Contributors'}
            </button>
          ))}
        </div>

        {/* Filters */}
        {activeTab === 'queue' && (
          <div className="flex gap-2 mt-4">
            {(['all', 'ai_flag', 'ai_clear'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-sm ${
                  filter === f
                    ? 'bg-boerne-navy text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {f === 'all' ? 'All' : f === 'ai_flag' ? 'Flagged' : 'Clear'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Queue Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🎉</div>
            <p className="text-gray-600">Queue is empty!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`bg-white rounded-lg shadow-sm border-2 transition-colors ${
                  index === selectedIndex
                    ? 'border-boerne-gold'
                    : 'border-transparent'
                }`}
              >
                {/* Row header */}
                <div
                  className="flex items-center gap-4 p-4 cursor-pointer"
                  onClick={() =>
                    setExpandedId((id) => (id === item.id ? null : item.id))
                  }
                >
                  <span className="text-2xl">{getTypeIcon(item.type)}</span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 truncate">
                        {item.contributor
                          ? formatDisplayName(
                              item.contributor.name,
                              item.contributor.display_pref
                            )
                          : 'Anonymous'}
                      </span>
                      <span className="text-gray-400">·</span>
                      <span className="text-sm text-gray-500">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                      {getAIBadge(item)}
                    </div>
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {item.title || item.body?.slice(0, 100) || 'No content'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(item.id);
                      }}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm font-medium hover:bg-green-200 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setRejectingId(item.id);
                        setShowRejectModal(true);
                      }}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>

                {/* Expanded content */}
                {expandedId === item.id && (
                  <div className="px-4 pb-4 border-t border-gray-100 pt-4">
                    {/* Photos */}
                    {item.assets && item.assets.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 mb-4">
                        {item.assets.map((asset) => (
                          <img
                            key={asset.id}
                            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${asset.bucket}/${asset.storage_path}`}
                            alt={asset.caption || 'Upload'}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    )}

                    {/* Body content */}
                    {item.body && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {item.body}
                        </p>
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="text-sm text-gray-500 space-y-1">
                      {item.contributor?.email && (
                        <p>
                          <strong>Email:</strong> {item.contributor.email}
                        </p>
                      )}
                      {item.metadata && Object.keys(item.metadata).length > 0 && (
                        <p>
                          <strong>Metadata:</strong>{' '}
                          {JSON.stringify(item.metadata)}
                        </p>
                      )}
                      {item.ai_verdict && (
                        <p>
                          <strong>AI Verdict:</strong>{' '}
                          {JSON.stringify(item.ai_verdict)}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Reject Submission
            </h3>

            <div className="space-y-3 mb-4">
              {REJECTION_REASONS.map((reason) => (
                <label
                  key={reason.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    rejectReason === reason.id
                      ? 'border-boerne-gold bg-boerne-gold/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="rejectReason"
                    value={reason.id}
                    checked={rejectReason === reason.id}
                    onChange={() => setRejectReason(reason.id)}
                    className="text-boerne-gold focus:ring-boerne-gold"
                  />
                  <span className="text-gray-700">{reason.label}</span>
                </label>
              ))}
            </div>

            {rejectReason === 'other' && (
              <textarea
                value={customRejectText}
                onChange={(e) => setCustomRejectText(e.target.value)}
                placeholder="Enter reason..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-boerne-gold"
              />
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectingId(null);
                  setRejectReason('');
                  setCustomRejectText('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason || (rejectReason === 'other' && !customRejectText)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
