'use client';

import { useState } from 'react';

interface QuoteRequestFormProps {
  providerName: string;
  providerEmail: string;
  categoryName: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  serviceNeeded: string;
  description: string;
  preferredContact: 'email' | 'phone' | 'either';
  urgency: 'flexible' | 'this_week' | 'urgent';
}

export default function QuoteRequestForm({
  providerName,
  providerEmail,
  categoryName,
}: QuoteRequestFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    serviceNeeded: '',
    description: '',
    preferredContact: 'either',
    urgency: 'flexible',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          providerName,
          providerEmail,
          categoryName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit quote request');
      }

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        serviceNeeded: '',
        description: '',
        preferredContact: 'either',
        urgency: 'flexible',
      });
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="text-center py-6">
        <div className="text-4xl mb-4">✅</div>
        <h4 className="text-lg font-semibold text-boerne-navy mb-2">Quote Request Sent!</h4>
        <p className="text-boerne-dark-gray mb-4">
          {providerName} will receive your request and contact you soon.
        </p>
        <button
          onClick={() => setSubmitStatus('idle')}
          className="text-boerne-gold hover:text-boerne-gold-alt font-medium"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {submitStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {errorMessage}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-boerne-dark-gray mb-1">
          Your Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
          placeholder="John Smith"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-boerne-dark-gray mb-1">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
          placeholder="john@example.com"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-boerne-dark-gray mb-1">
          Phone Number *
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
          placeholder="(830) 555-1234"
        />
      </div>

      <div>
        <label htmlFor="serviceNeeded" className="block text-sm font-medium text-boerne-dark-gray mb-1">
          Service Needed *
        </label>
        <input
          type="text"
          id="serviceNeeded"
          name="serviceNeeded"
          value={formData.serviceNeeded}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
          placeholder={`e.g., ${categoryName} repair, installation...`}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-boerne-dark-gray mb-1">
          Describe Your Project
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
          placeholder="Tell us more about what you need..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="preferredContact" className="block text-sm font-medium text-boerne-dark-gray mb-1">
            Contact Preference
          </label>
          <select
            id="preferredContact"
            name="preferredContact"
            value={formData.preferredContact}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
          >
            <option value="either">Either</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
          </select>
        </div>

        <div>
          <label htmlFor="urgency" className="block text-sm font-medium text-boerne-dark-gray mb-1">
            Timeline
          </label>
          <select
            id="urgency"
            name="urgency"
            value={formData.urgency}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
          >
            <option value="flexible">Flexible</option>
            <option value="this_week">This Week</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Sending...' : 'Send Quote Request'}
      </button>

      <p className="text-xs text-boerne-dark-gray text-center">
        By submitting, you agree to be contacted by {providerName} regarding your request.
      </p>
    </form>
  );
}
