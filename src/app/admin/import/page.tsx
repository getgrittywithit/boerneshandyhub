'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface ImportSettings {
  location: string;
  radius: number;
  categories: string[];
  maxResults: number;
}

interface ImportPreview {
  name: string;
  address: string;
  phone?: string;
  website?: string;
  rating: number;
  place_id: string;
  types: string[];
  category: string;
}

const WEDDING_CATEGORIES = [
  { id: 'wedding_venue', label: 'Wedding Venues', types: ['wedding_venue', 'banquet_hall', 'event_venue'] },
  { id: 'photographer', label: 'Photographers', types: ['photographer', 'wedding_photographer'] },
  { id: 'florist', label: 'Florists', types: ['florist', 'flower_shop'] },
  { id: 'restaurant', label: 'Catering/Restaurants', types: ['restaurant', 'meal_takeaway', 'catering'] },
  { id: 'beauty_salon', label: 'Beauty Services', types: ['beauty_salon', 'hair_care', 'spa'] },
  { id: 'jewelry_store', label: 'Jewelry Stores', types: ['jewelry_store'] },
  { id: 'clothing_store', label: 'Bridal Shops', types: ['clothing_store', 'bridal_shop'] }
];

export default function ImportBusinesses() {
  const [settings, setSettings] = useState<ImportSettings>({
    location: 'Boerne, TX',
    radius: 25000, // 25km
    categories: [],
    maxResults: 20
  });
  
  const [preview, setPreview] = useState<ImportPreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);


  const handlePreview = async () => {
    if (settings.categories.length === 0) {
      alert('Please select at least one category');
      return;
    }

    setLoading(true);
    setPreview([]);

    try {
      const response = await fetch('/api/google-places', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: settings.location,
          radius: settings.radius,
          categories: settings.categories,
          maxResults: settings.maxResults
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch places data');
      }

      setPreview(data.results);
    } catch (error) {
      console.error('Preview failed:', error);
      
      let errorMessage = 'Failed to preview businesses. Check your settings and try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Provide specific help for common issues
        if (error.message.includes('API key not configured')) {
          errorMessage += '\n\n💡 Solution: Add GOOGLE_PLACES_API_KEY to your Vercel environment variables and redeploy.';
        } else if (error.message.includes('Failed to geocode location')) {
          errorMessage += '\n\n💡 Check that:\n• Google Places API key has Geocoding API enabled\n• Billing is enabled for your Google Cloud project\n• The location "' + settings.location + '" is valid';
        }
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (preview.length === 0) {
      alert('No businesses to import. Run a preview first.');
      return;
    }

    setImporting(true);

    try {
      if (!supabase) {
        console.error('Supabase not initialized');
        return;
      }
      
      // Transform preview data for database insertion
      const businessData = preview.map(business => ({
        name: business.name,
        category: getCategoryName(business.category),
        address: business.address,
        phone: business.phone || '',
        website: business.website || '',
        rating: business.rating,
        membership_tier: 'basic',
        claim_status: 'unclaimed'
      }));

      const { error } = await supabase
        .from('businesses')
        .insert(businessData);

      if (error) throw error;

      alert(`Successfully imported ${businessData.length} businesses!`);
      setPreview([]);
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import businesses. Check the console for details.');
    } finally {
      setImporting(false);
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = WEDDING_CATEGORIES.find(c => c.id === categoryId);
    return category?.label || categoryId;
  };

  const toggleCategory = (categoryId: string) => {
    setSettings(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(c => c !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-4">
                  <li>
                    <a href="/admin" className="text-gray-500 hover:text-gray-700">Admin</a>
                  </li>
                  <li>
                    <span className="text-gray-500">/</span>
                  </li>
                  <li>
                    <span className="text-gray-900 font-medium">Import Businesses</span>
                  </li>
                </ol>
              </nav>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Import Businesses</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Settings Panel */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Import Settings</h3>
            
            <div className="space-y-4">
              {/* API Status */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Google Places API:</span> Configured via environment variables
                </p>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  value={settings.location}
                  onChange={(e) => setSettings(prev => ({ ...prev, location: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Radius */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Search Radius (km)
                </label>
                <input
                  type="number"
                  value={settings.radius / 1000}
                  onChange={(e) => setSettings(prev => ({ ...prev, radius: parseInt(e.target.value) * 1000 }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Max Results */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Max Results per Category
                </label>
                <input
                  type="number"
                  value={settings.maxResults}
                  onChange={(e) => setSettings(prev => ({ ...prev, maxResults: parseInt(e.target.value) }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Categories
                </label>
                <div className="space-y-2">
                  {WEDDING_CATEGORIES.map((category) => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.categories.includes(category.id)}
                        onChange={() => toggleCategory(category.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{category.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handlePreview}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Preview Results'}
                </button>
                
                {preview.length > 0 && (
                  <button
                    onClick={handleImport}
                    disabled={importing}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {importing ? 'Importing...' : `Import ${preview.length} Businesses`}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Preview Results ({preview.length} businesses)
            </h3>
            
            {preview.length === 0 ? (
              <p className="text-gray-500">No preview data. Configure settings and click "Preview Results".</p>
            ) : (
              <div className="max-h-96 overflow-y-auto space-y-3">
                {preview.map((business, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{business.name}</h4>
                        <p className="text-sm text-gray-600">{business.address}</p>
                        {business.phone && (
                          <p className="text-sm text-gray-600">{business.phone}</p>
                        )}
                        <div className="flex items-center mt-1">
                          <span className="text-sm text-gray-500">Rating: {business.rating || 'N/A'}</span>
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {getCategoryName(business.category)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}