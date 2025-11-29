'use client';

import { useState, useEffect } from 'react';
import { LocationData } from '@/components/LocationCard';
import Link from 'next/link';

type ActivityType = 'all' | 'hiking' | 'biking' | 'water' | 'wildlife' | 'camping' | 'climbing';
type DifficultyLevel = 'all' | 'beginner' | 'intermediate' | 'advanced';
type TimeOfDay = 'all' | 'sunrise' | 'morning' | 'afternoon' | 'sunset';

interface WeatherData {
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  sunrise: string;
  sunset: string;
  icon: string;
}

interface OutdoorActivity extends LocationData {
  activityTypes: ActivityType[];
  difficulty?: DifficultyLevel;
  bestTime?: TimeOfDay[];
  distance?: string;
  duration?: string;
  elevation?: string;
  trailheadLocation?: string;
  permitRequired?: boolean;
  dogFriendly?: boolean;
}

const outdoorActivities: OutdoorActivity[] = [
  {
    id: 'cibolo-creek-trail',
    name: "Cibolo Creek Trail",
    address: "City Park Road, Boerne, TX 78006",
    category: "Trails",
    rating: 4.8,
    priceLevel: "Free",
    hours: "Dawn to Dusk",
    phone: "(830) 249-9511",
    website: "https://www.ci.boerne.tx.us/1126/Cibolo-Creek-Trail",
    description: "Scenic paved trail following the beautiful Cibolo Creek through the heart of Boerne. Perfect for walking, jogging, and cycling.",
    membershipTier: "verified",
    keywords: ["trail", "hiking", "biking", "creek", "nature", "paved"],
    photos: ["/cibolo-creek-trail.jpg"],
    bernieRecommendation: "Start early morning to spot deer and enjoy cooler temperatures. The section near River Road Park has the best creek views!",
    verifiedDate: new Date(),
    features: ["Paved Trail", "Creek Access", "Wildlife Viewing", "Picnic Areas", "Restrooms"],
    activityTypes: ['hiking', 'biking'],
    difficulty: 'beginner',
    bestTime: ['morning', 'sunset'],
    distance: "1.5 miles",
    duration: "30-45 minutes",
    dogFriendly: true
  },
  {
    id: 'cibolo-nature-center-trails',
    name: "Cibolo Nature Center Trails",
    address: "140 City Park Rd, Boerne, TX 78006",
    category: "Nature Center",
    rating: 4.9,
    priceLevel: "$",
    hours: "8:00 AM - 5:00 PM",
    phone: "(830) 249-4616",
    website: "https://www.cibolo.org",
    description: "100 acres of hill country habitat with miles of walking trails through four distinct ecosystems. Features dinosaur tracks and prairie restoration areas.",
    membershipTier: "gold",
    keywords: ["nature", "trails", "education", "wildlife", "dinosaur tracks"],
    photos: ["/cibolo-nature-center.jpg"],
    bernieRecommendation: "Don't miss the dinosaur tracks! Join a guided nature walk on Saturdays to learn about local flora and fauna.",
    verifiedDate: new Date(),
    features: ["Nature Trails", "Dinosaur Tracks", "Education Programs", "Butterfly Garden", "Bird Watching"],
    activityTypes: ['hiking', 'wildlife'],
    difficulty: 'beginner',
    bestTime: ['morning', 'afternoon'],
    distance: "3+ miles of trails",
    duration: "1-3 hours",
    elevation: "Minimal",
    dogFriendly: false
  },
  {
    id: 'boerne-lake',
    name: "Boerne City Lake",
    address: "Boerne City Park Rd, Boerne, TX 78006",
    category: "Lake",
    rating: 4.6,
    priceLevel: "$",
    hours: "6:00 AM - 10:00 PM",
    phone: "(830) 249-9511",
    website: "https://www.ci.boerne.tx.us",
    description: "17-acre lake perfect for kayaking, canoeing, and fishing. Non-motorized boats only. Catch and release fishing with valid Texas license.",
    membershipTier: "verified",
    keywords: ["lake", "kayaking", "fishing", "water sports", "paddling"],
    photos: ["/boerne-lake.jpg"],
    bernieRecommendation: "Sunrise kayaking is magical here! Rental kayaks available on weekends. Great bass fishing from the dock.",
    verifiedDate: new Date(),
    features: ["Boat Ramp", "Fishing Dock", "Kayak Launch", "Picnic Tables", "Restrooms"],
    activityTypes: ['water'],
    difficulty: 'beginner',
    bestTime: ['sunrise', 'morning'],
    permitRequired: true,
    dogFriendly: true
  },
  {
    id: 'hill-country-sna',
    name: "Hill Country State Natural Area",
    address: "10600 Bandera Creek Rd, Bandera, TX 78003",
    category: "State Park",
    rating: 4.7,
    priceLevel: "$$",
    hours: "8:00 AM - 5:00 PM",
    phone: "(830) 796-4413",
    website: "https://tpwd.texas.gov/state-parks/hill-country",
    description: "5,369 acres of rugged hill country terrain with 40+ miles of trails for hiking, mountain biking, and horseback riding. Primitive camping available.",
    membershipTier: "silver",
    keywords: ["hiking", "mountain biking", "camping", "horseback", "wilderness"],
    photos: ["/hill-country-sna.jpg"],
    bernieRecommendation: "Twin Peaks Trail offers the best panoramic views! Visit in spring for wildflowers. Bring plenty of water - it's remote!",
    verifiedDate: new Date(),
    features: ["Mountain Biking", "Backcountry Camping", "Equestrian Trails", "Swimming Holes", "Dark Sky Viewing"],
    activityTypes: ['hiking', 'biking', 'camping'],
    difficulty: 'advanced',
    bestTime: ['morning', 'afternoon'],
    distance: "40+ miles of trails",
    duration: "Half day to multi-day",
    elevation: "Significant",
    trailheadLocation: "30 minutes from Boerne",
    permitRequired: true,
    dogFriendly: true
  },
  {
    id: 'joshua-springs-preserve',
    name: "Joshua Springs Park & Preserve",
    address: "Herff Rd, Boerne, TX 78006",
    category: "Nature Preserve",
    rating: 4.5,
    priceLevel: "Free",
    hours: "Dawn to Dusk",
    phone: "(830) 249-9511",
    website: "https://www.boerne-tx.gov",
    description: "200-acre preserve with natural spring, limestone cliffs, and diverse ecosystems. Features challenging hiking trails and rock climbing areas.",
    membershipTier: "verified",
    keywords: ["hiking", "climbing", "springs", "preserve", "nature"],
    photos: ["/joshua-springs.jpg"],
    bernieRecommendation: "The Overlook Trail leads to stunning views of the Cibolo Creek valley. Spring-fed pools are perfect for cooling off!",
    verifiedDate: new Date(),
    features: ["Natural Springs", "Rock Climbing", "Hiking Trails", "Wildlife Habitat", "Photography"],
    activityTypes: ['hiking', 'climbing'],
    difficulty: 'intermediate',
    bestTime: ['morning', 'afternoon'],
    distance: "5 miles of trails",
    duration: "2-4 hours",
    elevation: "Moderate",
    dogFriendly: true
  },
  {
    id: 'guadalupe-river-sp',
    name: "Guadalupe River State Park",
    address: "3350 Park Road 31, Spring Branch, TX 78070",
    category: "State Park",
    rating: 4.8,
    priceLevel: "$$",
    hours: "8:00 AM - 10:00 PM",
    phone: "(830) 438-2656",
    website: "https://tpwd.texas.gov/state-parks/guadalupe-river",
    description: "4 miles of Guadalupe River frontage perfect for swimming, tubing, and kayaking. Limestone cliffs and bald cypress trees create stunning scenery.",
    membershipTier: "gold",
    keywords: ["river", "swimming", "tubing", "camping", "kayaking"],
    photos: ["/guadalupe-river-sp.jpg"],
    bernieRecommendation: "The swimming hole near the day-use area is perfect for families. Rent tubes from the park store for a relaxing float!",
    verifiedDate: new Date(),
    features: ["River Access", "Swimming Areas", "Camping", "Hiking Trails", "Picnic Areas"],
    activityTypes: ['water', 'hiking', 'camping'],
    difficulty: 'beginner',
    bestTime: ['morning', 'afternoon'],
    distance: "13 miles of trails",
    duration: "Full day",
    trailheadLocation: "20 minutes from Boerne",
    permitRequired: true,
    dogFriendly: true
  }
];


const gearRentals = [
  {
    name: "Boerne Bicycle Shop",
    equipment: ["Mountain Bikes", "Road Bikes", "Helmets"],
    contact: "(830) 816-2046"
  },
  {
    name: "Hill Country Adventures",
    equipment: ["Kayaks", "Canoes", "SUPs", "Life Jackets"],
    contact: "(830) 249-1234"
  },
  {
    name: "Outdoor Trails Store",
    equipment: ["Camping Gear", "Backpacks", "Trekking Poles"],
    contact: "(830) 331-9876"
  }
];

export default function OutdoorAdventuresPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedActivity, setSelectedActivity] = useState<ActivityType>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('all');
  const [showMap, setShowMap] = useState(false);
  const [showChallenges, setShowChallenges] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('/api/weather');
        if (response.ok) {
          const data = await response.json();
          setWeather(data);
        } else {
          console.warn('Weather API not available:', await response.text());
        }
      } catch (error) {
        console.warn('Failed to fetch weather:', error);
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const filteredActivities = outdoorActivities.filter(activity => {
    if (selectedActivity !== 'all' && !activity.activityTypes.includes(selectedActivity)) {
      return false;
    }
    if (selectedDifficulty !== 'all' && activity.difficulty !== selectedDifficulty) {
      return false;
    }
    return true;
  });

  const getActivityIcon = (type: ActivityType) => {
    const icons = {
      all: '🌟',
      hiking: '🥾',
      biking: '🚴',
      water: '💧',
      wildlife: '🦌',
      camping: '🏕️',
      climbing: '🧗'
    };
    return icons[type];
  };

  const getDifficultyColor = (level: DifficultyLevel) => {
    const colors = {
      all: 'bg-gray-100 text-gray-800',
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    };
    return colors[level];
  };

  return (
    <div className="bg-boerne-light-gray min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-boerne-navy mb-4">
            🏔️ Outdoor Adventures in Boerne
          </h1>
          <p className="text-xl text-boerne-dark-gray mb-6">
            Explore the natural beauty of the Texas Hill Country
          </p>
          
          {/* Weather Banner */}
          <div className="bg-gradient-to-r from-boerne-light-blue to-blue-400 text-white rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-4">
              {weatherLoading ? (
                <>
                  <div className="text-3xl">🌤️</div>
                  <div>
                    <div className="text-xl font-bold">Loading weather...</div>
                    <div className="text-sm">Check conditions before your adventure</div>
                  </div>
                </>
              ) : weather ? (
                <>
                  <div className="text-3xl">
                    {weather.condition === 'Clear' ? '☀️' : 
                     weather.condition === 'Clouds' ? '☁️' :
                     weather.condition === 'Rain' ? '🌧️' :
                     weather.condition === 'Snow' ? '❄️' : '🌤️'}
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{weather.temperature}°F</div>
                    <div className="text-sm capitalize">{weather.description}</div>
                  </div>
                  <div className="text-sm">
                    <div>Sunrise: {weather.sunrise}</div>
                    <div>Sunset: {weather.sunset}</div>
                  </div>
                  <div className="text-sm">
                    <div>Wind: {weather.windSpeed} mph</div>
                    <div>Visibility: {weather.visibility} mi</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-3xl">🌤️</div>
                  <div>
                    <div className="text-xl font-bold">Weather unavailable</div>
                    <div className="text-sm">Check local conditions before heading out</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Activity Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-boerne-dark-gray mb-2">Activity Type</h3>
              <div className="flex flex-wrap gap-2">
                {(['all', 'hiking', 'biking', 'water', 'wildlife', 'camping', 'climbing'] as ActivityType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedActivity(type)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      selectedActivity === type
                        ? 'bg-boerne-navy text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {getActivityIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-boerne-dark-gray mb-2">Difficulty</h3>
              <div className="flex gap-2">
                {(['all', 'beginner', 'intermediate', 'advanced'] as DifficultyLevel[]).map(level => (
                  <button
                    key={level}
                    onClick={() => setSelectedDifficulty(level)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      selectedDifficulty === level
                        ? 'bg-boerne-navy text-white'
                        : getDifficultyColor(level)
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* View Toggle and Map Toggle */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setShowMap(!showMap)}
              className="px-4 py-2 bg-white rounded-lg border border-boerne-light-blue text-boerne-navy hover:bg-boerne-light-blue transition-colors"
            >
              {showMap ? '📍 Hide Map' : '🗺️ Show Map'}
            </button>
            <button
              onClick={() => setShowChallenges(!showChallenges)}
              className="px-4 py-2 bg-white rounded-lg border border-boerne-light-blue text-boerne-navy hover:bg-boerne-light-blue transition-colors"
            >
              {showChallenges ? '🏆 Hide Challenges' : '🏆 Show Challenges'}
            </button>
          </div>
          
          <div className="bg-white rounded-lg p-1 border border-boerne-light-blue">
            <button 
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded ${viewMode === 'grid' ? 'bg-boerne-navy text-white' : 'text-boerne-navy'}`}
            >
              📍 Card View
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded ${viewMode === 'list' ? 'bg-boerne-navy text-white' : 'text-boerne-navy'}`}
            >
              📋 List View
            </button>
          </div>
        </div>

        {/* Adventure Challenges */}
        {showChallenges && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-boerne-navy mb-4">🏆 Adventure Challenges</h2>
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-boerne-navy mb-2">Coming Soon!</h3>
              <p className="text-boerne-dark-gray">
                Adventure challenges will be available when user accounts are implemented.
              </p>
            </div>
          </div>
        )}

        {/* Map Section (Placeholder) */}
        {showMap && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🗺️</div>
                <p className="text-xl text-boerne-dark-gray">Interactive Adventure Map</p>
                <p className="text-sm text-gray-500 mt-2">Click on locations to explore activities</p>
              </div>
            </div>
          </div>
        )}

        {/* Activities Grid/List */}
        <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredActivities.map(activity => (
            viewMode === 'grid' ? (
              <div key={activity.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-boerne-navy">{activity.name}</h3>
                    {activity.difficulty && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(activity.difficulty)}`}>
                        {activity.difficulty}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {activity.activityTypes.map(type => (
                      <span key={type} className="text-lg" title={type}>
                        {getActivityIcon(type)}
                      </span>
                    ))}
                  </div>
                  
                  <p className="text-boerne-dark-gray text-sm mb-4">{activity.description}</p>
                  
                  {/* Activity Details */}
                  <div className="space-y-1 text-sm">
                    {activity.distance && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Distance:</span>
                        <span className="font-medium">{activity.distance}</span>
                      </div>
                    )}
                    {activity.duration && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{activity.duration}</span>
                      </div>
                    )}
                    {activity.elevation && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Elevation:</span>
                        <span className="font-medium">{activity.elevation}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Features */}
                  <div className="mt-4 flex flex-wrap gap-1">
                    {activity.dogFriendly && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">🐕 Dog Friendly</span>
                    )}
                    {activity.permitRequired && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">📝 Permit Required</span>
                    )}
                  </div>
                  
                  {/* Bernie's Tip */}
                  {activity.bernieRecommendation && (
                    <div className="mt-4 p-3 bg-boerne-light-blue bg-opacity-10 rounded-lg">
                      <p className="text-xs text-boerne-navy italic">
                        <span className="font-semibold">Bernie's Tip:</span> {activity.bernieRecommendation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div key={activity.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-boerne-navy">{activity.name}</h3>
                      <div className="flex gap-1">
                        {activity.activityTypes.map(type => (
                          <span key={type} className="text-base" title={type}>
                            {getActivityIcon(type)}
                          </span>
                        ))}
                      </div>
                      {activity.difficulty && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(activity.difficulty)}`}>
                          {activity.difficulty}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-boerne-dark-gray text-sm mb-2">{activity.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      {activity.distance && <span>📏 {activity.distance}</span>}
                      {activity.duration && <span>⏱️ {activity.duration}</span>}
                      {activity.elevation && <span>📈 {activity.elevation}</span>}
                      {activity.dogFriendly && <span>🐕 Dog Friendly</span>}
                      {activity.permitRequired && <span>📝 Permit Required</span>}
                    </div>
                  </div>
                  
                  <div className="ml-4 text-right">
                    <div className="flex items-center gap-1 text-boerne-gold">
                      <span className="text-2xl">★</span>
                      <span className="text-xl font-semibold">{activity.rating}</span>
                    </div>
                    <p className="text-sm text-boerne-navy font-medium">{activity.priceLevel}</p>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>

        {/* Gear Rentals Section */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-boerne-navy mb-6">🎒 Gear Rentals & Equipment</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {gearRentals.map((shop, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-boerne-navy mb-2">{shop.name}</h3>
                <div className="space-y-1">
                  {shop.equipment.map((item, i) => (
                    <p key={i} className="text-sm text-gray-600">• {item}</p>
                  ))}
                </div>
                <p className="text-sm text-boerne-light-blue mt-3">{shop.contact}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Tips */}
        <div className="mt-8 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6 border border-red-200">
          <h3 className="text-xl font-bold text-red-800 mb-3">⚠️ Safety First</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-red-700">
            <div>
              <p className="font-semibold mb-1">Before You Go:</p>
              <ul className="space-y-1">
                <li>• Check weather conditions</li>
                <li>• Tell someone your plans</li>
                <li>• Bring plenty of water</li>
                <li>• Wear appropriate gear</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-1">Emergency Contacts:</p>
              <ul className="space-y-1">
                <li>• Emergency: 911</li>
                <li>• Park Rangers: (830) 249-9511</li>
                <li>• Weather Alerts: (830) 249-8000</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-boerne-gold to-boerne-gold-alt rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-boerne-navy mb-4">
              🌟 Share Your Adventure
            </h2>
            <p className="text-boerne-navy mb-6">
              Tag <span className="font-semibold">#BoerneOutdoors</span> to be featured in our community gallery!
            </p>
            <div className="flex justify-center gap-4">
              <button className="px-6 py-3 bg-boerne-navy text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors">
                Submit Your Photos 📸
              </button>
              <Link href="/events" className="px-6 py-3 bg-white text-boerne-navy font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                Join Group Adventures 🥾
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}