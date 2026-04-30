'use client';

import { useState, useCallback } from 'react';
import { useSearchShortcut } from '@/lib/search/useSearch';
import SearchOverlay from './SearchOverlay';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  placeholder = 'Search businesses, services...',
  className = '',
}: SearchBarProps) {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const openOverlay = useCallback(() => {
    setIsOverlayOpen(true);
  }, []);

  const closeOverlay = useCallback(() => {
    setIsOverlayOpen(false);
  }, []);

  // Listen for Cmd/Ctrl+K
  useSearchShortcut(openOverlay);

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={openOverlay}
        className={`flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white/70 hover:text-white transition-all ${className}`}
      >
        <svg
          className="w-4 h-4"
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
        <span className="text-sm hidden sm:inline">{placeholder}</span>
        <kbd className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 bg-white/10 rounded text-xs text-white/50">
          <span className="text-[10px]">&#8984;</span>K
        </kbd>
      </button>

      {/* Search overlay modal */}
      {isOverlayOpen && <SearchOverlay onClose={closeOverlay} />}
    </>
  );
}
