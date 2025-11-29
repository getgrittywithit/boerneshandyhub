import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Boerne, Texas | History, Demographics & Complete Guide to Hill Country Living',
  description: 'Discover Boerne, Texas: A historic German settlement in the Texas Hill Country. Founded in 1849, population 21,600+. Complete guide to history, attractions, demographics, and living in Kendall County seat.',
  keywords: 'Boerne Texas, German settlement Texas, Hill Country Texas, Kendall County, Boerne history, Texas Hill Country living, Ludwig Börne, German heritage Texas, Boerne attractions, Cibolo Creek',
  openGraph: {
    title: 'About Boerne, Texas | Complete Guide to Hill Country Living',
    description: 'Explore Boerne\'s rich German heritage, historic Main Street, natural attractions, and thriving community in the heart of Texas Hill Country.',
    type: 'website',
    locale: 'en_US',
  },
  alternates: {
    canonical: '/about'
  }
};

export default function AboutBoernePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": "Boerne, Texas",
    "alternateName": "Boerne",
    "description": "Historic German settlement in the Texas Hill Country, founded in 1849. County seat of Kendall County with population over 21,600.",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 29.7946600,
      "longitude": -98.7319700
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US",
      "addressRegion": "TX",
      "addressLocality": "Boerne"
    },
    "foundingDate": "1849",
    "population": 21600,
    "elevation": "1526 ft",
    "timeZone": "America/Chicago",
    "containedInPlace": {
      "@type": "AdministrativeArea",
      "name": "Kendall County"
    },
    "touristAttraction": [
      {
        "@type": "TouristAttraction",
        "name": "Kendall County Courthouse",
        "description": "Second-oldest courthouse in Texas still in use, built in 1870"
      },
      {
        "@type": "TouristAttraction", 
        "name": "The Kendall Inn",
        "description": "Historic hotel from 1859, hosted presidents and Confederate generals"
      },
      {
        "@type": "TouristAttraction",
        "name": "Cibolo Nature Center",
        "description": "100+ acres with dinosaur tracks and Hill Country trails"
      },
      {
        "@type": "TouristAttraction",
        "name": "Cascade Caverns",
        "description": "Only natural cave in Texas with interior waterfall"
      }
    ],
    "knowsAbout": [
      "German heritage",
      "Texas Hill Country",
      "Ludwig Börne",
      "Cibolo Creek",
      "Antique shopping",
      "Outdoor recreation"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="bg-boerne-light-gray min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-boerne-navy to-boerne-light-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Boerne, Texas
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto">
              Discover the Rich History and Natural Beauty of the Texas Hill Country's Premier German Settlement
            </p>
            <div className="grid md:grid-cols-4 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold">1849</div>
                <div className="text-sm opacity-90">Founded</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">21,600+</div>
                <div className="text-sm opacity-90">Population</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">1,526 ft</div>
                <div className="text-sm opacity-90">Elevation</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">30 mi</div>
                <div className="text-sm opacity-90">From San Antonio</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Overview Section */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-boerne-navy mb-6">Welcome to Boerne, Texas</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-lg text-boerne-dark-gray mb-4">
                  <strong>Boerne</strong> (/ˈbɜːrni/ BURN-ee) is a charming city and the county seat of <strong>Kendall County, Texas</strong>, 
                  nestled in the heart of the <strong>Texas Hill Country</strong>. Located just 30 miles northwest of San Antonio along 
                  Interstate Highway 10, Boerne offers the perfect blend of small-town charm and modern amenities.
                </p>
                <p className="text-lg text-boerne-dark-gray mb-4">
                  Founded in 1849 as Tusculum, this historic <strong>German settlement</strong> was renamed Boerne in 1852 
                  to honor <strong>Ludwig Börne</strong>, a influential German writer and political satirist whose writings 
                  inspired many Germans to seek freedom and opportunity in Texas.
                </p>
                <p className="text-lg text-boerne-dark-gray">
                  Today, Boerne is one of the fastest-growing cities in Texas, with a population exceeding 21,600 residents 
                  and a remarkable growth rate of 5.54% annually. The city has experienced a dramatic 106.64% population 
                  increase since the 2010 US Census.
                </p>
              </div>
              <div className="bg-gradient-to-br from-boerne-gold to-boerne-light-blue p-6 rounded-lg text-white">
                <h3 className="text-xl font-bold mb-4">Quick Facts About Boerne</h3>
                <ul className="space-y-2">
                  <li><strong>Pronunciation:</strong> BURN-ee</li>
                  <li><strong>County:</strong> Kendall County (County Seat)</li>
                  <li><strong>Founded:</strong> 1849 (as Tusculum), renamed 1852</li>
                  <li><strong>Named After:</strong> Ludwig Börne (German writer)</li>
                  <li><strong>Area:</strong> 11.6 square miles</li>
                  <li><strong>Elevation:</strong> 1,526 feet above sea level</li>
                  <li><strong>Climate:</strong> Humid subtropical (Köppen Cfa)</li>
                  <li><strong>Major Waterway:</strong> Cibolo Creek</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* History Section */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-boerne-navy mb-8">Rich German Heritage & History</h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-boerne-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏰</span>
                </div>
                <h3 className="text-xl font-semibold text-boerne-navy mb-2">German Immigration (1840s)</h3>
                <p className="text-sm text-boerne-dark-gray">
                  Part of the Adelsverein colonization efforts bringing thousands of Germans to Texas seeking freedom from political and economic turmoil.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-boerne-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📜</span>
                </div>
                <h3 className="text-xl font-semibold text-boerne-navy mb-2">Town Founding (1852)</h3>
                <p className="text-sm text-boerne-dark-gray">
                  Gustav Theissen and John James platted the town, naming it after Ludwig Börne, whose writings inspired German emigration to Texas.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-boerne-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏛️</span>
                </div>
                <h3 className="text-xl font-semibold text-boerne-navy mb-2">County Seat (1862)</h3>
                <p className="text-sm text-boerne-dark-gray">
                  Became the county seat of newly formed Kendall County by just 67 votes, with the historic courthouse built in 1870.
                </p>
              </div>
            </div>

            <div className="border-l-4 border-boerne-gold pl-6 mb-8">
              <h3 className="text-2xl font-semibold text-boerne-navy mb-4">The Ludwig Börne Legacy</h3>
              <p className="text-boerne-dark-gray mb-4">
                <strong>Ludwig Börne</strong> (1786-1837) was a German-Jewish political writer and satirist who became 
                the first writer to exclusively criticize the political order of Germany. Although Börne died before 
                Boerne was founded, his radical writings inspired many young German liberals to seek a better life 
                in what was then the Republic of Texas.
              </p>
              <p className="text-boerne-dark-gray">
                The town's founders chose to honor Börne by naming their settlement after him, dropping the inflected 
                vowel and employing American spelling. This makes Boerne one of the few Texas cities named after a 
                European intellectual rather than a political or military figure.
              </p>
            </div>

            <div className="bg-boerne-light-gray p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-boerne-navy mb-4">German Cultural Heritage</h3>
              <p className="text-boerne-dark-gray mb-4">
                The German influence remained strong in Boerne for generations through various cultural organizations:
              </p>
              <ul className="text-boerne-dark-gray space-y-2">
                <li><strong>Boerne Gesangverein</strong> (singing society) - Established 1860, operated until 1977</li>
                <li><strong>Boerne Schuetzen Verein</strong> (shooting club) - Founded 1864, still active today</li>
                <li><strong>Boerne Village Band</strong> - Formed around 1860, continues to perform</li>
                <li><strong>Berges Fest</strong> - Annual German celebration held since 1967</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Geography & Climate Section */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-boerne-navy mb-8">Geography & Climate</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold text-boerne-navy mb-4">Location & Topography</h3>
                <p className="text-boerne-dark-gray mb-4">
                  Boerne sits at the geographic coordinates of <strong>29.7946600°N and 98.7319700°W</strong> in the 
                  southern region of the Texas Hill Country. The city covers <strong>11.6 square miles</strong>, with 
                  2.61% covered by water from Cibolo Creek and Boerne City Lake.
                </p>
                <p className="text-boerne-dark-gray mb-4">
                  At an elevation of <strong>1,526 feet above sea level</strong>, Boerne enjoys the cooler climate 
                  and scenic beauty characteristic of the Hill Country. The area's topography features rolling hills, 
                  limestone outcroppings, and spring-fed creeks.
                </p>
                
                <h4 className="text-lg font-semibold text-boerne-navy mb-3 mt-6">Cibolo Creek</h4>
                <p className="text-boerne-dark-gray mb-2">
                  The <strong>96-mile-long Cibolo Creek</strong> flows through the heart of Boerne, providing both 
                  natural beauty and practical benefits:
                </p>
                <ul className="text-boerne-dark-gray space-y-1 ml-4">
                  <li>• Dammed to form Boerne City Lake for municipal water supply</li>
                  <li>• Features bald cypress-lined shores through the town center</li>
                  <li>• Flows through the Cibolo Nature Center's 100+ acres</li>
                  <li>• Creates the scenic Cibolo Canyonlands east of town</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold text-boerne-navy mb-4">Climate & Weather</h3>
                <p className="text-boerne-dark-gray mb-4">
                  Boerne enjoys a <strong>humid subtropical climate (Köppen Cfa)</strong> with distinct seasons 
                  and generally pleasant weather year-round.
                </p>
                
                <div className="bg-gradient-to-r from-blue-50 to-yellow-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-boerne-navy mb-2">Seasonal Temperatures:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Summer (3.6 months)</strong><br/>
                      High: 93°F | Low: 72°F
                    </div>
                    <div>
                      <strong>Winter (2.9 months)</strong><br/>
                      High: 61°F | Low: 39°F
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-boerne-light-gray rounded">
                    <span className="font-medium">Freezing Mornings/Year:</span>
                    <span className="text-boerne-navy font-bold">46.1 days</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-boerne-light-gray rounded">
                    <span className="font-medium">Average Snowfall:</span>
                    <span className="text-boerne-navy font-bold">0.5 inches</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-boerne-light-gray rounded">
                    <span className="font-medium">Climate Zone:</span>
                    <span className="text-boerne-navy font-bold">Humid-Semiarid Transition</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Demographics Section */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-boerne-navy mb-8">Demographics & Community</h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center p-6 bg-gradient-to-br from-boerne-gold to-orange-200 rounded-lg text-white">
                <h3 className="text-2xl font-bold mb-2">21,600+</h3>
                <p className="text-sm">Current Population (2022)</p>
                <p className="text-xs mt-2 opacity-90">106.64% growth since 2010</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-boerne-light-blue to-blue-300 rounded-lg text-white">
                <h3 className="text-2xl font-bold mb-2">5.54%</h3>
                <p className="text-sm">Annual Growth Rate</p>
                <p className="text-xs mt-2 opacity-90">One of Texas' fastest growing</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-400 to-green-600 rounded-lg text-white">
                <h3 className="text-2xl font-bold mb-2">1,915</h3>
                <p className="text-sm">People per Square Mile</p>
                <p className="text-xs mt-2 opacity-90">Population density</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-boerne-navy mb-4">Racial & Ethnic Composition</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>White</span>
                    <span className="font-bold text-boerne-navy">87.06%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Other Races</span>
                    <span className="font-bold text-boerne-navy">7.32%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Two or More Races</span>
                    <span className="font-bold text-boerne-navy">3.81%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>African American</span>
                    <span className="font-bold text-boerne-navy">0.89%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Hawaiian/Pacific Islander</span>
                    <span className="font-bold text-boerne-navy">0.35%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Native American</span>
                    <span className="font-bold text-boerne-navy">0.33%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Asian</span>
                    <span className="font-bold text-boerne-navy">0.25%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-boerne-navy mb-4">Community Character</h3>
                <p className="text-boerne-dark-gray mb-4">
                  Boerne attracts residents and visitors who appreciate its unique blend of:
                </p>
                <ul className="text-boerne-dark-gray space-y-2">
                  <li>• <strong>Historic charm</strong> with well-preserved German architecture</li>
                  <li>• <strong>Natural beauty</strong> in the heart of Hill Country</li>
                  <li>• <strong>Small-town feel</strong> with big-city amenities nearby</li>
                  <li>• <strong>Quality of life</strong> with excellent schools and low crime</li>
                  <li>• <strong>Economic opportunity</strong> with growing job market</li>
                  <li>• <strong>Outdoor recreation</strong> with parks, trails, and waterways</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Historic Landmarks Section */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-boerne-navy mb-8">Historic Landmarks & Attractions</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-boerne-navy mb-3">🏛️ Kendall County Courthouse</h3>
                <p className="text-sm text-boerne-dark-gray mb-3">
                  Built in 1870, this limestone courthouse is the <strong>second-oldest courthouse in Texas</strong> 
                  still in use. Added to the National Register of Historic Places in 1980.
                </p>
                <div className="text-xs text-gray-600">
                  <strong>Address:</strong> 204 East San Antonio Street<br/>
                  <strong>Status:</strong> Recorded Texas Historic Landmark (1970)
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-boerne-navy mb-3">🏨 The Kendall Inn</h3>
                <p className="text-sm text-boerne-dark-gray mb-3">
                  Historic hotel opened in 1859, one of few remaining 19th-century resort hotels in Texas. 
                  Hosted <strong>Jefferson Davis, Dwight Eisenhower, and Robert E. Lee</strong>.
                </p>
                <div className="text-xs text-gray-600">
                  <strong>Address:</strong> 128 W. Blanco Road<br/>
                  <strong>Status:</strong> National Register Historic Place (1976)
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-boerne-navy mb-3">🏛️ Main Plaza</h3>
                <p className="text-sm text-boerne-dark-gray mb-3">
                  Historic town square where <strong>U.S. Cavalry camels were staked</strong> during Jefferson Davis's 
                  experimental camel cavalry program in the 1850s.
                </p>
                <div className="text-xs text-gray-600">
                  <strong>Features:</strong> Community events, festivals<br/>
                  <strong>Historical Note:</strong> Camel cavalry experiment site
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-boerne-navy mb-3">🏡 Herff-Rozelle Farm</h3>
                <p className="text-sm text-boerne-dark-gray mb-3">
                  Classical Revival farmhouse founded by <strong>Dr. Ferdinand Herff</strong>, now part of the 
                  Cibolo Center for Conservation with nature trails and community programs.
                </p>
                <div className="text-xs text-gray-600">
                  <strong>Current Use:</strong> Educational center<br/>
                  <strong>Features:</strong> Nature walks, community events
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-boerne-navy mb-3">💎 Cascade Caverns</h3>
                <p className="text-sm text-boerne-dark-gray mb-3">
                  <strong>Boerne's oldest tourist attraction</strong> since 1932. Only natural cave in Texas 
                  with an interior waterfall, located 3 miles southeast of town.
                </p>
                <div className="text-xs text-gray-600">
                  <strong>Distance:</strong> 3 miles southeast<br/>
                  <strong>Unique Feature:</strong> Underground waterfall
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-boerne-navy mb-3">🦴 Cibolo Nature Center</h3>
                <p className="text-sm text-boerne-dark-gray mb-3">
                  100+ acres with 6+ miles of trails through four ecosystems, featuring 
                  <strong>100-million-year-old dinosaur tracks</strong> exposed by 1997 flooding.
                </p>
                <div className="text-xs text-gray-600">
                  <strong>Address:</strong> 140 City Park Road<br/>
                  <strong>Unique Feature:</strong> Dinosaur footprints
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Economy & Living Section */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-boerne-navy mb-8">Economy & Quality of Life</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-boerne-navy mb-4">Economic Drivers</h3>
                <ul className="text-boerne-dark-gray space-y-3">
                  <li className="flex items-start">
                    <span className="text-boerne-gold mr-3">🏪</span>
                    <div>
                      <strong>Tourism & Hospitality:</strong> Historic Main Street antique shops, restaurants, and hotels draw visitors from across Texas
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-boerne-gold mr-3">🏡</span>
                    <div>
                      <strong>Residential Growth:</strong> Rapid population growth drives construction, retail, and service industries
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-boerne-gold mr-3">🚗</span>
                    <div>
                      <strong>San Antonio Proximity:</strong> Many residents commute to San Antonio, supporting a growing bedroom community
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-boerne-gold mr-3">🌿</span>
                    <div>
                      <strong>Natural Attractions:</strong> Caves, nature centers, and outdoor recreation support eco-tourism
                    </div>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-boerne-navy mb-4">Living in Boerne</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Advantages</h4>
                    <ul className="text-green-700 text-sm space-y-1">
                      <li>• Top-rated schools and family-friendly community</li>
                      <li>• Historic charm with modern amenities</li>
                      <li>• 30 minutes from San Antonio attractions</li>
                      <li>• Abundant outdoor recreation opportunities</li>
                      <li>• Low crime rates and safe neighborhoods</li>
                      <li>• Vibrant Main Street with local businesses</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">Considerations</h4>
                    <ul className="text-yellow-700 text-sm space-y-1">
                      <li>• Rapid growth may strain infrastructure</li>
                      <li>• Higher cost of living than rural areas</li>
                      <li>• Limited public transportation options</li>
                      <li>• Hot, humid summers typical of Central Texas</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section>
          <div className="bg-gradient-to-r from-boerne-navy to-boerne-light-blue rounded-lg shadow-lg p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Experience Boerne Today</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Whether you're planning a visit, considering a move, or simply want to explore one of Texas's most charming communities, 
              Boerne welcomes you with open arms and rich German heritage.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <h3 className="font-semibold mb-2">🏪 Visit Main Street</h3>
                <p className="text-sm">Explore antique shops, galleries, and restaurants in our historic downtown</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <h3 className="font-semibold mb-2">🌿 Discover Nature</h3>
                <p className="text-sm">Hike trails, explore caves, and enjoy the natural beauty of Hill Country</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <h3 className="font-semibold mb-2">🏡 Consider Moving</h3>
                <p className="text-sm">Join our growing community and experience the best of small-town Texas living</p>
              </div>
            </div>
          </div>
        </section>
        
      </div>
    </div>
    </>
  );
}