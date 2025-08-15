'use client';

import LocationCard, { LocationData } from '@/components/LocationCard';

const boerneCityPark: LocationData = {
  id: 'boerne-city-park',
  name: "Boerne City Park",
  address: "106 City Park Road, Boerne, TX 78006",
  category: "City Park",
  rating: 4.7,
  priceLevel: "Free",
  hours: "5am - Midnight",
  phone: "(830) 248-1635",
  website: "https://www.ci.boerne.tx.us/167/Boerne-City-Park",
  description: "Boerne&apos;s largest park featuring 125 acres of natural beauty along Cibolo Creek. Home to the scenic 1.75-mile Cibolo Trail connecting to downtown Main Plaza, plus sports fields, tennis courts, playground, and ADA-accessible trails. Connected to Cibolo Center for Conservation with 6 miles of additional trails.",
  membershipTier: "verified",
  keywords: ["trails", "playground"], // 2 keywords for verified public spot
  photos: ["city-park-1.jpg", "city-park-2.jpg", "city-park-3.jpg"],
  bernieRecommendation: "This is THE crown jewel of Boerne parks, y&apos;all! Those cypress trees along Cibolo Creek are older than most Texas towns. Pro tip: Start early morning for the best wildlife viewing - I&apos;ve seen deer, herons, and even the occasional fox. The trail to Main Plaza is perfect for showing visitors the real Boerne experience!",
  verifiedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  features: [
    "1.75-mile Cibolo Trail to downtown",
    "ADA-accessible paved trails", 
    "Covered playground",
    "Soccer fields & tennis courts",
    "Restrooms & water fountains",
    "WiFi (limited coverage)",
    "Picnic tables & pavilions",
    "Connects to Cibolo Center (6 more trail miles)",
    "Magnificent cypress-lined creek banks",
    "Paved parking lot"
  ]
};

export default function BoerneCityParkDemo() {
  return (
    <div className="bg-boerne-light-gray min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-boerne-navy mb-4">
            Boerne City Park Pin Preview 🌲
          </h1>
          <p className="text-lg text-boerne-dark-gray">
            How our public spots will look with official city data + Bernie's local insights
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <LocationCard location={boerneCityPark} />
        </div>

        {/* Bernie's Enhanced Info Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-boerne-navy mb-4">
            🤠 Bernie's Local Intelligence
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-boerne-navy mb-2">Best Times to Visit:</h3>
              <ul className="text-sm text-boerne-dark-gray space-y-1">
                <li>• <strong>Early morning (6-8am):</strong> Wildlife viewing, cooler temps</li>
                <li>• <strong>Tuesday-Thursday:</strong> Least crowded weekdays</li>
                <li>• <strong>Spring/Fall:</strong> Perfect weather, creek flowing</li>
                <li>• <strong>Avoid:</strong> Soccer tournament weekends (parking)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-boerne-navy mb-2">Hidden Gems:</h3>
              <ul className="text-sm text-boerne-dark-gray space-y-1">
                <li>• Creek access point behind tennis courts</li>
                <li>• Ancient cypress grove (200+ years old)</li>
                <li>• Best sunset views from soccer field hill</li>
                <li>• Secret wildflower meadow in spring</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Official vs Bernie's Info */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-boerne-navy mb-4">
            🏛️ Official Info + 🤠 Local Wisdom
          </h2>
          
          <div className="space-y-4">
            <div className="border-l-4 border-boerne-light-blue pl-4">
              <p className="text-sm font-semibold text-boerne-navy">Official Hours: 5am - Midnight</p>
              <p className="text-sm text-boerne-dark-gray italic">Bernie says: &quot;Gates stay open, but lighting is limited after 10pm. Bring a flashlight for evening creek walks!&quot;</p>
            </div>
            
            <div className="border-l-4 border-boerne-gold pl-4">
              <p className="text-sm font-semibold text-boerne-navy">Official: Connects to Cibolo Center</p>
              <p className="text-sm text-boerne-dark-gray italic">Bernie says: &quot;The connection trail is unmarked but starts behind the playground - look for the wooden post with the lizard carving!&quot;</p>
            </div>
            
            <div className="border-l-4 border-boerne-green pl-4">
              <p className="text-sm font-semibold text-boerne-navy">Official: WiFi (limited)</p>
              <p className="text-sm text-boerne-dark-gray italic">Bernie says: &quot;WiFi works great near the pavilions, perfect for remote work picnics. Password is usually &apos;BoerneParks&apos; - ask the groundskeeper if it&apos;s changed!&quot;</p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-boerne-light-gray">
            <a 
              href="https://www.ci.boerne.tx.us/167/Boerne-City-Park" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-boerne-navy text-white rounded hover:bg-opacity-90 transition-colors"
            >
              <span>🏛️</span>
              <span>View Official City Page</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}