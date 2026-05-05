'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBusinessDashboard } from '../../layout';
import {
  ArrowLeft,
  Save,
  AlertTriangle,
  Check,
  Palette,
  Wrench,
  Clock,
  Camera,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import type {
  Website,
  WebsiteTemplate,
  ServiceItem,
  BusinessHours,
  ServiceArea,
  Testimonial
} from '@/lib/websites/types';
import { TEMPLATES, HOURS_PRESETS, COLOR_PRESETS, FIELDS_REQUIRING_REVIEW, FIELDS_AUTO_PUBLISH, COMMON_SERVICES } from '@/lib/websites/types';

type EditSection = 'brand' | 'services' | 'hours' | 'photos';

const sections = [
  { id: 'brand' as EditSection, name: 'Brand & Colors', icon: Palette, requiresReview: ['tagline', 'about_text'] },
  { id: 'services' as EditSection, name: 'Services', icon: Wrench, requiresReview: ['services', 'license_number'] },
  { id: 'hours' as EditSection, name: 'Hours & Area', icon: Clock, requiresReview: [] },
  { id: 'photos' as EditSection, name: 'Photos & Reviews', icon: Camera, requiresReview: ['testimonials'] },
];

export default function WebsiteEditPage() {
  const router = useRouter();
  const { business } = useBusinessDashboard();
  const [website, setWebsite] = useState<Website | null>(null);
  const [activeSection, setActiveSection] = useState<EditSection>('brand');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changedFields, setChangedFields] = useState<Set<string>>(new Set());
  const [originalData, setOriginalData] = useState<Partial<Website>>({});

  // Form data
  const [formData, setFormData] = useState({
    template: 'handyman' as WebsiteTemplate,
    primary_color: '#1e3a5f',
    accent_color: '#d4a853',
    tagline: '',
    about_text: '',
    services: [] as ServiceItem[],
    license_number: '',
    insurance_carrier: '',
    years_in_business: null as number | null,
    hours: {} as BusinessHours,
    emergency_available: false,
    service_area: { cities: ['Boerne'] } as ServiceArea,
    testimonials: [] as Testimonial[],
  });

  useEffect(() => {
    if (business) {
      fetchWebsite();
    }
  }, [business]);

  const fetchWebsite = async () => {
    if (!business) return;

    try {
      const res = await fetch(`/api/websites?business_id=${business.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setWebsite(data);
          const initialData = {
            template: data.template,
            primary_color: data.primary_color,
            accent_color: data.accent_color,
            tagline: data.tagline || '',
            about_text: data.about_text || '',
            services: data.services || [],
            license_number: data.license_number || '',
            insurance_carrier: data.insurance_carrier || '',
            years_in_business: data.years_in_business,
            hours: data.hours || {},
            emergency_available: data.emergency_available || false,
            service_area: data.service_area || { cities: ['Boerne'] },
            testimonials: data.testimonials || [],
          };
          setFormData(initialData);
          setOriginalData(initialData);
        }
      }
    } catch (error) {
      console.error('Error fetching website:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Track changed fields
    const originalValue = originalData[field as keyof typeof originalData];
    if (JSON.stringify(value) !== JSON.stringify(originalValue)) {
      setChangedFields(prev => new Set(prev).add(field));
    } else {
      setChangedFields(prev => {
        const next = new Set(prev);
        next.delete(field);
        return next;
      });
    }
  };

  const requiresReview = () => {
    return Array.from(changedFields).some(field =>
      FIELDS_REQUIRING_REVIEW.includes(field as typeof FIELDS_REQUIRING_REVIEW[number])
    );
  };

  const handleSave = async () => {
    if (!website) return;

    setSaving(true);
    try {
      const res = await fetch('/api/websites/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          website_id: website.id,
          ...formData,
          changed_fields: Array.from(changedFields),
        }),
      });

      if (res.ok) {
        const result = await res.json();
        if (result.requires_review) {
          // Redirect to dashboard with message
          router.push('/business/dashboard/website?submitted=true');
        } else {
          // Changes auto-approved
          router.push('/business/dashboard/website?saved=true');
        }
      }
    } catch (error) {
      console.error('Error saving website:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!website || website.status !== 'live') {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <AlertTriangle size={48} className="mx-auto text-yellow-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Website Not Available
          </h2>
          <p className="text-gray-600 mb-6">
            You can only edit a live website. Please complete the setup first.
          </p>
          <Link
            href="/business/dashboard/website"
            className="inline-flex items-center gap-2 px-4 py-2 bg-boerne-navy text-white rounded-lg hover:bg-boerne-navy/90"
          >
            <ArrowLeft size={18} />
            Back to Website
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/business/dashboard/website"
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Edit Website</h1>
                <p className="text-sm text-gray-500">/{website.slug}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/site/${website.slug}`}
                target="_blank"
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900"
              >
                <Eye size={18} />
                Preview
              </Link>
              <button
                onClick={handleSave}
                disabled={saving || changedFields.size === 0}
                className="flex items-center gap-2 px-4 py-2 bg-boerne-navy text-white rounded-lg hover:bg-boerne-navy/90 disabled:opacity-50"
              >
                <Save size={18} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Review Warning */}
      {requiresReview() && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="max-w-5xl mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle size={18} />
              <span className="text-sm">
                Some changes require review before going live. Your site will remain live with the current content until approved.
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Section Nav */}
          <nav className="w-48 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-2">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                const hasChanges = section.requiresReview.some(f => changedFields.has(f));

                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-boerne-navy text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={16} />
                    {section.name}
                    {hasChanges && (
                      <span className="ml-auto w-2 h-2 bg-yellow-400 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Changed Fields Summary */}
            {changedFields.size > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700 font-medium mb-1">
                  Unsaved Changes
                </p>
                <p className="text-xs text-blue-600">
                  {changedFields.size} field{changedFields.size > 1 ? 's' : ''} modified
                </p>
              </div>
            )}
          </nav>

          {/* Section Content */}
          <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
            {activeSection === 'brand' && (
              <BrandSection
                formData={formData}
                updateFormData={updateFormData}
                businessName={business?.name}
                businessCategory={business?.category}
              />
            )}
            {activeSection === 'services' && (
              <ServicesSection formData={formData} updateFormData={updateFormData} />
            )}
            {activeSection === 'hours' && (
              <HoursSection formData={formData} updateFormData={updateFormData} />
            )}
            {activeSection === 'photos' && (
              <PhotosSection formData={formData} updateFormData={updateFormData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Brand Section
function BrandSection({
  formData,
  updateFormData,
  businessName,
  businessCategory,
}: {
  formData: { primary_color: string; accent_color: string; tagline: string; about_text: string };
  updateFormData: (field: string, value: unknown) => void;
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
          tagline: formData.tagline,
          about_text: formData.about_text,
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
    updateFormData(type, value);
    if (type === 'about_text') {
      setShowSuggestions(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Brand & Colors</h2>

      {/* Color Presets */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Color Scheme
        </label>
        <div className="flex flex-wrap gap-2">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                updateFormData('primary_color', preset.primary);
                updateFormData('accent_color', preset.accent);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                formData.primary_color === preset.primary
                  ? 'border-boerne-navy'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex">
                <div className="w-5 h-5 rounded-l" style={{ backgroundColor: preset.primary }} />
                <div className="w-5 h-5 rounded-r" style={{ backgroundColor: preset.accent }} />
              </div>
              <span className="text-sm">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tagline */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tagline
          <span className="ml-1 px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded">
            Requires review
          </span>
        </label>
        <input
          type="text"
          value={formData.tagline}
          onChange={(e) => updateFormData('tagline', e.target.value.slice(0, 80))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="Your trusted local plumber since 2010"
          maxLength={80}
        />
        <p className="text-xs text-gray-500 mt-1">{formData.tagline.length}/80</p>

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

      {/* About */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          About Your Business
          <span className="ml-1 px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded">
            Requires review
          </span>
        </label>
        <textarea
          value={formData.about_text}
          onChange={(e) => updateFormData('about_text', e.target.value.slice(0, 500))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg h-32"
          placeholder="Tell potential customers about your business..."
          maxLength={500}
        />
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-gray-500">{formData.about_text.length}/500</p>
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
    </div>
  );
}

// Services Section
function ServicesSection({
  formData,
  updateFormData,
}: {
  formData: {
    services: ServiceItem[];
    license_number: string;
    insurance_carrier: string;
    years_in_business: number | null;
  };
  updateFormData: (field: string, value: unknown) => void;
}) {
  const [newService, setNewService] = useState('');

  const toggleService = (serviceName: string) => {
    const exists = formData.services.some(s => s.name === serviceName);
    if (exists) {
      updateFormData('services', formData.services.filter(s => s.name !== serviceName));
    } else {
      updateFormData('services', [...formData.services, { name: serviceName }]);
    }
  };

  const addCustomService = () => {
    if (newService.trim() && !formData.services.some(s => s.name === newService.trim())) {
      updateFormData('services', [...formData.services, { name: newService.trim() }]);
      setNewService('');
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Services & Credentials</h2>

      {/* Services */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Services Offered
          <span className="ml-1 px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded">
            Requires review
          </span>
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {COMMON_SERVICES.map((service) => {
            const isSelected = formData.services.some(s => s.name === service);
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
        <div className="flex gap-2">
          <input
            type="text"
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCustomService()}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            placeholder="Add custom service"
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
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            License Number
            <span className="ml-1 px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded">
              Requires review
            </span>
          </label>
          <input
            type="text"
            value={formData.license_number}
            onChange={(e) => updateFormData('license_number', e.target.value)}
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
            value={formData.insurance_carrier}
            onChange={(e) => updateFormData('insurance_carrier', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
            value={formData.years_in_business || ''}
            onChange={(e) => updateFormData('years_in_business', e.target.value ? parseInt(e.target.value) : null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}

// Hours Section
function HoursSection({
  formData,
  updateFormData,
}: {
  formData: {
    hours: BusinessHours;
    emergency_available: boolean;
    service_area: ServiceArea;
  };
  updateFormData: (field: string, value: unknown) => void;
}) {
  const presets = Object.entries(HOURS_PRESETS);
  const [newCity, setNewCity] = useState('');

  const applyPreset = (presetKey: string) => {
    const preset = HOURS_PRESETS[presetKey as keyof typeof HOURS_PRESETS];
    updateFormData('hours', preset.hours);
  };

  const addCity = () => {
    if (newCity.trim() && !formData.service_area.cities?.includes(newCity.trim())) {
      updateFormData('service_area', {
        ...formData.service_area,
        cities: [...(formData.service_area.cities || []), newCity.trim()],
      });
      setNewCity('');
    }
  };

  const removeCity = (city: string) => {
    updateFormData('service_area', {
      ...formData.service_area,
      cities: formData.service_area.cities?.filter(c => c !== city) || [],
    });
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Hours & Service Area</h2>
      <p className="text-sm text-green-600 mb-4">
        <Check size={14} className="inline mr-1" />
        Changes to hours and service area are auto-approved
      </p>

      {/* Hours Presets */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quick Presets
        </label>
        <div className="flex flex-wrap gap-2">
          {presets.map(([key, preset]) => (
            <button
              key={key}
              onClick={() => applyPreset(key)}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:border-gray-300"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Emergency */}
      <div className="mb-6 p-4 bg-amber-50 rounded-lg">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.emergency_available}
            onChange={(e) => updateFormData('emergency_available', e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-boerne-navy"
          />
          <span className="font-medium text-gray-900">24/7 Emergency Service Available</span>
        </label>
      </div>

      {/* Service Area */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service Area
        </label>
        <div className="mb-3">
          <select
            value={formData.service_area.radiusMiles || ''}
            onChange={(e) => updateFormData('service_area', {
              ...formData.service_area,
              radiusMiles: e.target.value ? parseInt(e.target.value) : undefined,
            })}
            className="w-48 px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select radius...</option>
            <option value="10">10 miles</option>
            <option value="15">15 miles</option>
            <option value="20">20 miles</option>
            <option value="25">25 miles</option>
            <option value="30">30 miles</option>
            <option value="50">50 miles</option>
          </select>
        </div>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCity()}
            className="flex-1 sm:w-48 px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Add city"
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
          {formData.service_area.cities?.map((city) => (
            <span
              key={city}
              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
            >
              {city}
              <button onClick={() => removeCity(city)} className="text-gray-400 hover:text-red-500">×</button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// Photos Section
function PhotosSection({
  formData,
  updateFormData,
}: {
  formData: { testimonials: Testimonial[] };
  updateFormData: (field: string, value: unknown) => void;
}) {
  const addTestimonial = () => {
    if (formData.testimonials.length < 5) {
      updateFormData('testimonials', [...formData.testimonials, { name: '', text: '', rating: 5 }]);
    }
  };

  const updateTestimonial = (index: number, updates: Partial<Testimonial>) => {
    const updated = formData.testimonials.map((t, i) =>
      i === index ? { ...t, ...updates } : t
    );
    updateFormData('testimonials', updated);
  };

  const removeTestimonial = (index: number) => {
    updateFormData('testimonials', formData.testimonials.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Photos & Testimonials</h2>

      {/* Photo Upload Placeholder */}
      <div className="mb-8">
        <h3 className="font-medium text-gray-900 mb-2">Photos</h3>
        <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <Camera size={32} className="mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500">Photo upload coming soon</p>
        </div>
      </div>

      {/* Testimonials */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900">
            Customer Testimonials
            <span className="ml-2 px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded">
              Requires review
            </span>
          </h3>
          <button
            onClick={addTestimonial}
            disabled={formData.testimonials.length >= 5}
            className="text-sm text-boerne-navy hover:underline disabled:opacity-50"
          >
            + Add Testimonial
          </button>
        </div>

        {formData.testimonials.length === 0 ? (
          <div className="p-6 bg-gray-50 rounded-lg text-center text-gray-500">
            No testimonials yet
          </div>
        ) : (
          <div className="space-y-4">
            {formData.testimonials.map((testimonial, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => updateTestimonial(index, { rating: star })}
                        className={`text-lg ${
                          star <= (testimonial.rating || 5) ? 'text-yellow-400' : 'text-gray-300'
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
                  placeholder="Customer quote"
                  rows={2}
                />
                <input
                  type="text"
                  value={testimonial.name}
                  onChange={(e) => updateTestimonial(index, { name: e.target.value })}
                  className="w-48 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Customer name"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
