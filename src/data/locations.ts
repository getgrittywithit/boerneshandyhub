// Location data for Boerne's Handy Hub SEO pages

export interface Location {
  id: string;
  name: string;
  slug: string;
  county: string;
  state: string;
  zipCodes: string[];
  description: string;
  population?: number;
  nearbyAreas: string[];
}

export const locations: Location[] = [
  {
    id: 'boerne',
    name: 'Boerne',
    slug: 'boerne',
    county: 'Kendall',
    state: 'TX',
    zipCodes: ['78006', '78015'],
    description: 'The heart of the Texas Hill Country, Boerne offers small-town charm with big-city amenities.',
    population: 20000,
    nearbyAreas: ['Fair Oaks Ranch', 'Leon Springs', 'Comfort'],
  },
  {
    id: 'fair-oaks-ranch',
    name: 'Fair Oaks Ranch',
    slug: 'fair-oaks-ranch',
    county: 'Bexar',
    state: 'TX',
    zipCodes: ['78015'],
    description: 'An upscale community nestled between Boerne and San Antonio with beautiful Hill Country views.',
    population: 12000,
    nearbyAreas: ['Boerne', 'Leon Springs', 'Helotes'],
  },
  {
    id: 'helotes',
    name: 'Helotes',
    slug: 'helotes',
    county: 'Bexar',
    state: 'TX',
    zipCodes: ['78023'],
    description: 'A charming Hill Country community known for Floore Country Store and scenic landscapes.',
    population: 10000,
    nearbyAreas: ['Fair Oaks Ranch', 'Leon Springs', 'San Antonio'],
  },
  {
    id: 'leon-springs',
    name: 'Leon Springs',
    slug: 'leon-springs',
    county: 'Bexar',
    state: 'TX',
    zipCodes: ['78257'],
    description: 'A historic community along I-10 between San Antonio and Boerne with easy access to both cities.',
    population: 8000,
    nearbyAreas: ['Fair Oaks Ranch', 'Boerne', 'Helotes'],
  },
  {
    id: 'comfort',
    name: 'Comfort',
    slug: 'comfort',
    county: 'Kendall',
    state: 'TX',
    zipCodes: ['78013'],
    description: 'A historic German settlement with antique shops and Hill Country charm.',
    population: 3000,
    nearbyAreas: ['Boerne', 'Kerrville', 'Fredericksburg'],
  },
  {
    id: 'bulverde',
    name: 'Bulverde',
    slug: 'bulverde',
    county: 'Comal',
    state: 'TX',
    zipCodes: ['78163'],
    description: 'A growing Hill Country community between San Antonio and New Braunfels.',
    population: 6000,
    nearbyAreas: ['Spring Branch', 'New Braunfels', 'San Antonio'],
  },
];

// Location + Category combinations for SEO pages
export const locationCategoryPages = [
  { category: 'plumbing', location: 'boerne' },
  { category: 'plumbing', location: 'fair-oaks-ranch' },
  { category: 'hvac', location: 'boerne' },
  { category: 'hvac', location: 'leon-springs' },
  { category: 'electrical', location: 'boerne' },
  { category: 'electrical', location: 'helotes' },
  { category: 'roofing', location: 'boerne' },
  { category: 'roofing', location: 'fair-oaks-ranch' },
  { category: 'landscaping', location: 'boerne' },
  { category: 'pest-control', location: 'boerne' },
  { category: 'cleaning', location: 'boerne' },
  { category: 'pool-spa', location: 'boerne' },
  { category: 'auto-repair', location: 'boerne' },
  { category: 'auto-detailing', location: 'boerne' },
  { category: 'veterinarians', location: 'boerne' },
  { category: 'pet-grooming', location: 'boerne' },
  { category: 'it-services', location: 'boerne' },
  { category: 'accounting', location: 'boerne' },
  { category: 'contractors', location: 'boerne' },
  { category: 'handyman', location: 'boerne' },
];

export const getLocation = (slug: string): Location | undefined => {
  return locations.find(loc => loc.slug === slug);
};

export const getLocationsByCategory = (categorySlug: string): string[] => {
  return locationCategoryPages
    .filter(page => page.category === categorySlug)
    .map(page => page.location);
};
