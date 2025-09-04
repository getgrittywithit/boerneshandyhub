'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface WeddingForm {
  // Basic Info
  coupleName1: string;
  coupleName2: string;
  weddingDate: string;
  subdomain: string;
  
  // Venue Details
  venueName: string;
  venueAddress: string;
  ceremonyTime: string;
  receptionTime: string;
  
  // Story & Style
  weddingStory: string;
  colorPrimary: string;
  colorSecondary: string;
  
  // Contact
  email: string;
  phone: string;
  
  // RSVP Settings
  rsvpDeadline: string;
  maxGuestsPerRsvp: number;
  
  // Registry
  registryLinks: Array<{name: string; url: string}>;
  
  // Hotel Information
  hotelBlocks: Array<{name: string; address: string; phone: string; groupCode?: string}>;
}

function CreateWeddingWebsiteContent() {
  const searchParams = useSearchParams();
  const template = searchParams.get('template') || 'rustic';
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<WeddingForm>({
    coupleName1: '',
    coupleName2: '',
    weddingDate: '',
    subdomain: '',
    venueName: '',
    venueAddress: '',
    ceremonyTime: '',
    receptionTime: '',
    weddingStory: '',
    colorPrimary: template === 'rustic' ? '#8B4513' : template === 'elegant' ? '#DDA0DD' : '#2F4F4F',
    colorSecondary: template === 'rustic' ? '#F4E4C1' : template === 'elegant' ? '#F8F8FF' : '#FFFFFF',
    email: '',
    phone: '',
    rsvpDeadline: '',
    maxGuestsPerRsvp: 2,
    registryLinks: [{name: '', url: ''}],
    hotelBlocks: [{name: '', address: '', phone: '', groupCode: ''}]
  });

  // Auto-generate subdomain when names change
  const generateSubdomain = (name1: string, name2: string) => {
    const clean1 = name1.toLowerCase().replace(/[^a-z]/g, '');
    const clean2 = name2.toLowerCase().replace(/[^a-z]/g, '');
    return `${clean1}-${clean2}`;
  };

  const handleInputChange = (field: keyof WeddingForm, value: string | number) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-generate subdomain when names change
      if (field === 'coupleName1' || field === 'coupleName2') {
        updated.subdomain = generateSubdomain(
          field === 'coupleName1' ? String(value) : updated.coupleName1,
          field === 'coupleName2' ? String(value) : updated.coupleName2
        );
      }
      
      return updated;
    });
  };

  const addRegistryLink = () => {
    setFormData(prev => ({
      ...prev,
      registryLinks: [...prev.registryLinks, {name: '', url: ''}]
    }));
  };

  const updateRegistryLink = (index: number, field: 'name' | 'url', value: string) => {
    setFormData(prev => ({
      ...prev,
      registryLinks: prev.registryLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const addHotelBlock = () => {
    setFormData(prev => ({
      ...prev,
      hotelBlocks: [...prev.hotelBlocks, {name: '', address: '', phone: '', groupCode: ''}]
    }));
  };

  const updateHotelBlock = (index: number, field: keyof typeof formData.hotelBlocks[0], value: string) => {
    setFormData(prev => ({
      ...prev,
      hotelBlocks: prev.hotelBlocks.map((hotel, i) => 
        i === index ? { ...hotel, [field]: value } : hotel
      )
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/wedding-websites/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          template,
        }),
      });

      if (response.ok) {
        const { paymentUrl } = await response.json();
        // Redirect to payment, then to website
        window.location.href = paymentUrl;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create website');
      }
    } catch (error) {
      console.error('Error creating website:', error);
      alert(error instanceof Error ? error.message : 'There was an error creating your website. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const templateNames = {
    rustic: 'Rustic Hill Country',
    elegant: 'Elegant Garden', 
    modern: 'Modern Minimalist'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create Your Wedding Website
          </h1>
          <p className="text-lg text-gray-600">
            Template: {templateNames[template as keyof typeof templateNames]}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Step {step} of 4</span>
            <span className="text-sm text-gray-600">{Math.round((step / 4) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-pink-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Steps */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Partner 1 Name
                  </label>
                  <input
                    type="text"
                    value={formData.coupleName1}
                    onChange={(e) => handleInputChange('coupleName1', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Sarah"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Partner 2 Name
                  </label>
                  <input
                    type="text"
                    value={formData.coupleName2}
                    onChange={(e) => handleInputChange('coupleName2', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Michael"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wedding Date
                </label>
                <input
                  type="date"
                  value={formData.weddingDate}
                  onChange={(e) => handleInputChange('weddingDate', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website Address
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={formData.subdomain}
                    onChange={(e) => handleInputChange('subdomain', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="sarah-michael"
                  />
                  <span className="bg-gray-100 px-4 py-3 border border-l-0 border-gray-300 rounded-r-lg text-gray-700">
                    .boerneweddings.com
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  This will be your website URL that guests can visit
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="sarah@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Wedding Details</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue Name
                </label>
                <input
                  type="text"
                  value={formData.venueName}
                  onChange={(e) => handleInputChange('venueName', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Boerne Hill Country Venue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue Address
                </label>
                <textarea
                  value={formData.venueAddress}
                  onChange={(e) => handleInputChange('venueAddress', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  rows={3}
                  placeholder="123 Hill Country Rd, Boerne, TX 78006"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ceremony Time
                  </label>
                  <input
                    type="time"
                    value={formData.ceremonyTime}
                    onChange={(e) => handleInputChange('ceremonyTime', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reception Time
                  </label>
                  <input
                    type="time"
                    value={formData.receptionTime}
                    onChange={(e) => handleInputChange('receptionTime', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Love Story (Optional)
                </label>
                <textarea
                  value={formData.weddingStory}
                  onChange={(e) => handleInputChange('weddingStory', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  rows={4}
                  placeholder="Tell your guests how you met and your journey together..."
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Registry & Hotels</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Wedding Registry Links
                </label>
                {formData.registryLinks.map((link, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      value={link.name}
                      onChange={(e) => updateRegistryLink(index, 'name', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="Target Registry"
                    />
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateRegistryLink(index, 'url', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="https://target.com/registry/..."
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addRegistryLink}
                  className="text-pink-600 hover:text-pink-700 font-medium"
                >
                  + Add Another Registry
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Hotel Information for Guests
                </label>
                {formData.hotelBlocks.map((hotel, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <input
                      type="text"
                      value={hotel.name}
                      onChange={(e) => updateHotelBlock(index, 'name', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="Hotel Name"
                    />
                    <input
                      type="text"
                      value={hotel.phone}
                      onChange={(e) => updateHotelBlock(index, 'phone', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="Phone Number"
                    />
                    <input
                      type="text"
                      value={hotel.address}
                      onChange={(e) => updateHotelBlock(index, 'address', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 md:col-span-2"
                      placeholder="Address"
                    />
                    <input
                      type="text"
                      value={hotel.groupCode || ''}
                      onChange={(e) => updateHotelBlock(index, 'groupCode', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="Group Code (optional)"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addHotelBlock}
                  className="text-pink-600 hover:text-pink-700 font-medium"
                >
                  + Add Another Hotel
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">RSVP Settings</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RSVP Deadline
                </label>
                <input
                  type="date"
                  value={formData.rsvpDeadline}
                  onChange={(e) => handleInputChange('rsvpDeadline', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Guests Per RSVP
                </label>
                <select
                  value={formData.maxGuestsPerRsvp}
                  onChange={(e) => handleInputChange('maxGuestsPerRsvp', parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value={1}>1 guest</option>
                  <option value={2}>2 guests (couples)</option>
                  <option value={4}>4 guests (families)</option>
                  <option value={6}>6 guests (large families)</option>
                </select>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Website Preview</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Your website will be available at:
                </p>
                <p className="text-lg font-bold text-pink-600 mb-4">
                  {formData.subdomain}.boerneweddings.com
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>✓ {formData.coupleName1} & {formData.coupleName2}'s Wedding</p>
                  <p>✓ {formData.weddingDate ? new Date(formData.weddingDate).toLocaleDateString() : 'Wedding date'}</p>
                  <p>✓ {formData.venueName || 'Venue information'}</p>
                  <p>✓ RSVP collection and guest management</p>
                  <p>✓ Registry links and hotel information</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8 mt-8 border-t">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              >
                Previous
              </button>
            )}
            
            {step < 4 ? (
              <button
                onClick={nextStep}
                className={`px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-all ${step === 1 ? 'ml-auto' : ''}`}
                disabled={!formData.coupleName1 || !formData.coupleName2 || !formData.weddingDate}
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all font-semibold disabled:opacity-50"
              >
                {loading ? 'Creating Website...' : 'Create My Website'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateWeddingWebsite() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <CreateWeddingWebsiteContent />
    </Suspense>
  );
}