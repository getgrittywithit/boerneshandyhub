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
  'plumbing': ['emergency-plumber-boerne', 'home-repair-costs-boerne', 'hiring-contractor-texas', 'home-maintenance-schedule'],
  'hvac': ['hvac-maintenance-checklist', 'replace-vs-repair-guide', 'home-repair-costs-boerne', 'home-maintenance-schedule'],
  'electrical': ['electrical-panel-upgrade-guide', 'hiring-contractor-texas', 'home-repair-costs-boerne', 'diy-vs-professional'],
  'roofing': ['roof-inspection-guide', 'storm-damage-repair-guide', 'replace-vs-repair-guide', 'home-repair-costs-boerne'],
  'landscaping': ['pest-prevention-tips', 'pool-winterization', 'home-maintenance-schedule', 'home-selling-preparation-checklist'],
  'pest-control': ['pest-prevention-tips', 'home-maintenance-schedule', 'new-homeowner-checklist'],
  'pool-spa': ['pool-winterization', 'home-maintenance-schedule', 'home-repair-costs-boerne'],
  'handyman': ['handyman-vs-contractor', 'diy-vs-professional', 'home-repair-costs-boerne', 'new-homeowner-checklist'],
  'contractors': ['hiring-contractor-texas', 'storm-damage-repair-guide', 'home-repair-costs-boerne', 'home-selling-preparation-checklist'],
  'cleaning': ['home-maintenance-schedule', 'home-selling-preparation-checklist', 'new-homeowner-checklist'],
  'foundation-repair': ['foundation-problems-texas', 'home-repair-costs-boerne', 'hiring-contractor-texas'],
  'septic': ['septic-system-maintenance', 'home-maintenance-schedule', 'new-homeowner-checklist'],
  'gutters': ['storm-damage-repair-guide', 'home-maintenance-schedule', 'roof-inspection-guide'],
  'painting': ['home-selling-preparation-checklist', 'diy-vs-professional', 'home-maintenance-schedule'],
  'auto-repair': [],
  'auto-detailing': [],
  'veterinarians': ['choosing-veterinarian'],
  'pet-grooming': ['choosing-veterinarian'],
  'pet-boarding': ['choosing-veterinarian'],
  'pet-sitting': ['choosing-veterinarian'],
  'it-services': [],
  'accounting': [],
  'remodeling': ['hiring-contractor-texas', 'home-selling-preparation-checklist', 'home-repair-costs-boerne', 'diy-vs-professional'],
  'locksmith': ['new-homeowner-checklist', 'home-maintenance-schedule'],
  'garage-doors': ['replace-vs-repair-guide', 'home-maintenance-schedule', 'diy-vs-professional'],
  'well-drilling': ['septic-system-maintenance', 'new-homeowner-checklist'],
};

// Maps guides to related guides (for "You might also like" sections)
export const guideToRelatedGuides: Record<string, string[]> = {
  'emergency-plumber-boerne': ['home-repair-costs-boerne', 'hiring-contractor-texas', 'home-maintenance-schedule'],
  'hvac-maintenance-checklist': ['replace-vs-repair-guide', 'home-maintenance-schedule', 'home-repair-costs-boerne'],
  'hiring-contractor-texas': ['handyman-vs-contractor', 'storm-damage-repair-guide', 'home-repair-costs-boerne'],
  'roof-inspection-guide': ['storm-damage-repair-guide', 'replace-vs-repair-guide', 'hiring-contractor-texas'],
  'pest-prevention-tips': ['home-maintenance-schedule', 'new-homeowner-checklist', 'pool-winterization'],
  'pool-winterization': ['home-maintenance-schedule', 'pest-prevention-tips', 'home-repair-costs-boerne'],
  'choosing-veterinarian': ['new-homeowner-checklist'],
  'home-maintenance-schedule': ['new-homeowner-checklist', 'hvac-maintenance-checklist', 'pest-prevention-tips'],
  'handyman-vs-contractor': ['diy-vs-professional', 'hiring-contractor-texas', 'home-repair-costs-boerne'],
  'diy-vs-professional': ['handyman-vs-contractor', 'home-repair-costs-boerne', 'home-maintenance-schedule'],
  // New guides
  'home-repair-costs-boerne': ['hiring-contractor-texas', 'replace-vs-repair-guide', 'diy-vs-professional'],
  'storm-damage-repair-guide': ['roof-inspection-guide', 'hiring-contractor-texas', 'home-repair-costs-boerne'],
  'replace-vs-repair-guide': ['home-repair-costs-boerne', 'hvac-maintenance-checklist', 'electrical-panel-upgrade-guide'],
  'new-homeowner-checklist': ['home-maintenance-schedule', 'hiring-contractor-texas', 'pest-prevention-tips'],
  'foundation-problems-texas': ['home-repair-costs-boerne', 'hiring-contractor-texas', 'new-homeowner-checklist'],
  'electrical-panel-upgrade-guide': ['replace-vs-repair-guide', 'hiring-contractor-texas', 'home-repair-costs-boerne'],
  'septic-system-maintenance': ['home-maintenance-schedule', 'new-homeowner-checklist', 'foundation-problems-texas'],
  'home-selling-preparation-checklist': ['home-repair-costs-boerne', 'hiring-contractor-texas', 'roof-inspection-guide'],
};

// Maps aggregate pages to related categories and guides
export const aggregatePageLinks: Record<string, { categories: string[]; guides: string[] }> = {
  'emergency-services': {
    categories: ['plumbing', 'electrical', 'hvac', 'roofing'],
    guides: ['emergency-plumber-boerne', 'storm-damage-repair-guide', 'home-repair-costs-boerne'],
  },
  'licensed-contractors': {
    categories: ['contractors', 'roofing', 'electrical', 'plumbing', 'hvac'],
    guides: ['hiring-contractor-texas', 'home-repair-costs-boerne', 'storm-damage-repair-guide'],
  },
  'top-rated': {
    categories: ['plumbing', 'hvac', 'electrical', 'handyman', 'landscaping'],
    guides: ['hiring-contractor-texas', 'home-repair-costs-boerne'],
  },
  'new-homeowner': {
    categories: ['handyman', 'hvac', 'plumbing', 'landscaping', 'pest-control', 'locksmith'],
    guides: ['new-homeowner-checklist', 'home-maintenance-schedule', 'pest-prevention-tips', 'hvac-maintenance-checklist'],
  },
  'senior-services': {
    categories: ['handyman', 'hvac', 'plumbing', 'cleaning', 'landscaping'],
    guides: ['home-maintenance-schedule', 'home-repair-costs-boerne', 'hiring-contractor-texas'],
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
