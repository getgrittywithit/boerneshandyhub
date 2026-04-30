'use client';

import Link from 'next/link';
import type { SearchDocument } from '@/lib/search/types';
import { getTierDisplay } from '@/lib/search/tierBoost';

interface SearchResultRowProps {
  result: SearchDocument;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}

export default function SearchResultRow({
  result,
  index,
  isSelected,
  onClick,
}: SearchResultRowProps) {
  const tierDisplay = getTierDisplay(result.tier);

  // Get icon based on source type
  const getSourceIcon = () => {
    switch (result.source_type) {
      case 'business':
        return '🏢';
      case 'category':
        return '🔧';
      case 'realtor':
        return '🏠';
      case 'page':
        return '📄';
      default:
        return '📌';
    }
  };

  return (
    <Link
      href={result.url}
      onClick={(e) => {
        onClick();
      }}
      className={`flex items-center gap-3 px-4 py-3 transition-colors ${
        isSelected
          ? 'bg-boerne-gold/10 border-l-2 border-boerne-gold'
          : 'hover:bg-gray-50 border-l-2 border-transparent'
      }`}
      data-index={index}
    >
      {/* Icon */}
      <span className="text-xl flex-shrink-0">{getSourceIcon()}</span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-boerne-navy truncate">
            {result.title}
          </span>
          {tierDisplay.badge && (
            <span
              className={`px-1.5 py-0.5 text-xs font-semibold rounded ${tierDisplay.color}`}
            >
              {tierDisplay.label}
            </span>
          )}
        </div>
        {result.subtitle && (
          <p className="text-sm text-gray-500 truncate">{result.subtitle}</p>
        )}
        {result.description && (
          <p className="text-xs text-gray-400 truncate mt-0.5">
            {result.description}
          </p>
        )}
      </div>

      {/* Arrow indicator */}
      <svg
        className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${
          isSelected ? 'translate-x-1' : ''
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </Link>
  );
}
