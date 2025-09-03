'use client';

import { useState } from 'react';
import Link from 'next/link';

const weddingCategories = [
  {
    id: 'venues',
    name: 'Wedding Venues',
    icon: '🏰',
    description: 'Stunning Hill Country venues for your special day',
    count: 25,
    featured: true,
    subcategories: ['Outdoor Venues', 'Historic Buildings', 'Ranches', 'Vineyards', 'Intimate Spaces']
  },
  {
    id: 'photography',
    name: 'Photography & Video',
    icon: '📸',
    description: 'Capture your memories with local professionals',
    count: 18,
    subcategories: ['Wedding Photography', 'Videography', 'Engagement Sessions', 'Drone Photography']
  },
  {
    id: 'catering',
    name: 'Catering & Bars',
    icon: '🍽️',
    description: 'Delicious dining and beverage options',
    count: 22,
    subcategories: ['Full Service Catering', 'BBQ Catering', 'Food Trucks', 'Bar Services', 'Wedding Cakes']
  },
  {
    id: 'music',
    name: 'Music & Entertainment',
    icon: '🎵',
    description: 'DJs, bands, and entertainment for every style',
    count: 15,
    subcategories: ['Wedding DJs', 'Live Bands', 'Ceremony Musicians', 'String Quartets', 'Country Bands']
  },
  {
    id: 'flowers',
    name: 'Flowers & Decor',
    icon: '💐',
    description: 'Beautiful florals and decorations',
    count: 12,
    subcategories: ['Florists', 'Event Rentals', 'Lighting', 'Linens', 'Ceremony Decor']
  },
  {
    id: 'beauty',
    name: 'Beauty & Wellness',
    icon: '💄',
    description: 'Look and feel your best on your wedding day',
    count: 14,
    subcategories: ['Hair Stylists', 'Makeup Artists', 'Spas', 'Nail Salons', 'Mens Grooming']
  },
  {
    id: 'transportation',
    name: 'Transportation',
    icon: '🚗',
    description: 'Arrive in style with local transport options',
    count: 8,
    subcategories: ['Limousines', 'Party Buses', 'Vintage Cars', 'Shuttles', 'Horse & Carriage']
  },
  {
    id: 'planning',
    name: 'Wedding Planners',
    icon: '📋',
    description: 'Professional coordinators and planners',
    count: 10,
    featured: true,
    subcategories: ['Full Service Planning', 'Day-of Coordination', 'Partial Planning', 'Destination Weddings']
  },
  {
    id: 'specialty',
    name: 'Specialty Services',
    icon: '⭐',
    description: 'Unique touches for your perfect day',
    count: 16,
    subcategories: ['Officiants', 'Photo Booths', 'Specialty Cakes', 'Calligraphy', 'Wedding Favors']
  }
];

const weddingStyles = [
  { name: 'Rustic Hill Country', emoji: '🌾', popular: true },
  { name: 'Elegant Garden', emoji: '🌸', popular: true },
  { name: 'German Heritage', emoji: '🏛️', popular: false },
  { name: 'Bohemian Chic', emoji: '🌙', popular: false },
  { name: 'Modern Minimalist', emoji: '💎', popular: false },
  { name: 'Vintage Romance', emoji: '🌹', popular: true }
];

export default function WeddingsPage() {
  const [selectedStyle, setSelectedStyle] = useState('');

  return (
    <div className="bg-boerne-light-gray min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-boerne-navy to-boerne-dark-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">
              💍 Weddings in the Wedding Capital of Texas
            </h1>
            <p className="text-xl text-boerne-gold mb-8 max-w-3xl mx-auto">
              Discover Boerne's most trusted wedding vendors and create your perfect Hill Country celebration. 
              From intimate ceremonies to grand celebrations, we'll help you find everything you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors">
                Start Planning Your Wedding
              </button>
              <button className="px-8 py-3 border border-boerne-gold text-boerne-gold font-semibold rounded-lg hover:bg-boerne-gold hover:text-boerne-navy transition-colors">
                Browse Venues
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Wedding Style Filter */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h2 className="text-lg font-semibold text-boerne-navy mb-4">Find vendors for your wedding style:</h2>
          <div className="flex flex-wrap gap-3">
            {weddingStyles.map((style) => (
              <button
                key={style.name}
                onClick={() => setSelectedStyle(selectedStyle === style.name ? '' : style.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedStyle === style.name
                    ? 'bg-boerne-gold text-boerne-navy'
                    : 'bg-boerne-light-gray text-boerne-dark-gray hover:bg-boerne-gold hover:text-boerne-navy'
                } ${style.popular ? 'ring-2 ring-boerne-light-blue ring-opacity-50' : ''}`}
              >
                {style.emoji} {style.name}
                {style.popular && <span className="ml-1 text-xs">🔥</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Wedding Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-boerne-navy mb-4">
            Complete Wedding Vendor Directory
          </h2>
          <p className="text-lg text-boerne-dark-gray">
            Everything you need for your Hill Country wedding, all in one place
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {weddingCategories.map((category) => (
            <div
              key={category.id}
              className={`bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer ${
                category.featured ? 'ring-2 ring-boerne-gold ring-opacity-50' : ''
              }`}
              onClick={() => window.location.href = `/weddings/${category.id}`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{category.icon}</div>
                  {category.featured && (
                    <span className="bg-boerne-gold text-boerne-navy text-xs font-bold px-2 py-1 rounded-full">
                      FEATURED
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-boerne-navy mb-2">
                  {category.name}
                </h3>
                <p className="text-boerne-dark-gray mb-4">
                  {category.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-boerne-light-blue">
                    {category.count} vendors available
                  </span>
                </div>
                <div className="space-y-1">
                  {category.subcategories.slice(0, 3).map((sub, index) => (
                    <div key={index} className="text-sm text-boerne-dark-gray">
                      • {sub}
                    </div>
                  ))}
                  {category.subcategories.length > 3 && (
                    <div className="text-sm text-boerne-light-blue font-medium">
                      +{category.subcategories.length - 3} more categories
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <Link
                    href={`/weddings/${category.id}`}
                    className="text-boerne-gold hover:text-boerne-gold-alt font-medium transition-colors"
                  >
                    Browse {category.name} →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wedding Planning Tools */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-boerne-navy mb-4">
              🛠️ Wedding Planning Tools
            </h2>
            <p className="text-lg text-boerne-dark-gray">
              Make planning your Boerne wedding easier with our specialized tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-boerne-light-gray p-6 rounded-lg text-center">
              <div className="text-3xl mb-3">📅</div>
              <h3 className="font-bold text-boerne-navy mb-2">Venue Calendar</h3>
              <p className="text-sm text-boerne-dark-gray">Check availability across all venues</p>
            </div>
            <div className="bg-boerne-light-gray p-6 rounded-lg text-center">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-bold text-boerne-navy mb-2">Budget Calculator</h3>
              <p className="text-sm text-boerne-dark-gray">Plan your budget with local pricing</p>
            </div>
            <div className="bg-boerne-light-gray p-6 rounded-lg text-center">
              <div className="text-3xl mb-3">🗺️</div>
              <h3 className="font-bold text-boerne-navy mb-2">Guest Guide</h3>
              <p className="text-sm text-boerne-dark-gray">Help out-of-town guests explore Boerne</p>
            </div>
            <div className="bg-boerne-light-gray p-6 rounded-lg text-center">
              <div className="text-3xl mb-3">📋</div>
              <h3 className="font-bold text-boerne-navy mb-2">Timeline Builder</h3>
              <p className="text-sm text-boerne-dark-gray">Create your perfect wedding timeline</p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Boerne for Weddings */}
      <div className="py-16 bg-gradient-to-r from-boerne-green to-boerne-light-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Why Boerne is Perfect for Your Wedding
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl mb-4">🏔️</div>
              <h3 className="text-xl font-bold mb-2">Stunning Hill Country Setting</h3>
              <p>Rolling hills, cypress trees, and natural beauty provide the perfect backdrop</p>
            </div>
            <div className="text-white">
              <div className="text-4xl mb-4">🏛️</div>
              <h3 className="text-xl font-bold mb-2">Rich German Heritage</h3>
              <p>Historic venues and traditional charm add character to your celebration</p>
            </div>
            <div className="text-white">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-xl font-bold mb-2">Award-Winning Vendors</h3>
              <p>Top-rated photographers, planners, and venues recognized statewide</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-boerne-navy py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Planning Your Dream Wedding?
          </h2>
          <p className="text-xl text-boerne-gold mb-8">
            Connect with Boerne's top wedding vendors and create the perfect Hill Country celebration
          </p>
          <div className="space-x-4">
            <button className="px-8 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors">
              Create Wedding Plan
            </button>
            <button className="px-8 py-3 border border-boerne-gold text-boerne-gold font-semibold rounded-lg hover:bg-boerne-gold hover:text-boerne-navy transition-colors">
              Talk to Bernie
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}