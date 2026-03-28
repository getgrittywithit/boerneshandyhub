// Subcategory SEO data for Boerne's Handy Hub

export interface SubcategoryPage {
  category: string;
  subcategory: string;
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  h1: string;
  intro: string;
}

export const subcategoryPages: SubcategoryPage[] = [
  // Plumbing subcategories
  {
    category: 'plumbing',
    subcategory: 'Water Heaters',
    slug: 'water-heaters',
    title: 'Water Heater Installation & Repair in Boerne TX',
    description: 'Expert water heater installation, repair, and replacement services in Boerne. Tank and tankless options. Same-day service available from licensed plumbers.',
    keywords: ['water heater installation boerne', 'water heater repair', 'tankless water heater', 'hot water heater boerne tx'],
    h1: 'Water Heater Services in Boerne',
    intro: 'Need a new water heater or repair for your existing unit? Our licensed Boerne plumbers specialize in tank and tankless water heater installation, repair, and maintenance.',
  },
  {
    category: 'plumbing',
    subcategory: 'Drain Cleaning',
    slug: 'drain-cleaning',
    title: 'Drain Cleaning Services in Boerne TX | Clogged Drain Repair',
    description: 'Professional drain cleaning in Boerne, TX. Fast response for clogged drains, sewer line cleaning, and hydro jetting. Licensed plumbers serving the Hill Country.',
    keywords: ['drain cleaning boerne', 'clogged drain', 'sewer cleaning', 'hydro jetting boerne tx'],
    h1: 'Drain Cleaning Services in Boerne',
    intro: 'Dealing with slow or clogged drains? Our Boerne drain cleaning experts use advanced equipment including camera inspection and hydro jetting to clear any blockage.',
  },
  {
    category: 'plumbing',
    subcategory: 'Leak Repair',
    slug: 'leak-repair',
    title: 'Leak Detection & Repair in Boerne TX | Emergency Plumber',
    description: 'Fast leak detection and repair services in Boerne. 24/7 emergency plumbing for water leaks, pipe repairs, and slab leaks. Licensed and insured.',
    keywords: ['leak repair boerne', 'water leak detection', 'emergency plumber boerne', 'pipe leak repair'],
    h1: 'Leak Detection & Repair in Boerne',
    intro: 'Water leaks can cause serious damage to your home. Our Boerne plumbers provide fast, accurate leak detection and repair services to protect your property.',
  },

  // HVAC subcategories
  {
    category: 'hvac',
    subcategory: 'AC Repair',
    slug: 'ac-repair',
    title: 'AC Repair in Boerne TX | Same Day Air Conditioning Service',
    description: 'Fast AC repair in Boerne, TX. Same-day service for all air conditioning problems. Licensed HVAC technicians serving Boerne and the Hill Country.',
    keywords: ['ac repair boerne', 'air conditioning repair', 'hvac repair boerne tx', 'ac not working'],
    h1: 'AC Repair Services in Boerne',
    intro: 'When your AC breaks down in the Texas heat, you need fast, reliable repair. Our Boerne HVAC technicians provide same-day AC repair service to keep you cool.',
  },
  {
    category: 'hvac',
    subcategory: 'Heating Repair',
    slug: 'heating-repair',
    title: 'Heating Repair in Boerne TX | Furnace & Heat Pump Service',
    description: 'Expert heating repair in Boerne. Furnace repair, heat pump service, and emergency heating solutions. Licensed HVAC contractors serving the Hill Country.',
    keywords: ['heating repair boerne', 'furnace repair', 'heat pump repair boerne tx', 'heater not working'],
    h1: 'Heating Repair Services in Boerne',
    intro: 'Hill Country winters can get cold! Our Boerne heating experts repair furnaces, heat pumps, and all heating systems to keep your home warm and comfortable.',
  },

  // Electrical subcategories
  {
    category: 'electrical',
    subcategory: 'Panel Upgrades',
    slug: 'panel-upgrades',
    title: 'Electrical Panel Upgrades in Boerne TX | Service Panel Installation',
    description: 'Professional electrical panel upgrades in Boerne. Upgrade to 200 amp service, replace outdated panels, and improve electrical safety. Licensed electricians.',
    keywords: ['electrical panel upgrade boerne', 'service panel replacement', '200 amp upgrade', 'breaker panel boerne tx'],
    h1: 'Electrical Panel Upgrades in Boerne',
    intro: 'Is your electrical panel outdated or unable to handle modern demands? Our Boerne electricians specialize in safe, code-compliant panel upgrades.',
  },
  {
    category: 'electrical',
    subcategory: 'Lighting Installation',
    slug: 'lighting',
    title: 'Lighting Installation in Boerne TX | Indoor & Outdoor Lighting',
    description: 'Professional lighting installation in Boerne. Recessed lighting, landscape lighting, LED upgrades, and custom lighting design. Licensed electricians.',
    keywords: ['lighting installation boerne', 'recessed lighting', 'outdoor lighting boerne tx', 'led lighting upgrade'],
    h1: 'Lighting Installation Services in Boerne',
    intro: 'Transform your home with professional lighting. Our Boerne electricians install recessed lights, landscape lighting, ceiling fans, and more.',
  },

  // Roofing subcategories
  {
    category: 'roofing',
    subcategory: 'Roof Repair',
    slug: 'roof-repair',
    title: 'Roof Repair in Boerne TX | Leak Repair & Storm Damage',
    description: 'Expert roof repair in Boerne. Fix roof leaks, storm damage, missing shingles, and more. Free inspections. Licensed and insured roofers.',
    keywords: ['roof repair boerne', 'roof leak repair', 'storm damage repair boerne tx', 'shingle repair'],
    h1: 'Roof Repair Services in Boerne',
    intro: 'From minor leaks to major storm damage, our Boerne roofing experts provide fast, reliable roof repairs to protect your home and family.',
  },
  {
    category: 'roofing',
    subcategory: 'Roof Replacement',
    slug: 'roof-replacement',
    title: 'Roof Replacement in Boerne TX | New Roof Installation',
    description: 'Complete roof replacement services in Boerne. Shingle, metal, and tile roofing options. Insurance claim assistance. Free estimates from licensed roofers.',
    keywords: ['roof replacement boerne', 'new roof installation', 'roofing contractor boerne tx', 'metal roof'],
    h1: 'Roof Replacement in Boerne',
    intro: 'Time for a new roof? Our Boerne roofing contractors install quality shingle, metal, and tile roofs with excellent warranties and workmanship.',
  },

  // Landscaping subcategories
  {
    category: 'landscaping',
    subcategory: 'Lawn Care',
    slug: 'lawn-care',
    title: 'Lawn Care Services in Boerne TX | Mowing & Maintenance',
    description: 'Professional lawn care in Boerne. Weekly mowing, fertilization, weed control, and seasonal maintenance. Keep your yard looking great year-round.',
    keywords: ['lawn care boerne', 'lawn mowing service', 'yard maintenance boerne tx', 'lawn treatment'],
    h1: 'Lawn Care Services in Boerne',
    intro: 'Keep your lawn healthy and beautiful with professional lawn care. Our Boerne landscapers provide mowing, fertilization, and year-round maintenance.',
  },
  {
    category: 'landscaping',
    subcategory: 'Tree Service',
    slug: 'tree-services',
    title: 'Tree Service in Boerne TX | Tree Trimming & Removal',
    description: 'Professional tree service in Boerne. Tree trimming, tree removal, stump grinding, and emergency storm cleanup. ISA certified arborists available.',
    keywords: ['tree service boerne', 'tree trimming', 'tree removal boerne tx', 'stump grinding'],
    h1: 'Tree Services in Boerne',
    intro: 'From trimming to removal, our Boerne tree service experts handle all your tree care needs. ISA certified arborists ensure your trees stay healthy.',
  },

  // Auto Repair subcategories
  {
    category: 'mechanic',
    subcategory: 'Brake Service',
    slug: 'brake-service',
    title: 'Brake Repair in Boerne TX | Brake Pads, Rotors & Service',
    description: 'Expert brake repair in Boerne. Brake pad replacement, rotor resurfacing, brake fluid flush, and complete brake service. ASE certified mechanics.',
    keywords: ['brake repair boerne', 'brake pads replacement', 'brake service boerne tx', 'brake rotors'],
    h1: 'Brake Repair & Service in Boerne',
    intro: 'Your safety depends on reliable brakes. Our Boerne auto repair shops provide comprehensive brake inspection, repair, and replacement services.',
  },
  {
    category: 'mechanic',
    subcategory: 'Oil Change',
    slug: 'oil-change',
    title: 'Oil Change in Boerne TX | Quick Lube & Fluid Services',
    description: 'Fast oil change service in Boerne. Conventional, synthetic, and high-mileage oil options. Quick lube services including filter replacement.',
    keywords: ['oil change boerne', 'quick lube', 'synthetic oil change boerne tx', 'oil change near me'],
    h1: 'Oil Change Services in Boerne',
    intro: 'Keep your engine running smoothly with regular oil changes. Our Boerne mechanics offer quick, affordable oil change services with quality filters and oils.',
  },

  // Pest Control subcategories
  {
    category: 'pest-control',
    subcategory: 'Termite Treatment',
    slug: 'termite',
    title: 'Termite Treatment in Boerne TX | Termite Inspection & Control',
    description: 'Professional termite treatment in Boerne. Free termite inspections, treatment options, and prevention. Protect your home from termite damage.',
    keywords: ['termite treatment boerne', 'termite inspection', 'termite control boerne tx', 'termite exterminator'],
    h1: 'Termite Treatment & Control in Boerne',
    intro: 'Termites cause billions in damage annually. Our Boerne pest control experts provide thorough inspections and effective treatment to protect your home.',
  },

  // Cleaning subcategories
  {
    category: 'cleaning',
    subcategory: 'Deep Cleaning',
    slug: 'deep-cleaning',
    title: 'Deep Cleaning Services in Boerne TX | Thorough House Cleaning',
    description: 'Professional deep cleaning in Boerne. Thorough cleaning of every room including baseboards, appliances, and hard-to-reach areas. Eco-friendly options.',
    keywords: ['deep cleaning boerne', 'thorough house cleaning', 'spring cleaning boerne tx', 'detailed cleaning'],
    h1: 'Deep Cleaning Services in Boerne',
    intro: 'Sometimes your home needs more than a regular cleaning. Our Boerne cleaning professionals provide thorough deep cleaning to refresh your entire home.',
  },
];

export const getSubcategoryPage = (categorySlug: string, subcategorySlug: string): SubcategoryPage | undefined => {
  return subcategoryPages.find(
    page => page.category === categorySlug && page.slug === subcategorySlug
  );
};

export const getSubcategoriesForCategory = (categorySlug: string): SubcategoryPage[] => {
  return subcategoryPages.filter(page => page.category === categorySlug);
};

// All slugs for generateStaticParams
export const getAllSubcategorySlugs = (): { category: string; slug: string }[] => {
  return subcategoryPages.map(page => ({
    category: page.category,
    slug: page.slug,
  }));
};
