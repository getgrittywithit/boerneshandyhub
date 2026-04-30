'use client';

import type { SearchResultGroup as SearchResultGroupType, SearchDocument } from '@/lib/search/types';
import SearchResultRow from './SearchResultRow';

interface SearchResultGroupProps {
  group: SearchResultGroupType;
  selectedIndex: number;
  baseIndex: number;
  onResultClick: (result: SearchDocument, position: number) => void;
}

export default function SearchResultGroup({
  group,
  selectedIndex,
  baseIndex,
  onResultClick,
}: SearchResultGroupProps) {
  if (group.results.length === 0) return null;

  return (
    <div className="mb-4">
      {/* Group header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-y border-gray-100">
        <span>{group.icon}</span>
        <span className="text-sm font-semibold text-gray-600">{group.label}</span>
        <span className="text-xs text-gray-400">({group.count})</span>
      </div>

      {/* Results */}
      <div>
        {group.results.map((result, idx) => {
          const globalIndex = baseIndex + idx;
          return (
            <SearchResultRow
              key={result.id}
              result={result}
              index={globalIndex}
              isSelected={selectedIndex === globalIndex}
              onClick={() => onResultClick(result, globalIndex)}
            />
          );
        })}
      </div>
    </div>
  );
}
