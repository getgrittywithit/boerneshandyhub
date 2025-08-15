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
  description: "Boerne's largest park featuring 125 acres of natural beauty along Cibolo Creek. Home to the scenic 1.75-mile Cibolo Trail connecting to downtown Main Plaza, plus sports fields, tennis courts, playground, and ADA-accessible trails. Connected to Cibolo Center for Conservation with 6 miles of additional trails.",
  membershipTier: "verified",
  keywords: ["trails", "playground"], // 2 keywords for verified public spot
  photos: ["city-park-1.jpg", "city-park-2.jpg", "city-park-3.jpg"],
  bernieRecommendation: "This is Boerne's largest park at 125 acres! The Cibolo Trail connects all the way to Main Plaza downtown - perfect for showing visitors the real Boerne experience.",
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

        {/* Community Scavenger Hunt Game */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-boerne-navy mb-4">
            🎯 Boerne Parks Explorer Challenge
          </h2>
          <p className="text-boerne-dark-gray mb-4">
            Complete the scavenger hunt to unlock Bernie's insider tips! Find and photograph these items at City Park:
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-boerne-navy mb-2">📍 Required Finds:</h3>
              <ul className="text-sm text-boerne-dark-gray space-y-2">
                <li className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>Cibolo Trail stone marker</span>
                </li>
                <li className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>Covered playground structure</span>
                </li>
                <li className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>Soccer field goal posts</span>
                </li>
                <li className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>Creek access point</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-boerne-navy mb-2">🏆 Bonus Challenges:</h3>
              <ul className="text-sm text-boerne-dark-gray space-y-2">
                <li className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>Spot local wildlife (photo proof)</span>
                </li>
                <li className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>Find tennis court entrance</span>
                </li>
                <li className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>Locate park restrooms</span>
                </li>
                <li className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>Cypress trees along creek bank</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-boerne-gold bg-opacity-20 rounded">
            <p className="text-sm text-boerne-navy">
              <strong>🎁 Complete 6/8 items to unlock:</strong> Bernie's secret tips, best photo spots, and seasonal insights!
            </p>
          </div>
        </div>

        {/* Official Information */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-boerne-navy mb-4">
            🏛️ Official Park Information
          </h2>
          
          <div className="space-y-4">
            <div className="border-l-4 border-boerne-light-blue pl-4">
              <p className="text-sm font-semibold text-boerne-navy">Hours: 5am - Midnight</p>
              <p className="text-sm text-boerne-dark-gray">Park gates and main facilities accessible during these hours</p>
            </div>
            
            <div className="border-l-4 border-boerne-gold pl-4">
              <p className="text-sm font-semibold text-boerne-navy">Connects to Cibolo Center for Conservation</p>
              <p className="text-sm text-boerne-dark-gray">Trail connection provides access to 6 additional miles of nature trails</p>
            </div>
            
            <div className="border-l-4 border-boerne-green pl-4">
              <p className="text-sm font-semibold text-boerne-navy">WiFi Available (Limited Coverage)</p>
              <p className="text-sm text-boerne-dark-gray">WiFi service available in select areas of the park</p>
            </div>
            
            <div className="border-l-4 border-boerne-navy pl-4">
              <p className="text-sm font-semibold text-boerne-navy">Contact for Issues: (830) 248-1635</p>
              <p className="text-sm text-boerne-dark-gray">Report unsafe conditions or maintenance needs</p>
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