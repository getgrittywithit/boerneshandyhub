'use client';

import { useState } from 'react';
import LocationCard, { LocationData } from '@/components/LocationCard';
import Link from 'next/link';

const boerneParks: LocationData[] = [
  {
    id: 'boerne-city-park',
    name: "Boerne City Park",
    address: "106 City Park Road, Boerne, TX 78006",
    category: "City Park",
    rating: 4.7,
    priceLevel: "Free",
    hours: "5am - Midnight",
    phone: "(830) 248-1635",
    website: "https://www.ci.boerne.tx.us/167/Boerne-City-Park",
    description: "Boerne's largest park featuring 125 acres along Cibolo Creek with trails, sports facilities, and playground.",
    membershipTier: "verified",
    keywords: ["trails", "playground"],
    photos: ["city-park-1.jpg", "city-park-2.jpg", "city-park-3.jpg"],
    bernieRecommendation: "This is Boerne's largest park at 125 acres! The Cibolo Trail connects all the way to Main Plaza downtown.",
    verifiedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    features: [
      "1.75-mile Cibolo Trail to downtown",
      "ADA-accessible paved trails", 
      "Covered playground",
      "Soccer fields & tennis courts",
      "Restrooms & water fountains",
      "Connects to Cibolo Center (6 more trail miles)"
    ]
  },
  {
    id: 'northrup-park',
    name: "Northrup Park",
    address: "Northrup Park Dr, Boerne, TX 78006",
    category: "Neighborhood Park",
    rating: 4.3,
    priceLevel: "Free",
    hours: "Dawn - Dusk",
    description: "Small neighborhood park with playground equipment and open green space for family activities.",
    membershipTier: "basic",
    keywords: [],
    photos: ["northrup-1.jpg"],
    features: [
      "Playground equipment",
      "Open green space",
      "Picnic area"
    ]
  },
  {
    id: 'main-plaza',
    name: "Main Plaza",
    address: "Main Plaza, Boerne, TX 78006",
    category: "Historic Plaza",
    rating: 4.8,
    priceLevel: "Free",
    hours: "24 hours",
    description: "Historic town square featuring the iconic Boerne gazebo, perfect for events and community gatherings.",
    membershipTier: "verified",
    keywords: ["historic", "gazebo"],
    photos: ["plaza-1.jpg", "plaza-2.jpg"],
    bernieRecommendation: "The heart of Boerne! This is where the Cibolo Trail ends and where all our community events happen.",
    verifiedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    features: [
      "Historic gazebo",
      "Event space",
      "Cibolo Trail endpoint",
      "Downtown shops nearby"
    ]
  },
  {
    id: 'kinderpark',
    name: "Kinderpark",
    address: "Kinderpark Dr, Boerne, TX 78006", 
    category: "Children's Park",
    rating: 4.4,
    priceLevel: "Free",
    hours: "Dawn - Dusk",
    description: "Dedicated children's playground with age-appropriate equipment and safe play areas.",
    membershipTier: "basic",
    keywords: [],
    photos: ["kinder-1.jpg"],
    features: [
      "Age-appropriate playground",
      "Safe play areas",
      "Parking available"
    ]
  }
];

export default function ParksPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="bg-boerne-light-gray min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-boerne-navy mb-4">
            Boerne Parks & Recreation 🌲
          </h1>
          <p className="text-xl text-boerne-dark-gray mb-6">
            Discover all the parks, trails, and outdoor spaces in beautiful Boerne, Texas
          </p>
          
          {/* View Toggle */}
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-lg p-1 border border-boerne-light-blue">
              <button 
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded ${viewMode === 'grid' ? 'bg-boerne-navy text-white' : 'text-boerne-navy'}`}
              >
                📍 Pin View
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded ${viewMode === 'list' ? 'bg-boerne-navy text-white' : 'text-boerne-navy'}`}
              >
                📋 List View
              </button>
            </div>
          </div>
        </div>

        {/* Parks Explorer Challenge Banner */}
        <div className="bg-gradient-to-r from-boerne-gold to-boerne-gold-alt text-boerne-navy rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">🎯 Parks Explorer Challenge</h2>
              <p className="text-lg">Visit all parks and complete scavenger hunts to unlock Bernie's secret insights!</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">0/4</div>
              <div className="text-sm">Parks Completed</div>
            </div>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boerneParks.map((park) => (
              <Link key={park.id} href={`/park/${park.id}`}>
                <LocationCard location={park} compact={true} />
              </Link>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {boerneParks.map((park) => (
              <Link key={park.id} href={`/park/${park.id}`}>
                <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow border-l-4 border-boerne-gold">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">📍</span>
                        <div>
                          <h3 className="font-bold text-lg text-boerne-navy">{park.name}</h3>
                          <p className="text-sm text-boerne-dark-gray">{park.category} • {park.priceLevel}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="flex items-center text-boerne-gold">
                          <span>⭐</span>
                          <span className="ml-1 font-semibold">{park.rating}</span>
                        </div>
                      </div>
                      
                      {park.membershipTier === 'verified' && (
                        <div className="px-2 py-1 bg-boerne-gold text-boerne-navy rounded-full text-xs font-bold">
                          ✅ VERIFIED
                        </div>
                      )}
                      
                      <span className="text-boerne-light-blue text-2xl">→</span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-sm text-boerne-dark-gray line-clamp-2">{park.description}</p>
                  </div>
                  
                  {park.features && park.features.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {park.features.slice(0, 3).map((feature, index) => (
                        <span key={index} className="px-2 py-1 bg-boerne-light-blue bg-opacity-20 text-boerne-navy text-xs rounded">
                          {feature}
                        </span>
                      ))}
                      {park.features.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{park.features.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Add Your Park CTA */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-boerne-navy mb-4">
              Know a Park We're Missing?
            </h2>
            <p className="text-boerne-dark-gray mb-6">
              Help us build the most complete guide to Boerne's outdoor spaces!
            </p>
            <button className="px-6 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors">
              Suggest a Park 📍
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}