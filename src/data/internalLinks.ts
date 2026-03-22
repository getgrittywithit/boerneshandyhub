// Internal Linking Strategy for Boerne's Handy Hub
// Maps relationships between pages for SEO cross-linking

export interface RelatedGuide {
  slug: string;
  title: string;
  excerpt: string;
}

export interface RelatedCategory {
  slug: string;
  name: string;
  icon: string;
}

// Maps service categories to relevant guides
export const categoryToGuides: Record<string, string[]> = {
  'plumbing': ['emergency-plumber-boerne', 'hiring-contractor-texas', 'home-maintenance-schedule', 'handyman-vs-contractor'],
  'hvac': ['hvac-maintenance-checklist', 'home-maintenance-schedule', 'hiring-contractor-texas', 'diy-vs-professional'],
  'electrical': ['hiring-contractor-texas', 'home-maintenance-schedule', 'diy-vs-professional', 'handyman-vs-contractor'],
  'roofing': ['roof-inspection-guide', 'hiring-contractor-texas', 'diy-vs-professional'],
  'landscaping': ['pest-prevention-tips', 'pool-winterization', 'home-maintenance-schedule'],
  'pest-control': ['pest-prevention-tips', 'home-maintenance-schedule'],
  'pool-spa': ['pool-winterization', 'home-maintenance-schedule'],
  'handyman': ['handyman-vs-contractor', 'diy-vs-professional', 'home-maintenance-schedule', 'hiring-contractor-texas'],
  'contractors': ['hiring-contractor-texas', 'handyman-vs-contractor', 'diy-vs-professional', 'roof-inspection-guide'],
  'cleaning': ['home-maintenance-schedule'],
  'auto-repair': [],
  'auto-detailing': [],
  'veterinarians': ['choosing-veterinarian'],
  'pet-grooming': ['choosing-veterinarian'],
  'pet-boarding': ['choosing-veterinarian'],
  'pet-sitting': ['choosing-veterinarian'],
  'it-services': [],
  'accounting': [],
  'remodeling': ['hiring-contractor-texas', 'handyman-vs-contractor', 'diy-vs-professional'],
};

// Maps guides to related guides (for "You might also like" sections)
export const guideToRelatedGuides: Record<string, string[]> = {
  'emergency-plumber-boerne': ['hiring-contractor-texas', 'home-maintenance-schedule', 'diy-vs-professional'],
  'hvac-maintenance-checklist': ['home-maintenance-schedule', 'hiring-contractor-texas', 'diy-vs-professional'],
  'hiring-contractor-texas': ['handyman-vs-contractor', 'diy-vs-professional', 'roof-inspection-guide'],
  'roof-inspection-guide': ['hiring-contractor-texas', 'home-maintenance-schedule', 'diy-vs-professional'],
  'pest-prevention-tips': ['home-maintenance-schedule', 'pool-winterization'],
  'pool-winterization': ['home-maintenance-schedule', 'pest-prevention-tips'],
  'choosing-veterinarian': [],
  'home-maintenance-schedule': ['hvac-maintenance-checklist', 'pest-prevention-tips', 'roof-inspection-guide'],
  'handyman-vs-contractor': ['diy-vs-professional', 'hiring-contractor-texas'],
  'diy-vs-professional': ['handyman-vs-contractor', 'hiring-contractor-texas', 'home-maintenance-schedule'],
};

// Maps aggregate pages to related categories and guides
export const aggregatePageLinks: Record<string, { categories: string[]; guides: string[] }> = {
  'emergency-services': {
    categories: ['plumbing', 'electrical', 'hvac', 'roofing'],
    guides: ['emergency-plumber-boerne', 'home-maintenance-schedule'],
  },
  'licensed-contractors': {
    categories: ['contractors', 'roofing', 'electrical', 'plumbing', 'hvac'],
    guides: ['hiring-contractor-texas', 'handyman-vs-contractor', 'diy-vs-professional'],
  },
  'top-rated': {
    categories: ['plumbing', 'hvac', 'electrical', 'handyman', 'landscaping'],
    guides: ['hiring-contractor-texas'],
  },
  'new-homeowner': {
    categories: ['handyman', 'hvac', 'plumbing', 'landscaping', 'pest-control'],
    guides: ['home-maintenance-schedule', 'hvac-maintenance-checklist', 'pest-prevention-tips', 'choosing-veterinarian'],
  },
  'senior-services': {
    categories: ['handyman', 'hvac', 'plumbing', 'cleaning', 'landscaping'],
    guides: ['home-maintenance-schedule', 'hiring-contractor-texas'],
  },
};

// Maps subcategories to related subcategories within the same parent category
export const relatedSubcategories: Record<string, string[]> = {
  // Plumbing
  'water-heaters': ['leak-repair', 'drain-cleaning'],
  'drain-cleaning': ['leak-repair', 'water-heaters'],
  'leak-repair': ['water-heaters', 'drain-cleaning'],
  // HVAC
  'ac-repair': ['heating-repair'],
  'heating-repair': ['ac-repair'],
  // Electrical
  'panel-upgrades': ['lighting'],
  'lighting': ['panel-upgrades'],
  // Roofing
  'roof-repair': ['roof-replacement'],
  'roof-replacement': ['roof-repair'],
  // Landscaping
  'lawn-care': ['tree-services'],
  'tree-services': ['lawn-care'],
  // Auto
  'brake-service': ['oil-change'],
  'oil-change': ['brake-service'],
  // Pest Control
  'termite': [],
  // Cleaning
  'deep-cleaning': [],
};

// Cross-category relationships (related services from different categories)
export const crossCategoryRelations: Record<string, string[]> = {
  'plumbing': ['hvac', 'handyman', 'contractors'],
  'hvac': ['electrical', 'plumbing', 'handyman'],
  'electrical': ['hvac', 'handyman', 'contractors'],
  'roofing': ['contractors', 'handyman'],
  'landscaping': ['pool-spa', 'pest-control', 'handyman'],
  'pest-control': ['landscaping', 'cleaning'],
  'pool-spa': ['landscaping', 'handyman'],
  'handyman': ['plumbing', 'electrical', 'contractors'],
  'contractors': ['roofing', 'electrical', 'plumbing', 'remodeling'],
  'cleaning': ['handyman', 'pest-control'],
  'auto-repair': ['auto-detailing'],
  'auto-detailing': ['auto-repair'],
  'veterinarians': ['pet-grooming', 'pet-boarding', 'pet-sitting'],
  'pet-grooming': ['veterinarians', 'pet-boarding', 'pet-sitting'],
  'pet-boarding': ['veterinarians', 'pet-grooming', 'pet-sitting'],
  'pet-sitting': ['veterinarians', 'pet-grooming', 'pet-boarding'],
  'it-services': ['accounting'],
  'accounting': ['it-services'],
  'remodeling': ['contractors', 'electrical', 'plumbing'],
};

// Helper functions
export function getGuidesForCategory(categorySlug: string): string[] {
  return categoryToGuides[categorySlug] || [];
}

export function getRelatedGuides(guideSlug: string): string[] {
  return guideToRelatedGuides[guideSlug] || [];
}

export function getRelatedSubcategories(subcategorySlug: string): string[] {
  return relatedSubcategories[subcategorySlug] || [];
}

export function getRelatedCategories(categorySlug: string): string[] {
  return crossCategoryRelations[categorySlug] || [];
}

export function getAggregatePageLinks(pageSlug: string): { categories: string[]; guides: string[] } {
  return aggregatePageLinks[pageSlug] || { categories: [], guides: [] };
}
