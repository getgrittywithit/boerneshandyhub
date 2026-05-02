// Service Categories for Boerne's Handy Hub Directory
// Taxonomy: 5 top-level categories -> subcategories -> providers

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  keywords?: string[]; // For search matching
  section?: string; // Visual grouping on category landing page
}

export interface TopLevelCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  subcategories: ServiceCategory[];
}

// =============================================================================
// TOP-LEVEL CATEGORIES (5)
// =============================================================================

export const topLevelCategories: TopLevelCategory[] = [
  {
    id: 'home',
    name: 'Home',
    slug: 'home',
    description: 'Home repair, maintenance, and improvement services',
    icon: '🏠',
    color: 'bg-blue-500',
    subcategories: [
      // Trades
      { id: 'plumbing', name: 'Plumbing', slug: 'plumbing', description: 'Licensed plumbers for repairs, installations, and emergency services', icon: '🔧', section: 'Trades', keywords: ['plumber', 'pipes', 'drain', 'water heater', 'leak', 'faucet', 'toilet'] },
      { id: 'electrical', name: 'Electrical', slug: 'electrical', description: 'Professional electricians for residential needs', icon: '⚡', section: 'Trades', keywords: ['electrician', 'wiring', 'outlet', 'panel', 'lighting', 'ceiling fan'] },
      { id: 'hvac', name: 'HVAC', slug: 'hvac', description: 'Heating, cooling, and air quality experts', icon: '❄️', section: 'Trades', keywords: ['ac', 'air conditioning', 'heating', 'furnace', 'duct', 'air quality'] },
      { id: 'roofing', name: 'Roofing', slug: 'roofing', description: 'Roofers for repairs, replacements, and inspections', icon: '🏠', section: 'Trades', keywords: ['roof', 'shingles', 'leak', 'storm damage', 'metal roof'] },
      { id: 'handyman', name: 'Handyman', slug: 'handyman', description: 'General repairs and odd jobs', icon: '🛠️', section: 'Trades', keywords: ['handyman', 'repair', 'fix', 'odd jobs', 'maintenance'] },
      // Interior
      { id: 'painting', name: 'Painting', slug: 'painting', description: 'Interior and exterior painting services', icon: '🎨', section: 'Interior', keywords: ['painter', 'interior paint', 'exterior paint', 'stain', 'cabinet painting'] },
      { id: 'flooring', name: 'Flooring', slug: 'flooring', description: 'Flooring installation and refinishing', icon: '🪵', section: 'Interior', keywords: ['floor', 'hardwood', 'tile', 'carpet', 'laminate', 'vinyl'] },
      { id: 'drywall', name: 'Drywall/Sheetrock', slug: 'drywall', description: 'Drywall repair, texture, and popcorn ceiling removal', icon: '🧱', section: 'Interior', keywords: ['drywall', 'sheetrock', 'texture', 'popcorn ceiling', 'patch'] },
      { id: 'tile-countertops', name: 'Tile & Countertops', slug: 'tile-countertops', description: 'Tile installation and granite/quartz fabrication', icon: '🔲', section: 'Interior', keywords: ['tile', 'granite', 'quartz', 'countertop', 'backsplash'] },
      { id: 'cabinetry', name: 'Cabinetry & Custom Carpentry', slug: 'cabinetry', description: 'Kitchen cabinets, built-ins, and custom closets', icon: '🪚', section: 'Interior', keywords: ['cabinets', 'carpentry', 'built-ins', 'closets', 'custom'] },
      { id: 'window-treatments', name: 'Window Treatments/Blinds', slug: 'window-treatments', description: 'Plantation shutters, blinds, shades, and draperies', icon: '🪟', section: 'Interior', keywords: ['blinds', 'shutters', 'shades', 'draperies', 'plantation'] },
      // Exterior
      { id: 'fencing', name: 'Fencing', slug: 'fencing', description: 'Residential fence installation and repair', icon: '🚧', section: 'Exterior', keywords: ['fence', 'gate', 'wood fence', 'iron fence', 'privacy fence'] },
      { id: 'landscaping', name: 'Landscaping/Lawn', slug: 'landscaping', description: 'Lawn care and landscape design', icon: '🌿', section: 'Exterior', keywords: ['lawn', 'mowing', 'landscape', 'yard', 'garden', 'irrigation', 'sprinkler'] },
      { id: 'tree-service', name: 'Tree Service', slug: 'tree-service', description: 'Tree trimming, removal, and stump grinding', icon: '🌳', section: 'Exterior', keywords: ['tree', 'trimming', 'removal', 'stump', 'arborist'] },
      { id: 'pool-service', name: 'Pool Service', slug: 'pool-service', description: 'Pool cleaning, repair, and maintenance', icon: '🏊', section: 'Exterior', keywords: ['pool', 'spa', 'hot tub', 'pool cleaning', 'pool repair'] },
      { id: 'gutters', name: 'Gutters', slug: 'gutters', description: 'Gutter installation, cleaning, and repair', icon: '🌧️', section: 'Exterior', keywords: ['gutter', 'downspout', 'gutter guard', 'gutter cleaning'] },
      { id: 'pressure-washing', name: 'Pressure Washing', slug: 'pressure-washing', description: 'Power washing for homes and driveways', icon: '💦', section: 'Exterior', keywords: ['pressure wash', 'power wash', 'driveway', 'deck cleaning'] },
      { id: 'window-replacement', name: 'Window Replacement & Repair', slug: 'window-replacement', description: 'Energy-efficient windows, screens, and glass repair', icon: '🪟', section: 'Exterior', keywords: ['windows', 'replacement', 'glass', 'screens', 'energy efficient'] },
      { id: 'insulation', name: 'Insulation', slug: 'insulation', description: 'Spray foam, blown-in, and batt insulation', icon: '🏠', section: 'Exterior', keywords: ['insulation', 'spray foam', 'blown-in', 'batt', 'attic'] },
      { id: 'drainage', name: 'Drainage/French Drains', slug: 'drainage', description: 'French drains, regrading, and erosion control', icon: '💧', section: 'Exterior', keywords: ['drainage', 'french drain', 'regrading', 'erosion', 'runoff'] },
      // Repair & Restoration
      { id: 'remodeling', name: 'Remodeling/GC', slug: 'remodeling', description: 'General contractors for remodeling and renovations', icon: '🔨', section: 'Repair & Restoration', keywords: ['contractor', 'remodel', 'renovation', 'kitchen', 'bathroom', 'addition'] },
      { id: 'cleaning', name: 'Cleaning/Maid', slug: 'cleaning', description: 'House cleaning and maid services', icon: '🧹', section: 'Repair & Restoration', keywords: ['cleaning', 'maid', 'housekeeping', 'deep clean', 'move out'] },
      { id: 'carpet-cleaning', name: 'Carpet & Upholstery Cleaning', slug: 'carpet-cleaning', description: 'Deep clean carpet, rugs, and upholstery', icon: '🧽', section: 'Repair & Restoration', keywords: ['carpet cleaning', 'upholstery', 'rug cleaning', 'steam clean'] },
      { id: 'window-cleaning', name: 'Window Cleaning', slug: 'window-cleaning', description: 'Interior and exterior glass cleaning', icon: '✨', section: 'Repair & Restoration', keywords: ['window cleaning', 'glass', 'exterior windows'] },
      { id: 'mold-remediation', name: 'Mold Remediation & Water Damage', slug: 'mold-remediation', description: 'Mold removal, water damage restoration, fire/smoke repair', icon: '💨', section: 'Repair & Restoration', keywords: ['mold', 'water damage', 'restoration', 'fire damage', 'smoke'] },
      { id: 'appliance-repair', name: 'Appliance Repair', slug: 'appliance-repair', description: 'Washer, dryer, fridge, oven, and dishwasher repair', icon: '🔌', section: 'Repair & Restoration', keywords: ['appliance', 'washer', 'dryer', 'refrigerator', 'oven', 'dishwasher'] },
      { id: 'garage-doors', name: 'Garage Doors', slug: 'garage-doors', description: 'Garage door installation and repair', icon: '🚗', section: 'Repair & Restoration', keywords: ['garage door', 'opener', 'spring', 'garage repair'] },
      { id: 'foundation-repair', name: 'Foundation Repair', slug: 'foundation-repair', description: 'Foundation inspection and repair', icon: '🏗️', section: 'Repair & Restoration', keywords: ['foundation', 'leveling', 'pier', 'crack', 'settling'] },
      { id: 'chimney', name: 'Chimney Sweep & Fireplace', slug: 'chimney', description: 'Chimney cleaning, gas fireplace tune-up, and masonry repair', icon: '🔥', section: 'Repair & Restoration', keywords: ['chimney', 'fireplace', 'chimney sweep', 'gas fireplace', 'masonry'] },
      // Hill Country Specialty
      { id: 'pest-control', name: 'Pest Control', slug: 'pest-control', description: 'Exterminators and pest management', icon: '🐜', section: 'Hill Country Specialty', keywords: ['pest', 'exterminator', 'termite', 'rodent', 'ant', 'roach', 'bee', 'scorpion'] },
      { id: 'septic', name: 'Septic', slug: 'septic', description: 'Septic system installation and pumping', icon: '🚽', section: 'Hill Country Specialty', keywords: ['septic', 'pumping', 'tank', 'drain field'] },
      { id: 'water-treatment', name: 'Water Treatment & Softeners', slug: 'water-treatment', description: 'Whole-home softeners, filtration, and RO systems', icon: '💧', section: 'Hill Country Specialty', keywords: ['water softener', 'water treatment', 'filtration', 'reverse osmosis', 'hard water'] },
      { id: 'home-inspections', name: 'Home Inspections', slug: 'home-inspections', description: 'Professional home inspection services for buyers and sellers', icon: '🔍', section: 'Hill Country Specialty', keywords: ['home inspection', 'buyer inspection', 'pre-listing inspection', 'radon testing', 'mold inspection'] },
      // Tech & Security
      { id: 'locksmith', name: 'Locksmith', slug: 'locksmith', description: 'Residential locksmith services', icon: '🔐', section: 'Tech & Security', keywords: ['locksmith', 'lock', 'key', 'lockout', 'rekey'] },
      { id: 'smart-home', name: 'Smart Home/AV/Low-Voltage', slug: 'smart-home', description: 'TV mounting, networking, surround sound, smart thermostats', icon: '📺', section: 'Tech & Security', keywords: ['smart home', 'tv mount', 'networking', 'home theater', 'automation'] },
      { id: 'residential-security', name: 'Residential Security & Alarms', slug: 'residential-security', description: 'Home alarm and camera system installers', icon: '🔒', section: 'Tech & Security', keywords: ['security', 'alarm', 'camera', 'ring', 'adt', 'home security'] },
      { id: 'solar', name: 'Solar/Battery/EV Charger', slug: 'solar', description: 'Solar panels, batteries, and EV charger installation', icon: '☀️', section: 'Tech & Security', keywords: ['solar', 'solar panels', 'battery', 'ev charger', 'tesla'] },
      { id: 'interior-design', name: 'Interior Design/Stagers', slug: 'interior-design', description: 'Interior designers, decorators, and home stagers', icon: '🎨', section: 'Tech & Security', keywords: ['interior design', 'decorator', 'home staging', 'design'] },
    ],
  },
  {
    id: 'auto',
    name: 'Auto',
    slug: 'auto',
    description: 'Automotive repair, maintenance, and services',
    icon: '🚗',
    color: 'bg-red-500',
    subcategories: [
      // Repair & Maintenance
      { id: 'mechanic', name: 'Mechanic/Repair', slug: 'mechanic', description: 'General auto mechanics and repair shops', icon: '🔧', section: 'Repair & Maintenance', keywords: ['mechanic', 'auto repair', 'car repair', 'engine', 'brake', 'transmission'] },
      { id: 'oil-change', name: 'Oil Change', slug: 'oil-change', description: 'Quick oil changes and fluid services', icon: '🛢️', section: 'Repair & Maintenance', keywords: ['oil change', 'lube', 'fluid', 'filter'] },
      { id: 'tire-shop', name: 'Tire Shop', slug: 'tire-shop', description: 'Tire sales, installation, and repair', icon: '⭕', section: 'Repair & Maintenance', keywords: ['tire', 'wheel', 'alignment', 'flat', 'rotation'] },
      { id: 'brakes', name: 'Brakes', slug: 'brakes', description: 'Brake service, pads, rotors, and lines', icon: '🛑', section: 'Repair & Maintenance', keywords: ['brakes', 'brake pads', 'rotors', 'brake service'] },
      { id: 'transmission', name: 'Transmission Specialist', slug: 'transmission', description: 'Transmission rebuilds, replacement, and fluid service', icon: '⚙️', section: 'Repair & Maintenance', keywords: ['transmission', 'rebuild', 'automatic', 'manual', 'cvt'] },
      { id: 'alignment', name: 'Alignment & Suspension', slug: 'alignment', description: 'Alignment, shocks, struts, and lift leveling', icon: '🔄', section: 'Repair & Maintenance', keywords: ['alignment', 'suspension', 'shocks', 'struts', 'leveling'] },
      { id: 'mobile-mechanic', name: 'Mobile Mechanic', slug: 'mobile-mechanic', description: 'Mobile auto repair services', icon: '🔧', section: 'Repair & Maintenance', keywords: ['mobile mechanic', 'on-site', 'house call'] },
      // Body & Glass
      { id: 'body-shop', name: 'Body Shop', slug: 'body-shop', description: 'Collision repair and auto body work', icon: '🚗', section: 'Body & Glass', keywords: ['body shop', 'collision', 'dent', 'paint', 'auto body'] },
      { id: 'windshield-glass', name: 'Windshield/Glass', slug: 'windshield-glass', description: 'Auto glass repair and replacement', icon: '🪟', section: 'Body & Glass', keywords: ['windshield', 'auto glass', 'chip', 'crack', 'window'] },
      // Customization & Aftermarket
      { id: 'detailing', name: 'Detailing', slug: 'detailing', description: 'Professional car detailing services', icon: '✨', section: 'Customization & Aftermarket', keywords: ['detailing', 'car wash', 'wax', 'interior', 'ceramic coating'] },
      { id: 'lift-kits', name: 'Lift Kits/Off-Road/4x4', slug: 'lift-kits', description: 'Lifts, levelers, bumpers, winches, and off-road builds', icon: '🏔️', section: 'Customization & Aftermarket', keywords: ['lift kit', 'off-road', '4x4', 'bumper', 'winch'] },
      { id: 'window-tint', name: 'Window Tint', slug: 'window-tint', description: 'Auto window tinting', icon: '🕶️', section: 'Customization & Aftermarket', keywords: ['window tint', 'tinting', 'tint'] },
      { id: 'wraps-ppf', name: 'Wraps/PPF/Ceramic Coating', slug: 'wraps-ppf', description: 'Vinyl wraps, paint protection film, and ceramic coatings', icon: '🎨', section: 'Customization & Aftermarket', keywords: ['wrap', 'vinyl wrap', 'ppf', 'paint protection', 'ceramic coating'] },
      { id: 'audio-stereo', name: 'Audio/Stereo/Lighting', slug: 'audio-stereo', description: 'Aftermarket audio, stereo, and lighting installs', icon: '🔊', section: 'Customization & Aftermarket', keywords: ['car audio', 'stereo', 'speakers', 'subwoofer', 'lights'] },
      { id: 'auto-upholstery', name: 'Auto Upholstery/Interior', slug: 'auto-upholstery', description: 'Leather, headliner, custom seats, and classic restoration', icon: '💺', section: 'Customization & Aftermarket', keywords: ['upholstery', 'leather', 'headliner', 'seats', 'interior'] },
      // Trucks, Trailers, RV, Marine
      { id: 'diesel', name: 'Diesel & Heavy-Duty Truck', slug: 'diesel', description: 'Diesel specialists for Cummins, Duramax, Powerstroke', icon: '🚛', section: 'Trucks, Trailers, RV, Marine', keywords: ['diesel', 'truck', 'cummins', 'duramax', 'powerstroke', 'heavy duty'] },
      { id: 'trailer-repair', name: 'Trailer Sales & Repair', slug: 'trailer-repair', description: 'Gooseneck, livestock, utility, and dump trailer service', icon: '🚚', section: 'Trucks, Trailers, RV, Marine', keywords: ['trailer', 'gooseneck', 'livestock', 'utility', 'dump trailer'] },
      { id: 'rv-service', name: 'RV Service & Repair', slug: 'rv-service', description: 'RV electrical, plumbing, slide-outs, and awnings', icon: '🚐', section: 'Trucks, Trailers, RV, Marine', keywords: ['rv', 'camper', 'motorhome', 'rv repair', 'slide out'] },
      { id: 'boat-marine', name: 'Boat & Marine Repair', slug: 'boat-marine', description: 'Outboard, inboard, hull, and trailer service', icon: '🚤', section: 'Trucks, Trailers, RV, Marine', keywords: ['boat', 'marine', 'outboard', 'inboard', 'boat repair'] },
      { id: 'motorcycle', name: 'Motorcycle & Powersports', slug: 'motorcycle', description: 'Motorcycle, ATV, UTV, and powersports service', icon: '🏍️', section: 'Trucks, Trailers, RV, Marine', keywords: ['motorcycle', 'atv', 'utv', 'powersports', 'harley'] },
      { id: 'small-engine', name: 'Small Engine/Lawn Equipment', slug: 'small-engine', description: 'Mower, chainsaw, blower, and small engine repair', icon: '🔧', section: 'Trucks, Trailers, RV, Marine', keywords: ['small engine', 'lawn mower', 'chainsaw', 'blower', 'weed eater'] },
      // Roadside & On-Demand
      { id: 'towing', name: 'Towing', slug: 'towing', description: 'Towing and roadside assistance', icon: '🚚', section: 'Roadside & On-Demand', keywords: ['towing', 'tow truck', 'roadside', 'jump start', 'flatbed'] },
      { id: 'auto-locksmith', name: 'Auto Locksmith/Key Programming', slug: 'auto-locksmith', description: 'Auto keys, fobs, ignitions, and lockouts', icon: '🔑', section: 'Roadside & On-Demand', keywords: ['auto locksmith', 'car key', 'fob', 'lockout', 'key programming'] },
      // Buy/Sell
      { id: 'car-wash', name: 'Car Wash', slug: 'car-wash', description: 'Self-service and full-service car washes', icon: '🚿', section: 'Buy/Sell/Title', keywords: ['car wash', 'wash', 'self service'] },
      { id: 'auto-dealers', name: 'Auto Dealerships', slug: 'auto-dealers', description: 'New and used car dealerships', icon: '🏪', section: 'Buy/Sell/Title', keywords: ['dealership', 'car dealer', 'used cars', 'new cars'] },
      { id: 'auto-parts', name: 'Auto Parts', slug: 'auto-parts', description: 'Auto parts stores and suppliers', icon: '🔩', section: 'Buy/Sell/Title', keywords: ['auto parts', 'parts', 'oreilly', 'autozone', 'napa'] },
      { id: 'title-registration', name: 'Title & Registration Services', slug: 'title-registration', description: 'DMV services, title transfers, and registration', icon: '📄', section: 'Buy/Sell/Title', keywords: ['title', 'registration', 'dmv', 'plates', 'title transfer'] },
      { id: 'cash-for-cars', name: 'Cash for Cars/Salvage', slug: 'cash-for-cars', description: 'Junk car removal and salvage buyers', icon: '💵', section: 'Buy/Sell/Title', keywords: ['cash for cars', 'junk car', 'salvage', 'sell car'] },
    ],
  },
  {
    id: 'outdoor',
    name: 'Outdoor/Land',
    slug: 'outdoor',
    description: 'Land services, outdoor construction, and rural property work',
    icon: '🌳',
    color: 'bg-green-600',
    subcategories: [
      // Land Work
      { id: 'brush-clearing', name: 'Brush Clearing/Cedar', slug: 'brush-clearing', description: 'Land clearing and cedar removal', icon: '🪓', section: 'Land Work', keywords: ['brush', 'cedar', 'land clearing', 'mulching', 'forestry'] },
      { id: 'excavation', name: 'Excavation/Grading', slug: 'excavation', description: 'Excavation, grading, and dirt work', icon: '🚜', section: 'Land Work', keywords: ['excavation', 'grading', 'dirt work', 'dozer', 'backhoe'] },
      { id: 'mowing-acreage', name: 'Mowing — Acreage/Tractor', slug: 'mowing-acreage', description: 'Tractor mowing for large properties and acreage', icon: '🚜', section: 'Land Work', keywords: ['acreage mowing', 'tractor', 'bush hog', 'pasture mowing'] },
      { id: 'land-surveying', name: 'Land Surveying', slug: 'land-surveying', description: 'Property surveys, boundary markers, and platting', icon: '📐', section: 'Land Work', keywords: ['surveying', 'survey', 'boundary', 'plat', 'property lines'] },
      { id: 'soil-delivery', name: 'Soil/Aggregate Delivery', slug: 'soil-delivery', description: 'Topsoil, gravel, sand, and aggregate delivery', icon: '🪨', section: 'Land Work', keywords: ['soil', 'topsoil', 'gravel', 'sand', 'aggregate', 'delivery'] },
      // Hardscape & Stone
      { id: 'concrete', name: 'Concrete/Driveways', slug: 'concrete', description: 'Concrete work and driveway installation', icon: '🧱', section: 'Hardscape & Stone', keywords: ['concrete', 'driveway', 'slab', 'patio', 'sidewalk'] },
      { id: 'hardscaping', name: 'Hardscaping/Patios/Outdoor Kitchens', slug: 'hardscaping', description: 'Patios, outdoor kitchens, pavers, and hardscape design', icon: '🏡', section: 'Hardscape & Stone', keywords: ['hardscape', 'patio', 'outdoor kitchen', 'pavers', 'pergola'] },
      { id: 'retaining-walls', name: 'Retaining Walls/Stone Work', slug: 'retaining-walls', description: 'Retaining walls, stone masonry, and rock work', icon: '🧱', section: 'Hardscape & Stone', keywords: ['retaining wall', 'stone', 'masonry', 'rock wall'] },
      { id: 'fire-pits', name: 'Fire Pits & Outdoor Living', slug: 'fire-pits', description: 'Fire pits, outdoor fireplaces, and living spaces', icon: '🔥', section: 'Hardscape & Stone', keywords: ['fire pit', 'outdoor fireplace', 'outdoor living'] },
      // Water
      { id: 'well-drilling', name: 'Well Drilling/Pump', slug: 'well-drilling', description: 'Water well drilling and pump services', icon: '💧', section: 'Water', keywords: ['well', 'drilling', 'pump', 'water well', 'well repair'] },
      { id: 'irrigation', name: 'Irrigation/Sprinklers', slug: 'irrigation', description: 'Sprinkler system installation and repair', icon: '💦', section: 'Water', keywords: ['irrigation', 'sprinkler', 'drip', 'sprinkler repair'] },
      { id: 'pond', name: 'Pond/Water Feature', slug: 'pond', description: 'Pond construction, water features, and maintenance', icon: '🌊', section: 'Water', keywords: ['pond', 'water feature', 'fountain', 'koi pond'] },
      { id: 'rainwater', name: 'Rainwater Catchment/Tank Service', slug: 'rainwater', description: 'Rainwater collection systems and tank maintenance', icon: '🌧️', section: 'Water', keywords: ['rainwater', 'cistern', 'tank', 'rainwater harvesting'] },
      { id: 'water-hauling', name: 'Water Hauling/Cistern Fill', slug: 'water-hauling', description: 'Bulk water delivery and cistern filling', icon: '🚰', section: 'Water', keywords: ['water hauling', 'water delivery', 'cistern', 'tank fill'] },
      // Rural Infrastructure
      { id: 'welding', name: 'Welding/Fabrication', slug: 'welding', description: 'Custom welding and metal fabrication', icon: '🔥', section: 'Rural Infrastructure', keywords: ['welding', 'fabrication', 'metal', 'steel', 'custom'] },
      { id: 'ag-fencing', name: 'Ag Fencing', slug: 'ag-fencing', description: 'Agricultural and ranch fencing', icon: '🚜', section: 'Rural Infrastructure', keywords: ['ag fence', 'ranch fence', 'cattle fence', 'farm fence', 'barbed wire'] },
      { id: 'barn-shop', name: 'Barn/Shop Build', slug: 'barn-shop', description: 'Barn and shop construction', icon: '🏚️', section: 'Rural Infrastructure', keywords: ['barn', 'shop', 'metal building', 'pole barn', 'outbuilding'] },
      { id: 'outdoor-lighting', name: 'Outdoor Lighting', slug: 'outdoor-lighting', description: 'Landscape lighting, pathway lights, and outdoor fixtures', icon: '💡', section: 'Rural Infrastructure', keywords: ['outdoor lighting', 'landscape lights', 'pathway', 'security lights'] },
      // Recreation
      { id: 'wildlife-management', name: 'Wildlife Management', slug: 'wildlife-management', description: 'Wildlife management and trapping', icon: '🦌', section: 'Recreation', keywords: ['wildlife', 'trapping', 'deer', 'hog', 'varmint'] },
      { id: 'sod-turf', name: 'Sod/Turf Install', slug: 'sod-turf', description: 'Sod installation and artificial turf', icon: '🌱', section: 'Recreation', keywords: ['sod', 'turf', 'grass', 'artificial turf', 'lawn install'] },
    ],
  },
  {
    id: 'commercial',
    name: 'Business',
    slug: 'business-services',
    description: 'Professional services and commercial trades for businesses',
    icon: '🏢',
    color: 'bg-gray-600',
    subcategories: [
      // Professional Services
      { id: 'accountant', name: 'Accountants/Bookkeeping', slug: 'accountant', description: 'CPAs, bookkeepers, and tax professionals', icon: '📊', section: 'Professional Services', keywords: ['accountant', 'cpa', 'bookkeeper', 'tax', 'payroll', 'quickbooks'] },
      { id: 'tax-preparation', name: 'Tax Preparation', slug: 'tax-preparation', description: 'Individual and small business tax prep', icon: '📋', section: 'Professional Services', keywords: ['tax prep', 'taxes', 'irs', 'tax return', 'tax filing'] },
      { id: 'attorney', name: 'Business Attorneys', slug: 'attorney', description: 'Business law, contracts, and legal services', icon: '⚖️', section: 'Professional Services', keywords: ['attorney', 'lawyer', 'legal', 'contracts', 'business law', 'llc'] },
      { id: 'insurance', name: 'Business Insurance', slug: 'insurance', description: 'Commercial insurance and bonding', icon: '🛡️', section: 'Professional Services', keywords: ['insurance', 'commercial insurance', 'liability', 'bonding', 'workers comp'] },
      { id: 'commercial-real-estate', name: 'Commercial Real Estate', slug: 'commercial-real-estate', description: 'Commercial property sales, leasing, and management', icon: '🏢', section: 'Real Estate & Facilities', keywords: ['commercial real estate', 'office space', 'retail space', 'warehouse', 'leasing'] },
      { id: 'banking-lending', name: 'Banking & Lending', slug: 'banking-lending', description: 'Business banking, SBA loans, and financing', icon: '🏦', section: 'Professional Services', keywords: ['bank', 'lending', 'sba loan', 'business loan', 'financing'] },
      { id: 'business-coaching', name: 'Business Coaching', slug: 'business-coaching', description: 'Business coaches, consultants, and mentors', icon: '🎯', section: 'Professional Services', keywords: ['business coach', 'consultant', 'mentor', 'strategy'] },
      { id: 'business-brokers', name: 'Business Brokers/M&A', slug: 'business-brokers', description: 'Business valuations, sales, and acquisitions', icon: '🤝', section: 'Professional Services', keywords: ['business broker', 'mergers', 'acquisitions', 'sell business', 'buy business'] },
      // HR & Staffing
      { id: 'payroll-hr', name: 'Payroll & HR', slug: 'payroll-hr', description: 'Payroll processing, HR consulting, and benefits', icon: '👥', section: 'People', keywords: ['payroll', 'hr', 'human resources', 'benefits', 'adp', 'gusto'] },
      { id: 'staffing-recruiting', name: 'Staffing & Recruiting', slug: 'staffing-recruiting', description: 'Temp staffing, recruiting, and headhunters', icon: '🔍', section: 'People', keywords: ['staffing', 'recruiting', 'temp agency', 'headhunter', 'employment'] },
      { id: 'training-education', name: 'Training & Continuing Education', slug: 'training-education', description: 'Professional training, certifications, and CE courses', icon: '📚', section: 'People', keywords: ['training', 'continuing education', 'certification', 'professional development'] },
      // Tech & Marketing
      { id: 'it-support', name: 'IT Support', slug: 'it-support', description: 'Computer repair, networking, and tech support', icon: '💻', section: 'Technology & Operations', keywords: ['it', 'computer', 'tech support', 'network', 'managed it', 'computer repair'] },
      { id: 'web-design', name: 'Web Design & Development', slug: 'web-design', description: 'Website design, development, and hosting', icon: '🌐', section: 'Marketing & Brand', keywords: ['web design', 'website', 'web development', 'hosting', 'wordpress'] },
      { id: 'marketing', name: 'Marketing/Advertising', slug: 'marketing', description: 'Marketing, advertising, and digital services', icon: '📣', section: 'Marketing & Brand', keywords: ['marketing', 'advertising', 'social media', 'seo', 'branding'] },
      { id: 'commercial-photography', name: 'Commercial Photography & Video', slug: 'commercial-photography', description: 'Product photography, video production, and drone', icon: '📸', section: 'Marketing & Brand', keywords: ['photography', 'video', 'drone', 'product photos', 'commercial video'] },
      { id: 'business-telecom', name: 'Business Telecom', slug: 'business-telecom', description: 'Business phone systems, VoIP, and internet', icon: '📞', section: 'Technology & Operations', keywords: ['telecom', 'phone system', 'voip', 'business internet', 'pbx'] },
      // Print & Promo
      { id: 'printing', name: 'Printing/Copying', slug: 'printing', description: 'Business printing, copying, and promotional items', icon: '🖨️', section: 'Marketing & Brand', keywords: ['printing', 'copying', 'promotional', 'business cards', 'banners'] },
      { id: 'promotional-products', name: 'Promotional Products & Branded Merch', slug: 'promotional-products', description: 'Custom swag, branded merchandise, and giveaways', icon: '🎁', section: 'Marketing & Brand', keywords: ['promotional products', 'swag', 'branded', 'merch', 'giveaways'] },
      { id: 'signage', name: 'Signage', slug: 'signage', description: 'Business signs and graphics', icon: '🪧', section: 'Marketing & Brand', keywords: ['sign', 'signage', 'banner', 'vehicle wrap', 'graphics'] },
      // Commercial Trades
      { id: 'commercial-hvac', name: 'Commercial HVAC', slug: 'commercial-hvac', description: 'Commercial heating and cooling services', icon: '❄️', section: 'Real Estate & Facilities', keywords: ['commercial hvac', 'commercial ac', 'rooftop unit', 'commercial heating'] },
      { id: 'commercial-construction', name: 'Commercial Construction', slug: 'commercial-construction', description: 'Commercial building and tenant improvements', icon: '🏗️', section: 'Real Estate & Facilities', keywords: ['commercial construction', 'tenant improvement', 'buildout', 'commercial contractor'] },
      { id: 'architects-engineers', name: 'Architects & Engineers', slug: 'architects-engineers', description: 'Commercial architects, structural engineers, and MEP', icon: '📐', section: 'Real Estate & Facilities', keywords: ['architect', 'engineer', 'structural', 'mep', 'commercial design'] },
      { id: 'janitorial', name: 'Janitorial', slug: 'janitorial', description: 'Commercial cleaning and janitorial services', icon: '🧹', section: 'Real Estate & Facilities', keywords: ['janitorial', 'office cleaning', 'commercial cleaning', 'floor care'] },
      { id: 'commercial-pest', name: 'Commercial Pest Control', slug: 'commercial-pest', description: 'Commercial exterminators and pest management', icon: '🐜', section: 'Real Estate & Facilities', keywords: ['commercial pest', 'exterminator', 'pest control', 'restaurant pest'] },
      { id: 'parking-lot', name: 'Parking Lot', slug: 'parking-lot', description: 'Parking lot striping, repair, and maintenance', icon: '🅿️', section: 'Real Estate & Facilities', keywords: ['parking lot', 'striping', 'asphalt', 'sealcoating'] },
      { id: 'security', name: 'Security Systems', slug: 'security', description: 'Commercial security, cameras, and access control', icon: '📹', section: 'Real Estate & Facilities', keywords: ['security', 'cameras', 'alarm', 'access control', 'cctv', 'surveillance'] },
      // Office & Operations
      { id: 'office-furniture', name: 'Office Furniture & Equipment', slug: 'office-furniture', description: 'Office furniture, copiers, and equipment leasing', icon: '🪑', section: 'Technology & Operations', keywords: ['office furniture', 'desk', 'copier', 'equipment leasing'] },
      { id: 'payment-processing', name: 'Payment Processing & POS', slug: 'payment-processing', description: 'Credit card processing, POS systems, and merchant services', icon: '💳', section: 'Technology & Operations', keywords: ['payment processing', 'pos', 'credit card', 'merchant services', 'square'] },
      { id: 'shipping-couriers', name: 'Shipping/Mailing/Couriers', slug: 'shipping-couriers', description: 'Local couriers, mailbox services, and shipping', icon: '📬', section: 'Logistics', keywords: ['shipping', 'courier', 'mailbox', 'fedex', 'ups', 'usps'] },
      { id: 'notary-apostille', name: 'Notary/Apostille', slug: 'notary-apostille', description: 'Notary public, apostille, and document authentication', icon: '✒️', section: 'Logistics', keywords: ['notary', 'apostille', 'notarize', 'authentication'] },
      // Food & Hospitality Services
      { id: 'business-catering', name: 'Business Catering', slug: 'business-catering', description: 'Corporate catering, box lunches, and event food', icon: '🍱', section: 'Logistics', keywords: ['catering', 'corporate catering', 'box lunch', 'event food'] },
      { id: 'office-coffee', name: 'Office Coffee/Water/Vending', slug: 'office-coffee', description: 'Coffee service, water delivery, and vending machines', icon: '☕', section: 'Logistics', keywords: ['office coffee', 'water delivery', 'vending', 'breakroom'] },
      { id: 'uniforms-workwear', name: 'Uniforms/Workwear/Linen', slug: 'uniforms-workwear', description: 'Uniform rental, workwear, and linen service', icon: '👔', section: 'Logistics', keywords: ['uniforms', 'workwear', 'linen', 'scrubs', 'embroidery'] },
    ],
  },
  {
    id: 'specialty',
    name: 'Specialty/Seasonal',
    slug: 'specialty',
    description: 'Seasonal services and specialty contractors',
    icon: '🎄',
    color: 'bg-purple-500',
    subcategories: [
      // Seasonal
      { id: 'holiday-lighting', name: 'Holiday Lighting', slug: 'holiday-lighting', description: 'Christmas light installation and removal', icon: '🎄', section: 'Seasonal', keywords: ['christmas lights', 'holiday lights', 'light installation', 'decorations'] },
      { id: 'generators', name: 'Generators', slug: 'generators', description: 'Generator sales, installation, and service', icon: '⚡', section: 'Seasonal', keywords: ['generator', 'backup power', 'standby generator', 'portable generator'] },
      // Moving & Storage
      { id: 'moving', name: 'Moving Companies', slug: 'moving', description: 'Local and long-distance moving services', icon: '📦', section: 'Move-Ins / Outs', keywords: ['moving', 'movers', 'relocation', 'packing'] },
      { id: 'storage', name: 'Storage', slug: 'storage', description: 'Self storage and portable storage units', icon: '📦', section: 'Move-Ins / Outs', keywords: ['storage', 'self storage', 'storage unit', 'portable storage'] },
      { id: 'estate-sales', name: 'Estate Sales/Senior Move Mgmt', slug: 'estate-sales', description: 'Estate sales, downsizing, and senior relocation help', icon: '🏠', section: 'Move-Ins / Outs', keywords: ['estate sale', 'senior move', 'downsizing', 'liquidation'] },
      // Hauling & Waste
      { id: 'junk-hauling', name: 'Junk Hauling/Dumpster', slug: 'junk-hauling', description: 'Junk removal and dumpster rental', icon: '🗑️', section: 'Move-Ins / Outs', keywords: ['junk', 'hauling', 'dumpster', 'trash', 'debris'] },
      { id: 'document-shredding', name: 'Document Shredding/Records Storage', slug: 'document-shredding', description: 'Secure shredding, records storage, and destruction', icon: '📄', section: 'Move-Ins / Outs', keywords: ['shredding', 'document shredding', 'records storage', 'secure destruction'] },
      // Rentals
      { id: 'equipment-rental', name: 'Equipment Rental', slug: 'equipment-rental', description: 'Tool and equipment rental for construction and DIY', icon: '🔧', section: 'Rentals', keywords: ['equipment rental', 'tool rental', 'bobcat', 'excavator', 'rental'] },
      { id: 'event-rentals', name: 'Event Rentals', slug: 'event-rentals', description: 'Tents, tables, chairs, and event equipment', icon: '🎪', section: 'Rentals', keywords: ['event rental', 'tent rental', 'party rental', 'tables', 'chairs'] },
      { id: 'porta-potty', name: 'Porta Potty Rental', slug: 'porta-potty', description: 'Portable restroom rentals', icon: '🚽', section: 'Rentals', keywords: ['porta potty', 'portable restroom', 'sanitation', 'event rental'] },
      // Specialty Services
      { id: 'mobile-notary', name: 'Mobile Notary', slug: 'mobile-notary', description: 'Mobile notary services and signing agents', icon: '✒️', section: 'Misc', keywords: ['mobile notary', 'notary', 'signing agent', 'loan signing'] },
      { id: 'auctioneers', name: 'Auctioneers', slug: 'auctioneers', description: 'Auction services for estate, farm, and equipment', icon: '🔨', section: 'Misc', keywords: ['auctioneer', 'auction', 'estate auction', 'farm auction'] },
    ],
  },
];

// =============================================================================
// SEASONAL HIGHLIGHTS - "What Boerne Needs Right Now"
// =============================================================================

export interface SeasonalHighlight {
  subcategoryId: string;
  topCategorySlug: string;
  headline: string;
  reason: string;
}

export interface SeasonConfig {
  months: number[]; // 1-12
  highlights: SeasonalHighlight[];
}

export const seasonalConfig: SeasonConfig[] = [
  {
    // Spring: March, April, May
    months: [3, 4, 5],
    highlights: [
      { subcategoryId: 'hvac', topCategorySlug: 'home', headline: 'AC Tune-Up Season', reason: 'Get your AC ready before the Texas heat hits' },
      { subcategoryId: 'landscaping', topCategorySlug: 'home', headline: 'Spring Lawn Revival', reason: 'Prime time for fertilizing, aerating, and new plantings' },
      { subcategoryId: 'pressure-washing', topCategorySlug: 'home', headline: 'Spring Cleaning Outside', reason: 'Wash away winter grime from driveways and decks' },
      { subcategoryId: 'pest-control', topCategorySlug: 'home', headline: 'Pest Prevention', reason: 'Stop bugs before they invade this summer' },
    ],
  },
  {
    // Summer: June, July, August
    months: [6, 7, 8],
    highlights: [
      { subcategoryId: 'hvac', topCategorySlug: 'home', headline: 'AC Repair & Emergency', reason: 'Don\'t sweat it - get fast AC help' },
      { subcategoryId: 'pool-service', topCategorySlug: 'home', headline: 'Pool Season', reason: 'Keep your pool crystal clear all summer' },
      { subcategoryId: 'tree-service', topCategorySlug: 'home', headline: 'Storm Prep', reason: 'Trim branches before summer storms hit' },
      { subcategoryId: 'brush-clearing', topCategorySlug: 'outdoor', headline: 'Fire Prevention', reason: 'Clear brush to reduce wildfire risk' },
    ],
  },
  {
    // Fall: September, October, November
    months: [9, 10, 11],
    highlights: [
      { subcategoryId: 'hvac', topCategorySlug: 'home', headline: 'Heating Tune-Up', reason: 'Prep your furnace before the first cold snap' },
      { subcategoryId: 'gutters', topCategorySlug: 'home', headline: 'Gutter Cleaning', reason: 'Clear leaves before winter rains' },
      { subcategoryId: 'roofing', topCategorySlug: 'home', headline: 'Roof Inspection', reason: 'Fix issues before winter weather' },
      { subcategoryId: 'holiday-lighting', topCategorySlug: 'specialty', headline: 'Holiday Lights', reason: 'Book early for Christmas light installation' },
    ],
  },
  {
    // Winter: December, January, February
    months: [12, 1, 2],
    highlights: [
      { subcategoryId: 'generators', topCategorySlug: 'specialty', headline: 'Backup Power', reason: 'Be ready for winter storm outages' },
      { subcategoryId: 'plumbing', topCategorySlug: 'home', headline: 'Freeze Protection', reason: 'Prevent frozen pipes and water damage' },
      { subcategoryId: 'hvac', topCategorySlug: 'home', headline: 'Heating Repair', reason: 'Stay warm when temperatures drop' },
      { subcategoryId: 'remodeling', topCategorySlug: 'home', headline: 'Indoor Projects', reason: 'Perfect time for kitchen and bath remodels' },
    ],
  },
];

// =============================================================================
// CROSS-LISTINGS - Subcategories that appear in multiple top-level categories
// =============================================================================

export interface CrossListing {
  subcategoryId: string;
  primaryCategory: string; // The category where the subcategory is defined
  alsoIn: string[]; // Other categories where it should also appear
}

export const crossListings: CrossListing[] = [
  { subcategoryId: 'locksmith', primaryCategory: 'home', alsoIn: ['auto'] },
  { subcategoryId: 'pest-control', primaryCategory: 'home', alsoIn: ['business-services'] },
  { subcategoryId: 'generators', primaryCategory: 'specialty', alsoIn: ['home'] },
  { subcategoryId: 'drainage', primaryCategory: 'home', alsoIn: ['outdoor'] },
  { subcategoryId: 'welding', primaryCategory: 'outdoor', alsoIn: ['auto'] },
];

/**
 * Get subcategories for a category, including cross-listed items
 */
export const getSubcategoriesWithCrossListings = (categorySlug: string): ServiceCategory[] => {
  const category = getTopLevelCategory(categorySlug);
  if (!category) return [];

  // Start with the category's own subcategories
  const subcats = [...category.subcategories];

  // Add cross-listed items from other categories
  crossListings.forEach(cl => {
    if (cl.alsoIn.includes(categorySlug)) {
      const primaryCat = getTopLevelCategory(cl.primaryCategory);
      const crossListedSub = primaryCat?.subcategories.find(s => s.id === cl.subcategoryId);
      if (crossListedSub && !subcats.find(s => s.id === crossListedSub.id)) {
        subcats.push({ ...crossListedSub, section: crossListedSub.section || 'Cross-Listed' });
      }
    }
  });

  return subcats;
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export const getTopLevelCategory = (slug: string): TopLevelCategory | undefined => {
  return topLevelCategories.find(cat => cat.slug === slug);
};

export const getSubcategory = (topSlug: string, subSlug: string): ServiceCategory | undefined => {
  const topCat = getTopLevelCategory(topSlug);
  return topCat?.subcategories.find(sub => sub.slug === subSlug);
};

export const getAllSubcategories = (): Array<ServiceCategory & { topCategory: string }> => {
  return topLevelCategories.flatMap(top =>
    top.subcategories.map(sub => ({ ...sub, topCategory: top.slug }))
  );
};

export const searchSubcategories = (query: string): Array<ServiceCategory & { topCategory: string }> => {
  const lowerQuery = query.toLowerCase();
  return getAllSubcategories().filter(sub => {
    const nameMatch = sub.name.toLowerCase().includes(lowerQuery);
    const descMatch = sub.description.toLowerCase().includes(lowerQuery);
    const keywordMatch = sub.keywords?.some(kw => kw.toLowerCase().includes(lowerQuery));
    return nameMatch || descMatch || keywordMatch;
  });
};

export const getCurrentSeasonHighlights = (): SeasonalHighlight[] => {
  const currentMonth = new Date().getMonth() + 1; // getMonth() is 0-indexed
  const season = seasonalConfig.find(s => s.months.includes(currentMonth));
  return season?.highlights || [];
};

export const getSeasonalSubcategories = (): Array<ServiceCategory & { topCategory: string; headline: string; reason: string }> => {
  const highlights = getCurrentSeasonHighlights();
  return highlights.map(h => {
    const sub = getSubcategory(h.topCategorySlug, h.subcategoryId) ||
                getAllSubcategories().find(s => s.id === h.subcategoryId);
    if (!sub) return null;
    return {
      ...sub,
      topCategory: h.topCategorySlug,
      headline: h.headline,
      reason: h.reason,
    };
  }).filter(Boolean) as Array<ServiceCategory & { topCategory: string; headline: string; reason: string }>;
};

// =============================================================================
// MEMBERSHIP TIERS - Re-exported from pricingTiers.ts (single source of truth)
// =============================================================================

import {
  pricingTiers,
  type TierKey,
  getTier,
  getCategoryLimit,
  getTierSortPriority,
} from './pricingTiers';

// Re-export for convenience
export { pricingTiers, getTier, getCategoryLimit, getTierSortPriority };
export type { TierKey };

// Legacy compatibility: map old tier names to new ones
// Old: basic, verified, premium, elite
// New (v1): unclaimed, claimed, verified, foundingPartner
const legacyTierMapping: Record<string, TierKey> = {
  basic: 'claimed',
  verified: 'verified',
  premium: 'verified',        // No V+ in v1, maps to Verified
  elite: 'foundingPartner',
};

// Legacy membershipTiers object for backward compatibility
// DEPRECATED: Use pricingTiers from '@/data/pricingTiers' instead
export const membershipTiers = {
  basic: {
    name: pricingTiers.claimed.displayName,
    price: 'Free',
    badge: pricingTiers.claimed.badge,
    color: pricingTiers.claimed.badgeColor,
    features: pricingTiers.claimed.features.slice(0, 3),
    categoryLimit: pricingTiers.claimed.categoryLimit,
    priority: pricingTiers.claimed.sortPriority,
  },
  verified: {
    name: pricingTiers.verified.displayName,
    price: `$${pricingTiers.verified.monthlyPrice}/mo`,
    badge: pricingTiers.verified.badge,
    color: pricingTiers.verified.badgeColor,
    features: pricingTiers.verified.features.slice(0, 5),
    categoryLimit: pricingTiers.verified.categoryLimit,
    priority: pricingTiers.verified.sortPriority,
  },
  // premium maps to verified in v1 (no Verified+ tier)
  premium: {
    name: pricingTiers.verified.displayName,
    price: `$${pricingTiers.verified.monthlyPrice}/mo`,
    badge: pricingTiers.verified.badge,
    color: pricingTiers.verified.badgeColor,
    features: pricingTiers.verified.features.slice(0, 5),
    categoryLimit: pricingTiers.verified.categoryLimit,
    priority: pricingTiers.verified.sortPriority,
  },
  // elite maps to foundingPartner in v1
  elite: {
    name: pricingTiers.foundingPartner.displayName,
    price: 'Contact Us',
    badge: pricingTiers.foundingPartner.badge,
    color: pricingTiers.foundingPartner.badgeColor,
    features: pricingTiers.foundingPartner.features.slice(0, 5),
    categoryLimit: pricingTiers.foundingPartner.categoryLimit,
    priority: pricingTiers.foundingPartner.sortPriority,
  },
};

export type MembershipTier = keyof typeof membershipTiers;

// Helper to convert legacy tier name to new tier key
export const getLegacyTierKey = (legacyName: string): TierKey => {
  return legacyTierMapping[legacyName] || 'claimed';
};

// =============================================================================
// LEGACY COMPATIBILITY (to avoid breaking existing code during migration)
// =============================================================================

// Maps old flat structure to new nested structure
export const serviceCategories = getAllSubcategories().map(sub => ({
  id: sub.id,
  name: sub.name,
  slug: sub.slug,
  bucket: sub.topCategory,
  description: sub.description,
  icon: sub.icon,
  subcategories: [], // Legacy field
  featured: ['plumbing', 'electrical', 'hvac', 'mechanic', 'remodeling'].includes(sub.id),
}));

export const serviceBuckets = topLevelCategories.map(cat => ({
  id: cat.id,
  name: cat.name,
  slug: cat.slug,
  description: cat.description,
  icon: cat.icon,
  color: cat.color,
}));

export const getServiceCategory = (slug: string) => {
  return serviceCategories.find(cat => cat.slug === slug);
};

export const getCategoriesByBucket = (bucketSlug: string) => {
  return serviceCategories.filter(cat => cat.bucket === bucketSlug);
};

export const getBucket = (slug: string) => {
  return serviceBuckets.find(b => b.slug === slug);
};

export const getFeaturedCategories = () => {
  return serviceCategories.filter(cat => cat.featured);
};
