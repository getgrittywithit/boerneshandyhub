'use client';

import { useState } from 'react';
import type { SubscriberSource, SubscriberType } from '@/types/newsletter';

interface SubscribeFormProps {
  source?: SubscriberSource;
  type?: SubscriberType;
  variant?: 'inline' | 'card' | 'minimal';
  headline?: string;
  description?: string;
  buttonText?: string;
  showNameField?: boolean;
  className?: string;
}

export default function SubscribeForm({
  source = 'website',
  type = 'homeowner',
  variant = 'inline',
  headline = 'Get Monthly Home Tips',
  description = 'Join Boerne homeowners getting seasonal maintenance reminders and local recommendations.',
  buttonText = 'Subscribe',
  showNameField = false,
  className = '',
}: SubscribeFormProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/newsletters/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: name || undefined,
          type,
          source,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(data.message);
        setEmail('');
        setName('');
      } else {
        setStatus('error');
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  // Success state
  if (status === 'success') {
    return (
      <div className={`${className}`}>
        <div className={`
          ${variant === 'card' ? 'bg-green-50 border border-green-200 rounded-xl p-6' : ''}
          ${variant === 'inline' ? 'bg-green-50 rounded-lg p-4' : ''}
          ${variant === 'minimal' ? '' : ''}
        `}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">&#10003;</span>
            <div>
              <p className="font-medium text-green-800">{message}</p>
              <p className="text-sm text-green-600 mt-1">
                Check your inbox for a confirmation.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Card variant
  if (variant === 'card') {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="text-center mb-4">
          <span className="text-3xl">&#128231;</span>
          <h3 className="text-xl font-bold text-gray-900 mt-2">{headline}</h3>
          <p className="text-gray-600 mt-1 text-sm">{description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {showNameField && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? 'Subscribing...' : buttonText}
          </button>
        </form>

        {status === 'error' && (
          <p className="text-red-600 text-sm mt-3 text-center">{message}</p>
        )}

        <p className="text-xs text-gray-500 mt-4 text-center">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    );
  }

  // Minimal variant (just input + button)
  if (variant === 'minimal') {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent text-sm"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-4 py-2 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors disabled:opacity-50 text-sm whitespace-nowrap"
        >
          {status === 'loading' ? '...' : buttonText}
        </button>
        {status === 'error' && (
          <p className="text-red-600 text-xs absolute mt-10">{message}</p>
        )}
      </form>
    );
  }

  // Inline variant (default)
  return (
    <div className={`${className}`}>
      <div className="flex items-start gap-4 mb-4">
        <span className="text-2xl flex-shrink-0">&#128231;</span>
        <div>
          <h3 className="font-semibold text-gray-900">{headline}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {status === 'loading' ? '...' : buttonText}
        </button>
      </form>

      {status === 'error' && (
        <p className="text-red-600 text-sm mt-2">{message}</p>
      )}

      <p className="text-xs text-gray-500 mt-3">
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}
