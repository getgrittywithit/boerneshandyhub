'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { search, trackClick, getSearchSessionId } from './client';
import type { SearchResponse, SearchScope, SearchDocument, SearchSource } from './types';

interface UseSearchOptions {
  scope?: SearchScope;
  limit?: number;
  minQueryLength?: number;
}

interface UseSearchResult {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResponse | null;
  isLoading: boolean;
  error: string | null;
  handleResultClick: (result: SearchDocument, position: number) => void;
  clearResults: () => void;
}

export function useSearch(options: UseSearchOptions = {}): UseSearchResult {
  const { scope, limit = 20, minQueryLength = 2 } = options;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Execute search when query changes
  useEffect(() => {
    // Clear results for empty or too short queries
    if (query.length < minQueryLength) {
      setResults(null);
      setError(null);
      return;
    }

    // Cancel any pending search
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    setError(null);

    search({
      query,
      scope,
      limit,
    })
      .then((response) => {
        setResults(response);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Search failed');
          setIsLoading(false);
        }
      });

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query, scope, limit, minQueryLength]);

  // Handle clicking on a search result
  const handleResultClick = useCallback((result: SearchDocument, position: number) => {
    if (results?.query_id) {
      trackClick({
        query_id: results.query_id,
        result_id: result.id,
        position,
        source_type: result.source_type,
      });
    }
  }, [results?.query_id]);

  // Clear all results
  const clearResults = useCallback(() => {
    setQuery('');
    setResults(null);
    setError(null);
  }, []);

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    handleResultClick,
    clearResults,
  };
}

// Hook for keyboard shortcut (Cmd/Ctrl+K)
export function useSearchShortcut(onOpen: () => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        onOpen();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onOpen]);
}

// Hook for keyboard navigation in results
export function useSearchKeyboardNav(
  results: SearchResponse | null,
  onSelect: (result: SearchDocument) => void,
  onClose: () => void
) {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Flatten results for navigation
  const flatResults = results?.groups.flatMap((group) => group.results) || [];

  useEffect(() => {
    // Reset selection when results change
    setSelectedIndex(-1);
  }, [results]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!results || flatResults.length === 0) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex((prev) =>
            prev < flatResults.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          event.preventDefault();
          if (selectedIndex >= 0 && flatResults[selectedIndex]) {
            onSelect(flatResults[selectedIndex]);
          }
          break;
        case 'Escape':
          event.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [results, flatResults, selectedIndex, onSelect, onClose]);

  return { selectedIndex, setSelectedIndex, flatResults };
}
