'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSearch, useSearchKeyboardNav } from '@/lib/search/useSearch';
import { SOURCE_CONFIG, type SearchDocument, type SearchScope } from '@/lib/search/types';
import SearchResultGroup from './SearchResultGroup';
import SuggestBusinessForm from './SuggestBusinessForm';

interface SearchOverlayProps {
  onClose: () => void;
  scope?: SearchScope;
  scopeLabel?: string;
}

export default function SearchOverlay({
  onClose,
  scope,
  scopeLabel,
}: SearchOverlayProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const { query, setQuery, results, isLoading, error, handleResultClick, clearResults } =
    useSearch({ scope, limit: 20 });

  // Handle selecting a result
  const handleSelect = useCallback(
    (result: SearchDocument) => {
      // Track click position
      const allResults = results?.groups.flatMap((g) => g.results) || [];
      const position = allResults.findIndex((r) => r.id === result.id);
      handleResultClick(result, position);

      // Navigate and close
      router.push(result.url);
      onClose();
    },
    [results, handleResultClick, router, onClose]
  );

  // Keyboard navigation
  const { selectedIndex, flatResults } = useSearchKeyboardNav(
    results,
    handleSelect,
    onClose
  );

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Prevent body scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Calculate base indices for keyboard navigation
  const getBaseIndex = (groupIndex: number) => {
    if (!results) return 0;
    return results.groups
      .slice(0, groupIndex)
      .reduce((acc, g) => acc + g.results.length, 0);
  };

  const hasResults = results && results.total > 0;
  const showSuggestForm = results && results.total === 0 && query.length >= 2;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] bg-black/50 backdrop-blur-sm">
      <div
        ref={overlayRef}
        className="w-full max-w-2xl mx-4 bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200">
          <svg
            className="w-5 h-5 text-gray-400 flex-shrink-0"
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
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              scopeLabel
                ? `Search in ${scopeLabel}...`
                : 'Search businesses, services, realtors...'
            }
            className="flex-1 text-lg text-boerne-navy placeholder:text-gray-400 outline-none"
          />
          {isLoading && (
            <div className="w-5 h-5 border-2 border-boerne-gold border-t-transparent rounded-full animate-spin" />
          )}
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scope indicator */}
        {scopeLabel && (
          <div className="px-4 py-2 bg-boerne-gold/10 border-b border-boerne-gold/20">
            <span className="text-sm text-boerne-navy">
              Searching in <strong>{scopeLabel}</strong>
            </span>
            <button
              onClick={() => {
                // Clear scope and search everywhere
                // This would need to be passed up to parent
              }}
              className="ml-2 text-sm text-boerne-gold hover:text-boerne-gold-alt underline"
            >
              Search all of BoernesHandyHub
            </button>
          </div>
        )}

        {/* Results area */}
        <div className="max-h-[60vh] overflow-y-auto">
          {/* Error state */}
          {error && (
            <div className="p-6 text-center">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Empty state (before searching) */}
          {!query && !error && (
            <div className="p-6 text-center text-gray-500">
              <p className="mb-2">Start typing to search...</p>
              <p className="text-sm">
                Find businesses, services, realtors, and more
              </p>
            </div>
          )}

          {/* Loading state */}
          {query && query.length >= 2 && isLoading && !results && (
            <div className="p-6 text-center text-gray-500">
              <p>Searching...</p>
            </div>
          )}

          {/* Results */}
          {hasResults && (
            <div className="py-2">
              {results.groups.map((group, groupIndex) => (
                <SearchResultGroup
                  key={group.source_type}
                  group={group}
                  selectedIndex={selectedIndex}
                  baseIndex={getBaseIndex(groupIndex)}
                  onResultClick={handleResultClick}
                />
              ))}

              {/* Results summary */}
              <div className="px-4 py-2 text-xs text-gray-400 border-t border-gray-100">
                {results.total} result{results.total !== 1 ? 's' : ''} in{' '}
                {results.took_ms}ms
              </div>
            </div>
          )}

          {/* No results - show suggest form */}
          {showSuggestForm && (
            <div className="p-4">
              <p className="text-center text-gray-500 mb-4">
                No results found for &quot;{query}&quot;
              </p>
              <SuggestBusinessForm searchQuery={query} onSuccess={onClose} />
            </div>
          )}
        </div>

        {/* Footer with keyboard hints */}
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded">
              ↑↓
            </kbd>
            Navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded">
              Enter
            </kbd>
            Select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded">
              Esc
            </kbd>
            Close
          </span>
        </div>
      </div>
    </div>
  );
}
