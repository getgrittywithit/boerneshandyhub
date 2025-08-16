'use client';

import { useState } from 'react';
import Link from 'next/link';

const accommodationTypes = [
  { name: 'Luxury Resorts', emoji: '🏨', count: 3, popular: true },
  { name: 'Boutique Hotels', emoji: '🏛️', count: 5, popular: true },
  { name: 'Hill Country B&Bs', emoji: '🏡', count: 8, popular: true },
  { name: 'Vacation Rentals', emoji: '🏘️', count: 15, popular: false },
  { name: 'RV Parks & Camping', emoji: '🏕️', count: 6, popular: false },
  { name: 'Guest Ranches', emoji: '🤠', count: 4, popular: false }
];

const activityCategories = [
  { name: 'Outdoor Adventures', icon: '🥾', count: 25, activities: ['Hiking', 'Kayaking', 'Fishing', 'Biking'] },
  { name: 'Family Fun', icon: '👨‍👩‍👧‍👦', count: 18, activities: ['Mini Golf', 'Playgrounds', 'Swimming', 'Nature Centers'] },
  { name: 'Arts & Culture', icon: '🎨', count: 12, activities: ['Museums', 'Art Galleries', 'Historic Tours', 'Music Venues'] },
  { name: 'Relaxation & Wellness', icon: '🧘‍♀️', count: 8, activities: ['Spas', 'Yoga', 'Hot Springs', 'Meditation'] },
  { name: 'Shopping & Dining', icon: '🛍️', count: 35, activities: ['Hill Country Mile', 'Antique Shops', 'Local Markets', 'Food Tours'] },
  { name: 'Adventure Sports', icon: '🪂', count: 10, activities: ['Zip Lining', 'Rock Climbing', 'Tubing', 'Horseback Riding'] }
];

const featuredStays = [
  {
    id: 'tapatio-springs',
    name: 'Tapatio Springs Hill Country Resort',
    type: 'Luxury Resort',
    priceLevel: '$$$$',
    rating: 4.8,
    address: '1 Resort Way, Boerne, TX',
    description: 'Premier Hill Country resort featuring golf, spa, multiple dining options, and luxurious accommodations.',
    amenities: ['18-Hole Golf Course', 'Full-Service Spa', 'Multiple Restaurants', 'Pool & Hot Tub', 'Tennis Court', 'Fitness Center'],
    roomTypes: ['Standard Rooms', 'Suites', 'Villas'],
    membershipTier: 'gold',
    bernieRecommendation: "The crown jewel of Boerne! Perfect for a romantic getaway or family vacation with world-class amenities."
  },
  {
    id: 'ye-kendall-inn',
    name: 'Ye Kendall Inn',
    type: 'Historic Boutique Hotel',
    priceLevel: '$$$',
    rating: 4.6,
    address: '128 W Blanco St, Boerne, TX',
    description: 'Historic inn dating back to 1859, offering charming accommodations in the heart of downtown Boerne.',
    amenities: ['Historic Building', 'Downtown Location', 'Restaurant', 'Event Spaces', 'Courtyard', 'Free WiFi'],
    roomTypes: ['Historic Rooms', 'Suites', 'Cottage'],
    membershipTier: 'silver',
    bernieRecommendation: "Step into Boerne's history! This charming inn puts you right in the heart of everything with authentic character."
  },
  {
    id: 'hill-country-hideaway',
    name: 'Hill Country Hideaway B&B',
    type: 'Bed & Breakfast',
    priceLevel: '$$',
    rating: 4.7,
    address: 'Private Hill Country Location',
    description: 'Peaceful bed & breakfast nestled in the hills, offering stunning views and personalized hospitality.',
    amenities: ['Hill Country Views', 'Gourmet Breakfast', 'Hot Tub', 'Walking Trails', 'Private Decks', 'Pet Friendly'],
    roomTypes: ['Garden Rooms', 'Hill View Suites', 'Cottage'],
    membershipTier: 'verified',
    bernieRecommendation: "Wake up to incredible Hill Country sunrises! The breakfast here is legendary and the hosts treat you like family."
  }
];

const topActivities = [
  {
    id: 'cibolo-nature-center',
    name: 'Cibolo Nature Center',
    category: 'Outdoor Adventures',
    rating: 4.8,
    description: 'Six miles of trails through five distinct ecosystems along the Cibolo Creek.',
    features: ['6 Miles of Trails', 'Wildlife Viewing', 'Educational Programs', 'Family Friendly'],
    priceLevel: 'Free',
    bernieRecommendation: "A hidden gem right in town! Perfect for families and nature lovers of all ages."
  },
  {
    id: 'cave-without-name',
    name: 'Cave Without a Name',
    category: 'Family Fun',
    rating: 4.6,
    description: 'Underground cave tours showcasing stunning limestone formations and underground beauty.',
    features: ['Guided Tours', 'Cool 66°F Year-Round', 'Photography Allowed', 'Gift Shop'],
    priceLevel: '$$',
    bernieRecommendation: "Amazing underground adventure! The formations are breathtaking and it's cool even in summer."
  },
  {
    id: 'boerne-lake',
    name: 'Boerne City Lake Park',
    category: 'Outdoor Adventures',
    rating: 4.5,
    description: 'Beautiful lake park offering kayaking, fishing, disc golf, and scenic walking trails.',
    features: ['Kayak Rentals', 'Fishing', 'Disc Golf', 'Picnic Areas', 'Walking Trails'],
    priceLevel: '$',
    bernieRecommendation: "Perfect for a day outdoors! Rent a kayak or try the disc golf course - both are fantastic."
  }
];

export default function StayPlayPage() {
  const [selectedAccommodation, setSelectedAccommodation] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');

  return (
    <div className="bg-boerne-light-gray min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-boerne-green to-boerne-light-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">
              🏨 Stay & Play in Hill Country Paradise
            </h1>
            <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
              From luxury resorts to cozy B&Bs, endless outdoor adventures to family fun - 
              discover the perfect way to experience Boerne's natural beauty and small-town charm.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-boerne-green font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                Find Perfect Stay
              </button>
              <button className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-boerne-green transition-colors">
                Explore Activities
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Accommodation Filter */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-boerne-navy mb-4">Find your perfect stay:</h2>
            <div className="flex flex-wrap gap-3">
              {accommodationTypes.map((type) => (
                <button
                  key={type.name}
                  onClick={() => setSelectedAccommodation(selectedAccommodation === type.name ? '' : type.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedAccommodation === type.name
                      ? 'bg-boerne-green text-white'
                      : 'bg-boerne-light-gray text-boerne-dark-gray hover:bg-boerne-green hover:text-white'
                  } ${type.popular ? 'ring-2 ring-boerne-light-blue ring-opacity-50' : ''}`}
                >
                  {type.emoji} {type.name} ({type.count})
                  {type.popular && <span className="ml-1 text-xs">🔥</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Filter */}
          <div>
            <h2 className="text-lg font-semibold text-boerne-navy mb-4">Activities & attractions:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activityCategories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedActivity(selectedActivity === category.name ? '' : category.name)}
                  className={`p-4 rounded-lg text-left transition-colors ${
                    selectedActivity === category.name
                      ? 'bg-boerne-light-blue text-white'
                      : 'bg-boerne-light-gray hover:bg-boerne-light-blue hover:text-white'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-3">{category.icon}</span>
                    <div>
                      <div className="font-medium">{category.name}</div>
                      <div className="text-sm opacity-75">({category.count} options)</div>
                    </div>
                  </div>
                  <div className="text-xs">
                    {category.activities.join(' • ')}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Accommodations */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-boerne-navy mb-4">
            🌟 Where to Stay in Boerne
          </h2>
          <p className="text-lg text-boerne-dark-gray">
            From luxury resorts to charming inns, find your perfect Hill Country retreat
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {featuredStays.map((stay) => (
            <div key={stay.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-boerne-navy mb-1">
                      {stay.name}
                    </h3>
                    <p className="text-boerne-dark-gray text-sm">{stay.type}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-boerne-green">{stay.priceLevel}</span>
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">⭐</span>
                      <span className="text-sm font-medium">{stay.rating}</span>
                    </div>
                  </div>
                </div>

                <p className="text-boerne-dark-gray mb-4">{stay.description}</p>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-boerne-navy mb-2">Amenities:</h4>
                  <div className="flex flex-wrap gap-2">
                    {stay.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-boerne-light-gray text-boerne-dark-gray text-xs rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-sm text-boerne-dark-gray mb-4">
                  <div>📍 {stay.address}</div>
                </div>

                {stay.bernieRecommendation && (
                  <div className="bg-boerne-green bg-opacity-10 p-3 rounded-lg mb-4">
                    <div className="flex items-start space-x-2">
                      <span className="text-lg">🤠</span>
                      <div>
                        <div className="text-xs font-medium text-boerne-green mb-1">Bernie says:</div>
                        <div className="text-sm text-boerne-dark-gray italic">"{stay.bernieRecommendation}"</div>
                      </div>
                    </div>
                  </div>
                )}

                <Link
                  href={`/stay-play/${stay.id}`}
                  className="text-boerne-green hover:text-boerne-light-blue font-medium transition-colors"
                >
                  View Details & Book →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Activities */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-boerne-navy mb-4">
              🎯 Must-Do Activities
            </h2>
            <p className="text-lg text-boerne-dark-gray">
              Adventure, relaxation, and fun for every type of traveler
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topActivities.map((activity) => (
              <div key={activity.id} className="bg-boerne-light-gray p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-boerne-navy mb-1">
                      {activity.name}
                    </h3>
                    <p className="text-boerne-dark-gray text-sm">{activity.category}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-boerne-light-blue">{activity.priceLevel}</span>
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">⭐</span>
                      <span className="text-sm font-medium">{activity.rating}</span>
                    </div>
                  </div>
                </div>

                <p className="text-boerne-dark-gray mb-4">{activity.description}</p>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {activity.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white text-boerne-dark-gray text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {activity.bernieRecommendation && (
                  <div className="bg-boerne-light-blue bg-opacity-10 p-3 rounded-lg mb-4">
                    <div className="flex items-start space-x-2">
                      <span className="text-lg">🤠</span>
                      <div>
                        <div className="text-xs font-medium text-boerne-light-blue mb-1">Bernie says:</div>
                        <div className="text-sm text-boerne-dark-gray italic">"{activity.bernieRecommendation}"</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Visitor Packages */}
      <div className="py-16 bg-gradient-to-r from-boerne-gold to-boerne-gold-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-boerne-navy mb-4">
              🎁 Visitor Experience Packages
            </h2>
            <p className="text-lg text-boerne-navy">
              Curated experiences combining the best of Boerne's stays and activities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg text-center shadow-lg">
              <div className="text-4xl mb-4">💑</div>
              <h3 className="text-xl font-bold text-boerne-navy mb-2">Romantic Getaway</h3>
              <p className="text-boerne-dark-gray mb-4">Luxury resort stay + spa + fine dining + scenic activities</p>
              <p className="text-boerne-green font-bold">From $299/couple</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg text-center shadow-lg">
              <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
              <h3 className="text-xl font-bold text-boerne-navy mb-2">Family Adventure</h3>
              <p className="text-boerne-dark-gray mb-4">Family-friendly stay + nature center + cave tour + lake activities</p>
              <p className="text-boerne-green font-bold">From $199/family</p>
            </div>

            <div className="bg-white p-6 rounded-lg text-center shadow-lg">
              <div className="text-4xl mb-4">🥾</div>
              <h3 className="text-xl font-bold text-boerne-navy mb-2">Outdoor Explorer</h3>
              <p className="text-boerne-dark-gray mb-4">B&B stay + hiking + kayaking + outdoor adventures</p>
              <p className="text-boerne-green font-bold">From $149/person</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-boerne-navy py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Plan Your Hill Country Escape?
          </h2>
          <p className="text-xl text-boerne-gold mb-8">
            Save your favorite stays and activities, get personalized recommendations from Bernie
          </p>
          <div className="space-x-4">
            <button className="px-8 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors">
              Create Trip Plan
            </button>
            <button className="px-8 py-3 border border-boerne-gold text-boerne-gold font-semibold rounded-lg hover:bg-boerne-gold hover:text-boerne-navy transition-colors">
              Browse All Options
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}