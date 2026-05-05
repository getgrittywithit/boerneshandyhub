'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const contributeOptions = [
  {
    href: '/contribute?type=photo',
    icon: '📷',
    label: 'Share a Photo',
    description: 'Old Boerne photos & memories',
  },
  {
    href: '/contribute?type=story',
    icon: '📖',
    label: 'Tell a Story',
    description: 'Local history & memories',
  },
  {
    href: '/contribute?type=tip',
    icon: '💡',
    label: 'Suggest a Tip',
    description: 'Hidden gems & recommendations',
  },
  {
    href: '/contribute?type=feedback',
    icon: '💬',
    label: 'Send Feedback',
    description: 'Ideas to improve the Hub',
  },
];

export default function CommunityFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Hide on admin, business dashboard, and contribute pages
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/business/dashboard') ||
    pathname.startsWith('/contribute') ||
    pathname.startsWith('/site/')
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden mb-2">
          {/* Header */}
          <div className="bg-boerne-navy px-4 py-3">
            <p className="text-white font-semibold">Share with Boerne</p>
            <p className="text-white/70 text-xs">
              Built by neighbors, for neighbors
            </p>
          </div>

          {/* Options */}
          <div className="p-2">
            {contributeOptions.map((option) => (
              <Link
                key={option.href}
                href={option.href}
                onClick={() => setIsOpen(false)}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <span className="text-2xl">{option.icon}</span>
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-boerne-navy">
                    {option.label}
                  </p>
                  <p className="text-xs text-gray-500">{option.description}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-2 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              Your contributions help fellow Boerne residents
            </p>
          </div>
        </div>
      )}

      {/* Main button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all duration-200 ${
          isOpen
            ? 'bg-gray-700 text-white'
            : 'bg-boerne-gold text-boerne-navy hover:bg-boerne-gold-alt hover:scale-105'
        }`}
        aria-label={isOpen ? 'Close menu' : 'Share with community'}
      >
        {isOpen ? (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="font-semibold text-sm">Close</span>
          </>
        ) : (
          <>
            <span className="text-xl">🤝</span>
            <span className="font-semibold text-sm hidden sm:inline">Share with Boerne</span>
          </>
        )}
      </button>
    </div>
  );
}
