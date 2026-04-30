'use client';

import { useState, useCallback } from 'react';
import { topLevelCategories } from '@/data/serviceCategories';
import { pricingTiers, type TierKey } from '@/data/pricingTiers';

interface RankedCategory {
  slug: string;
  name: string;
  icon: string;
}

interface RankedCategoryPickerProps {
  topCategory: string;
  rankedCategories: string[]; // Array of slugs in ranked order
  onChange: (rankedCategories: string[]) => void;
  maxCategories?: number;
  tierKey?: TierKey;
  error?: string;
}

export default function RankedCategoryPicker({
  topCategory,
  rankedCategories,
  onChange,
  maxCategories = 5,
  tierKey = 'claimed',
  error,
}: RankedCategoryPickerProps) {
  const [isDragging, setIsDragging] = useState<number | null>(null);

  // Get subcategories for selected top category
  const availableSubcategories = topLevelCategories
    .find(cat => cat.slug === topCategory)
    ?.subcategories || [];

  // Get active limit for current tier
  const activeLimit = pricingTiers[tierKey]?.categoryLimit || 1;

  // Convert slugs to full objects with names and icons
  const rankedWithDetails: RankedCategory[] = rankedCategories
    .map(slug => {
      const subcat = availableSubcategories.find(s => s.slug === slug);
      return subcat ? { slug, name: subcat.name, icon: subcat.icon } : null;
    })
    .filter((item): item is RankedCategory => item !== null);

  // Available (unselected) subcategories
  const unselectedSubcategories = availableSubcategories.filter(
    sub => !rankedCategories.includes(sub.slug)
  );

  const addCategory = (slug: string) => {
    if (rankedCategories.length < maxCategories) {
      onChange([...rankedCategories, slug]);
    }
  };

  const removeCategory = (slug: string) => {
    onChange(rankedCategories.filter(s => s !== slug));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newList = [...rankedCategories];
    [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
    onChange(newList);
  };

  const moveDown = (index: number) => {
    if (index === rankedCategories.length - 1) return;
    const newList = [...rankedCategories];
    [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
    onChange(newList);
  };

  // Drag and drop handlers
  const handleDragStart = useCallback((index: number) => {
    setIsDragging(index);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (isDragging === null || isDragging === index) return;

    const newList = [...rankedCategories];
    const draggedItem = newList[isDragging];
    newList.splice(isDragging, 1);
    newList.splice(index, 0, draggedItem);
    onChange(newList);
    setIsDragging(index);
  }, [isDragging, rankedCategories, onChange]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(null);
  }, []);

  if (!topCategory) {
    return (
      <div className="text-sm text-gray-500 italic p-4 bg-gray-50 rounded-lg">
        Please select a category first
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Info about ranking */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          <strong>Rank your services by priority.</strong> Your #1 category will be active on your free listing.
          Additional categories can be unlocked by upgrading your plan.
        </p>
      </div>

      {/* Ranked list */}
      {rankedWithDetails.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Your Ranked Services
          </label>
          <div className="space-y-2">
            {rankedWithDetails.map((category, index) => {
              const isActive = index < activeLimit;
              const rank = index + 1;

              return (
                <div
                  key={category.slug}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-grab active:cursor-grabbing ${
                    isDragging === index
                      ? 'opacity-50 border-dashed border-gray-400'
                      : isActive
                        ? 'border-green-500 bg-green-50'
                        : 'border-amber-300 bg-amber-50'
                  }`}
                >
                  {/* Rank number */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    isActive
                      ? 'bg-green-500 text-white'
                      : 'bg-amber-400 text-white'
                  }`}>
                    {rank}
                  </div>

                  {/* Icon and name */}
                  <span className="text-lg">{category.icon}</span>
                  <span className="flex-1 font-medium text-gray-900">{category.name}</span>

                  {/* Status badge */}
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    isActive
                      ? 'bg-green-500 text-white'
                      : 'bg-amber-200 text-amber-800'
                  }`}>
                    {isActive ? 'Active' : 'Upgrade'}
                  </span>

                  {/* Move buttons */}
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className={`p-1 rounded transition-colors ${
                        index === 0
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                      }`}
                      title="Move up"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDown(index)}
                      disabled={index === rankedCategories.length - 1}
                      className={`p-1 rounded transition-colors ${
                        index === rankedCategories.length - 1
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                      }`}
                      title="Move down"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => removeCategory(category.slug)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="Remove"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Drag hint */}
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            Drag to reorder or use arrows. Your #1 ranked service is your primary listing.
          </p>
        </div>
      )}

      {/* Available categories to add */}
      {unselectedSubcategories.length > 0 && rankedCategories.length < maxCategories && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add More Services <span className="font-normal text-gray-500">({rankedCategories.length}/{maxCategories} selected)</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {unselectedSubcategories.map((sub) => (
              <button
                key={sub.slug}
                type="button"
                onClick={() => addCategory(sub.slug)}
                className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:border-boerne-gold hover:bg-boerne-gold/5 transition-colors text-left"
              >
                <span>{sub.icon}</span>
                <span className="text-sm text-gray-700">{sub.name}</span>
                <span className="ml-auto text-boerne-gold">+</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* At max selection */}
      {rankedCategories.length >= maxCategories && (
        <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
          You've selected the maximum of {maxCategories} categories. Remove one to add a different service.
        </p>
      )}

      {/* Upsell info for additional categories */}
      {rankedWithDetails.length > activeLimit && (
        <div className="bg-gradient-to-r from-boerne-navy to-boerne-navy/90 rounded-lg p-4 text-white">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <span>✨</span> Unlock All Your Services
          </h4>
          <p className="text-sm text-white/90 mb-2">
            Your listing will appear in <strong>{rankedWithDetails[0].name}</strong>.
            Upgrade to appear in all {rankedWithDetails.length} categories:
          </p>
          <ul className="text-sm text-white/80 space-y-1">
            {rankedWithDetails.slice(activeLimit).map((cat, i) => (
              <li key={cat.slug}>
                #{i + activeLimit + 1} {cat.icon} {cat.name}
              </li>
            ))}
          </ul>
          <p className="text-xs text-white/60 mt-3">
            Upgrade options available after registration from your dashboard.
          </p>
        </div>
      )}

      {/* Error display */}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
