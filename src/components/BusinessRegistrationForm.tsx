'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { topLevelCategories, getAllSubcategories, membershipTiers } from '@/data/serviceCategories';
import { locations } from '@/data/locations';

// Registration allows selecting up to 5 categories (for upsell data)
const MAX_SELECTABLE_CATEGORIES = 5;
// But only 1 is active on Basic tier
const BASIC_ACTIVE_CATEGORIES = membershipTiers.basic.categoryLimit;

interface FormData {
  // Step 1: Business Info
  name: string;
  topCategory: string;
  subcategories: string[];
  description: string;
  // Step 2: Contact Info
  address: string;
  phone: string;
  email: string;
  website: string;
  // Step 3: Services & Areas
  services: string[];
  serviceArea: string[];
  // Step 4: Credentials
  yearsInBusiness: string;
  licensed: boolean;
  insured: boolean;
  // Step 5: Account
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  password: string;
  confirmPassword: string;
  agreedToTerms: boolean;
}

const initialFormData: FormData = {
  name: '',
  topCategory: '',
  subcategories: [],
  description: '',
  address: '',
  phone: '',
  email: '',
  website: '',
  services: [],
  serviceArea: [],
  yearsInBusiness: '',
  licensed: false,
  insured: false,
  ownerName: '',
  ownerEmail: '',
  ownerPhone: '',
  password: '',
  confirmPassword: '',
  agreedToTerms: false,
};

const steps = [
  { id: 1, name: 'Business Info', description: 'Tell us about your business' },
  { id: 2, name: 'Contact', description: 'How customers can reach you' },
  { id: 3, name: 'Services', description: 'What you offer' },
  { id: 4, name: 'Credentials', description: 'Your qualifications' },
  { id: 5, name: 'Review', description: 'Submit your listing' },
];

export default function BusinessRegistrationForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [newService, setNewService] = useState('');

  // Get subcategories for selected top category
  const availableSubcategories = topLevelCategories
    .find(cat => cat.slug === formData.topCategory)
    ?.subcategories || [];

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    switch (step) {
      case 1:
        if (!formData.name || formData.name.length < 2) {
          newErrors.name = 'Business name is required (min 2 characters)';
        }
        if (!formData.topCategory) {
          newErrors.topCategory = 'Please select a category';
        }
        if (formData.subcategories.length === 0) {
          newErrors.subcategories = 'Please select at least one service type';
        }
        if (formData.subcategories.length > MAX_SELECTABLE_CATEGORIES) {
          newErrors.subcategories = `Maximum ${MAX_SELECTABLE_CATEGORIES} categories allowed`;
        }
        if (!formData.description || formData.description.length < 50) {
          newErrors.description = 'Description must be at least 50 characters';
        }
        if (formData.description.length > 500) {
          newErrors.description = 'Description must be less than 500 characters';
        }
        break;

      case 2:
        if (!formData.address) {
          newErrors.address = 'Address is required';
        }
        if (!formData.phone || !/^[\d\s\-\(\)]+$/.test(formData.phone)) {
          newErrors.phone = 'Valid phone number is required';
        }
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Valid email address is required';
        }
        if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
          newErrors.website = 'Website must start with http:// or https://';
        }
        break;

      case 3:
        if (formData.services.length < 3) {
          newErrors.services = 'Please add at least 3 services';
        }
        if (formData.serviceArea.length === 0) {
          newErrors.serviceArea = 'Please select at least one service area';
        }
        break;

      case 4:
        // No required fields in step 4
        break;

      case 5:
        if (!formData.ownerName || formData.ownerName.length < 2) {
          newErrors.ownerName = 'Your name is required';
        }
        if (!formData.ownerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.ownerEmail)) {
          newErrors.ownerEmail = 'Valid email is required';
        }
        if (!formData.ownerPhone) {
          newErrors.ownerPhone = 'Phone number is required';
        }
        if (!formData.password || formData.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        }
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!formData.agreedToTerms) {
          newErrors.agreedToTerms = 'You must agree to the terms';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const addService = () => {
    if (newService.trim() && !formData.services.includes(newService.trim())) {
      updateField('services', [...formData.services, newService.trim()]);
      setNewService('');
    }
  };

  const removeService = (service: string) => {
    updateField('services', formData.services.filter(s => s !== service));
  };

  const toggleServiceArea = (area: string) => {
    if (formData.serviceArea.includes(area)) {
      updateField('serviceArea', formData.serviceArea.filter(a => a !== area));
    } else {
      updateField('serviceArea', [...formData.serviceArea, area]);
    }
  };

  const toggleSubcategory = (slug: string) => {
    if (formData.subcategories.includes(slug)) {
      // Always allow deselection
      updateField('subcategories', formData.subcategories.filter(s => s !== slug));
    } else {
      // Allow selection up to max (5 categories for upsell data)
      if (formData.subcategories.length < MAX_SELECTABLE_CATEGORIES) {
        updateField('subcategories', [...formData.subcategories, slug]);
      }
    }
  };

  const isAtMaxSelection = formData.subcategories.length >= MAX_SELECTABLE_CATEGORIES;
  const hasExtraCategories = formData.subcategories.length > BASIC_ACTIVE_CATEGORIES;

  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    setSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/business/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to register business');
      }

      // Redirect to dashboard (auto-logged in via API)
      router.push('/business/dashboard');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep > step.id
                    ? 'bg-green-500 text-white'
                    : currentStep === step.id
                    ? 'bg-boerne-gold text-boerne-navy'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {currentStep > step.id ? '✓' : step.id}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`hidden sm:block w-16 md:w-24 h-1 mx-2 ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {steps[currentStep - 1].name}
          </h2>
          <p className="text-gray-500 text-sm">
            {steps[currentStep - 1].description}
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {submitError}
          </div>
        )}

        {/* Step 1: Business Info */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Acme Plumbing Services"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                value={formData.topCategory}
                onChange={(e) => {
                  updateField('topCategory', e.target.value);
                  updateField('subcategories', []);
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent ${
                  errors.topCategory ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select a category...</option>
                {topLevelCategories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
              {errors.topCategory && <p className="text-red-500 text-sm mt-1">{errors.topCategory}</p>}
            </div>

            {formData.topCategory && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Types * <span className="font-normal text-gray-500">(select up to {MAX_SELECTABLE_CATEGORIES})</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availableSubcategories.map((sub, index) => {
                    const isSelected = formData.subcategories.includes(sub.slug);
                    const selectionIndex = formData.subcategories.indexOf(sub.slug);
                    const isFirstSelection = selectionIndex === 0;
                    const isLocked = !isSelected && isAtMaxSelection;

                    return (
                      <label
                        key={sub.slug}
                        className={`flex items-center gap-2 p-3 border rounded-lg transition-colors ${
                          isSelected
                            ? isFirstSelection
                              ? 'border-green-500 bg-green-50 cursor-pointer'
                              : 'border-boerne-gold bg-boerne-gold/10 cursor-pointer'
                            : isLocked
                            ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                            : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSubcategory(sub.slug)}
                          disabled={isLocked}
                          className="sr-only"
                        />
                        <span>{sub.icon}</span>
                        <span className="text-sm">{sub.name}</span>
                        {isSelected && isFirstSelection && (
                          <span className="ml-auto text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">Active</span>
                        )}
                        {isSelected && !isFirstSelection && (
                          <span className="ml-auto text-xs bg-gray-300 text-gray-600 px-2 py-0.5 rounded-full">Upgrade</span>
                        )}
                        {isLocked && <span className="ml-auto text-gray-400">🔒</span>}
                      </label>
                    );
                  })}
                </div>
                {errors.subcategories && <p className="text-red-500 text-sm mt-1">{errors.subcategories}</p>}

                {/* Info about active vs upgrade categories */}
                {formData.subcategories.length > 0 && (
                  <div className={`mt-4 p-4 rounded-lg ${hasExtraCategories ? 'bg-boerne-gold/10 border border-boerne-gold/20' : 'bg-green-50 border border-green-200'}`}>
                    {hasExtraCategories ? (
                      <div className="text-sm text-boerne-navy">
                        <p className="font-semibold mb-1">
                          Your listing will appear in: <span className="text-green-600">{formData.subcategories[0]}</span>
                        </p>
                        <p className="text-gray-600">
                          Upgrade after registration to also appear in: {formData.subcategories.slice(1).join(', ')}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-green-700">
                        Your listing will appear in <strong>{formData.subcategories[0]}</strong>. Select more categories above if you offer additional services.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Description * ({formData.description.length}/500 characters)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Tell potential customers about your business, your experience, and what sets you apart..."
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>
          </div>
        )}

        {/* Step 2: Contact Info */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Address *
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent ${
                  errors.address ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="123 Main St, Boerne, TX 78006"
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Phone *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="(830) 555-0000"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="info@yourbusiness.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website (optional)
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => updateField('website', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent ${
                  errors.website ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="https://www.yourbusiness.com"
              />
              {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
            </div>
          </div>
        )}

        {/* Step 3: Services & Areas */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Services Offered * (minimum 3)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                  placeholder="e.g., Water heater installation"
                />
                <button
                  type="button"
                  onClick={addService}
                  className="px-4 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.services.map((service, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {service}
                    <button
                      type="button"
                      onClick={() => removeService(service)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              {errors.services && <p className="text-red-500 text-sm mt-1">{errors.services}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Areas * (select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {locations.map((location) => (
                  <label
                    key={location.slug}
                    className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.serviceArea.includes(location.name)
                        ? 'border-boerne-gold bg-boerne-gold/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.serviceArea.includes(location.name)}
                      onChange={() => toggleServiceArea(location.name)}
                      className="sr-only"
                    />
                    <span className="text-sm">{location.name}</span>
                  </label>
                ))}
              </div>
              {errors.serviceArea && <p className="text-red-500 text-sm mt-1">{errors.serviceArea}</p>}
            </div>
          </div>
        )}

        {/* Step 4: Credentials */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Years in Business
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.yearsInBusiness}
                onChange={(e) => updateField('yearsInBusiness', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                placeholder="e.g., 10"
              />
            </div>

            <div className="space-y-4">
              <label
                className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                  formData.licensed ? 'border-green-500 bg-green-50' : 'border-gray-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.licensed}
                  onChange={(e) => updateField('licensed', e.target.checked)}
                  className="w-5 h-5 text-green-500 rounded border-gray-300 focus:ring-green-500"
                />
                <div>
                  <div className="font-medium text-gray-900">Licensed</div>
                  <div className="text-sm text-gray-500">
                    I hold valid professional licenses for my trade
                  </div>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                  formData.insured ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.insured}
                  onChange={(e) => updateField('insured', e.target.checked)}
                  className="w-5 h-5 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-gray-900">Insured</div>
                  <div className="text-sm text-gray-500">
                    I carry liability insurance for my business
                  </div>
                </div>
              </label>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> Adding credentials builds trust with potential customers.
                Businesses marked as licensed and insured often receive more inquiries.
              </p>
            </div>
          </div>
        )}

        {/* Step 5: Review & Submit */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Review Your Information</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Business Name:</dt>
                  <dd className="text-gray-900 font-medium">{formData.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Category:</dt>
                  <dd className="text-gray-900">{formData.topCategory}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Address:</dt>
                  <dd className="text-gray-900">{formData.address}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Phone:</dt>
                  <dd className="text-gray-900">{formData.phone}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Services:</dt>
                  <dd className="text-gray-900">{formData.services.length} listed</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Service Areas:</dt>
                  <dd className="text-gray-900">{formData.serviceArea.join(', ')}</dd>
                </div>
              </dl>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Your Contact Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => updateField('ownerName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent ${
                      errors.ownerName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="John Smith"
                  />
                  {errors.ownerName && <p className="text-red-500 text-sm mt-1">{errors.ownerName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    value={formData.ownerEmail}
                    onChange={(e) => updateField('ownerEmail', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent ${
                      errors.ownerEmail ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="john@yourbusiness.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    We'll send your login credentials here
                  </p>
                  {errors.ownerEmail && <p className="text-red-500 text-sm mt-1">{errors.ownerEmail}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Phone *
                  </label>
                  <input
                    type="tel"
                    value={formData.ownerPhone}
                    onChange={(e) => updateField('ownerPhone', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent ${
                      errors.ownerPhone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="(830) 555-0000"
                  />
                  {errors.ownerPhone && <p className="text-red-500 text-sm mt-1">{errors.ownerPhone}</p>}
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Create Your Account Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Minimum 8 characters"
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateField('confirmPassword', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Re-enter your password"
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>

            <label
              className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer ${
                errors.agreedToTerms ? 'border-red-300' : 'border-gray-200'
              }`}
            >
              <input
                type="checkbox"
                checked={formData.agreedToTerms}
                onChange={(e) => updateField('agreedToTerms', e.target.checked)}
                className="w-5 h-5 mt-0.5 text-boerne-gold rounded border-gray-300 focus:ring-boerne-gold"
              />
              <span className="text-sm text-gray-600">
                I agree to the Terms of Service and Privacy Policy. I confirm that
                I am authorized to register this business and that all information provided is accurate.
              </span>
            </label>
            {errors.agreedToTerms && <p className="text-red-500 text-sm">{errors.agreedToTerms}</p>}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-8 py-3 bg-boerne-navy text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Registration'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
