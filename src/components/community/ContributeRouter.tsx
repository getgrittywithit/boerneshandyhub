'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { ContributionType } from '@/lib/community/types';
import FeedbackForm from './FeedbackForm';
import PhotoForm from './PhotoForm';
import StoryForm from './StoryForm';
import TipForm from './TipForm';

interface ContributeRouterProps {
  initialType?: ContributionType;
  targetCategory?: string;
}

const TYPE_OPTIONS: Array<{
  type: ContributionType;
  icon: string;
  label: string;
  description: string;
}> = [
  {
    type: 'feedback',
    icon: '📨',
    label: 'Feedback for the team',
    description: 'Send us a private message',
  },
  {
    type: 'photo',
    icon: '📷',
    label: 'A photo',
    description: 'Share photos of Boerne, past or present',
  },
  {
    type: 'story',
    icon: '📖',
    label: 'A story',
    description: 'Tell us about your Boerne memories',
  },
  {
    type: 'tip',
    icon: '💡',
    label: 'A local tip',
    description: 'Recommend your favorite spots',
  },
];

export default function ContributeRouter({
  initialType,
  targetCategory,
}: ContributeRouterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get type from URL or props
  const typeFromUrl = searchParams.get('type') as ContributionType | null;
  const [selectedType, setSelectedType] = useState<ContributionType | null>(
    typeFromUrl || initialType || null
  );
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Update URL when type changes
  const handleTypeSelect = (type: ContributionType) => {
    setSelectedType(type);
    const params = new URLSearchParams(searchParams);
    params.set('type', type);
    if (targetCategory) {
      params.set('target', targetCategory);
    }
    router.push(`/contribute?${params.toString()}`, { scroll: false });
  };

  // Handle successful submission
  const handleSuccess = (message: string, requiresVerification: boolean) => {
    setSuccessMessage(message);
    setShowSuccess(true);
  };

  // Reset to type picker
  const handleReset = () => {
    setSelectedType(null);
    setShowSuccess(false);
    router.push('/contribute', { scroll: false });
  };

  // Success state
  if (showSuccess) {
    return (
      <div className="max-w-xl mx-auto text-center py-12">
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Thanks for your contribution!
        </h2>
        <p className="text-gray-600 mb-8">{successMessage}</p>
        <button
          onClick={handleReset}
          className="px-6 py-3 bg-boerne-navy text-white font-semibold rounded-lg hover:bg-boerne-navy/90 transition-colors"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Type Picker */}
      {!selectedType && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            What would you like to share?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TYPE_OPTIONS.map((option) => (
              <button
                key={option.type}
                onClick={() => handleTypeSelect(option.type)}
                className="flex flex-col items-center p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-boerne-gold hover:shadow-lg transition-all group"
              >
                <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {option.icon}
                </span>
                <span className="font-medium text-gray-900 text-center">
                  {option.label}
                </span>
                <span className="text-xs text-gray-500 mt-1 text-center">
                  {option.description}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Form */}
      {selectedType && (
        <div>
          {/* Back button */}
          <button
            onClick={handleReset}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Choose a different type
          </button>

          {/* Form based on type */}
          {selectedType === 'feedback' && (
            <FeedbackForm onSuccess={handleSuccess} />
          )}
          {selectedType === 'photo' && (
            <PhotoForm
              onSuccess={handleSuccess}
              targetCategory={targetCategory}
            />
          )}
          {selectedType === 'story' && (
            <StoryForm
              onSuccess={handleSuccess}
              targetCategory={targetCategory}
            />
          )}
          {selectedType === 'tip' && <TipForm onSuccess={handleSuccess} />}
        </div>
      )}
    </div>
  );
}
