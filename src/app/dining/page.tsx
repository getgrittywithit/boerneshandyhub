'use client';

import { useState } from 'react';
import Link from 'next/link';

const cuisineTypes = [
  { name: 'German-American', emoji: '🍺', popular: true },
  { name: 'BBQ & Tex-Mex', emoji: '🌮', popular: true },
  { name: 'Fine Dining', emoji: '🍽️', popular: false },
  { name: 'Casual American', emoji: '🍔', popular: true },
  { name: 'Italian', emoji: '🍝', popular: false },
  { name: 'Asian', emoji: '🥢', popular: false },
  { name: 'Coffee & Bakery', emoji: '☕', popular: true },
  { name: 'Wine & Spirits', emoji: '🍷', popular: false }
];

const diningFeatures = [
  { name: 'Outdoor Seating', icon: '🌳', count: 28 },
  { name: 'Live Music', icon: '🎵', count: 12 },
  { name: 'Dog Friendly', icon: '🐕', count: 22 },
  { name: 'Family Friendly', icon: '👨‍👩‍👧‍👦', count: 35 },
  { name: 'Historic Building', icon: '🏛️', count: 8 },
  { name: 'Craft Beer', icon: '🍺', count: 6 },
  { name: 'Wine Selection', icon: '🍷', count: 15 },
  { name: 'Late Night', icon: '🌙', count: 9 }
];

const priceRanges = [
  { symbol: '$', description: 'Budget-friendly ($10-15 per person)', count: 18 },
  { symbol: '$$', description: 'Moderate ($15-25 per person)', count: 22 },
  { symbol: '$$$', description: 'Upscale ($25-40 per person)', count: 12 },
  { symbol: '$$$$', description: 'Fine dining ($40+ per person)', count: 6 }
];

const featuredRestaurants = [
  {
    id: 'dodging-duck',
    name: 'The Dodging Duck Brewhaus',
    cuisine: 'German-American, Brewery',
    priceLevel: '$$',
    rating: 4.6,
    address: '402 River Rd, Boerne, TX',
    description: 'Local brewery featuring German-inspired food and craft beers in a fun, casual atmosphere.',
    features: ['Outdoor Seating', 'Live Music', 'Craft Beer', 'Dog Friendly'],
    hours: 'Mon-Thu 11am-10pm, Fri-Sat 11am-11pm, Sun 11am-9pm',
    membershipTier: 'gold',
    bernieRecommendation: "The Duck is where locals go to unwind! Try their pretzel with beer cheese - it's legendary!"
  },
  {
    id: 'peggys-on-green',
    name: "Peggy's on the Green",
    cuisine: 'Fine Dining, American',
    priceLevel: '$$$',
    rating: 4.8,
    address: '123 N Main St, Boerne, TX',
    description: 'Upscale dining on the historic town square with seasonal menus and excellent wine selection.',
    features: ['Historic Building', 'Wine Selection', 'Outdoor Seating', 'Fine Dining'],
    hours: 'Tue-Sat 5pm-10pm, Sun 5pm-9pm, Closed Mon',
    membershipTier: 'silver',
    bernieRecommendation: "Perfect for special occasions! Their seasonal menu always features the best local ingredients."
  },
  {
    id: 'bear-moon-bakery',
    name: 'Bear Moon Bakery',
    cuisine: 'Bakery, Breakfast, Coffee',
    priceLevel: '$',
    rating: 4.7,
    address: '401 S Main St, Boerne, TX',
    description: 'Local favorite for fresh-baked goods, breakfast, and excellent coffee since 1995.',
    features: ['Family Friendly', 'Coffee', 'Outdoor Seating', 'Historic Building'],
    hours: 'Daily 6:30am-3pm',
    membershipTier: 'verified',
    bernieRecommendation: "Start your day right at Bear Moon! Their cinnamon rolls are worth the early morning trip."
  }
];

export default function DiningPage() {
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedFeature, setSelectedFeature] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');

  return (
    <div className="bg-boerne-light-gray min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-boerne-gold to-boerne-gold-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-boerne-navy mb-4">
              🍽️ Dining in Boerne's Hill Country
            </h1>
            <p className="text-xl text-boerne-navy mb-8 max-w-3xl mx-auto">
              From authentic German cuisine to Texas BBQ, farm-to-table fine dining to cozy coffee shops - 
              discover the flavors that make Boerne a true culinary destination.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-boerne-navy text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors">
                Find My Perfect Meal
              </button>
              <button className="px-8 py-3 border-2 border-boerne-navy text-boerne-navy font-semibold rounded-lg hover:bg-boerne-navy hover:text-white transition-colors">
                View Restaurant Map
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Cuisine Filter */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-boerne-navy mb-4">Browse by cuisine:</h2>
            <div className="flex flex-wrap gap-3">
              {cuisineTypes.map((cuisine) => (
                <button
                  key={cuisine.name}
                  onClick={() => setSelectedCuisine(selectedCuisine === cuisine.name ? '' : cuisine.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCuisine === cuisine.name
                      ? 'bg-boerne-gold text-boerne-navy'
                      : 'bg-boerne-light-gray text-boerne-dark-gray hover:bg-boerne-gold hover:text-boerne-navy'
                  } ${cuisine.popular ? 'ring-2 ring-boerne-light-blue ring-opacity-50' : ''}`}
                >
                  {cuisine.emoji} {cuisine.name}
                  {cuisine.popular && <span className="ml-1 text-xs">🔥</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Feature Filter */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-boerne-navy mb-4">Special features:</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {diningFeatures.map((feature) => (
                <button
                  key={feature.name}
                  onClick={() => setSelectedFeature(selectedFeature === feature.name ? '' : feature.name)}
                  className={`p-3 rounded-lg text-center transition-colors ${
                    selectedFeature === feature.name
                      ? 'bg-boerne-light-blue text-white'
                      : 'bg-boerne-light-gray hover:bg-boerne-light-blue hover:text-white'
                  }`}
                >
                  <div className="text-2xl mb-1">{feature.icon}</div>
                  <div className="text-xs font-medium">{feature.name}</div>
                  <div className="text-xs opacity-75">({feature.count})</div>
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <h2 className="text-lg font-semibold text-boerne-navy mb-4">Price range:</h2>
            <div className="flex flex-wrap gap-3">
              {priceRanges.map((price) => (
                <button
                  key={price.symbol}
                  onClick={() => setSelectedPrice(selectedPrice === price.symbol ? '' : price.symbol)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedPrice === price.symbol
                      ? 'bg-boerne-green text-white'
                      : 'bg-boerne-light-gray text-boerne-dark-gray hover:bg-boerne-green hover:text-white'
                  }`}
                >
                  <span className="font-bold text-lg">{price.symbol}</span>
                  <span className="ml-2">{price.description}</span>
                  <span className="ml-2 opacity-75">({price.count})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Restaurants */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-boerne-navy mb-4">
            🌟 Bernie's Top Picks
          </h2>
          <p className="text-lg text-boerne-dark-gray">
            Local favorites that capture the true taste of Boerne
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {featuredRestaurants.map((restaurant) => (
            <div key={restaurant.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-boerne-navy mb-1">
                      {restaurant.name}
                    </h3>
                    <p className="text-boerne-dark-gray text-sm">{restaurant.cuisine}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-boerne-gold">{restaurant.priceLevel}</span>
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">⭐</span>
                      <span className="text-sm font-medium">{restaurant.rating}</span>
                    </div>
                  </div>
                </div>

                <p className="text-boerne-dark-gray mb-4">{restaurant.description}</p>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {restaurant.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-boerne-light-gray text-boerne-dark-gray text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-sm text-boerne-dark-gray mb-4">
                  <div className="mb-1">📍 {restaurant.address}</div>
                  <div>🕒 {restaurant.hours}</div>
                </div>

                {restaurant.bernieRecommendation && (
                  <div className="bg-boerne-light-blue bg-opacity-10 p-3 rounded-lg mb-4">
                    <div className="flex items-start space-x-2">
                      <span className="text-lg">🤠</span>
                      <div>
                        <div className="text-xs font-medium text-boerne-light-blue mb-1">Bernie says:</div>
                        <div className="text-sm text-boerne-dark-gray italic">"{restaurant.bernieRecommendation}"</div>
                      </div>
                    </div>
                  </div>
                )}

                <Link
                  href={`/dining/${restaurant.id}`}
                  className="text-boerne-gold hover:text-boerne-gold-alt font-medium transition-colors"
                >
                  View Details & Menu →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dining Categories */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-boerne-navy mb-4">
              Explore Boerne's Dining Scene
            </h2>
            <p className="text-lg text-boerne-dark-gray">
              From Hauptstrasse to the Hill Country Mile, discover amazing flavors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-boerne-light-gray p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">🍺</div>
              <h3 className="font-bold text-boerne-navy mb-2">German Heritage</h3>
              <p className="text-sm text-boerne-dark-gray mb-3">Authentic German cuisine and breweries</p>
              <p className="text-boerne-light-blue font-medium">8 restaurants</p>
            </div>
            
            <div className="bg-boerne-light-gray p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">🔥</div>
              <h3 className="font-bold text-boerne-navy mb-2">Texas BBQ</h3>
              <p className="text-sm text-boerne-dark-gray mb-3">Authentic low & slow barbecue</p>
              <p className="text-boerne-light-blue font-medium">6 restaurants</p>
            </div>

            <div className="bg-boerne-light-gray p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">🌮</div>
              <h3 className="font-bold text-boerne-navy mb-2">Tex-Mex</h3>
              <p className="text-sm text-boerne-dark-gray mb-3">Local Mexican and fusion favorites</p>
              <p className="text-boerne-light-blue font-medium">12 restaurants</p>
            </div>

            <div className="bg-boerne-light-gray p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">☕</div>
              <h3 className="font-bold text-boerne-navy mb-2">Coffee & Casual</h3>
              <p className="text-sm text-boerne-dark-gray mb-3">Coffee shops, bakeries, and casual dining</p>
              <p className="text-boerne-light-blue font-medium">15 locations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hill Country Dining Experience */}
      <div className="py-16 bg-gradient-to-r from-boerne-green to-boerne-light-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              The Hill Country Dining Experience
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl mb-4">🌾</div>
              <h3 className="text-xl font-bold mb-2">Farm-to-Table Fresh</h3>
              <p>Many restaurants source ingredients locally from Hill Country farms</p>
            </div>
            <div className="text-white">
              <div className="text-4xl mb-4">🏞️</div>
              <h3 className="text-xl font-bold mb-2">Scenic Outdoor Dining</h3>
              <p>Enjoy meals with beautiful Hill Country views and perfect weather</p>
            </div>
            <div className="text-white">
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="text-xl font-bold mb-2">Live Music & Events</h3>
              <p>Many venues feature live music, making dinner an experience</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-boerne-navy py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Explore Boerne's Flavors?
          </h2>
          <p className="text-xl text-boerne-gold mb-8">
            Save your favorite restaurants and get personalized recommendations from Bernie
          </p>
          <div className="space-x-4">
            <button className="px-8 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors">
              Create Dining Profile
            </button>
            <button className="px-8 py-3 border border-boerne-gold text-boerne-gold font-semibold rounded-lg hover:bg-boerne-gold hover:text-boerne-navy transition-colors">
              Browse All Restaurants
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}