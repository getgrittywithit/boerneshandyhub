'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface GuideSearchProps {
  initialQuery?: string;
}

export default function GuideSearch({ initialQuery = '' }: GuideSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/guides?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/guides');
    }
  }, [query, router]);

  return (
    <form onSubmit={handleSubmit} className="relative max-w-xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search guides... (e.g., plumbing, AC maintenance, moving)"
          className="w-full px-5 py-4 pl-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
        />
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              router.push('/guides');
            }}
            className="absolute right-14 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors text-sm"
        >
          Search
        </button>
      </div>
    </form>
  );
}
