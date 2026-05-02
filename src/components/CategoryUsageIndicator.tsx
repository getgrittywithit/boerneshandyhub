'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  type TierKey,
  getCategoryLimit,
  getNextTierUp,
  pricingTiers,
} from '@/data/pricingTiers';

interface CategoryUsageIndicatorProps {
  currentCount: number;
  tierKey: TierKey;
  showUpgradePrompt?: boolean;
  variant?: 'default' | 'compact' | 'inline';
  onUpgradeClick?: () => void;
}

type UsageState = 'below' | 'at' | 'over';

function getUsageState(currentCount: number, limit: number): UsageState {
  if (currentCount > limit) return 'over';
  if (currentCount === limit) return 'at';
  return 'below';
}

export default function CategoryUsageIndicator({
  currentCount,
  tierKey,
  showUpgradePrompt = true,
  variant = 'default',
  onUpgradeClick,
}: CategoryUsageIndicatorProps) {
  const [showModal, setShowModal] = useState(false);
  const limit = getCategoryLimit(tierKey);
  const usageState = getUsageState(currentCount, limit);
  const nextTier = getNextTierUp(tierKey);

  // Progress bar styling based on state
  const progressStyles = {
    below: {
      bar: 'bg-gray-200',
      fill: 'bg-gray-400',
      text: 'text-gray-600',
      label: '',
    },
    at: {
      bar: 'bg-amber-100',
      fill: 'bg-amber-500',
      text: 'text-amber-700',
      label: ' — at limit',
    },
    over: {
      bar: 'bg-red-100',
      fill: 'bg-red-500',
      text: 'text-red-700',
      label: ` — please remove ${currentCount - limit} to match your plan`,
    },
  };

  const style = progressStyles[usageState];
  const percentage = Math.min((currentCount / limit) * 100, 100);

  if (variant === 'inline') {
    return (
      <span className={`text-sm ${style.text}`}>
        {currentCount} of {limit}
        {usageState !== 'below' && (
          <span className="font-medium">{style.label}</span>
        )}
      </span>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2">
        <div className={`h-2 w-24 rounded-full ${style.bar}`}>
          <div
            className={`h-full rounded-full transition-all ${style.fill}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className={`text-xs ${style.text}`}>
          {currentCount}/{limit}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Label */}
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${style.text}`}>
          Categories: {currentCount} of {limit}
          {usageState !== 'below' && (
            <span className="font-normal">{style.label}</span>
          )}
        </span>
        {usageState === 'over' && (
          <button
            onClick={() => setShowModal(true)}
            className="text-xs text-red-600 hover:text-red-700 font-medium"
          >
            Pick which to keep
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className={`h-2 rounded-full ${style.bar}`}>
        <div
          className={`h-full rounded-full transition-all ${style.fill}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Upgrade prompt for at-limit state */}
      {usageState === 'at' && showUpgradePrompt && nextTier && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-amber-600">
            Upgrade to {nextTier.displayName} for {nextTier.categoryLimit} categories
          </span>
          <button
            onClick={() => {
              if (onUpgradeClick) {
                onUpgradeClick();
              } else {
                setShowModal(true);
              }
            }}
            className="text-amber-700 hover:text-amber-800 font-medium"
          >
            Upgrade &rarr;
          </button>
        </div>
      )}

      {/* Upgrade Modal */}
      {showModal && (
        <UpgradePromptModal
          tierKey={tierKey}
          currentCount={currentCount}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

// =============================================================================
// UPGRADE PROMPT MODAL
// =============================================================================

interface UpgradePromptModalProps {
  tierKey: TierKey;
  currentCount: number;
  onClose: () => void;
}

function UpgradePromptModal({ tierKey, currentCount, onClose }: UpgradePromptModalProps) {
  const currentTier = pricingTiers[tierKey];
  const nextTier = getNextTierUp(tierKey);
  const limit = getCategoryLimit(tierKey);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          You're listed in {currentCount} of {limit} categories
        </h3>
        <p className="text-gray-600 mb-6">
          To list in more categories, upgrade your plan.
        </p>

        <div className="space-y-3 mb-6">
          {/* Stay option */}
          <button
            onClick={onClose}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-left"
          >
            <span className="font-medium">Stay on {currentTier.displayName}</span>
            <span className="text-gray-500 text-sm ml-2">
              ${currentTier.monthlyPrice}/mo
            </span>
          </button>

          {/* Upgrade option */}
          {nextTier && (
            <Link
              href="/business/upgrade"
              className="w-full px-4 py-3 bg-boerne-gold text-boerne-navy rounded-lg hover:bg-boerne-gold-alt transition-colors text-left block"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold">Upgrade to {nextTier.displayName}</span>
                  <span className="text-boerne-navy/70 text-sm ml-2">
                    ${nextTier.monthlyPrice}/mo
                  </span>
                </div>
                <span className="text-lg">&rarr;</span>
              </div>
              <p className="text-sm text-boerne-navy/80 mt-1">
                {nextTier.displayName} lets you list in up to {nextTier.categoryLimit} categories
                {nextTier.key === 'verified' && ' plus a professional website'}
                {nextTier.key === 'foundingPartner' && ' with exclusive Founding Partner status'}.
              </p>
            </Link>
          )}

          {/* See all plans */}
          <Link
            href="/pricing"
            className="w-full px-4 py-2 text-center text-sm text-gray-500 hover:text-gray-700 transition-colors block"
          >
            See all plans
          </Link>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// DISABLED ADD BUTTON WITH TOOLTIP
// =============================================================================

interface AddCategoryButtonProps {
  tierKey: TierKey;
  currentCount: number;
  onAdd: () => void;
  disabled?: boolean;
}

export function AddCategoryButton({
  tierKey,
  currentCount,
  onAdd,
  disabled = false,
}: AddCategoryButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const limit = getCategoryLimit(tierKey);
  const isAtLimit = currentCount >= limit;
  const nextTier = getNextTierUp(tierKey);

  const handleClick = () => {
    if (isAtLimit) {
      setShowModal(true);
    } else {
      onAdd();
    }
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={handleClick}
          onMouseEnter={() => isAtLimit && setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          disabled={disabled}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isAtLimit
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-boerne-gold text-boerne-navy hover:bg-boerne-gold-alt'
          }`}
        >
          + Add Category
        </button>

        {/* Tooltip */}
        {showTooltip && isAtLimit && nextTier && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap z-10">
            You've reached your category limit. Upgrade to {nextTier.displayName} to add {nextTier.categoryLimit - limit} more.
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      {showModal && (
        <UpgradePromptModal
          tierKey={tierKey}
          currentCount={currentCount}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

// =============================================================================
// CATEGORY PICKER WITH GRAYED OUT OPTIONS
// =============================================================================

interface CategoryOption {
  id: string;
  name: string;
  selected: boolean;
}

interface CategoryPickerProps {
  categories: CategoryOption[];
  tierKey: TierKey;
  currentCount: number;
  onToggle: (categoryId: string) => void;
}

export function CategoryPicker({
  categories,
  tierKey,
  currentCount,
  onToggle,
}: CategoryPickerProps) {
  const [showModal, setShowModal] = useState(false);
  const limit = getCategoryLimit(tierKey);
  const isAtLimit = currentCount >= limit;
  const nextTier = getNextTierUp(tierKey);

  return (
    <div className="space-y-4">
      {/* Usage indicator at top */}
      <CategoryUsageIndicator
        currentCount={currentCount}
        tierKey={tierKey}
        variant="default"
      />

      {/* Category grid */}
      <div className="grid grid-cols-2 gap-2">
        {categories.map((category) => {
          const canSelect = category.selected || !isAtLimit;

          return (
            <button
              key={category.id}
              onClick={() => {
                if (canSelect) {
                  onToggle(category.id);
                } else {
                  setShowModal(true);
                }
              }}
              className={`px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                category.selected
                  ? 'bg-boerne-gold/20 text-boerne-navy border-2 border-boerne-gold'
                  : canSelect
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                    : 'bg-gray-50 text-gray-400 cursor-not-allowed border-2 border-transparent'
              }`}
            >
              <span className="flex items-center justify-between">
                <span>{category.name}</span>
                {category.selected && (
                  <span className="text-boerne-gold">✓</span>
                )}
                {!category.selected && !canSelect && nextTier && (
                  <span className="text-xs text-amber-600">Upgrade to add</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Upgrade Modal */}
      {showModal && (
        <UpgradePromptModal
          tierKey={tierKey}
          currentCount={currentCount}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
