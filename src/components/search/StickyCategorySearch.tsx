'use client';

import { useState, useCallback } from 'react';
import { useSearchShortcut } from '@/lib/search/useSearch';
import SearchOverlay from './SearchOverlay';
import type { SearchScope } from '@/lib/search/types';

interface StickyCategorySearchProps {
  categorySlug: string;
  categoryName: string;
  subcategorySlug?: string;
  subcategoryName?: string;
}

export default function StickyCategorySearch({
  categorySlug,
  categoryName,
  subcategorySlug,
  subcategoryName,
}: StickyCategorySearchProps) {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [searchAll, setSearchAll] = useState(false);

  const scope: SearchScope | undefined = searchAll
    ? undefined
    : {
        category_slug: categorySlug,
        subcategory_slug: subcategorySlug,
      };

  const scopeLabel = searchAll
    ? undefined
    : subcategoryName
    ? `${categoryName} > ${subcategoryName}`
    : categoryName;

  const openOverlay = useCallback(() => {
    setIsOverlayOpen(true);
    setSearchAll(false);
  }, []);

  const closeOverlay = useCallback(() => {
    setIsOverlayOpen(false);
    setSearchAll(false);
  }, []);

  const openAllSearch = useCallback(() => {
    setSearchAll(true);
    setIsOverlayOpen(true);
  }, []);

  // Listen for Cmd/Ctrl+K
  useSearchShortcut(openOverlay);

  return (
    <>
      {/* Sticky search bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-4">
            {/* Search input trigger */}
            <button
              onClick={openOverlay}
              className="flex-1 flex items-center gap-3 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-gray-500 transition-colors text-left"
            >
              <svg
                className="w-5 h-5 text-gray-400"
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
              <span className="flex-1">
                Search in {subcategoryName || categoryName}...
              </span>
              <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs text-gray-400">
                <span className="text-[10px]">&#8984;</span>K
              </kbd>
            </button>

            {/* Search all link */}
            <button
              onClick={openAllSearch}
              className="text-sm text-boerne-gold hover:text-boerne-gold-alt whitespace-nowrap"
            >
              Search all
            </button>
          </div>
        </div>
      </div>

      {/* Search overlay */}
      {isOverlayOpen && (
        <SearchOverlay
          onClose={closeOverlay}
          scope={scope}
          scopeLabel={scopeLabel}
        />
      )}
    </>
  );
}
