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

// Trades that require state licenses in Texas
const LICENSED_TRADES: Record<string, { board: string; name: string; verifyUrl: string }> = {
  plumbing: { board: 'TSBPE', name: 'Texas State Board of Plumbing Examiners', verifyUrl: 'https://vo.licensing.tdlr.texas.gov/' },
  electrical: { board: 'TDLR', name: 'Texas Dept of Licensing & Regulation', verifyUrl: 'https://vo.licensing.tdlr.texas.gov/' },
  hvac: { board: 'TDLR', name: 'Texas Dept of Licensing & Regulation', verifyUrl: 'https://vo.licensing.tdlr.texas.gov/' },
  'commercial-hvac': { board: 'TDLR', name: 'Texas Dept of Licensing & Regulation', verifyUrl: 'https://vo.licensing.tdlr.texas.gov/' },
};

// Common certifications for unlicensed trades
const TRADE_CERTIFICATIONS: Record<string, string[]> = {
  handyman: ['EPA Lead-Safe Certified', 'OSHA 10/30 Certified', 'Home Improvement Contractor Cert'],
  remodeling: ['EPA Lead-Safe Certified', 'OSHA 10/30 Certified', 'NAHB Certified Graduate Builder', 'NAHB Certified Green Professional'],
  roofing: ['GAF Certified Installer', 'Owens Corning Preferred', 'CertainTeed SELECT ShingleMaster', 'OSHA 10/30 Certified'],
  painting: ['EPA Lead-Safe Certified', 'PDCA Certified'],
  flooring: ['CFI Certified Flooring Installer', 'NWFA Certified'],
  landscaping: ['Texas Nursery & Landscape Assoc Certified', 'Irrigation Association Certified'],
  'pest-control': ['TDA Structural Pest Control License', 'QualityPro Certified'],
  'pool-service': ['CPO Certified Pool Operator', 'NSPF Certified'],
  concrete: ['ACI Concrete Flatwork Certified', 'OSHA 10/30 Certified'],
  welding: ['AWS Certified Welder', 'ASME Certified'],
};

// Common services for each subcategory - users select from these
const subcategoryServices: Record<string, string[]> = {
  // Home
  plumbing: ['Leak repair', 'Drain cleaning', 'Water heater installation', 'Water heater repair', 'Faucet installation', 'Toilet repair', 'Sewer line repair', 'Garbage disposal', 'Water softener', 'Gas line repair', 'Emergency plumbing'],
  electrical: ['Outlet installation', 'Ceiling fan installation', 'Panel upgrades', 'Lighting installation', 'Wiring repair', 'Generator hookup', 'EV charger installation', 'Smoke detector installation', 'Troubleshooting', 'Emergency electrical'],
  hvac: ['AC repair', 'AC installation', 'Heating repair', 'Furnace installation', 'Duct cleaning', 'Thermostat installation', 'Mini-split installation', 'Maintenance plans', 'Air quality testing', 'Emergency HVAC'],
  roofing: ['Roof repair', 'Roof replacement', 'Shingle repair', 'Metal roofing', 'Flat roof repair', 'Leak repair', 'Storm damage repair', 'Roof inspection', 'Gutter installation'],
  fencing: ['Wood fence installation', 'Iron fence installation', 'Chain link fence', 'Privacy fence', 'Gate installation', 'Fence repair', 'Post replacement', 'Fence staining'],
  painting: ['Interior painting', 'Exterior painting', 'Cabinet painting', 'Deck staining', 'Pressure washing', 'Drywall repair', 'Wallpaper removal', 'Color consultation'],
  flooring: ['Hardwood installation', 'Tile installation', 'Carpet installation', 'Laminate flooring', 'Vinyl flooring', 'Floor refinishing', 'Grout cleaning', 'Floor repair'],
  remodeling: ['Kitchen remodel', 'Bathroom remodel', 'Room additions', 'Garage conversion', 'Deck building', 'Patio construction', 'Home renovation', 'Custom carpentry'],
  'pest-control': ['Termite treatment', 'Ant control', 'Roach control', 'Rodent control', 'Bee removal', 'Mosquito treatment', 'Wildlife removal', 'Preventive treatment'],
  landscaping: ['Lawn mowing', 'Landscape design', 'Irrigation installation', 'Sprinkler repair', 'Mulching', 'Tree planting', 'Flower bed installation', 'Yard cleanup', 'Sod installation'],
  'tree-service': ['Tree trimming', 'Tree removal', 'Stump grinding', 'Emergency tree service', 'Tree health assessment', 'Lot clearing', 'Pruning'],
  'pool-service': ['Pool cleaning', 'Pool repair', 'Equipment repair', 'Liner replacement', 'Pool opening/closing', 'Chemical balancing', 'Filter cleaning', 'Heater repair'],
  cleaning: ['Regular cleaning', 'Deep cleaning', 'Move-in/move-out cleaning', 'Post-construction cleaning', 'Window cleaning', 'Carpet cleaning', 'Organization'],
  handyman: ['Minor repairs', 'Furniture assembly', 'TV mounting', 'Shelf installation', 'Door repair', 'Drywall patching', 'Caulking', 'Weather stripping', 'Odd jobs'],
  'garage-doors': ['Garage door installation', 'Garage door repair', 'Opener installation', 'Spring replacement', 'Panel replacement', 'Maintenance'],
  'foundation-repair': ['Foundation inspection', 'Pier installation', 'Crack repair', 'Leveling', 'Drainage solutions', 'Waterproofing'],
  septic: ['Septic pumping', 'Septic inspection', 'Drain field repair', 'Tank installation', 'Maintenance'],
  gutters: ['Gutter installation', 'Gutter cleaning', 'Gutter repair', 'Gutter guards', 'Downspout installation'],
  'pressure-washing': ['House washing', 'Driveway cleaning', 'Deck cleaning', 'Fence cleaning', 'Concrete cleaning', 'Roof cleaning'],
  locksmith: ['Lockout service', 'Lock installation', 'Rekeying', 'Key duplication', 'Smart lock installation', 'Safe services'],
  // Auto
  mechanic: ['Oil change', 'Brake repair', 'Engine repair', 'Transmission service', 'Diagnostics', 'Tune-up', 'AC repair', 'Suspension work'],
  'body-shop': ['Collision repair', 'Dent removal', 'Paint work', 'Frame straightening', 'Bumper repair', 'Scratch repair'],
  towing: ['Emergency towing', 'Roadside assistance', 'Jump start', 'Tire change', 'Fuel delivery', 'Lockout service'],
  detailing: ['Full detail', 'Interior cleaning', 'Exterior wash', 'Waxing', 'Ceramic coating', 'Paint correction', 'Headlight restoration'],
  'tire-shop': ['Tire sales', 'Tire installation', 'Wheel alignment', 'Tire rotation', 'Flat repair', 'Balancing'],
  'windshield-glass': ['Windshield replacement', 'Chip repair', 'Window replacement', 'Mobile service'],
  'oil-change': ['Conventional oil change', 'Synthetic oil change', 'Filter replacement', 'Fluid top-off'],
  'mobile-mechanic': ['On-site diagnostics', 'Mobile oil change', 'Battery replacement', 'Brake service', 'Minor repairs'],
  // Outdoor
  welding: ['Custom fabrication', 'Gate welding', 'Fence welding', 'Trailer repair', 'Equipment repair', 'Ornamental work'],
  'ag-fencing': ['Barbed wire fence', 'Cattle fence', 'Game fence', 'Pipe fence', 'T-post fence', 'Ranch entrance'],
  'brush-clearing': ['Cedar clearing', 'Land clearing', 'Mulching', 'Forestry mowing', 'Lot clearing', 'Fire break creation'],
  excavation: ['Site grading', 'Driveway grading', 'Pond construction', 'Trenching', 'Land leveling', 'Dirt work'],
  concrete: ['Driveway installation', 'Patio pouring', 'Sidewalk', 'Foundation work', 'Concrete repair', 'Stamped concrete'],
  'well-drilling': ['Well drilling', 'Pump installation', 'Pump repair', 'Well inspection', 'Water testing'],
  'wildlife-management': ['Hog trapping', 'Varmint control', 'Deer management', 'Habitat improvement', 'Wildlife surveys'],
  'barn-shop': ['Metal building construction', 'Pole barn', 'Shop building', 'Carport installation', 'Barn repair'],
  // Commercial
  'commercial-hvac': ['Commercial AC repair', 'Rooftop unit service', 'Commercial installation', 'Preventive maintenance'],
  janitorial: ['Office cleaning', 'Floor care', 'Restroom service', 'Window cleaning', 'Carpet cleaning'],
  'parking-lot': ['Striping', 'Sealcoating', 'Pothole repair', 'Asphalt patching', 'Sign installation'],
  signage: ['Business signs', 'Monument signs', 'Vehicle wraps', 'Banners', 'Window graphics'],
  'commercial-construction': ['Tenant buildout', 'Commercial renovation', 'ADA compliance', 'Office construction'],
  // Specialty
  'holiday-lighting': ['Christmas light installation', 'Light removal', 'Commercial displays', 'Residential decorating'],
  moving: ['Local moving', 'Long-distance moving', 'Packing services', 'Loading/unloading', 'Storage'],
  'junk-hauling': ['Junk removal', 'Dumpster rental', 'Estate cleanout', 'Construction debris', 'Appliance removal'],
  'porta-potty': ['Standard rentals', 'Luxury restrooms', 'Event rentals', 'Construction site rentals'],
  storage: ['Self storage', 'Climate controlled', 'RV/boat storage', 'Portable storage'],
  generators: ['Generator installation', 'Generator repair', 'Maintenance', 'Transfer switch installation'],
};

interface FormData {
  // Step 1: Business Info
  name: string;
  topCategory: string;
  subcategories: string[];
  description: string;
  // Step 2: Contact Info
  streetAddress: string;
  suite: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  website: string;
  // Step 3: Services & Areas
  services: string[];
  serviceArea: string[];
  // Step 4: Credentials
  yearsInBusiness: string;
  // For licensed trades (plumber, electrician, HVAC)
  licenseNumber: string;
  licenseExpiration: string;
  // For all trades
  insured: boolean;
  bonded: boolean;
  // For unlicensed trades - certifications
  certifications: string[];
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
  streetAddress: '',
  suite: '',
  city: 'Boerne',
  state: 'TX',
  zip: '',
  phone: '',
  email: '',
  website: '',
  services: [],
  serviceArea: [],
  yearsInBusiness: '',
  licenseNumber: '',
  licenseExpiration: '',
  insured: false,
  bonded: false,
  certifications: [],
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
        if (!formData.streetAddress) {
          newErrors.streetAddress = 'Street address is required';
        }
        if (!formData.city) {
          newErrors.city = 'City is required';
        }
        if (!formData.state) {
          newErrors.state = 'State is required';
        }
        if (!formData.zip || !/^\d{5}(-\d{4})?$/.test(formData.zip)) {
          newErrors.zip = 'Valid ZIP code is required';
        }
        if (!formData.phone || !/^[\d\s\-\(\)]+$/.test(formData.phone)) {
          newErrors.phone = 'Valid phone number is required';
        }
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Valid email address is required';
        }
        // Website validation - just check it looks like a domain if provided
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
            {/* Address Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address *
              </label>
              <input
                type="text"
                value={formData.streetAddress}
                onChange={(e) => updateField('streetAddress', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent ${
                  errors.streetAddress ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="123 Main St"
              />
              {errors.streetAddress && <p className="text-red-500 text-sm mt-1">{errors.streetAddress}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Suite / Unit (optional)
              </label>
              <input
                type="text"
                value={formData.suite}
                onChange={(e) => updateField('suite', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                placeholder="Suite 100"
              />
            </div>

            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent ${
                    errors.city ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Boerne"
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent ${
                    errors.state ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="TX"
                  maxLength={2}
                />
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  value={formData.zip}
                  onChange={(e) => updateField('zip', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent ${
                    errors.zip ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="78006"
                />
                {errors.zip && <p className="text-red-500 text-sm mt-1">{errors.zip}</p>}
              </div>
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
                type="text"
                value={formData.website}
                onChange={(e) => updateField('website', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                placeholder="www.yourbusiness.com"
              />
              <p className="text-xs text-gray-500 mt-1">No need to include http:// or https://</p>
            </div>
          </div>
        )}

        {/* Step 3: Services & Areas */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Services Offered * <span className="font-normal text-gray-500">(select at least 3)</span>
              </label>
              <p className="text-sm text-gray-500 mb-4">
                Based on your selected categories, choose the services you offer:
              </p>

              {/* Dynamic services based on selected subcategories */}
              {formData.subcategories.map((subcatSlug) => {
                const subcat = availableSubcategories.find(s => s.slug === subcatSlug);
                const services = subcategoryServices[subcatSlug] || [];
                if (services.length === 0) return null;

                return (
                  <div key={subcatSlug} className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <span>{subcat?.icon}</span>
                      <span>{subcat?.name}</span>
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {services.map((service) => {
                        const isSelected = formData.services.includes(service);
                        return (
                          <label
                            key={service}
                            className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-colors text-sm ${
                              isSelected
                                ? 'border-boerne-gold bg-boerne-gold/10'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {
                                if (isSelected) {
                                  removeService(service);
                                } else {
                                  updateField('services', [...formData.services, service]);
                                }
                              }}
                              className="sr-only"
                            />
                            <span className={`w-4 h-4 rounded border flex items-center justify-center ${
                              isSelected ? 'bg-boerne-gold border-boerne-gold' : 'border-gray-300'
                            }`}>
                              {isSelected && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </span>
                            <span>{service}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Add custom service */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Don't see a service? Add your own:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent text-sm"
                    placeholder="Add a custom service..."
                  />
                  <button
                    type="button"
                    onClick={addService}
                    className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Selected services summary */}
              {formData.services.length > 0 && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 font-medium mb-2">
                    {formData.services.length} service{formData.services.length !== 1 ? 's' : ''} selected
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {formData.services.map((service, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-white text-gray-700 rounded text-xs border border-green-200"
                      >
                        {service}
                        <button
                          type="button"
                          onClick={() => removeService(service)}
                          className="text-gray-400 hover:text-red-500 ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {errors.services && <p className="text-red-500 text-sm mt-2">{errors.services}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Areas * <span className="font-normal text-gray-500">(select all that apply)</span>
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
            {/* Important notice about verification */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                <span>🔒</span> About Credential Verification
              </h4>
              <p className="text-sm text-amber-800">
                To protect customers, credentials (Licensed, Insured, Bonded) are <strong>not displayed publicly</strong> until verified.
                Upgrade to our <strong>Verified plan ($29/mo)</strong> to submit documentation and display verified badges on your listing.
              </p>
            </div>

            {/* Years in Business - for all */}
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

            {/* License section - only for licensed trades */}
            {(() => {
              const licensedSubcats = formData.subcategories.filter(s => LICENSED_TRADES[s]);
              if (licensedSubcats.length === 0) return null;

              const licenseInfo = LICENSED_TRADES[licensedSubcats[0]];
              return (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <span>📋</span> State License Information
                  </h4>
                  <p className="text-sm text-blue-800 mb-4">
                    {licensedSubcats.map(s => {
                      const subcat = availableSubcategories.find(sub => sub.slug === s);
                      return subcat?.name;
                    }).join(', ')} require{licensedSubcats.length === 1 ? 's' : ''} a Texas state license from the {licenseInfo.name}.
                    Provide your info now, then upload documentation when you upgrade to Verified.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        License Number <span className="font-normal text-gray-500">(optional for now)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.licenseNumber}
                        onChange={(e) => updateField('licenseNumber', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                        placeholder="Enter your license number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        License Expiration <span className="font-normal text-gray-500">(optional for now)</span>
                      </label>
                      <input
                        type="date"
                        value={formData.licenseExpiration}
                        onChange={(e) => updateField('licenseExpiration', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-blue-700 mt-3">
                    🔒 "Licensed" badge only shown after we verify your license against {licenseInfo.board} records.
                  </p>
                </div>
              );
            })()}

            {/* Certifications section - for unlicensed trades */}
            {(() => {
              const hasLicensedTrade = formData.subcategories.some(s => LICENSED_TRADES[s]);
              const availableCerts = new Set<string>();
              formData.subcategories.forEach(s => {
                const certs = TRADE_CERTIFICATIONS[s] || [];
                certs.forEach(c => availableCerts.add(c));
              });

              if (availableCerts.size === 0 && hasLicensedTrade) return null;

              return (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    {hasLicensedTrade ? 'Additional Certifications' : 'Certifications'} <span className="font-normal text-gray-500">(optional)</span>
                  </h4>
                  {!hasLicensedTrade && (
                    <p className="text-sm text-gray-500 mb-3">
                      Your trade doesn't require a state license in Texas. Select any certifications you hold:
                    </p>
                  )}

                  {availableCerts.size > 0 ? (
                    <div className="grid grid-cols-1 gap-2">
                      {Array.from(availableCerts).map((cert) => {
                        const isSelected = formData.certifications.includes(cert);
                        return (
                          <label
                            key={cert}
                            className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                              isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {
                                if (isSelected) {
                                  updateField('certifications', formData.certifications.filter(c => c !== cert));
                                } else {
                                  updateField('certifications', [...formData.certifications, cert]);
                                }
                              }}
                              className="w-5 h-5 text-green-500 rounded border-gray-300 focus:ring-green-500"
                            />
                            <span className="text-sm text-gray-700">{cert}</span>
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No common certifications for your selected categories</p>
                  )}
                </div>
              );
            })()}

            {/* Insurance & Bonded - for all */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Insurance & Bonding</h4>
              <p className="text-sm text-gray-500 -mt-2">
                Check all that apply. Badges shown only after uploading proof with Verified plan.
              </p>

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
                  <div className="font-medium text-gray-900">I have General Liability Insurance</div>
                  <div className="text-sm text-gray-500">
                    Certificate of insurance required for verification
                  </div>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                  formData.bonded ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.bonded}
                  onChange={(e) => updateField('bonded', e.target.checked)}
                  className="w-5 h-5 text-purple-500 rounded border-gray-300 focus:ring-purple-500"
                />
                <div>
                  <div className="font-medium text-gray-900">I have a Surety Bond</div>
                  <div className="text-sm text-gray-500">
                    Bond certificate required for verification
                  </div>
                </div>
              </label>
            </div>

            {/* Verification upsell */}
            <div className="bg-gradient-to-r from-boerne-navy to-boerne-navy/90 rounded-lg p-5 text-white">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <span>✅</span> Get Verified - $29/mo
              </h4>
              <p className="text-sm text-white/90 mb-3">
                Stand out with verified credential badges that customers trust:
              </p>
              <ul className="text-sm text-white/80 space-y-1 mb-3">
                <li>• <strong className="text-white">Licensed ✓</strong> - We verify against state records</li>
                <li>• <strong className="text-white">Insured ✓</strong> - Upload your certificate of insurance</li>
                <li>• <strong className="text-white">Bonded ✓</strong> - Upload your bond certificate</li>
              </ul>
              <p className="text-xs text-white/70">
                You can upgrade anytime from your dashboard after registering.
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
                  <dd className="text-gray-900 text-right">
                    {formData.streetAddress}{formData.suite ? `, ${formData.suite}` : ''}<br />
                    {formData.city}, {formData.state} {formData.zip}
                  </dd>
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
