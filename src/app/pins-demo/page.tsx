'use client';

import LocationCard, { LocationData } from '@/components/LocationCard';

const sampleLocations: LocationData[] = [
  {
    id: '1',
    name: "Joe's Coffee Shop",
    address: "123 Main St, Boerne, TX",
    category: "Coffee Shop",
    rating: 4.2,
    priceLevel: "$$",
    hours: "7am-6pm",
    phone: "(830) 555-0123",
    website: "https://joescoffee.com",
    description: "Great local coffee spot with friendly service.",
    membershipTier: "basic",
    keywords: [], // No keywords for basic
    photos: ["coffee1.jpg"]
  },
  {
    id: '2',
    name: "Joe's Coffee Shop",
    address: "123 Main St, Boerne, TX",
    category: "Coffee Shop",
    rating: 4.5,
    priceLevel: "$$",
    hours: "7am-6pm",
    phone: "(830) 555-0123",
    website: "https://joescoffee.com",
    description: "Family-owned coffee shop serving Boerne since 2015. We pride ourselves on quality coffee and community connection.",
    membershipTier: "verified",
    keywords: ["coffee", "breakfast"], // 2 keywords for verified
    photos: ["coffee1.jpg", "coffee2.jpg", "coffee3.jpg"],
    verifiedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    bernieRecommendation: "Great local hangout spot with the friendliest staff in town!"
  },
  {
    id: '3',
    name: "Joe's Coffee Shop",
    address: "123 Main St, Boerne, TX",
    category: "Coffee Shop",
    rating: 4.8,
    priceLevel: "$$",
    hours: "7am-6pm",
    phone: "(830) 555-0123",
    website: "https://joescoffee.com",
    description: "Family-owned coffee shop serving the Boerne community since 2015. Winner of 'Best Local Coffee' 2023. We're committed to supporting local farmers and providing a welcoming space for our community.",
    membershipTier: "silver",
    keywords: ["coffee", "breakfast", "wifi", "pastries", "local"], // 5 keywords for silver
    photos: Array(10).fill("coffee.jpg"),
    specialOffers: ["20% off lattes this week", "Free pastry with any coffee purchase"],
    events: ["Live Music Fridays 7pm", "Coffee Cupping Class Saturdays"],
    verifiedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    responseTime: "Responds in ~1hr",
    bernieRecommendation: "My personal favorite spot for morning coffee! The atmosphere is perfect for meeting friends."
  },
  {
    id: '4',
    name: "Joe's Coffee Shop",
    address: "123 Main St, Boerne, TX",
    category: "Coffee Shop",
    rating: 4.9,
    priceLevel: "$$",
    hours: "7am-6pm",
    phone: "(830) 555-0123",
    website: "https://joescoffee.com",
    description: "Family-owned coffee shop serving the Boerne community since 2015. Winner of 'Best Local Coffee' 2023, featured in Hill Country Magazine. We roast our own beans and are committed to sustainability and community. Perfect for remote work, date nights, or catching up with friends over artisanal beverages.",
    membershipTier: "gold",
    keywords: ["coffee", "breakfast", "wifi", "pastries", "local", "artisan", "roasting", "community", "workspace", "events"], // 10 keywords for gold
    photos: Array(20).fill("coffee.jpg"),
    specialOffers: ["Free pastry with coffee purchase", "Loyalty program - 10th coffee free"],
    events: ["Live Music Fridays 7pm", "Coffee Cupping Class Saturdays", "Book Club Mondays 6pm"],
    verifiedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    responseTime: "Instant Response",
    bernieRecommendation: "This is THE coffee spot in Boerne! Joe knows everyone's order by heart and the atmosphere is perfect for meeting friends or working. They even have a community bulletin board where locals share news and events!"
  }
];

export default function PinsDemo() {
  return (
    <div className="bg-boerne-light-gray min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-boerne-navy mb-4">
            Boerne Handy Hub Pin System 📍
          </h1>
          <p className="text-xl text-boerne-dark-gray">
            See how businesses look at each membership tier
          </p>
        </div>

        <div className="space-y-12">
          {/* Unverified */}
          <div>
            <h2 className="text-2xl font-bold text-boerne-navy mb-4 flex items-center">
              📍 Basic Pin (Free, Unverified)
            </h2>
            <p className="text-boerne-dark-gray mb-6">
              Basic business listing with minimal information. Anyone can add these. No search keywords included.
            </p>
            <div className="flex justify-center">
              <LocationCard location={sampleLocations[0]} />
            </div>
          </div>

          {/* Verified */}
          <div className="border-t border-boerne-light-blue pt-12">
            <h2 className="text-2xl font-bold text-boerne-navy mb-4 flex items-center">
              ✅ Verified Pin (Free after verification)
            </h2>
            <p className="text-boerne-dark-gray mb-6">
              Business owner has verified their listing. Gets Boerne Verified badge, Bernie recommendation, and 2 search keywords.
            </p>
            <div className="flex justify-center">
              <LocationCard location={sampleLocations[1]} />
            </div>
          </div>

          {/* Silver */}
          <div className="border-t border-boerne-light-blue pt-12">
            <h2 className="text-2xl font-bold text-boerne-navy mb-4 flex items-center">
              🥈 Silver Member ($19/month)
            </h2>
            <p className="text-boerne-dark-gray mb-6">
              Enhanced listing with special offers, event posting, analytics, and 5 search keywords for better discovery.
            </p>
            <div className="flex justify-center">
              <LocationCard location={sampleLocations[2]} />
            </div>
          </div>

          {/* Gold */}
          <div className="border-t border-boerne-light-blue pt-12">
            <h2 className="text-2xl font-bold text-boerne-navy mb-4 flex items-center">
              🥇 Gold Member ($39/month)
            </h2>
            <p className="text-boerne-dark-gray mb-6">
              Premium business with homepage featuring, unlimited photos, premium Bernie recommendations, full analytics, and 10 search keywords.
            </p>
            <div className="flex justify-center">
              <LocationCard location={sampleLocations[3]} />
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-boerne-navy mb-6 text-center">
            Membership Comparison
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-boerne-light-blue">
                  <th className="text-left py-3 px-4 text-boerne-navy">Feature</th>
                  <th className="text-center py-3 px-4 text-boerne-dark-gray">Basic</th>
                  <th className="text-center py-3 px-4 text-boerne-gold">Verified</th>
                  <th className="text-center py-3 px-4 text-gray-600">Silver</th>
                  <th className="text-center py-3 px-4 text-yellow-600">Gold</th>
                </tr>
              </thead>
              <tbody className="text-boerne-dark-gray">
                <tr className="border-b border-boerne-light-gray">
                  <td className="py-3 px-4">Basic Listing</td>
                  <td className="text-center py-3 px-4">✅</td>
                  <td className="text-center py-3 px-4">✅</td>
                  <td className="text-center py-3 px-4">✅</td>
                  <td className="text-center py-3 px-4">✅</td>
                </tr>
                <tr className="border-b border-boerne-light-gray">
                  <td className="py-3 px-4">Boerne Verified Badge</td>
                  <td className="text-center py-3 px-4">❌</td>
                  <td className="text-center py-3 px-4">✅</td>
                  <td className="text-center py-3 px-4">✅</td>
                  <td className="text-center py-3 px-4">✅</td>
                </tr>
                <tr className="border-b border-boerne-light-gray">
                  <td className="py-3 px-4">Bernie Recommendation</td>
                  <td className="text-center py-3 px-4">❌</td>
                  <td className="text-center py-3 px-4">Basic</td>
                  <td className="text-center py-3 px-4">Enhanced</td>
                  <td className="text-center py-3 px-4">Premium</td>
                </tr>
                <tr className="border-b border-boerne-light-gray">
                  <td className="py-3 px-4">Photos</td>
                  <td className="text-center py-3 px-4">1</td>
                  <td className="text-center py-3 px-4">3</td>
                  <td className="text-center py-3 px-4">10</td>
                  <td className="text-center py-3 px-4">Unlimited</td>
                </tr>
                <tr className="border-b border-boerne-light-gray">
                  <td className="py-3 px-4">Special Offers</td>
                  <td className="text-center py-3 px-4">❌</td>
                  <td className="text-center py-3 px-4">❌</td>
                  <td className="text-center py-3 px-4">✅</td>
                  <td className="text-center py-3 px-4">✅</td>
                </tr>
                <tr className="border-b border-boerne-light-gray">
                  <td className="py-3 px-4">Event Posting</td>
                  <td className="text-center py-3 px-4">❌</td>
                  <td className="text-center py-3 px-4">❌</td>
                  <td className="text-center py-3 px-4">✅</td>
                  <td className="text-center py-3 px-4">✅</td>
                </tr>
                <tr className="border-b border-boerne-light-gray">
                  <td className="py-3 px-4">Featured Placement</td>
                  <td className="text-center py-3 px-4">❌</td>
                  <td className="text-center py-3 px-4">❌</td>
                  <td className="text-center py-3 px-4">Category</td>
                  <td className="text-center py-3 px-4">Homepage</td>
                </tr>
                <tr className="border-b border-boerne-light-gray">
                  <td className="py-3 px-4">Analytics</td>
                  <td className="text-center py-3 px-4">❌</td>
                  <td className="text-center py-3 px-4">❌</td>
                  <td className="text-center py-3 px-4">Advanced</td>
                  <td className="text-center py-3 px-4">Full Suite</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold">Search Keywords</td>
                  <td className="text-center py-3 px-4 font-semibold">0</td>
                  <td className="text-center py-3 px-4 font-semibold">2</td>
                  <td className="text-center py-3 px-4 font-semibold">5</td>
                  <td className="text-center py-3 px-4 font-semibold">10</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold">Monthly Cost</td>
                  <td className="text-center py-3 px-4 font-semibold">Free</td>
                  <td className="text-center py-3 px-4 font-semibold">Free</td>
                  <td className="text-center py-3 px-4 font-semibold">$19</td>
                  <td className="text-center py-3 px-4 font-semibold">$39</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-boerne-navy mb-4">
              Ready to Get Your Business Listed?
            </h2>
            <p className="text-boerne-dark-gray mb-6">
              Start with a free verified listing and upgrade anytime for enhanced features.
            </p>
            <div className="space-x-4">
              <button 
                onClick={() => window.location.href = '/business/onboard'}
                className="px-6 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors"
              >
                Get Verified Free 🤠
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-boerne-navy text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Explore Boerne Hub
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}