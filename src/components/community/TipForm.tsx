'use client';

import { useState, useEffect } from 'react';
import { submitContribution, getTipLists } from '@/lib/community/client';
import type { TipList, DisplayPref } from '@/lib/community/types';

interface TipFormProps {
  onSuccess: (message: string, requiresVerification: boolean) => void;
}

export default function TipForm({ onSuccess }: TipFormProps) {
  const [tipLists, setTipLists] = useState<TipList[]>([]);
  const [isLoadingLists, setIsLoadingLists] = useState(true);
  const [listSlug, setListSlug] = useState('');
  const [pick, setPick] = useState('');
  const [whyPick, setWhyPick] = useState('');
  const [suggestNewList, setSuggestNewList] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [displayPref, setDisplayPref] = useState<DisplayPref>('first_name');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Load tip lists on mount
  useEffect(() => {
    async function loadLists() {
      try {
        const lists = await getTipLists();
        setTipLists(lists);
      } catch (err) {
        console.error('Failed to load tip lists:', err);
      } finally {
        setIsLoadingLists(false);
      }
    }
    loadLists();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!listSlug && !suggestNewList) {
      setError('Please select a list or suggest a new one');
      return;
    }

    if (pick.length < 30) {
      setError('Your pick should be at least 30 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitContribution({
        type: 'tip',
        email,
        name: name || undefined,
        display_pref: displayPref,
        list_slug: listSlug || 'suggested',
        pick,
        why_pick: whyPick || undefined,
        suggest_new_list: suggestNewList || undefined,
      });

      if (result.success) {
        onSuccess(
          result.requires_verification
            ? "We've sent you a verification email. Click the link to confirm your submission. We'll review your tip within 48 hours."
            : "Thanks for sharing your local knowledge! We'll review your tip within 48 hours and email you when it's live.",
          result.requires_verification || false
        );
      } else {
        setError(result.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Failed to submit. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedList = tipLists.find((l) => l.slug === listSlug);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">💡</span>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Share a local tip</h3>
          <p className="text-sm text-gray-500">
            Recommend your favorite spots to fellow Boerne residents
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* List selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Which list? <span className="text-red-500">*</span>
          </label>
          {isLoadingLists ? (
            <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-500 text-sm">
              Loading lists...
            </div>
          ) : (
            <select
              value={listSlug}
              onChange={(e) => setListSlug(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-boerne-gold"
            >
              <option value="">Select a list...</option>
              {tipLists.map((list) => (
                <option key={list.slug} value={list.slug}>
                  {list.title}
                </option>
              ))}
            </select>
          )}
          {selectedList?.description && (
            <p className="text-sm text-gray-500 mt-1">{selectedList.description}</p>
          )}
        </div>

        {/* Your pick */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your pick <span className="text-red-500">*</span>
          </label>
          <textarea
            value={pick}
            onChange={(e) => setPick(e.target.value)}
            required
            minLength={30}
            maxLength={500}
            rows={3}
            placeholder="What's your recommendation? (e.g., &quot;The swimming hole at River Road Park — the water is crystal clear and there's plenty of shade.&quot;)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-boerne-gold resize-none"
          />
          <p className="text-xs text-gray-400 mt-1">
            {pick.length}/500 characters
            {pick.length < 30 && pick.length > 0 && (
              <span className="text-amber-600 ml-2">
                ({30 - pick.length} more needed)
              </span>
            )}
          </p>
        </div>

        {/* Why it's a pick */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Why is this your pick? <span className="text-gray-400">(recommended)</span>
          </label>
          <textarea
            value={whyPick}
            onChange={(e) => setWhyPick(e.target.value)}
            maxLength={300}
            rows={2}
            placeholder="What makes this spot special to you?"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-boerne-gold resize-none"
          />
        </div>

        {/* Suggest new list */}
        <div className="border-t border-gray-200 pt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Don&apos;t see the right list?
          </label>
          <textarea
            value={suggestNewList}
            onChange={(e) => setSuggestNewList(e.target.value)}
            maxLength={200}
            rows={2}
            placeholder="Suggest a new list topic (e.g., &quot;Best places for a first date&quot;)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-boerne-gold resize-none"
          />
          <p className="text-xs text-gray-400 mt-1">
            This goes to our team — we&apos;ll add it if there&apos;s interest
          </p>
        </div>

        {/* Contributor info */}
        <div className="border-t border-gray-200 pt-6 space-y-4">
          <h4 className="font-medium text-gray-900">Your information</h4>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-boerne-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-boerne-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              How should we display your name?
            </label>
            <select
              value={displayPref}
              onChange={(e) => setDisplayPref(e.target.value as DisplayPref)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-boerne-gold"
            >
              <option value="full_name">Full name</option>
              <option value="first_name">First name only</option>
              <option value="initials">Initials</option>
              <option value="anonymous">Anonymous</option>
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-boerne-navy text-white font-semibold rounded-lg hover:bg-boerne-navy/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Tip'}
        </button>
      </form>
    </div>
  );
}
