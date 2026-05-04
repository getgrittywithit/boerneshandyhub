'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBusinessDashboard } from '../../layout';
import { ArrowLeft, ArrowRight, Check, Palette, Wrench, Clock, Camera, Layout } from 'lucide-react';
import type { WebsiteTemplate, ServiceItem, BusinessHours, ServiceArea, Testimonial, WebsitePhoto } from '@/lib/websites/types';
import { TEMPLATES, HOURS_PRESETS, COLOR_PRESETS, COMMON_SERVICES } from '@/lib/websites/types';
import { getPhotoLimit, type TierKey } from '@/data/pricingTiers';
import PhotoUpload from '@/components/website/PhotoUpload';

interface UploadedPhoto {
  id: string;
  storage_path: string;
  derivatives: {
    thumb: string;
    medium: string;
    large: string;
  };
}

interface WizardData {
  template: WebsiteTemplate;
  primary_color: string;
  accent_color: string;
  tagline: string;
  about_text: string;
  services: ServiceItem[];
  license_number: string;
  insurance_carrier: string;
  years_in_business: number | null;
  hours: BusinessHours;
  emergency_available: boolean;
  service_area: ServiceArea;
  testimonials: Testimonial[];
  logo_photo: UploadedPhoto | null;
  hero_photo: UploadedPhoto | null;
  gallery_photos: UploadedPhoto[];
}

const initialData: WizardData = {
  template: 'handyman',
  primary_color: '#1e3a5f',
  accent_color: '#d4a853',
  tagline: '',
  about_text: '',
  services: [],
  license_number: '',
  insurance_carrier: '',
  years_in_business: null,
  hours: {},
  emergency_available: false,
  service_area: { cities: ['Boerne'] },
  testimonials: [],
  logo_photo: null,
  hero_photo: null,
  gallery_photos: [],
};

const steps = [
  { id: 1, name: 'Template', icon: Layout, description: 'Choose your website style' },
  { id: 2, name: 'Brand', icon: Palette, description: 'Colors & tagline' },
  { id: 3, name: 'Services', icon: Wrench, description: 'What you offer' },
  { id: 4, name: 'Hours', icon: Clock, description: 'When you work' },
  { id: 5, name: 'Photos', icon: Camera, description: 'Show your work' },
];

export default function WebsiteSetupWizard() {
  const router = useRouter();
  const { business } = useBusinessDashboard();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<WizardData>(initialData);
  const [saving, setSaving] = useState(false);
  const [existingWebsite, setExistingWebsite] = useState<string | null>(null);

  useEffect(() => {
    if (business) {
      // Pre-fill tagline and about from business description
      setData(prev => ({
        ...prev,
        about_text: business.description || '',
      }));

      // Check for existing website draft
      checkExistingWebsite();
    }
  }, [business]);

  const checkExistingWebsite = async () => {
    if (!business) return;

    try {
      const res = await fetch(`/api/websites/draft?business_id=${business.id}`);
      if (res.ok) {
        const websiteData = await res.json();
        if (websiteData) {
          setExistingWebsite(websiteData.id);
          // Restore draft data
          setData(prev => ({
            ...prev,
            ...websiteData,
          }));
        }
      }
    } catch {
      // No existing draft
    }
  };

  const updateData = (updates: Partial<WizardData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const saveDraft = async () => {
    if (!business) return;

    setSaving(true);
    try {
      await fetch('/api/websites/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_id: business.id,
          website_id: existingWebsite,
          ...data,
        }),
      });
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    await saveDraft();
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!business) return;

    setSaving(true);
    try {
      const res = await fetch('/api/websites/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_id: business.id,
          website_id: existingWebsite,
          ...data,
        }),
      });

      if (res.ok) {
        router.push('/business/dashboard/website');
      }
    } catch (error) {
      console.error('Error submitting website:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Create Your Website</h1>
          <p className="text-gray-600">Set up your professional business website in a few steps</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isComplete = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isComplete
                          ? 'bg-green-500 text-white'
                          : isActive
                          ? 'bg-boerne-navy text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {isComplete ? <Check size={20} /> : <Icon size={20} />}
                    </div>
                    <span
                      className={`mt-1 text-xs font-medium ${
                        isActive ? 'text-boerne-navy' : 'text-gray-500'
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-12 lg:w-24 h-0.5 mx-2 ${
                        currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
          {currentStep === 1 && (
            <TemplateStep data={data} updateData={updateData} />
          )}
          {currentStep === 2 && (
            <BrandStep
              data={data}
              updateData={updateData}
              businessName={business?.name}
              businessCategory={business?.category}
            />
          )}
          {currentStep === 3 && (
            <ServicesStep data={data} updateData={updateData} />
          )}
          {currentStep === 4 && (
            <HoursStep data={data} updateData={updateData} />
          )}
          {currentStep === 5 && (
            <PhotosStep
              data={data}
              updateData={updateData}
              businessId={business?.id}
              websiteId={existingWebsite || undefined}
              tierKey={(business?.membership_tier === 'premium' ? 'verifiedPlus' : business?.membership_tier === 'verified' ? 'verified' : 'claimed') as TierKey}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="flex items-center gap-3">
            {saving && (
              <span className="text-sm text-gray-500">Saving...</span>
            )}

            {currentStep < 5 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2 bg-boerne-navy text-white rounded-lg hover:bg-boerne-navy/90"
              >
                Next
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Check size={18} />
                Submit for Review
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 1: Template Selection
function TemplateStep({
  data,
  updateData,
}: {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
}) {
  const templates = Object.values(TEMPLATES);

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Choose Your Template</h2>
      <p className="text-gray-600 mb-6">
        Select the template that best matches your trade. Don&apos;t worry, they all look professional!
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <button
            key={template.key}
            onClick={() => {
              updateData({
                template: template.key,
                primary_color: template.defaultColors.primary,
                accent_color: template.defaultColors.accent,
              });
            }}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              data.template === template.key
                ? 'border-boerne-navy bg-boerne-navy/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div
              className="w-full h-16 rounded-lg mb-3 flex items-end justify-end p-2"
              style={{ backgroundColor: template.defaultColors.primary }}
            >
              <div
                className="px-2 py-1 rounded text-xs font-medium"
                style={{ backgroundColor: template.defaultColors.accent, color: template.defaultColors.primary }}
              >
                Preview
              </div>
            </div>
            <h3 className="font-semibold text-gray-900">{template.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{template.description}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {template.features.map((feature, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600"
                >
                  {feature}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Step 2: Brand & Colors
function BrandStep({
  data,
  updateData,
  businessName,
  businessCategory,
}: {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
  businessName?: string;
  businessCategory?: string;
}) {
  const [improving, setImproving] = useState(false);
  const [suggestions, setSuggestions] = useState<{
    tagline: { improved: string; alternatives: string[] };
    about_text: { improved: string; keywords: string[] };
  } | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleImprove = async () => {
    if (!businessName || !businessCategory) return;

    setImproving(true);
    setSuggestions(null);

    try {
      const res = await fetch('/api/business/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tagline: data.tagline,
          about_text: data.about_text,
          business_name: businessName,
          category: businessCategory,
        }),
      });

      const result = await res.json();

      if (result.success && result.suggestions) {
        setSuggestions(result.suggestions);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Improve error:', error);
    } finally {
      setImproving(false);
    }
  };

  const applySuggestion = (type: 'tagline' | 'about_text', value: string) => {
    updateData({ [type]: value });
    if (type === 'about_text') {
      setShowSuggestions(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Your Brand</h2>
      <p className="text-gray-600 mb-6">
        Choose colors and write a short tagline that represents your business.
      </p>

      {/* Color Presets */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Color Scheme
        </label>
        <div className="flex flex-wrap gap-3">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => updateData({
                primary_color: preset.primary,
                accent_color: preset.accent,
              })}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                data.primary_color === preset.primary
                  ? 'border-boerne-navy'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex">
                <div
                  className="w-6 h-6 rounded-l"
                  style={{ backgroundColor: preset.primary }}
                />
                <div
                  className="w-6 h-6 rounded-r"
                  style={{ backgroundColor: preset.accent }}
                />
              </div>
              <span className="text-sm font-medium">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Colors */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Primary Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={data.primary_color}
              onChange={(e) => updateData({ primary_color: e.target.value })}
              className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={data.primary_color}
              onChange={(e) => updateData({ primary_color: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="#1e3a5f"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Accent Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={data.accent_color}
              onChange={(e) => updateData({ accent_color: e.target.value })}
              className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={data.accent_color}
              onChange={(e) => updateData({ accent_color: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="#d4a853"
            />
          </div>
        </div>
      </div>

      {/* Tagline */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Tagline <span className="text-gray-400">(optional)</span>
          </label>
        </div>
        <input
          type="text"
          value={data.tagline}
          onChange={(e) => updateData({ tagline: e.target.value.slice(0, 80) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="Your trusted local plumber since 2010"
          maxLength={80}
        />
        <p className="text-xs text-gray-500 mt-1">{data.tagline.length}/80 characters</p>

        {/* Tagline suggestions */}
        {showSuggestions && suggestions && (
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-medium text-blue-700 mb-2">AI Suggestions:</p>
            <div className="space-y-2">
              <button
                onClick={() => applySuggestion('tagline', suggestions.tagline.improved)}
                className="w-full text-left px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm hover:bg-blue-100 transition-colors"
              >
                {suggestions.tagline.improved}
              </button>
              {suggestions.tagline.alternatives.map((alt, i) => (
                <button
                  key={i}
                  onClick={() => applySuggestion('tagline', alt)}
                  className="w-full text-left px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm hover:bg-blue-100 transition-colors"
                >
                  {alt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* About Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          About Your Business
        </label>
        <textarea
          value={data.about_text}
          onChange={(e) => updateData({ about_text: e.target.value.slice(0, 500) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg h-32"
          placeholder="Tell potential customers about your business, experience, and what makes you different..."
          maxLength={500}
        />
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-gray-500">
            {data.about_text.length}/500 characters (minimum 50 recommended)
          </p>
          <button
            onClick={handleImprove}
            disabled={improving || !businessName || !businessCategory}
            className="text-xs text-boerne-navy hover:underline disabled:opacity-50 disabled:no-underline flex items-center gap-1"
          >
            {improving ? (
              <>
                <span className="animate-spin">⏳</span> Improving...
              </>
            ) : (
              <>✨ Improve with AI</>
            )}
          </button>
        </div>

        {/* About text suggestion */}
        {showSuggestions && suggestions && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-blue-700">AI Improved Version:</p>
              <button
                onClick={() => setShowSuggestions(false)}
                className="text-blue-500 hover:text-blue-700 text-xs"
              >
                Dismiss
              </button>
            </div>
            <p className="text-sm text-gray-700 mb-2">{suggestions.about_text.improved}</p>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {suggestions.about_text.keywords.slice(0, 3).map((kw, i) => (
                  <span key={i} className="px-2 py-0.5 bg-blue-100 rounded text-xs text-blue-700">
                    {kw}
                  </span>
                ))}
              </div>
              <button
                onClick={() => applySuggestion('about_text', suggestions.about_text.improved)}
                className="px-3 py-1 bg-boerne-navy text-white text-xs rounded-lg hover:bg-boerne-navy/90"
              >
                Use This
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Preview */}
      <div className="mt-8 p-4 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-500 mb-2">Preview:</p>
        <div
          className="p-4 rounded-lg"
          style={{ backgroundColor: data.primary_color }}
        >
          <span
            className="inline-block px-3 py-1 rounded-full text-sm font-medium"
            style={{ backgroundColor: data.accent_color, color: data.primary_color }}
          >
            Boerne Verified
          </span>
          <h3 className="text-xl font-bold text-white mt-2">{businessName || 'Your Business Name'}</h3>
          {data.tagline && (
            <p className="text-white/80 mt-1">{data.tagline}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Step 3: Services & Credentials
function ServicesStep({
  data,
  updateData,
}: {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
}) {
  const template = TEMPLATES[data.template];
  const [newService, setNewService] = useState('');

  const toggleService = (serviceName: string) => {
    const exists = data.services.some(s => s.name === serviceName);
    if (exists) {
      updateData({
        services: data.services.filter(s => s.name !== serviceName),
      });
    } else {
      updateData({
        services: [...data.services, { name: serviceName }],
      });
    }
  };

  const addCustomService = () => {
    if (newService.trim() && !data.services.some(s => s.name === newService.trim())) {
      updateData({
        services: [...data.services, { name: newService.trim() }],
      });
      setNewService('');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Your Services</h2>
      <p className="text-gray-600 mb-6">
        Select the services you offer. You can add custom services too.
      </p>

      {/* Common Services Grid */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Quick Add Common Services
        </label>
        <div className="flex flex-wrap gap-2">
          {COMMON_SERVICES.map((service) => {
            const isSelected = data.services.some(s => s.name === service);
            return (
              <button
                key={service}
                onClick={() => toggleService(service)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-boerne-navy text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isSelected && <Check size={14} className="inline mr-1" />}
                {service}
              </button>
            );
          })}
        </div>
      </div>

      {/* Add Custom Service */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Add Custom Service
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCustomService()}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="e.g., Tankless Water Heater Installation"
          />
          <button
            onClick={addCustomService}
            disabled={!newService.trim()}
            className="px-4 py-2 bg-boerne-navy text-white rounded-lg hover:bg-boerne-navy/90 disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>

      {/* Credentials */}
      <div className="border-t pt-6">
        <h3 className="font-semibold text-gray-900 mb-4">Credentials (Optional)</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              License Number
            </label>
            <input
              type="text"
              value={data.license_number}
              onChange={(e) => updateData({ license_number: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="TX123456"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Insurance Carrier
            </label>
            <input
              type="text"
              value={data.insurance_carrier}
              onChange={(e) => updateData({ insurance_carrier: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="State Farm, Allstate, etc."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Years in Business
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={data.years_in_business || ''}
              onChange={(e) => updateData({
                years_in_business: e.target.value ? parseInt(e.target.value) : null
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="10"
            />
          </div>
        </div>
      </div>

      {/* Selected Services Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm font-medium text-gray-700 mb-2">
          Selected Services ({data.services.length})
        </p>
        {data.services.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {data.services.map((s, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 rounded text-sm"
              >
                {s.name}
                <button
                  onClick={() => toggleService(s.name)}
                  className="text-gray-400 hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No services selected yet</p>
        )}
      </div>
    </div>
  );
}

// Step 4: Hours & Service Area
function HoursStep({
  data,
  updateData,
}: {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
}) {
  const presets = Object.entries(HOURS_PRESETS);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [newCity, setNewCity] = useState('');

  const applyPreset = (presetKey: string) => {
    const preset = HOURS_PRESETS[presetKey as keyof typeof HOURS_PRESETS];
    updateData({ hours: preset.hours });
    setSelectedPreset(presetKey);
  };

  const addCity = () => {
    if (newCity.trim() && !data.service_area.cities?.includes(newCity.trim())) {
      updateData({
        service_area: {
          ...data.service_area,
          cities: [...(data.service_area.cities || []), newCity.trim()],
        },
      });
      setNewCity('');
    }
  };

  const removeCity = (city: string) => {
    updateData({
      service_area: {
        ...data.service_area,
        cities: data.service_area.cities?.filter(c => c !== city) || [],
      },
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Hours & Service Area</h2>
      <p className="text-gray-600 mb-6">
        Let customers know when you&apos;re available and where you serve.
      </p>

      {/* Hours Presets */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Quick Presets
        </label>
        <div className="flex flex-wrap gap-2">
          {presets.map(([key, preset]) => (
            <button
              key={key}
              onClick={() => applyPreset(key)}
              className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                selectedPreset === key
                  ? 'border-boerne-navy bg-boerne-navy/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Emergency Service */}
      <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.emergency_available}
            onChange={(e) => updateData({ emergency_available: e.target.checked })}
            className="w-5 h-5 rounded border-gray-300 text-boerne-navy focus:ring-boerne-navy"
          />
          <div>
            <span className="font-medium text-gray-900">24/7 Emergency Service Available</span>
            <p className="text-sm text-gray-600">
              Check this if you offer after-hours emergency calls
            </p>
          </div>
        </label>
      </div>

      {/* Service Area */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Service Area</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Radius (miles from Boerne)
          </label>
          <select
            value={data.service_area.radiusMiles || ''}
            onChange={(e) => updateData({
              service_area: {
                ...data.service_area,
                radiusMiles: e.target.value ? parseInt(e.target.value) : undefined,
              },
            })}
            className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select...</option>
            <option value="10">10 miles</option>
            <option value="15">15 miles</option>
            <option value="20">20 miles</option>
            <option value="25">25 miles</option>
            <option value="30">30 miles</option>
            <option value="50">50 miles</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cities Served
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCity()}
              className="flex-1 sm:w-48 px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., Fair Oaks Ranch"
            />
            <button
              onClick={addCity}
              disabled={!newCity.trim()}
              className="px-4 py-2 bg-boerne-navy text-white rounded-lg hover:bg-boerne-navy/90 disabled:opacity-50"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.service_area.cities?.map((city) => (
              <span
                key={city}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
              >
                {city}
                <button
                  onClick={() => removeCity(city)}
                  className="text-gray-400 hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 5: Photos & About
function PhotosStep({
  data,
  updateData,
  businessId,
  websiteId,
  tierKey,
}: {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
  businessId?: string;
  websiteId?: string;
  tierKey: TierKey;
}) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(data.testimonials);

  const photoLimit = getPhotoLimit(tierKey);
  const currentPhotoCount =
    (data.logo_photo ? 1 : 0) +
    (data.hero_photo ? 1 : 0) +
    data.gallery_photos.length;

  const addTestimonial = () => {
    if (testimonials.length < 5) {
      setTestimonials([...testimonials, { name: '', text: '', rating: 5 }]);
    }
  };

  const updateTestimonial = (index: number, updates: Partial<Testimonial>) => {
    const updated = testimonials.map((t, i) =>
      i === index ? { ...t, ...updates } : t
    );
    setTestimonials(updated);
    updateData({ testimonials: updated });
  };

  const removeTestimonial = (index: number) => {
    const updated = testimonials.filter((_, i) => i !== index);
    setTestimonials(updated);
    updateData({ testimonials: updated });
  };

  const handleLogoUpload = (photo: UploadedPhoto) => {
    updateData({ logo_photo: photo });
  };

  const handleLogoDelete = () => {
    updateData({ logo_photo: null });
  };

  const handleHeroUpload = (photo: UploadedPhoto) => {
    updateData({ hero_photo: photo });
  };

  const handleHeroDelete = () => {
    updateData({ hero_photo: null });
  };

  const handleGalleryUpload = (photo: UploadedPhoto) => {
    updateData({ gallery_photos: [...data.gallery_photos, photo] });
  };

  const handleGalleryDelete = (photoId: string) => {
    updateData({
      gallery_photos: data.gallery_photos.filter((p) => p.id !== photoId),
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Final Touches</h2>
      <p className="text-gray-600 mb-6">
        Add photos and testimonials to make your site shine. You can add more later!
      </p>

      {/* Photo Upload Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Photos</h3>
          <span className="text-sm text-gray-500">
            {currentPhotoCount}/{photoLimit} photos used
          </span>
        </div>

        {businessId && websiteId ? (
          <div className="space-y-6">
            {/* Logo Upload */}
            <PhotoUpload
              photoType="logo"
              businessId={businessId}
              websiteId={websiteId}
              currentPhoto={data.logo_photo}
              photoLimit={photoLimit}
              currentPhotoCount={currentPhotoCount}
              onUpload={handleLogoUpload}
              onDelete={handleLogoDelete}
            />

            {/* Hero Upload */}
            <PhotoUpload
              photoType="hero"
              businessId={businessId}
              websiteId={websiteId}
              currentPhoto={data.hero_photo}
              photoLimit={photoLimit}
              currentPhotoCount={currentPhotoCount}
              onUpload={handleHeroUpload}
              onDelete={handleHeroDelete}
            />

            {/* Gallery Upload */}
            <PhotoUpload
              photoType="gallery"
              businessId={businessId}
              websiteId={websiteId}
              currentPhotos={data.gallery_photos}
              maxPhotos={Math.max(0, photoLimit - 2)} // Reserve 2 for logo/hero
              photoLimit={photoLimit}
              currentPhotoCount={currentPhotoCount}
              onUpload={handleGalleryUpload}
              onDelete={handleGalleryDelete}
            />
          </div>
        ) : (
          <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
            <Camera size={40} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-600 mb-2">Save your progress first</p>
            <p className="text-sm text-gray-500">
              Click &quot;Next&quot; on any previous step to create your website draft, then you can upload photos.
            </p>
          </div>
        )}

        <p className="text-xs text-gray-500 mt-3">
          Tip: Photos of your work help build trust with potential customers
        </p>
      </div>

      {/* Testimonials */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Customer Testimonials</h3>
          <button
            onClick={addTestimonial}
            disabled={testimonials.length >= 5}
            className="text-sm text-boerne-navy hover:underline disabled:opacity-50 disabled:no-underline"
          >
            + Add Testimonial
          </button>
        </div>

        {testimonials.length === 0 ? (
          <div className="p-6 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-600 mb-2">No testimonials yet</p>
            <p className="text-sm text-gray-500">
              Add quotes from satisfied customers to build trust
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => updateTestimonial(index, { rating: star })}
                        className={`text-xl ${
                          star <= (testimonial.rating || 5)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => removeTestimonial(index)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
                <textarea
                  value={testimonial.text}
                  onChange={(e) => updateTestimonial(index, { text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2"
                  placeholder="What did the customer say?"
                  rows={2}
                />
                <input
                  type="text"
                  value={testimonial.name}
                  onChange={(e) => updateTestimonial(index, { name: e.target.value })}
                  className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Customer name"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Summary */}
      <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h4 className="font-semibold text-green-800 mb-2">Ready to Submit?</h4>
        <p className="text-sm text-green-700">
          After you submit, we&apos;ll review your site within 1-2 business days. You&apos;ll receive
          an email once it&apos;s approved and live!
        </p>
      </div>
    </div>
  );
}
