// Moving to Boerne Resource Center Data
// Real local information for people relocating to Boerne, Texas

export interface UtilityProvider {
  name: string;
  type: string;
  phone: string;
  website: string;
  notes: string;
  serviceArea?: string;
}

export interface School {
  name: string;
  type: 'elementary' | 'middle' | 'high' | 'private';
  grades: string;
  address: string;
  phone: string;
  website?: string;
  notes?: string;
}

export interface Neighborhood {
  name: string;
  slug: string;
  description: string;
  priceRange: string;
  highlights: string[];
  nearbyAmenities: string[];
}

export interface TimelinePhase {
  phase: string;
  title: string;
  timing: string;
  tasks: {
    task: string;
    description: string;
    link?: string;
  }[];
}

// =============================================================================
// UTILITY PROVIDERS
// =============================================================================

export const utilityProviders: UtilityProvider[] = [
  // Electricity
  {
    name: 'CPS Energy',
    type: 'Electricity',
    phone: '(210) 353-2222',
    website: 'https://www.cpsenergy.com',
    notes: 'Primary electric provider for Boerne and surrounding area. Start service at least 3 business days before move-in.',
    serviceArea: 'Boerne city limits and most of Kendall County'
  },
  {
    name: 'Bandera Electric Cooperative',
    type: 'Electricity',
    phone: '(830) 796-3799',
    website: 'https://www.banderaelectric.com',
    notes: 'Serves some rural areas west of Boerne',
    serviceArea: 'Western Kendall County, rural areas'
  },
  // Internet & Communications
  {
    name: 'GVTC',
    type: 'Internet',
    phone: '(800) 367-4882',
    website: 'https://www.gvtc.com',
    notes: 'Local fiber internet provider. Fastest speeds available in the area. Popular choice for home offices. Also offers phone and TV services.',
    serviceArea: 'Boerne and surrounding Hill Country communities'
  },
  {
    name: 'Spectrum',
    type: 'Internet',
    phone: '(833) 267-6094',
    website: 'https://www.spectrum.com',
    notes: 'Cable internet and TV available in some Boerne neighborhoods.',
    serviceArea: 'Select areas within Boerne city limits'
  },
  // Water
  {
    name: 'City of Boerne Utilities',
    type: 'Water',
    phone: '(830) 249-9511',
    website: 'https://www.ci.boerne.tx.us/151/Utilities',
    notes: 'Municipal water and sewer for homes within city limits. Visit City Hall to set up service.',
    serviceArea: 'Boerne city limits'
  },
  {
    name: 'Cow Creek Groundwater Conservation District',
    type: 'Water',
    phone: '(830) 816-2700',
    website: 'https://www.ccgcd.org',
    notes: 'For private well permits and groundwater information. Contact if your property has a well.',
    serviceArea: 'Kendall County'
  },
  // Gas
  {
    name: 'CenterPoint Energy',
    type: 'Natural Gas',
    phone: '(800) 752-8036',
    website: 'https://www.centerpointenergy.com',
    notes: 'Natural gas service where available. Not all Boerne areas have gas lines.',
    serviceArea: 'Limited areas within Boerne'
  },
  // Trash & Recycling
  {
    name: 'City of Boerne Solid Waste',
    type: 'Trash',
    phone: '(830) 249-9511',
    website: 'https://www.ci.boerne.tx.us/148/Trash-Recycling',
    notes: 'Curbside trash and recycling pickup included for city residents.',
    serviceArea: 'Boerne city limits'
  },
  {
    name: 'Republic Services',
    type: 'Trash',
    phone: '(830) 249-8681',
    website: 'https://www.republicservices.com',
    notes: 'Private trash service for areas outside city limits.',
    serviceArea: 'Unincorporated Kendall County'
  }
];

// =============================================================================
// BOERNE ISD SCHOOLS
// =============================================================================

export const boerneISDSchools: School[] = [
  // Elementary Schools
  {
    name: 'Boerne Elementary',
    type: 'elementary',
    grades: 'K-5',
    address: '235 Adler Rd, Boerne, TX 78006',
    phone: '(830) 357-2650',
    notes: 'Historic campus near downtown Boerne'
  },
  {
    name: 'Fabra Elementary',
    type: 'elementary',
    grades: 'K-5',
    address: '229 Fabra St, Boerne, TX 78006',
    phone: '(830) 357-2550'
  },
  {
    name: 'Herff Elementary',
    type: 'elementary',
    grades: 'K-5',
    address: '140 Ammann Rd, Boerne, TX 78015',
    phone: '(830) 357-2570'
  },
  {
    name: 'Kendall Elementary',
    type: 'elementary',
    grades: 'K-5',
    address: '228 Adler Rd, Boerne, TX 78006',
    phone: '(830) 357-2500'
  },
  {
    name: 'Van Raub Elementary',
    type: 'elementary',
    grades: 'K-5',
    address: '8925 Dietz Elkhorn, Fair Oaks Ranch, TX 78015',
    phone: '(830) 357-2580'
  },
  {
    name: 'Currey Creek Elementary',
    type: 'elementary',
    grades: 'K-5',
    address: '311 Ammann Rd, Boerne, TX 78015',
    phone: '(830) 357-2590'
  },
  // Middle Schools
  {
    name: 'Boerne Middle School North',
    type: 'middle',
    grades: '6-8',
    address: '1000 River Rd, Boerne, TX 78006',
    phone: '(830) 357-2340'
  },
  {
    name: 'Boerne Middle School South',
    type: 'middle',
    grades: '6-8',
    address: '32555 Interstate 10 W, Boerne, TX 78006',
    phone: '(830) 357-2360'
  },
  // High Schools
  {
    name: 'Boerne High School',
    type: 'high',
    grades: '9-12',
    address: '1 Greyhound Ln, Boerne, TX 78006',
    phone: '(830) 357-2000',
    notes: 'Home of the Greyhounds. Texas state champion athletics programs.'
  },
  {
    name: 'Samuel V. Champion High School',
    type: 'high',
    grades: '9-12',
    address: '32250 IH-10 West, Boerne, TX 78006',
    phone: '(830) 357-2200',
    notes: 'Newer campus serving the southern portion of the district'
  }
];

export const privateSchools: School[] = [
  {
    name: 'St. Helena Catholic School',
    type: 'private',
    grades: 'PreK-8',
    address: '211 S. Main St, Boerne, TX 78006',
    phone: '(830) 249-3651',
    website: 'https://www.shcstx.org'
  },
  {
    name: 'Geneva School of Boerne',
    type: 'private',
    grades: 'K-12',
    address: '113 Scenic Loop Rd, Boerne, TX 78006',
    phone: '(830) 755-6292',
    website: 'https://www.genevaboerne.org',
    notes: 'Classical Christian education'
  }
];

// =============================================================================
// NEIGHBORHOODS & AREAS
// =============================================================================

export const neighborhoods: Neighborhood[] = [
  {
    name: 'Downtown Boerne',
    slug: 'downtown-boerne',
    description: 'Historic Main Street area with walkable shops, restaurants, and Hill Country charm. Perfect for those who want small-town Texas character and easy access to local events.',
    priceRange: '$400K - $800K+',
    highlights: [
      'Walking distance to Main Street shops and dining',
      'Historic architecture and tree-lined streets',
      'Close to Cibolo Creek Nature Center',
      'Active community events year-round'
    ],
    nearbyAmenities: ['HEB', 'Boerne Library', 'Main Street shops', 'Cibolo Creek']
  },
  {
    name: 'Fair Oaks Ranch',
    slug: 'fair-oaks-ranch',
    description: 'Established golf course community with resort-style amenities. Known for excellent schools, low crime, and a strong sense of community. Popular with families and retirees.',
    priceRange: '$450K - $1.5M+',
    highlights: [
      'Two 18-hole golf courses',
      'Community pools and fitness center',
      'Excellent Boerne ISD schools',
      'Gated sections available',
      'Strong HOA maintenance'
    ],
    nearbyAmenities: ['Fairway Grille', 'Community pools', 'Tennis courts', 'HEB Plus']
  },
  {
    name: 'Cordillera Ranch',
    slug: 'cordillera-ranch',
    description: 'Premier luxury master-planned community featuring a Jack Nicklaus golf course, club amenities, and stunning Hill Country views. Texas Hill Country living at its finest.',
    priceRange: '$700K - $5M+',
    highlights: [
      'Jack Nicklaus Signature Golf Course',
      'The Clubs of Cordillera Ranch',
      'Swimming, tennis, fitness facilities',
      'Gated community with security',
      'Hill Country views and acreage lots'
    ],
    nearbyAmenities: ['The Lodge at Cordillera', 'Spa and fitness', 'Fine dining']
  },
  {
    name: 'Tapatio Springs',
    slug: 'tapatio-springs',
    description: 'Golf resort community along Frederick Creek offering a mix of home styles from garden homes to custom estates. Beautiful mature landscaping and relaxed atmosphere.',
    priceRange: '$350K - $1M+',
    highlights: [
      'Resort-style golf course',
      'Mature trees and landscaping',
      'Swimming pool and clubhouse',
      'Mix of home sizes and styles',
      'Close to Johns Road corridor'
    ],
    nearbyAmenities: ['Tapatio Springs Resort', 'HEB', 'I-10 access']
  },
  {
    name: 'Esperanza',
    slug: 'esperanza',
    description: 'Newer master-planned community on the southwest side of Boerne featuring modern homes, community amenities, and easy Hill Country access.',
    priceRange: '$400K - $900K',
    highlights: [
      'Newer construction homes',
      'Community pool and parks',
      'Walking trails',
      'Growing commercial nearby',
      'Champion High School district'
    ],
    nearbyAmenities: ['Future retail development', 'I-10 access', 'Parks']
  },
  {
    name: 'The Dominion',
    slug: 'the-dominion',
    description: 'Exclusive gated community straddling the Boerne/San Antonio line. Known for celebrity residents, PGA golf course, and ultra-luxury homes.',
    priceRange: '$1M - $10M+',
    highlights: [
      'PGA Tour-caliber golf course',
      '24/7 guarded gates',
      'Celebrity and executive homes',
      'World-class amenities',
      'Close to La Cantera shopping'
    ],
    nearbyAmenities: ['La Cantera', 'The Rim', 'UTSA']
  },
  {
    name: 'River Road Corridor',
    slug: 'river-road',
    description: 'Scenic area along Cibolo Creek featuring a mix of established homes, acreage properties, and proximity to nature trails. Popular with outdoor enthusiasts.',
    priceRange: '$500K - $1.5M+',
    highlights: [
      'Cibolo Creek access',
      'Mature oak trees',
      'Larger lots available',
      'Near Guadalupe River State Park',
      'Rural feel close to town'
    ],
    nearbyAmenities: ['Cibolo Nature Center', 'Kayaking', 'State parks']
  }
];

// =============================================================================
// MOVING TIMELINE
// =============================================================================

export const movingTimeline: TimelinePhase[] = [
  {
    phase: 'before',
    title: 'Before You Move',
    timing: '2-4 weeks before',
    tasks: [
      {
        task: 'Set up utilities',
        description: 'Contact CPS Energy, GVTC, and city water at least 1 week before move-in. Some services require 3+ business days.',
        link: '#utilities'
      },
      {
        task: 'Research school zones',
        description: 'Verify which Boerne ISD schools serve your address. Request enrollment packets early.',
        link: '#schools'
      },
      {
        task: 'Update address',
        description: 'File change of address with USPS, update driver\'s license within 30 days of moving to Texas.',
      },
      {
        task: 'Schedule movers',
        description: 'Book moving company 2-4 weeks ahead, especially during summer months.',
        link: '/services/specialty/moving'
      },
      {
        task: 'Plan home inspection repairs',
        description: 'Address any issues from your home inspection before move-in if possible.',
        link: '/services/home/home-inspections'
      }
    ]
  },
  {
    phase: 'during',
    title: 'Moving Week',
    timing: 'Week of your move',
    tasks: [
      {
        task: 'Verify utilities are active',
        description: 'Confirm electricity, water, and internet are working before movers arrive.',
      },
      {
        task: 'Change locks',
        description: 'One of the first things to do - you don\'t know who has copies of the old keys.',
        link: '/services/home/locksmith'
      },
      {
        task: 'Check HVAC',
        description: 'Make sure AC/heating is working. Texas summers require functioning air conditioning.',
        link: '/services/home/hvac'
      },
      {
        task: 'Test smoke detectors',
        description: 'Replace batteries in all smoke and carbon monoxide detectors.',
      },
      {
        task: 'Locate shutoffs',
        description: 'Find your main water shutoff, electrical panel, and gas shutoff (if applicable).',
      }
    ]
  },
  {
    phase: 'after',
    title: 'First 30 Days',
    timing: 'After you\'re settled',
    tasks: [
      {
        task: 'Register vehicle & license',
        description: 'Texas requires vehicle registration and driver\'s license update within 30 days.',
      },
      {
        task: 'File homestead exemption',
        description: 'File with Kendall County Appraisal District to reduce property taxes. Worth $100,000+ off taxable value.',
        link: '/guides/texas-homeowner-tips'
      },
      {
        task: 'Set up Home Tracker',
        description: 'Get personalized maintenance reminders for your new home and Hill Country conditions.',
        link: '/my-home'
      },
      {
        task: 'Find your service providers',
        description: 'Establish relationships with local HVAC, plumbing, and handyman services before you need them.',
        link: '/services'
      },
      {
        task: 'Explore the area',
        description: 'Visit downtown Main Street, Cibolo Nature Center, and local restaurants. You\'re a Boernite now!',
      }
    ]
  }
];

// =============================================================================
// LOCAL ESSENTIALS
// =============================================================================

export const localEssentials = {
  emergencyNumbers: {
    emergency: '911',
    boernePolice: '(830) 249-8645',
    kendallCountySheriff: '(830) 249-9721',
    boerneFire: '(830) 249-2731',
    cpsEnergyOutages: '(210) 353-4357',
    poisonControl: '1-800-222-1222'
  },
  hospitals: [
    {
      name: 'Methodist Hospital Hill Country',
      address: '1001 River Rd, Boerne, TX 78006',
      phone: '(830) 431-7000',
      type: 'Full-service hospital'
    }
  ],
  shoppingEssentials: [
    { name: 'HEB Plus', address: '605 N Main St' },
    { name: 'HEB', address: '1381 S Main St' },
    { name: 'Walmart Supercenter', address: '1381 S Main St' },
    { name: 'Lowe\'s', address: '31014 I-10 Frontage Rd' },
    { name: 'Home Depot', address: 'Fair Oaks Pkwy (nearby)' }
  ],
  climate: {
    overview: 'Boerne enjoys a humid subtropical climate with hot summers and mild winters.',
    summerHighs: '95-100°F (May-September)',
    winterLows: '30-40°F (December-February)',
    rainfall: '32 inches annually, heaviest in May-June',
    keyWeatherNotes: [
      'Air conditioning is essential May through September',
      'Occasional freezes require pipe protection in winter',
      'Spring brings potential for severe storms and hail',
      'Fall is the most pleasant season in the Hill Country'
    ]
  }
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export const getUtilitiesByType = (type: string): UtilityProvider[] => {
  return utilityProviders.filter(u => u.type === type);
};

export const getSchoolsByType = (type: 'elementary' | 'middle' | 'high' | 'private'): School[] => {
  if (type === 'private') return privateSchools;
  return boerneISDSchools.filter(s => s.type === type);
};

export const getNeighborhoodBySlug = (slug: string): Neighborhood | undefined => {
  return neighborhoods.find(n => n.slug === slug);
};

export const getTimelinePhase = (phase: string): TimelinePhase | undefined => {
  return movingTimeline.find(t => t.phase === phase);
};
