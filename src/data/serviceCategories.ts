// Service Categories for Boerne Handy Hub Directory

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  bucket: string;
  description: string;
  icon: string;
  subcategories: string[];
  featured?: boolean;
}

export interface ServiceBucket {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
}

export const serviceBuckets: ServiceBucket[] = [
  {
    id: 'home',
    name: 'Home',
    slug: 'home',
    description: 'Home repair, maintenance, and improvement services',
    icon: '🏠',
    color: 'bg-blue-500',
  },
  {
    id: 'auto',
    name: 'Auto',
    slug: 'auto',
    description: 'Automotive repair, maintenance, and detailing',
    icon: '🚗',
    color: 'bg-red-500',
  },
  {
    id: 'business',
    name: 'Business',
    slug: 'business',
    description: 'Professional and commercial services',
    icon: '💼',
    color: 'bg-green-500',
  },
  {
    id: 'pet',
    name: 'Pet',
    slug: 'pet',
    description: 'Pet care, grooming, and veterinary services',
    icon: '🐕',
    color: 'bg-purple-500',
  },
];

export const serviceCategories: ServiceCategory[] = [
  // HOME SERVICES
  {
    id: 'plumbing',
    name: 'Plumbing',
    slug: 'plumbing',
    bucket: 'home',
    description: 'Licensed plumbers for repairs, installations, and emergency services',
    icon: '🔧',
    subcategories: ['Drain Cleaning', 'Water Heaters', 'Leak Repair', 'Pipe Installation', 'Sewer Services', 'Fixture Installation'],
    featured: true,
  },
  {
    id: 'electrical',
    name: 'Electrical',
    slug: 'electrical',
    bucket: 'home',
    description: 'Professional electricians for residential and commercial needs',
    icon: '⚡',
    subcategories: ['Panel Upgrades', 'Lighting Installation', 'Outlet Repair', 'Ceiling Fans', 'Generator Installation', 'Electrical Inspections'],
    featured: true,
  },
  {
    id: 'hvac',
    name: 'HVAC',
    slug: 'hvac',
    bucket: 'home',
    description: 'Heating, cooling, and air quality experts',
    icon: '❄️',
    subcategories: ['AC Repair', 'Heating Repair', 'AC Installation', 'Duct Cleaning', 'Maintenance Plans', 'Indoor Air Quality'],
    featured: true,
  },
  {
    id: 'roofing',
    name: 'Roofing',
    slug: 'roofing',
    bucket: 'home',
    description: 'Roofers for repairs, replacements, and inspections',
    icon: '🏠',
    subcategories: ['Roof Repair', 'Roof Replacement', 'Gutter Installation', 'Storm Damage', 'Roof Inspections', 'Metal Roofing'],
  },
  {
    id: 'contractors',
    name: 'Contractors',
    slug: 'contractors',
    bucket: 'home',
    description: 'General contractors for remodeling, additions, and new construction',
    icon: '🔨',
    subcategories: ['Kitchen Remodeling', 'Bathroom Remodeling', 'Room Additions', 'Home Renovation', 'Deck Building', 'New Construction'],
    featured: true,
  },
  {
    id: 'landscaping',
    name: 'Landscaping',
    slug: 'landscaping',
    bucket: 'home',
    description: 'Lawn care, tree services, and outdoor design',
    icon: '🌳',
    subcategories: ['Lawn Care', 'Tree Service', 'Irrigation Systems', 'Landscape Design', 'Hardscaping', 'Seasonal Maintenance'],
  },
  {
    id: 'cleaning',
    name: 'Cleaning',
    slug: 'cleaning',
    bucket: 'home',
    description: 'House cleaning, pressure washing, and specialized cleaning services',
    icon: '🧹',
    subcategories: ['House Cleaning', 'Pressure Washing', 'Window Cleaning', 'Deep Cleaning', 'Move-In/Out Cleaning', 'Carpet Cleaning'],
  },
  {
    id: 'pest-control',
    name: 'Pest Control',
    slug: 'pest-control',
    bucket: 'home',
    description: 'Exterminators and wildlife removal services',
    icon: '🐜',
    subcategories: ['General Pest Control', 'Termite Treatment', 'Rodent Control', 'Wildlife Removal', 'Bee Removal', 'Mosquito Control'],
  },
  {
    id: 'handyman',
    name: 'Handyman',
    slug: 'handyman',
    bucket: 'home',
    description: 'General repairs, odd jobs, and home maintenance',
    icon: '🛠️',
    subcategories: ['General Repairs', 'Furniture Assembly', 'Drywall Repair', 'Painting', 'Door Installation', 'Minor Plumbing & Electrical'],
  },
  {
    id: 'pool-spa',
    name: 'Pool & Spa',
    slug: 'pool-spa',
    bucket: 'home',
    description: 'Pool cleaning, repair, and installation services',
    icon: '🏊',
    subcategories: ['Pool Cleaning', 'Pool Repair', 'Pool Installation', 'Spa Services', 'Equipment Repair', 'Pool Remodeling'],
  },

  // AUTO SERVICES
  {
    id: 'auto-repair',
    name: 'Auto Repair',
    slug: 'auto-repair',
    bucket: 'auto',
    description: 'General mechanics and automotive repair shops',
    icon: '🔧',
    subcategories: ['Engine Repair', 'Brake Service', 'Diagnostics', 'Tune-Ups', 'Suspension', 'Exhaust Systems'],
    featured: true,
  },
  {
    id: 'body-shops',
    name: 'Body Shops',
    slug: 'body-shops',
    bucket: 'auto',
    description: 'Collision repair and auto body work',
    icon: '🚗',
    subcategories: ['Collision Repair', 'Dent Removal', 'Paint Jobs', 'Frame Repair', 'Insurance Claims'],
  },
  {
    id: 'oil-change',
    name: 'Oil Change & Lube',
    slug: 'oil-change',
    bucket: 'auto',
    description: 'Quick oil changes and fluid services',
    icon: '🛢️',
    subcategories: ['Oil Change', 'Fluid Top-Off', 'Filter Replacement', 'Fluid Flush'],
  },
  {
    id: 'tires',
    name: 'Tire Shops',
    slug: 'tires',
    bucket: 'auto',
    description: 'Tire sales, installation, and repair',
    icon: '⭕',
    subcategories: ['Tire Sales', 'Tire Installation', 'Tire Rotation', 'Flat Repair', 'Wheel Alignment', 'Balancing'],
  },
  {
    id: 'auto-detailing',
    name: 'Auto Detailing',
    slug: 'auto-detailing',
    bucket: 'auto',
    description: 'Professional car cleaning and detailing',
    icon: '✨',
    subcategories: ['Interior Detailing', 'Exterior Detailing', 'Ceramic Coating', 'Paint Correction', 'Mobile Detailing'],
  },
  {
    id: 'towing',
    name: 'Towing',
    slug: 'towing',
    bucket: 'auto',
    description: 'Towing and roadside assistance',
    icon: '🚚',
    subcategories: ['Emergency Towing', 'Flatbed Towing', 'Roadside Assistance', 'Jump Starts', 'Lockout Service'],
  },
  {
    id: 'auto-glass',
    name: 'Auto Glass',
    slug: 'auto-glass',
    bucket: 'auto',
    description: 'Windshield repair and replacement',
    icon: '🪟',
    subcategories: ['Windshield Repair', 'Windshield Replacement', 'Side Windows', 'Rear Windows'],
  },
  {
    id: 'transmission',
    name: 'Transmission',
    slug: 'transmission',
    bucket: 'auto',
    description: 'Transmission repair and service specialists',
    icon: '⚙️',
    subcategories: ['Transmission Repair', 'Transmission Rebuild', 'Fluid Service', 'Clutch Repair'],
  },
  {
    id: 'car-wash',
    name: 'Car Wash',
    slug: 'car-wash',
    bucket: 'auto',
    description: 'Car wash services',
    icon: '🧼',
    subcategories: ['Full Service Wash', 'Self-Service', 'Express Wash', 'Hand Wash'],
  },

  // BUSINESS SERVICES
  {
    id: 'it-services',
    name: 'IT & Computer',
    slug: 'it-services',
    bucket: 'business',
    description: 'IT support, computer repair, and tech services',
    icon: '💻',
    subcategories: ['Computer Repair', 'Network Setup', 'IT Support', 'Data Recovery', 'Cybersecurity', 'Cloud Services'],
    featured: true,
  },
  {
    id: 'accounting',
    name: 'Accounting',
    slug: 'accounting',
    bucket: 'business',
    description: 'Bookkeeping, tax preparation, and accounting services',
    icon: '📊',
    subcategories: ['Bookkeeping', 'Tax Preparation', 'Payroll', 'Financial Planning', 'Business Consulting'],
  },
  {
    id: 'legal',
    name: 'Legal Services',
    slug: 'legal',
    bucket: 'business',
    description: 'Attorneys and legal services',
    icon: '⚖️',
    subcategories: ['Business Law', 'Real Estate', 'Estate Planning', 'Family Law', 'Contract Review'],
  },
  {
    id: 'marketing',
    name: 'Marketing',
    slug: 'marketing',
    bucket: 'business',
    description: 'Marketing, advertising, and branding services',
    icon: '📣',
    subcategories: ['Digital Marketing', 'Social Media', 'SEO', 'Graphic Design', 'Web Design', 'Branding'],
  },
  {
    id: 'printing',
    name: 'Printing & Signs',
    slug: 'printing',
    bucket: 'business',
    description: 'Printing, signage, and promotional materials',
    icon: '🖨️',
    subcategories: ['Business Cards', 'Banners', 'Vehicle Wraps', 'Signs', 'Promotional Items'],
  },
  {
    id: 'commercial-cleaning',
    name: 'Commercial Cleaning',
    slug: 'commercial-cleaning',
    bucket: 'business',
    description: 'Office and commercial cleaning services',
    icon: '🏢',
    subcategories: ['Office Cleaning', 'Janitorial', 'Floor Care', 'Window Cleaning', 'Post-Construction'],
  },
  {
    id: 'insurance',
    name: 'Insurance',
    slug: 'insurance',
    bucket: 'business',
    description: 'Business and personal insurance services',
    icon: '🛡️',
    subcategories: ['Business Insurance', 'Auto Insurance', 'Home Insurance', 'Life Insurance', 'Health Insurance'],
  },
  {
    id: 'consulting',
    name: 'Consulting',
    slug: 'consulting',
    bucket: 'business',
    description: 'Business consulting and advisory services',
    icon: '💡',
    subcategories: ['Business Strategy', 'HR Consulting', 'Operations', 'Management Consulting'],
  },
  {
    id: 'notary-shipping',
    name: 'Notary & Shipping',
    slug: 'notary-shipping',
    bucket: 'business',
    description: 'Notary, shipping, and mailbox services',
    icon: '📦',
    subcategories: ['Notary Public', 'Shipping', 'Mailbox Rental', 'Packing Services'],
  },

  // PET SERVICES
  {
    id: 'veterinarians',
    name: 'Veterinarians',
    slug: 'veterinarians',
    bucket: 'pet',
    description: 'Veterinary clinics and animal hospitals',
    icon: '🏥',
    subcategories: ['General Care', 'Emergency Vet', 'Surgery', 'Dental Care', 'Vaccinations', 'Mobile Vet'],
    featured: true,
  },
  {
    id: 'pet-grooming',
    name: 'Pet Grooming',
    slug: 'pet-grooming',
    bucket: 'pet',
    description: 'Professional pet grooming services',
    icon: '✂️',
    subcategories: ['Dog Grooming', 'Cat Grooming', 'Mobile Grooming', 'Nail Trimming', 'De-shedding'],
  },
  {
    id: 'pet-boarding',
    name: 'Boarding & Kennels',
    slug: 'pet-boarding',
    bucket: 'pet',
    description: 'Pet boarding and kennel facilities',
    icon: '🏨',
    subcategories: ['Dog Boarding', 'Cat Boarding', 'Luxury Boarding', 'Long-Term Boarding'],
  },
  {
    id: 'pet-sitting',
    name: 'Pet Sitting',
    slug: 'pet-sitting',
    bucket: 'pet',
    description: 'In-home pet sitting and dog walking',
    icon: '🐕‍🦺',
    subcategories: ['Dog Walking', 'In-Home Pet Sitting', 'Drop-In Visits', 'Overnight Care'],
  },
  {
    id: 'pet-training',
    name: 'Pet Training',
    slug: 'pet-training',
    bucket: 'pet',
    description: 'Dog training and behavior services',
    icon: '🎓',
    subcategories: ['Obedience Training', 'Puppy Training', 'Behavior Modification', 'Group Classes', 'In-Home Training'],
  },
  {
    id: 'pet-waste',
    name: 'Pet Waste Removal',
    slug: 'pet-waste',
    bucket: 'pet',
    description: 'Yard cleanup and pet waste removal services',
    icon: '🧹',
    subcategories: ['Yard Cleanup', 'Regular Service', 'One-Time Cleanup', 'Commercial Service'],
  },
  {
    id: 'doggy-daycare',
    name: 'Doggy Daycare',
    slug: 'doggy-daycare',
    bucket: 'pet',
    description: 'Daytime dog care and socialization',
    icon: '🐶',
    subcategories: ['Full Day', 'Half Day', 'Playgroups', 'Training Included'],
  },
];

export const getServiceCategory = (slug: string): ServiceCategory | undefined => {
  return serviceCategories.find(cat => cat.slug === slug);
};

export const getCategoriesByBucket = (bucketSlug: string): ServiceCategory[] => {
  return serviceCategories.filter(cat => cat.bucket === bucketSlug);
};

export const getBucket = (slug: string): ServiceBucket | undefined => {
  return serviceBuckets.find(b => b.slug === slug);
};

export const getFeaturedCategories = (): ServiceCategory[] => {
  return serviceCategories.filter(cat => cat.featured);
};

export const membershipTiers = {
  basic: {
    name: 'Basic',
    price: 'Free',
    badge: null,
    color: 'bg-gray-100 text-gray-600',
    features: ['Listed in directory', 'Basic profile'],
    priority: 0,
  },
  verified: {
    name: 'Verified',
    price: '$29/mo',
    badge: '✅',
    color: 'bg-green-100 text-green-700',
    features: ['Verified badge', 'Claim listing', 'Edit profile', 'Contact info displayed'],
    priority: 1,
  },
  premium: {
    name: 'Premium',
    price: '$79/mo',
    badge: '⭐',
    color: 'bg-boerne-gold/20 text-boerne-gold-dark',
    features: ['Featured in category', 'Bernie recommends', 'Special offers', 'Priority support'],
    priority: 2,
  },
  elite: {
    name: 'Elite',
    price: '$149/mo',
    badge: '💎',
    color: 'bg-purple-100 text-purple-700',
    features: ['Homepage featured', 'Top of listings', 'Priority support', 'Analytics dashboard'],
    priority: 3,
  },
};

export type MembershipTier = keyof typeof membershipTiers;
