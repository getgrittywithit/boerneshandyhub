import ProviderCard from '@/components/ProviderCard';

// Sample providers for each tier
const sampleProviders = [
  {
    id: 'unclaimed-example',
    name: 'Acme Plumbing Co',
    category: 'plumbing',
    subcategories: [],
    description: '',
    address: '123 Main St, Boerne TX',
    phone: '(830) 555-0100',
    email: '',
    rating: 0,
    reviewCount: 0,
    membershipTier: 'basic' as const,
    claimStatus: 'unclaimed' as const,
    licensed: false,
    insured: false,
    services: [],
    serviceArea: ['Boerne'],
    photos: [],
    keywords: [],
  },
  {
    id: 'claimed-example',
    name: 'Johnson Home Repair',
    category: 'plumbing',
    subcategories: [],
    description: 'Family-owned plumbing business serving Boerne and the Hill Country for over 15 years. We specialize in residential repairs and installations.',
    address: '456 Oak Ave, Boerne TX',
    phone: '(830) 555-0200',
    email: 'info@johnsonhomerepair.com',
    website: 'https://johnsonhomerepair.com',
    rating: 4.2,
    reviewCount: 12,
    membershipTier: 'basic' as const,
    claimStatus: 'verified' as const,
    yearsInBusiness: 15,
    licensed: true,
    insured: true,
    services: ['Drain Cleaning', 'Water Heater Repair', 'Leak Detection', 'Pipe Repair'],
    serviceArea: ['Boerne', 'Fair Oaks Ranch'],
    photos: ['/images/placeholder-business.jpg'],
    hours: 'Mon-Fri 8am-5pm',
    keywords: [],
  },
  {
    id: 'verified-example',
    name: 'Hill Country Plumbing Pros',
    category: 'plumbing',
    subcategories: [],
    description: 'Licensed master plumbers providing top-quality service. 24/7 emergency repairs available. We guarantee our work with a 2-year warranty on all installations.',
    address: '789 River Rd, Boerne TX',
    phone: '(830) 555-0300',
    email: 'service@hcplumbingpros.com',
    website: 'https://hcplumbingpros.com',
    rating: 4.7,
    reviewCount: 48,
    membershipTier: 'verified' as const,
    claimStatus: 'verified' as const,
    yearsInBusiness: 8,
    licensed: true,
    insured: true,
    services: ['Emergency Repairs', 'Water Heaters', 'Repiping', 'Sewer Lines', 'Drain Cleaning', 'Fixture Installation'],
    serviceArea: ['Boerne', 'Fair Oaks Ranch', 'Helotes'],
    photos: [
      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    ],
    specialOffers: ['$50 off first service call'],
    hours: 'Mon-Sat 7am-7pm, Sun Emergency Only',
    keywords: [],
  },
  {
    id: 'verifiedplus-example',
    name: 'Premier Plumbing & Drain',
    category: 'plumbing',
    subcategories: [],
    description: 'Award-winning plumbing company with a team of certified technicians. We use the latest technology including video pipe inspection and trenchless repairs.',
    address: '321 Cibolo Creek Dr, Boerne TX',
    phone: '(830) 555-0400',
    email: 'hello@premierplumbing.com',
    website: 'https://premierplumbing.com',
    rating: 4.9,
    reviewCount: 127,
    membershipTier: 'premium' as const,
    claimStatus: 'verified' as const,
    yearsInBusiness: 12,
    licensed: true,
    insured: true,
    services: ['Video Inspection', 'Trenchless Repair', 'Water Heaters', 'Tankless Systems', 'Whole-Home Repiping', 'Commercial Plumbing'],
    serviceArea: ['Boerne', 'Fair Oaks Ranch', 'Helotes', 'Leon Springs', 'Comfort'],
    photos: [
      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400',
    ],
    specialOffers: [
      'Free estimates on all jobs',
      '10% senior discount',
      '$100 off tankless water heater install',
    ],
    bernieRecommendation: 'These guys are the real deal. Fast response, fair pricing, and they cleaned up after themselves. Highly recommend!',
    hours: '24/7 Service Available',
    keywords: [],
  },
  {
    id: 'partner-example',
    name: 'Boerne Master Plumbers',
    category: 'plumbing',
    subcategories: [],
    description: 'The official plumbing partner for Boerne\'s Handy Hub. Family-owned for 3 generations, we\'re committed to excellence in every job. Licensed, bonded, and insured with a lifetime warranty on select services.',
    address: '100 Partner Plaza, Boerne TX',
    phone: '(830) 555-0500',
    email: 'vip@boernemasterplumbers.com',
    website: 'https://boernemasterplumbers.com',
    rating: 5.0,
    reviewCount: 312,
    membershipTier: 'elite' as const,
    claimStatus: 'verified' as const,
    yearsInBusiness: 35,
    licensed: true,
    insured: true,
    services: ['Emergency Service', 'Water Heaters', 'Tankless Systems', 'Whole-Home Repiping', 'Sewer & Drain', 'Commercial', 'New Construction', 'Gas Lines'],
    serviceArea: ['Boerne', 'Fair Oaks Ranch', 'Helotes', 'Leon Springs', 'Comfort', 'Kendalia', 'Bergheim'],
    photos: [
      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400',
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400',
    ],
    specialOffers: [
      'Free video inspection with any service',
      '15% off for new customers',
      'Lifetime warranty on water heaters',
    ],
    bernieRecommendation: 'The gold standard in Boerne plumbing. Three generations of expertise, and they treat every customer like family. Our top recommendation.',
    hours: '24/7/365 - Always Available',
    keywords: [],
  },
];

const tierInfo = [
  {
    name: 'Unclaimed',
    price: 'N/A',
    description: 'Business added from public data, not yet claimed by owner',
    provider: sampleProviders[0],
  },
  {
    name: 'Claimed (Free)',
    price: '$0/mo',
    description: 'Basic listing with description, 1 photo, hours, and contact info',
    provider: sampleProviders[1],
  },
  {
    name: 'Verified',
    price: '$29/mo',
    description: 'Verified badge, up to 5 photos, 2 categories, analytics, special offers',
    provider: sampleProviders[2],
  },
  {
    name: 'Verified Plus',
    price: '$79/mo',
    description: 'Featured placement, up to 15 photos, 4 categories, newsletter inclusion',
    provider: sampleProviders[3],
  },
  {
    name: 'Partner',
    price: '$249/mo',
    description: 'Exclusive per category, unlimited photos + video, homepage carousel, custom landing page',
    provider: sampleProviders[4],
  },
];

export default function TierDemoPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-boerne-navy text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Tier Card Demo</h1>
          <p className="text-white/70">
            Visual comparison of all membership tier cards
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-8">
          {tierInfo.map((tier, index) => (
            <div key={tier.name} className="bg-white rounded-xl p-6 shadow-sm">
              {/* Tier Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {index + 1}. {tier.name}
                  </h2>
                  <p className="text-gray-600 mt-1">{tier.description}</p>
                </div>
                <div className="text-right">
                  <span className={`text-2xl font-bold ${
                    tier.price === '$0/mo' ? 'text-gray-600' :
                    tier.price === '$29/mo' ? 'text-green-600' :
                    tier.price === '$79/mo' ? 'text-boerne-gold' :
                    tier.price === '$249/mo' ? 'text-amber-600' :
                    'text-gray-400'
                  }`}>
                    {tier.price}
                  </span>
                </div>
              </div>

              {/* Card Preview */}
              <div className="max-w-sm">
                <ProviderCard
                  provider={tier.provider}
                  topCategorySlug="home"
                  subcategorySlug="plumbing"
                  subcategoryName="Plumbing"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="mt-12 bg-white rounded-xl p-6 shadow-sm overflow-x-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Feature Comparison</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 pr-4 font-semibold text-gray-900">Feature</th>
                <th className="text-center py-3 px-2 font-semibold text-gray-400">Unclaimed</th>
                <th className="text-center py-3 px-2 font-semibold text-gray-600">Claimed</th>
                <th className="text-center py-3 px-2 font-semibold text-green-600">Verified</th>
                <th className="text-center py-3 px-2 font-semibold text-boerne-gold">V+ Plus</th>
                <th className="text-center py-3 px-2 font-semibold text-amber-600">Partner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-3 pr-4">Badge</td>
                <td className="text-center py-3 px-2 text-gray-400">—</td>
                <td className="text-center py-3 px-2 text-gray-400">—</td>
                <td className="text-center py-3 px-2">✓ Verified</td>
                <td className="text-center py-3 px-2">✓+ Plus</td>
                <td className="text-center py-3 px-2">🏆 Partner</td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Photos on Card</td>
                <td className="text-center py-3 px-2 text-gray-400">0</td>
                <td className="text-center py-3 px-2">1</td>
                <td className="text-center py-3 px-2">2</td>
                <td className="text-center py-3 px-2">3</td>
                <td className="text-center py-3 px-2">4</td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Photos in Profile</td>
                <td className="text-center py-3 px-2 text-gray-400">0</td>
                <td className="text-center py-3 px-2">1</td>
                <td className="text-center py-3 px-2">5</td>
                <td className="text-center py-3 px-2">15</td>
                <td className="text-center py-3 px-2">∞</td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Special Offers Shown</td>
                <td className="text-center py-3 px-2 text-gray-400">—</td>
                <td className="text-center py-3 px-2">1</td>
                <td className="text-center py-3 px-2">1</td>
                <td className="text-center py-3 px-2">3</td>
                <td className="text-center py-3 px-2">3</td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Credentials Box</td>
                <td className="text-center py-3 px-2 text-gray-400">—</td>
                <td className="text-center py-3 px-2 text-gray-400">—</td>
                <td className="text-center py-3 px-2 text-green-600">✓</td>
                <td className="text-center py-3 px-2 text-green-600">✓</td>
                <td className="text-center py-3 px-2 text-green-600">✓</td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Staff Pick</td>
                <td className="text-center py-3 px-2 text-gray-400">—</td>
                <td className="text-center py-3 px-2 text-gray-400">—</td>
                <td className="text-center py-3 px-2 text-gray-400">—</td>
                <td className="text-center py-3 px-2 text-green-600">✓</td>
                <td className="text-center py-3 px-2 text-green-600">✓</td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Featured Ribbon</td>
                <td className="text-center py-3 px-2 text-gray-400">—</td>
                <td className="text-center py-3 px-2 text-gray-400">—</td>
                <td className="text-center py-3 px-2 text-gray-400">—</td>
                <td className="text-center py-3 px-2 text-green-600">✓</td>
                <td className="text-center py-3 px-2 text-green-600">✓</td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Border Style</td>
                <td className="text-center py-3 px-2">Dashed Gray</td>
                <td className="text-center py-3 px-2">Gray</td>
                <td className="text-center py-3 px-2">Green</td>
                <td className="text-center py-3 px-2">Gold</td>
                <td className="text-center py-3 px-2">Amber + Glow</td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Background</td>
                <td className="text-center py-3 px-2">Gray</td>
                <td className="text-center py-3 px-2">White</td>
                <td className="text-center py-3 px-2">White</td>
                <td className="text-center py-3 px-2">White</td>
                <td className="text-center py-3 px-2">Gold Gradient</td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Categories</td>
                <td className="text-center py-3 px-2">1</td>
                <td className="text-center py-3 px-2">1</td>
                <td className="text-center py-3 px-2">2</td>
                <td className="text-center py-3 px-2">4</td>
                <td className="text-center py-3 px-2">5</td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Sort Priority</td>
                <td className="text-center py-3 px-2">0</td>
                <td className="text-center py-3 px-2">1</td>
                <td className="text-center py-3 px-2">2</td>
                <td className="text-center py-3 px-2">3</td>
                <td className="text-center py-3 px-2">4</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Visual Elements Legend */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Visual Elements</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded"></div>
              <span className="text-sm text-gray-600">Claimed gradient header</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded"></div>
              <span className="text-sm text-gray-600">Verified gradient header</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-gradient-to-r from-boerne-gold to-yellow-400 rounded"></div>
              <span className="text-sm text-gray-600">Verified Plus gradient header</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 rounded"></div>
              <span className="text-sm text-gray-600">Partner gradient header</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-4 border-2 border-dashed border-gray-300 rounded"></div>
              <span className="text-sm text-gray-600">Unclaimed dashed border</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-4 border-2 border-amber-400 rounded shadow-md shadow-amber-100"></div>
              <span className="text-sm text-gray-600">Partner glow effect</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
