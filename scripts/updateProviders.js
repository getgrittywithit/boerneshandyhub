const fs = require('fs');
const path = require('path');

// Load existing providers
const providersPath = path.join(__dirname, '../src/data/serviceProviders.json');
const data = JSON.parse(fs.readFileSync(providersPath, 'utf8'));

// Research data for all providers
const researchData = {
  // PLUMBING (already updated, but including for completeness)
  "hill-country-plumbing": {
    description: "Hill Country Plumbing is a family-owned plumbing and gas service company serving Boerne and surrounding areas since 1974. Founded by Billy Stevens, a retired U.S. Air Force veteran and Boerne native, the company was built on hard work, fair pricing, and treating every customer like family. Now in its second generation of family ownership, the business has earned over 500 five-star Google reviews and been voted 'Best of the Best' in Boerne multiple consecutive years.",
    address: "122 Industrial Dr, Boerne, TX 78006",
    phone: "(830) 249-2782",
    services: ["Faucet Repairs", "Water Heater Services", "Leak Repairs", "Emergency Plumbing Services", "Sewer Line Replacements", "General Plumbing Services", "Gas Line Services"],
    keywords: ["family-owned", "veteran-founded", "50+ years experience", "no upselling", "fair pricing", "Best of the Best winner", "emergency plumbing"]
  },
  "olde-town-plumbing": {
    description: "Olde Town Plumbing is an independent, veteran-owned and operated plumbing company serving Boerne and the Texas Hill Country. Owner Rob Williams brings over 30 years of master plumber experience to every job. The company has earned the Boerne Star's 'Best-of-the-Best' Popular Choice designation. They provide licensed, insured plumbing services with free estimates and upfront pricing.",
    address: "128 W. Bandera Rd, Boerne, TX 78006",
    phone: "(830) 446-5227",
    services: ["Water Heater Repair & Replacement", "Tankless Water Heater Installation", "Water Softener Installation", "Whole House Water Filtration", "Plumbing Repipes", "Leak Detection & Repair", "Gas Line Installation & Repair", "Backflow Testing", "Drain Cleaning", "Emergency Plumbing Services"],
    keywords: ["veteran-owned", "master plumber", "30 years experience", "Best-of-the-Best winner", "hard water solutions", "water filtration", "emergency services"]
  },
  "the-plumbing-bros": {
    description: "The Plumbing Bros is a veteran-owned and operated plumbing company serving Boerne and the greater San Antonio area. Founded in 2023 by Grant Prudhomme, who brings over 20 years of industry experience. As a BBB Accredited business, they are committed to upholding high standards of trust and customer service.",
    address: "30775 Interstate 10 West, Boerne, TX 78006",
    phone: "(830) 490-2767",
    services: ["Leak Detection", "Water Softener Installation", "Water Heater Services", "Drain Cleaning", "Residential Plumbing", "Commercial Plumbing", "General Plumbing Repairs"],
    keywords: ["veteran-owned", "BBB accredited", "20+ years experience", "residential plumbing", "commercial plumbing"]
  },
  "rittimann-plumbing": {
    description: "Rittimann Plumbing is a family-owned and operated business that has served the greater Boerne area with exceptional quality since 1977. The company boasts over 200 years of combined plumbing experience among their team, with employees averaging 25 years of tenure. They maintain long-term relationships with the best local builders.",
    address: "111 Shooting Club Road, Boerne, TX 78006",
    phone: "(830) 249-9361",
    services: ["Residential Plumbing", "Commercial Plumbing", "Large Installation Projects", "Home Plumbing Repairs", "Backflow Services", "Remodeling Contractor Services", "Water Leak Repair", "Faucet Repair"],
    keywords: ["family-owned", "since 1977", "48 years experience", "200+ years combined experience", "repair over replace philosophy"]
  },
  "gottfried-plumbing": {
    description: "Gottfried Plumbing is a local, family-owned plumbing company serving the Texas Hill Country with pride and integrity. Voted Best Plumber by the Boerne Star, they have built a reputation for quality service at affordable prices. They provide 24/7 emergency response services and offer slab leak detection and rainwater collection systems.",
    address: "607 E Blanco Rd, Boerne, TX 78006",
    phone: "(830) 331-2055",
    services: ["Bathroom Plumbing", "Kitchen Plumbing", "Faucet Installation & Repair", "Drain Cleaning", "Leak Detection & Repair", "Slab Leak Detection", "Water Heaters", "Tankless Water Heaters", "Water Softeners", "Rainwater Collection Systems", "Sewer Cleaning & Repair", "24/7 Emergency Plumbing"],
    keywords: ["family-owned", "Best Plumber award", "24/7 emergency", "slab leak detection", "water treatment", "rainwater collection"]
  },
  "pulliam-plumbing": {
    description: "Pulliam Plumbing Services is a local plumbing contractor serving Boerne and Fair Oaks Ranch with over 15 years of plumbing repair experience. They provide complete plumbing solutions with affordable pricing and 24/7 emergency service. They offer 10% discounts to military personnel, first responders, teachers, and new customers.",
    address: "729 Mountain Creek Trail, Boerne, TX 78006",
    phone: "(210) 263-3005",
    services: ["Garbage Disposal Repair", "Drain Cleaning", "Sewer Cleaning", "Shower Repair & Installation", "Toilet Repair & Installation", "Water Heater Repair & Installation", "Tankless Water Heater Installation", "Leaking Pipes Repair", "24/7 Emergency Plumbing", "Water Softeners", "Sprinkler Repair", "Backflow Repair & Testing", "Water Filtration Systems"],
    keywords: ["15+ years experience", "24/7 emergency", "military discount", "first responder discount", "teacher discount", "Fair Oaks Ranch"]
  },

  // ELECTRICAL
  "tex-star-power": {
    description: "Tex Star Power Group, LLC is a full-service electrical contracting company based in Boerne, Texas, providing electrical services since 1994. With nearly three decades of industry experience, they serve clients throughout the Texas Hill Country region. The company specializes in both commercial and residential electrical work, including new construction, remodels, and barndominiums.",
    address: "Boerne, TX 78006",
    phone: "(830) 499-2559",
    services: ["Residential Electrical", "Commercial Electrical", "Barndominium Electrical", "New Construction Wiring", "Electrical Remodels", "Service and Repairs", "Panel Replacements", "Generator Installation", "24/7 Emergency Services"],
    keywords: ["licensed electrician", "commercial electrical", "residential electrical", "barndominiums", "generators", "emergency services", "since 1994"]
  },
  "total-electric-pro": {
    description: "Total Electric Pro, LLC is a residential and light commercial electrical service company founded in 2022, serving the San Antonio area including Boerne. The team brings 35 years of combined electrical experience. They are a certified GENERAC dealer and BBB accredited business offering free estimates.",
    address: "San Antonio, TX (serving Boerne)",
    phone: "(210) 350-7143",
    services: ["Whole Home Generator Installation", "Electrical Panel Upgrades", "EV Charger Installation", "Interior Lighting Upgrades", "Exterior Lighting", "Smart Home Integration", "Troubleshooting and Service Calls", "Security Camera Installation"],
    keywords: ["GENERAC dealer", "EV charger installation", "smart home", "panel upgrades", "BBB certified", "generator installation"]
  },
  "kehler-electric": {
    description: "Kehler Electric is a family-owned electrical contracting company based in Boerne, Texas, with over 50 years of combined electrical experience. Owner Brandon grew up in Boerne and attended Boerne High School. The company holds Texas Electrical Contractor License #TECL 28477 and employs master electricians.",
    address: "5 North Star Road, Boerne, TX 78015",
    phone: "(830) 981-4401",
    services: ["New Home Wiring", "Commercial Buildouts", "Generator Installations", "Remodeling Projects", "Sports Court Electrical", "Horse Arena Lighting", "Electrical Inspections", "Repair and Maintenance"],
    keywords: ["family-owned", "master electrician", "50 years experience", "new construction", "commercial buildouts", "generators", "licensed contractor"]
  },
  "boerne-master-electrician": {
    description: "Boerne Master Electrician is an electrical service provider offering both residential and commercial electrical solutions in the Boerne, Texas area. They employ master electricians to handle electrical projects of varying complexity throughout the Texas Hill Country region.",
    address: "Boerne, TX 78006",
    phone: "",
    services: ["Residential Electrical Services", "Commercial Electrical Services"],
    keywords: ["master electrician", "residential electrical", "commercial electrical", "Boerne electrician"]
  },

  // HVAC
  "boerne-ac-and-heating": {
    description: "Boerne AC & Heating is a locally managed HVAC service provider celebrating over 45 years of operation in the Texas Hill Country. Their team of NATE certified technicians provides expert service for all makes and models, backed by a 100% satisfaction guarantee. Voted Best of Boerne with an A+ BBB rating.",
    address: "7 Toepperwein Rd, Boerne, TX 78006",
    phone: "(830) 816-3828",
    services: ["AC Repair", "AC Installation", "Heater Repair", "Heater Installation", "Furnace Repair", "AC Maintenance", "Ductwork Services", "Indoor Air Quality", "System Replacement"],
    keywords: ["NATE certified", "A+ BBB rating", "Best of Boerne", "45 years experience", "same-day service", "interest-free financing"]
  },
  "comfort-boys": {
    description: "Comfort Boys is one of the oldest and most professional HVAC companies serving San Antonio and the Texas Hill Country region. They provide comprehensive heating, cooling, and air quality solutions with unique expertise in wine cellar repair and commercial refrigeration for walk-in coolers and freezers.",
    address: "29690 Interstate 10 Frontage Rd, Boerne, TX 78006",
    phone: "(830) 251-5374",
    services: ["AC Installation", "AC Service and Tune-ups", "AC Repair", "Mini Split Installation", "Smart Thermostat Installation", "Duct Cleaning", "Heater Installation", "Heater Repair", "Heat Pump Repair", "Wine Cellar Repair", "Commercial Cooler Repair", "Commercial Freezer Repair"],
    keywords: ["upfront flat-rate pricing", "same-day response", "Comfort Club membership", "wine cellar specialist", "commercial refrigeration"]
  },
  "cowboys-ac": {
    description: "Cowboys Air Conditioning & Heating is a family-owned HVAC company founded in 1985, recognized as the San Antonio region's fastest-expanding heating and cooling provider. Operating 24/7 with emergency service, they are an authorized Trane dealer with A+ BBB rating. They offer 10% discounts for seniors, first responders, educators, and military.",
    address: "6510 Blanco Rd, San Antonio, TX 78216",
    phone: "(210) 495-7771",
    services: ["AC Repair", "AC Installation", "Emergency AC Service", "Furnace Repair", "Furnace Installation", "Heat Pump Services", "Ductless Mini-Split Systems", "Duct Cleaning", "Duct Sealing", "Indoor Air Quality", "Smart Thermostat Installation", "HVAC Maintenance Plans"],
    keywords: ["family-owned", "authorized Trane dealer", "A+ BBB rating", "24/7 emergency service", "Cowboys Cares", "military discount", "senior discount", "since 1985"]
  },
  "champion-home-services": {
    description: "Champion Home Services is a comprehensive home services contractor established in 2007, serving South Central Texas with HVAC, plumbing, and electrical solutions. Their NATE and ACCA certified technicians have earned Angie's List Super Service Awards and an A+ BBB rating. They offer no service call fees and free second opinions.",
    address: "5 Upper Cibolo Creek Rd, Unit 4A, Boerne, TX 78006",
    phone: "(210) 528-1604",
    services: ["AC Repair", "AC Installation", "AC Tune-ups", "Ductless AC Systems", "Ductwork Repair", "Duct Cleaning", "Heating Repair", "Furnace Installation", "Heat Pump Installation", "Emergency AC Repair", "Commercial AC Services", "Indoor Air Quality"],
    keywords: ["NATE certified", "ACCA certified", "A+ BBB rating", "Angie's List Super Service Award", "24/7 emergency service", "no service call fees", "free second opinion", "since 2007"]
  },
  "frontrunner-ac": {
    description: "Frontrunner Air Conditioning & Heating is a family-owned HVAC company serving Fair Oaks Ranch, Boerne, and surrounding areas since 2011. Owner Kenny Sides brings over 20 years of heating and cooling experience. As certified Trane dealers, they are members of the Greater Boerne Chamber of Commerce.",
    address: "Fair Oaks Ranch, TX 78015",
    phone: "(210) 381-5724",
    services: ["AC Sales", "AC Service", "AC Repair", "AC Installation", "Heating Sales", "Heating Service", "Heating Repair", "Heating Installation", "HVAC Maintenance", "Full-System Repairs", "Trane System Installation"],
    keywords: ["family-owned", "certified Trane dealer", "20+ years experience", "since 2011", "Greater Boerne Chamber member", "Fair Oaks Ranch", "honest pricing"]
  },

  // ROOFING
  "kendall-county-roofing": {
    description: "Kendall County Roofing (KCR) is a residential and commercial roofing contractor headquartered in Boerne, Texas, serving all of Kendall County and surrounding South Texas areas. The company emphasizes integrity, quality workmanship, and customer-first service. As a BBB-accredited business, they offer financing options.",
    address: "117 Commerce Ave., Boerne, TX 78006",
    phone: "(830) 230-5003",
    services: ["New Construction Roofing", "Commercial Roofing", "Roof Inspections", "Roof Replacement", "Roof Repairs", "Reroofing", "Shingle Roofing", "Metal Roofing", "Tile Roofing"],
    keywords: ["residential roofing", "commercial roofing", "BBB accredited", "shingles", "metal roofing", "tile roofing", "financing available", "roof inspections"]
  },
  "ja-mar-roofing": {
    description: "Ja-Mar Roofing & Sheet Metal is a premier Texas roofing company established in 1969. With over five decades of experience, they are a GAF Master Elite Contractor - a distinction held by only 2% of roofers in North America. Their state-of-the-art sheet metal shop specializes in custom flashings.",
    address: "11103 San Pedro #120, San Antonio, TX 78216",
    phone: "(512) 441-8437",
    services: ["Commercial Roofing", "Residential Roofing", "Industrial Roofing", "Roof Construction", "Roof Repair", "Roof Replacement", "Roof Inspections", "Solar Roofing", "Slate Roofing", "Tile Roofing", "Cedar Wood Roofing", "Metal Roofing", "Custom Sheet Metal Fabrication", "Gutters and Downspouts"],
    keywords: ["GAF Master Elite", "since 1969", "sheet metal", "custom fabrication", "slate roofing", "cedar wood", "solar roofing", "commercial roofing"]
  },
  "eternal-roofing": {
    description: "Eternal Roofing & General Contracting is an A+ BBB-rated roofing company based in Bulverde, Texas, serving Boerne, New Braunfels, Canyon Lake, and Spring Branch. Beyond roofing, they offer comprehensive general contracting services including gutter installation, painting, and flooring. They offer free roof inspections.",
    address: "Bulverde, TX (serves Boerne area)",
    phone: "(830) 251-5673",
    services: ["Roof Repairs", "Roof Replacements", "Free Roof Inspections", "Residential Roofing", "Commercial Roofing", "Gutter Installation", "Painting", "Sheetrock Repairs", "Woodwork", "Flooring Installations"],
    keywords: ["A+ BBB rated", "general contracting", "free inspections", "family owned", "community involvement", "Texas Hill Country"]
  },
  "williamson-roofing": {
    description: "Williamson Roofing is a complete roofing source for residential and commercial projects, with locations in Boerne and Marble Falls. They specialize in new construction and reroofs, working closely with builders and project managers. Recognized by the Better Business Bureau and Greater San Antonio Business Association.",
    address: "112 Shooting Club Road, Boerne, TX 78006",
    phone: "(830) 249-7939",
    services: ["Residential Roofing", "Commercial Roofing", "New Construction Roofing", "Reroofs and Repairs", "Custom Work", "Standing Seam Metal Roofing", "Concrete Tile Roofing", "Clay Tile Roofing", "Asphalt Shingles", "Flat Roof Systems", "Wall Panels", "Custom Chimney Caps"],
    keywords: ["new construction", "BBB accredited", "standing seam metal", "tile roofing", "custom work", "builder partnerships", "project management"]
  },
  "roof-pros": {
    description: "Roof Pros LLC is a family-owned roofing company founded in 2018, serving Boerne and greater San Antonio. They have grown into a multimillion-dollar company built on honesty, integrity, and community involvement. Fully licensed, insured, and bonded, they specialize in insurance claim assistance for storm damage.",
    address: "27462 IH-10 W, Boerne, TX 78006",
    phone: "(210) 236-5653",
    services: ["Residential Roofing", "Commercial Roofing", "Roof Repair", "Roof Replacement", "Insurance Claim Assistance", "Storm Damage Repair", "Metal Roofing", "Standing Seam Roofing", "Tile Roofing", "Shingle Roofing", "Flat Roofing", "Free Estimates", "Emergency Repairs"],
    keywords: ["family owned", "insurance claims", "storm damage", "licensed and insured", "free estimates", "financing available", "metal roofing"]
  },

  // FENCING
  "comal-fence": {
    description: "Comal Fence is a family-owned fence company serving San Antonio, Boerne, and Comal County since 2007. With over 30 years of combined industry experience, they specialize in professional fence installation and repair. BBB accredited with an A+ rating.",
    address: "734 Tecumseh Dr, San Antonio, TX 78260",
    phone: "(210) 686-3932",
    services: ["Wood Fence Installation", "Cedar Privacy Fencing", "Wrought Iron Fencing", "Chain Link Fencing", "Vinyl Fencing", "Fence Repairs", "Residential Fencing", "Commercial Fencing", "Ranch Fencing"],
    keywords: ["wood fence", "cedar fence", "privacy fence", "wrought iron", "chain link", "vinyl fence", "BBB accredited", "family-owned"]
  },
  "boerne-fencing": {
    description: "Boerne Fencing is a local fence company serving Boerne and surrounding Hill Country communities. They specialize in well-crafted fencing solutions focused on security, privacy, and property enhancement with multiple fence styles.",
    address: "Boerne, TX 78006",
    phone: "",
    services: ["Privacy Fences", "Ranch Style Fences", "Equipment Covers", "Custom Fence Design", "Fence Installation", "Fence Repairs"],
    keywords: ["privacy fence", "ranch fence", "equipment covers", "custom fencing", "property security"]
  },
  "inline-fence-and-fabrication": {
    description: "Inline Fence & Fabrication is an insured, full-service fence and fabrication company established in 2009, serving residential, commercial, industrial, and oil field customers. With over 50 years of combined experience, they are a trusted partner for major oil field companies.",
    address: "106 Shooting Club Rd Unit A, Boerne, TX 78006",
    phone: "(830) 428-2660",
    services: ["Wood Privacy Fencing", "Wrought Iron Fencing", "Chain Link Fencing", "Vinyl Fencing", "Pipe Rail Fencing", "Barbed Wire Fencing", "Game and Field Fences", "Gate Operator Installation", "Guard Rail Fabrication", "Industrial Fencing", "Oil Field Services"],
    keywords: ["wood fence", "wrought iron", "chain link", "pipe rail", "barbed wire", "game fence", "fabrication", "oil field", "industrial"]
  },

  // PEST CONTROL
  "witten-pest-control": {
    description: "Witten Pest Control is a locally-owned pest management company serving the San Antonio area since 1948, making them one of the original pest control companies with over 75 years of service across three generations. They offer pet-friendly solutions, no long-term contracts, and free inspections.",
    address: "9595 Hwy 87 E, Ste 104, San Antonio, TX 78263",
    phone: "(210) 625-3056",
    services: ["Residential Pest Control", "Commercial Pest Control", "Ant Control", "Bed Bug Treatment", "Cockroach Control", "Flea Control", "Mosquito Control", "Scorpion Control", "Spider Control", "Termite Control", "Rodent Control", "Quarterly Pest Control Programs", "Free Inspections"],
    keywords: ["pest control", "termite", "rodent control", "bed bugs", "pet-friendly", "family-owned", "since 1948", "75+ years"]
  },
  "covenant-pest-control": {
    description: "Covenant Pest Control is a family-owned pest control company operating in the Boerne area since 2013. They provide customized pest control solutions with pet and family-friendly treatment options and eco-friendly choices. They offer free re-services guarantee.",
    address: "50502A I 10 W, Comfort, TX 78013",
    phone: "(830) 320-4002",
    services: ["Termite Control", "New Construction Termite Treatments", "Residential Pest Control", "Commercial Pest Control", "Fire Ant Control", "Mosquito Control", "Rodent Control", "Spider Control", "Lawn Fertilization", "Weed Control", "WDI Inspections", "Eco-Friendly Pest Control"],
    keywords: ["pest control", "termite", "fire ants", "mosquitoes", "lawn care", "eco-friendly", "pet-friendly", "family-owned"]
  },
  "barefoot-mosquito-and-pest": {
    description: "Barefoot Mosquito & Pest Control has served Texas and Oklahoma since 1996. The company emphasizes safe and effective pest solutions using innovative approaches that reduce pesticide use. They offer same-day service, free inspections, and a 12-month guarantee.",
    address: "7825 Mainland Dr, San Antonio, TX 78250",
    phone: "(888) 840-5806",
    services: ["Residential Pest Control", "Commercial Pest Control", "Ant Control", "Bed Bug Treatment", "Chigger Control", "Cockroach Control", "Flea and Tick Control", "Mosquito Control", "Rodent Control", "Scorpion Control", "Spider Control", "Termite Control", "Lawn Care Services"],
    keywords: ["mosquito control", "pest control", "eco-friendly", "safe pest control", "termite", "bed bugs", "same-day service", "12-month guarantee"]
  },
  "go-away-pest-control": {
    description: "Go Away Pest Control is a local and veteran-owned business providing over 30 years of pest and wildlife control in Boerne. They specialize in humane wildlife removal with same-day service and an 18-month guarantee. They offer senior and veteran discounts.",
    address: "309 Water St Suite 109, Boerne, TX 78006",
    phone: "(830) 816-5005",
    services: ["Wildlife and Animal Removal", "Raccoon Removal", "Squirrel Removal", "Bat Removal", "Mouse and Rat Removal", "Ant Control", "Scorpion Control", "Termite Control", "Mosquito Misting Systems", "Entry Point Sealing", "Exclusion Services", "Free Inspections"],
    keywords: ["wildlife removal", "pest control", "humane removal", "veteran-owned", "same-day service", "18-month guarantee", "senior discount", "veteran discount"]
  },

  // LANDSCAPING
  "boerne-lawn-care": {
    description: "Boerne Lawn Care is a family-owned and operated lawn care service that has been serving Boerne and Fair Oaks Ranch since 1987. With nearly four decades of experience, they specialize in residential lawn maintenance with reliable, personalized service.",
    address: "Boerne, TX 78006",
    phone: "(210) 710-5010",
    services: ["Lawn Mowing", "Grass Cutting", "Lawn Trimming", "Residential Lawn Maintenance"],
    keywords: ["family-owned", "lawn mowing", "residential lawn care", "Boerne", "Fair Oaks", "established 1987"]
  },
  "maldonado-landscape-co": {
    description: "Maldonado Landscape Company is a full-service landscaping firm with over 30 years of experience serving Boerne and the Hill Country. They operate both retail and wholesale landscape materials yard and nursery, stocking native Texas plants. They offer military discounts and free estimates.",
    address: "136 Adler Rd, Boerne, TX 78006",
    phone: "(830) 249-4694",
    services: ["Landscape Design", "Landscape Installation", "Irrigation Sprinkler System Design", "Irrigation Installation", "Landscape Lighting", "Native Tree Installation", "Native Plant Installation", "Landscape Materials Sales", "Nursery", "Mulch Delivery", "Soil Delivery", "Stone Delivery"],
    keywords: ["landscape design", "irrigation", "native plants", "nursery", "landscape materials", "30+ years experience", "licensed irrigation", "military discount"]
  },
  "acacia-landscape-and-design": {
    description: "Acacia Landscape & Design has been transforming outdoor spaces throughout the Texas Hill Country since 1998. With over 25 years of experience, they specialize in custom landscape designs using 3D design renderings. Their outdoor showroom in Boerne allows customers to experience materials firsthand.",
    address: "32255 IH 10 West A, Boerne, TX 78006",
    phone: "(830) 816-3200",
    services: ["Landscape Design and Consultation", "Landscape Installation", "Existing Landscape Improvements", "Irrigation System Design", "Irrigation Installation", "3D Design Renderings", "Outdoor Showroom Visits"],
    keywords: ["luxury landscaping", "Hill Country", "landscape design", "custom irrigation", "3D renderings", "established 1998", "outdoor showroom"]
  },
  "green-space-landscape": {
    description: "Green Space is a full-service landscape firm that has served Boerne for over 20 years. As a locally owned company, they provide comprehensive landscaping from routine lawn maintenance to complete outdoor living transformations including stonework and irrigation.",
    address: "153 Highway 46 E, Boerne, TX 78006",
    phone: "(830) 331-8781",
    services: ["Lawn Mowing", "Edging", "Weed Eating", "Leaf Removal", "Shrub Trimming", "Tree Trimming", "Landscape Design Installation", "Outdoor Living Design", "Mulch Installation", "Irrigation Installation", "Irrigation Repair", "Stone Work", "Retaining Walls", "Fountain Installation"],
    keywords: ["full-service landscaping", "lawn maintenance", "irrigation repair", "stonework", "outdoor living", "20+ years experience", "locally owned"]
  },

  // TREE SERVICE
  "central-tx-tree-service": {
    description: "Central Texas Tree Service is a professional tree care company serving Fair Oaks Ranch and greater Boerne. They provide expert arborist services focused on maintaining the health and safety of residential trees with precise trimming and complete removal when necessary.",
    address: "8000 Fair Oaks Parkway, Fair Oaks Ranch, TX 78015",
    phone: "(830) 431-8503",
    services: ["Tree Trimming", "Tree Removal", "Arborist Services"],
    keywords: ["tree service", "tree trimming", "tree removal", "arborist", "Fair Oaks Ranch", "professional tree care"]
  },
  "clean-cut-chainsaw": {
    description: "Clean Cut Chainsaw Tree Service is a family-owned tree care company founded in 2016 in Boerne. Led by Matt Bell, an experienced arborist and Live Oak specialist, they focus on non-invasive clearing methods and ecosystem balance.",
    address: "Boerne, TX 78006",
    phone: "(830) 289-8234",
    services: ["Residential Tree Trimming", "Tree Pruning and Shaping", "Non-Invasive Land Clearing", "Storm Damage Cleanup", "Dead Tree Removal", "Cedar Removal", "Ball Moss Removal", "Large Lot Tree Planning", "Diseased Tree Removal"],
    keywords: ["Live Oak specialist", "certified arborist", "non-invasive clearing", "family-owned", "cedar removal", "ball moss removal", "free estimates"]
  },
  "gilbert-tree-service": {
    description: "Gilbert Tree Service has provided high-quality tree care for nearly a decade throughout Boerne, Kerrville, Fredericksburg, and Bandera. Their certified professional arborists serve residential, commercial, and ranch properties with discounts for veterans, first responders, and seniors. 24/7 emergency services available.",
    address: "1415 East Blanco Road Suite 7, Boerne, TX 78006",
    phone: "(830) 928-3366",
    services: ["Tree Removal", "Tree Trimming and Pruning", "Stump Grinding and Removal", "Ball Moss Removal", "Micro-Infusions", "Tree Installation", "Vertical Mulching", "Shrub Maintenance", "Land Clearing", "Firewood Sales", "Mulch Sales", "24/7 Emergency Services"],
    keywords: ["certified arborist", "tree health", "emergency tree service", "stump grinding", "veteran discount", "senior discount", "first responder discount", "firewood", "mulch"]
  },
  "tree-amigos": {
    description: "Tree Amigos is a professional tree care company with over 20 years of experience serving Boerne and San Antonio. Led by an ISA-Certified Arborist and Texas Oak Wilt Qualified specialist, all projects are owner-supervised. Licensed and bonded with 24/7 emergency services.",
    address: "25518 W I-10 Frontage Rd, San Antonio, TX 78257",
    phone: "(210) 389-8733",
    services: ["Tree Removal", "Tree Trimming", "Oak Wilt Management", "Fungicide Injections", "Root Barrier Installations", "Land Clearing", "Lot Clearing", "Landscape Lighting", "Consulting Services", "Farm and Ranch Services", "24/7 Emergency Tree Services"],
    keywords: ["ISA-certified arborist", "oak wilt qualified", "licensed and bonded", "owner-supervised", "oak wilt management", "emergency service", "fungicide injection"]
  },

  // HANDYMAN
  "the-boerne-handyman": {
    description: "The Boerne Handyman is a family-owned home improvement company founded by Curtis Ormond, serving Boerne with strong values and dedication to excellence. They specialize in transforming homes through quality workmanship and offer smart home technology integration.",
    address: "PO Box 1000, Boerne, TX 78006",
    phone: "(210) 872-0133",
    services: ["Home Improvement", "Plumbing", "Landscaping", "Land Clearing", "Driveway Work", "Roofing", "Walls and Floors", "Home IT Assistance", "Flooring Installation", "Drywall Repair"],
    keywords: ["family-owned", "handyman", "home improvement", "plumbing", "landscaping", "roofing", "flooring", "drywall", "smart home"]
  },
  "mr-handyman": {
    description: "Mr. Handyman of North San Antonio and Stone Oak is a professional handyman service serving Boerne and surrounding Hill Country communities. As part of the Neighborly family, their experienced craftsmen can tackle multiple projects in a single visit.",
    address: "21750 Hardy Oak Blvd, Ste 102-301, San Antonio, TX 78258",
    phone: "",
    services: ["Door Repair and Installation", "Window Repair and Installation", "Patio Construction", "Carpentry", "Drywall Repair", "Furniture Assembly", "Remodel Projects", "Deck Construction", "Home Maintenance", "General Home Repairs"],
    keywords: ["franchise", "handyman", "home repair", "carpentry", "drywall", "deck construction", "Neighborly"]
  },
  "ace-handyman-services": {
    description: "Ace Handyman Services Northwest San Antonio & Boerne is a locally owned professional handyman business serving since 2013. As part of the Ace Hardware family, they employ fully bonded and insured craftsmen with a comprehensive 1-year warranty on all work.",
    address: "28720 I-10, Ste 420, Boerne, TX 78006",
    phone: "(210) 549-9714",
    services: ["Bathroom Remodeling", "Doors and Windows", "Drywall Repairs", "Interior Carpentry", "Exterior Carpentry", "Interior Maintenance", "Exterior Maintenance", "Light Plumbing", "Light Electrical"],
    keywords: ["Ace Hardware", "handyman", "bonded", "insured", "warranty", "bathroom remodeling", "carpentry", "drywall"]
  },

  // PAINTING
  "boerne-painting-pros": {
    description: "Boerne Painting Pros is the leading residential and commercial painting service in Boerne with many years of experience transforming both interior and exterior surfaces. They also offer staining, drywalling, and carpentry work throughout the Hill Country region.",
    address: "215 W Bandera Rd, Ste 114-229, Boerne, TX 78006",
    phone: "(830) 476-7607",
    services: ["Residential Interior Painting", "Residential Exterior Painting", "Commercial Painting", "Staining", "Drywall Installation and Repair", "Carpentry"],
    keywords: ["painting contractor", "interior painting", "exterior painting", "commercial painting", "staining", "drywall", "carpentry"]
  },
  "noble-painting-llc": {
    description: "Noble Painting LLC is a residential and commercial painting company based in Boerne committed to delivering quality and professional workmanship. Their experienced team specializes in transforming homes and businesses including kitchen cabinet refinishing.",
    address: "Boerne, TX 78006",
    phone: "",
    services: ["Residential Interior Painting", "Residential Exterior Painting", "Commercial Painting", "Kitchen Cabinet Painting", "Interior Home Improvement Projects"],
    keywords: ["painting contractor", "commercial painter", "residential painting", "interior painting", "exterior painting", "cabinet refinishing"]
  },
  "hendrick-painting": {
    description: "Hendrick Painting is a family-owned painting company established in 1999 with over 25 years of experience serving San Antonio and the Hill Country including Boerne. As an EPA Lead-Safe Certified company, they use eco-friendly, low-VOC paints with transparent pricing.",
    address: "9901 McDermott Freeway, I-10 Suite 800, San Antonio, TX 78230",
    phone: "(210) 499-5400",
    services: ["Interior Painting", "Exterior Painting", "Cabinet Painting and Refinishing", "Commercial Painting", "Office Building Painting", "Retail Space Painting", "Apartment Painting", "Warehouse Painting", "Color Consultation"],
    keywords: ["family-owned", "EPA Lead-Safe Certified", "eco-friendly", "low-VOC paints", "interior painting", "exterior painting", "cabinet refinishing", "commercial painting"]
  },

  // REMODELING
  "cmw-general-contractors": {
    description: "CMW General Contractors is a family-owned Hill Country construction firm established in 1999. Owner Jimmy Stewart personally supervises each project. They handle diverse projects including custom homes, barndominiums, renovations, and metal buildings throughout Texas Hill Country.",
    address: "Spring Branch, TX 78070",
    phone: "(210) 394-7792",
    services: ["Custom Homes", "Barndominiums", "Renovations and Remodels", "Metal Buildings and Barns", "Masonry and Concrete Work", "Commercial Buildouts", "Finish-Out Services", "Home Construction", "Office Construction", "Fencing", "Gates", "Metal Railings"],
    keywords: ["general contractor", "custom homes", "barndominium", "remodeling", "metal buildings", "masonry", "concrete", "commercial buildout", "Hill Country"]
  },
  "lone-star-construction": {
    description: "Lone Star Construction and Remodeling is a full-service residential and commercial remodeling contractor founded in 1997, specializing in design-build solutions in Boerne. They earned the NARI Contractor of the Year award in 2006 for Kitchen Remodel. They also offer water harvesting systems.",
    address: "1018 River Road, Suite 300, Boerne, TX 78006",
    phone: "(830) 688-6912",
    services: ["Room Additions", "Kitchen Remodels", "Bathroom Renovations", "Decks and Porches", "Outdoor Kitchens", "Commercial Services", "Barns and Outbuildings", "Water Harvesting Systems", "Reclaimed and Demo Work", "Universal Design", "Design-Build Projects"],
    keywords: ["design-build", "remodeling contractor", "kitchen remodel", "bathroom renovation", "room additions", "outdoor kitchen", "water harvesting", "NARI award winner"]
  },
  "haus-design-+-build": {
    description: "Haus Design + Build is a woman-owned, family-operated design-build firm based in Boerne, established in 2021 with over 25 years of combined industry experience. They earned recognition as Boerne's premier remodeler in 2022. They offer 3D rendering and flood/fire restoration services.",
    address: "704 North Main Street, Boerne, TX 78006",
    phone: "(830) 428-4545",
    services: ["3D Rendering", "Architectural Design", "Barn Design and Construction", "Bathroom Design", "Custom Home Building", "Deck Building", "Demolition", "Design Consultation", "Flooring Installation", "Garage Building", "Home Additions", "Home Remodeling", "Kitchen Design", "New Home Construction", "Outdoor Kitchen Design", "Pool House Design", "Swimming Pool Construction", "Flood and Fire Restoration"],
    keywords: ["design-build", "woman-owned", "custom homes", "kitchen remodeling", "bathroom design", "home additions", "outdoor living", "fire restoration", "flood restoration"]
  },
  "1st-rate-remodeling": {
    description: "1st Rate Remodeling is a full-service residential remodeling company serving San Antonio since 2004. This veteran-owned business specializes in kitchen and bathroom remodeling with custom cabinets and countertops. Home Advisor Elite Service award recipient with financing options.",
    address: "401 Isom Rd, Suite 310, San Antonio, TX 78216",
    phone: "(210) 451-0003",
    services: ["Kitchen Remodeling", "Custom Cabinets", "Countertop Installation", "Backsplash and Tile Work", "Bathroom Remodeling", "Shower and Bathtub Installation", "Vanity Installation", "Room Additions", "Custom Fireplaces", "Flooring Installation", "Roofing", "Garage Doors", "Seamless Gutters", "Interior and Exterior Painting", "Custom Outdoor Living Spaces"],
    keywords: ["veteran-owned", "remodeling contractor", "kitchen remodel", "bathroom remodel", "room additions", "custom cabinets", "outdoor living", "Home Advisor Elite"]
  },

  // SEPTIC
  "rw-septic-services": {
    description: "RW Septic Services has served the Boerne area for over 20 years with excellent customer service, integrity, and honesty. They are a one-stop shop for septic construction needs including installation, maintenance, and repairs. Financing available through Synchrony Bank.",
    address: "PO BOX 644, Boerne, TX 78006",
    phone: "(830) 230-5466",
    services: ["Septic Tank Installation", "Septic Tank Cleaning", "Grease Trap Cleaning", "Septic Tank Repairs", "County Permit Applications", "Site Work", "Utility Work", "Driveway Construction", "Excavation Services"],
    keywords: ["septic installation", "septic maintenance", "grease trap", "excavation", "county permits", "20+ years experience"]
  },
  "van-delden-wastewater": {
    description: "Van Delden Wastewater Systems is a 4th-generation family-owned septic company with 88+ years of service since 1937. Having completed over 126,936 services, their non-commissioned technicians hold 23+ licenses and prioritize customer education about system maintenance.",
    address: "26665 I-10, Boerne, TX 78006",
    phone: "(830) 507-2156",
    services: ["Septic Tank Cleaning and Inspection", "Septic Installation and Repairs", "Tank Locating and Replacement", "Aerobic System Maintenance", "Aerobic System Installation", "Spray Head Relocation", "Drip Irrigation Systems", "Drainfield Cleaning and Jetting", "Consultations and Estimates", "Lids and Risers Installation", "Root Removal"],
    keywords: ["family-owned", "4th generation", "aerobic systems", "standard septic", "drainfield services", "88 years experience", "licensed technicians"]
  },
  "san-aerobic": {
    description: "San Aerobic provides prompt, professional septic service throughout the San Antonio region including Boerne with over 15 years of experience. They specialize in resolving recurring septic problems and offer comprehensive aerobic maintenance programs with 24-hour emergency services.",
    address: "24165 West Interstate 10, Suite 217-457, San Antonio, TX 78257",
    phone: "(210) 260-6587",
    services: ["Aerobic Maintenance Programs", "Septic Repair and Installation", "Real Estate Septic Inspections", "Septic Tank Pumping", "24-Hour Emergency Services", "Free Service Quotes"],
    keywords: ["aerobic maintenance", "septic repair", "real estate inspections", "emergency services", "15+ years experience"]
  },

  // AUTO - MECHANIC
  "bradys-auto-repair": {
    description: "Brady's Auto Repair and Diesel has been serving Boerne since 2001 with dependable and transparent car care. This ASE-certified shop specializes in both foreign and domestic vehicles with an industry-leading 3-year/36,000-mile warranty. NAPA Auto Care and AAA Approved facility.",
    address: "225 Market Ave, Boerne, TX 78006",
    phone: "(830) 249-5556",
    services: ["Professional Wheel Alignment", "Engine Diagnostics", "Full Engine Overhauls", "Transmission Services", "Brake Repair", "Major and Minor Auto Repairs", "Routine Maintenance", "Foreign and Domestic Service", "Diesel Repair"],
    keywords: ["ASE certified", "diesel repair", "NAPA Auto Care", "AAA approved", "3 year warranty", "foreign and domestic", "family owned"]
  },
  "hill-country-automotive": {
    description: "Hill Country Automotive operates under the motto 'Complete Auto Repair By People Who Care.' This ASE-certified shop has served the Texas Hill Country for over 10 years, focusing on solving root causes rather than just replacing parts. BBB rated and official state inspection station.",
    address: "32980 Interstate 10 West Frontage Road, Boerne, TX 78006",
    phone: "(830) 331-2489",
    services: ["Brake Repair", "Oil Changes", "Auto Maintenance and Repair", "Diesel Repairs", "Full-Service Maintenance", "Vehicle Inspections", "All Makes and Models", "Free Consultations"],
    keywords: ["ASE certified", "diesel specialist", "BBB rated", "state inspection", "Spanish language services", "all makes and models"]
  },
  "boerne-automotive": {
    description: "Boerne Automotive has proudly served the community since 2004 as a trusted, family-owned auto repair shop with over 30 years of combined expertise. Their ASE Certified Master Technicians offer a 3-year/36,000-mile nationwide warranty. Free towing with repairs, free shuttle, and Uber rides available.",
    address: "31140 Interstate 10 W, Boerne, TX 78006",
    phone: "(830) 755-6062",
    services: ["Transmission Repairs", "Engine Overhauls", "Brake Maintenance", "Air Conditioning Repair", "Computer Diagnostics", "Routine Maintenance", "Foreign and Domestic Service", "High-Performance Import Service"],
    keywords: ["ASE Master Technicians", "family owned", "nationwide warranty", "free towing", "free shuttle", "Uber rides", "Spanish speaking", "high-performance imports"]
  },
  "fair-oaks-automotive": {
    description: "Fair Oaks Automotive is a family-owned auto repair shop with over 20 years of experience serving South Texas. Since 2005, their 18-bay facility has been a NAPA AutoCare Service Center and AAA Approved facility with ASE certified technicians.",
    address: "28485 I-10 W, Boerne, TX 78006",
    phone: "(830) 981-8565",
    services: ["Oil Changes", "Towing Service", "AC and Heating Repair", "Wheel Alignment", "Alternator and Starter Repair", "Vehicle Inspections", "Full Engine Repairs", "Major Overhauls", "Foreign and Domestic Service"],
    keywords: ["NAPA AutoCare", "AAA approved", "ASE certified", "family owned", "18 bays", "20 years experience", "full service"]
  },
  "lesters-automotive-center": {
    description: "Lester's Automotive Center has been a cornerstone of the Boerne community for over 60 years. This family-oriented shop carries major tire brands including Michelin, BFGoodrich, and Goodyear. BBB Accredited Business and NAPA Gold member with RV tire and farm tire services.",
    address: "32128 IH-10 West, Boerne, TX 78006",
    phone: "(830) 249-2501",
    services: ["Tire Sales and Installation", "Brake Repair", "Oil Changes", "Belt and Hose Service", "Tire Repair", "Wheel Alignments", "RV Tire and Chassis Repairs", "Farm Tire Services", "Lawn and Garden Tire Services"],
    keywords: ["60 years experience", "BBB accredited", "NAPA Gold", "tire shop", "RV service", "farm tires", "Michelin", "BFGoodrich", "Goodyear"]
  },

  // AUTO - BODY SHOP
  "classic-collision": {
    description: "Classic Collision Boerne is part of a nationally recognized collision repair network established in 1983 with over 40 years of experience. I-CAR Gold certified technicians with multiple OE certifications for Mercedes, BMW, Tesla, Ford, GM, Honda, and more. ADAS calibration services available.",
    address: "110 Parkway Dr, Boerne, TX 78006",
    phone: "(830) 443-9556",
    services: ["Collision Repair", "Auto Body Repair", "Auto Glass Repair", "ADAS Calibrations", "Electronics Diagnostics", "Electrical Troubleshooting", "System Calibrations", "Paint Refinishing"],
    keywords: ["I-CAR Gold certified", "OE certified", "Tesla certified", "Mercedes certified", "BMW certified", "ADAS calibration", "collision repair"]
  },
  "elite-collision-of-boerne": {
    description: "Elite Collision of Boerne is a family-owned collision repair center serving since 2014. Their I-CAR certified technicians deliver the highest quality work with same-day estimates and lifetime warranty on all repairs. Car rental program available.",
    address: "124 Industrial Dr, Boerne, TX 78006",
    phone: "(830) 331-1210",
    services: ["Auto Body Repair", "Auto Dent Repair", "Auto Glass Repair", "Auto Paint Repair", "Bumper Repair", "Hail Damage Repair", "Car Rental Program", "Same-Day Estimates", "Free Estimates"],
    keywords: ["I-CAR certified", "family owned", "lifetime warranty", "same-day estimates", "hail damage", "all makes and models"]
  },
  "true-craft-pdr": {
    description: "True Craft Paintless Dent Repair is a family-owned automotive dent repair business founded in 2018 in Boerne with over 10 years of PDR experience. Most repairs completed same day within hours. A+ BBB rating with free pick-up and delivery service.",
    address: "18 Truss Dr, Ste A, Boerne, TX 78006",
    phone: "(830) 446-2549",
    services: ["Paintless Dent Removal", "Hail Damage Repair", "Ding and Dent Repair", "Minor Collision Damage Repair", "Same-Day Repairs", "Free Pick-Up and Delivery"],
    keywords: ["paintless dent repair", "PDR", "hail damage", "same-day service", "free pickup delivery", "A+ BBB rating", "family owned"]
  },

  // AUTO - TOWING
  "pantusa-towing-and-recovery": {
    description: "Pantusa Towing & Recovery LLC is a family-owned towing service with multiple Texas locations including San Antonio/Boerne. They handle light, medium, and heavy-duty towing with municipal contracts and commercial towing services. Licensed and insured with 24/7 availability.",
    address: "26575 Interstate 10 West, Boerne, TX 78006",
    phone: "(210) 971-4447",
    services: ["Towing and Recovery", "Heavy Duty Towing", "Equipment Transport", "Trucking and Hauling", "Municipal Towing", "Auto Transport", "Commercial Towing", "Vehicle Storage", "Roadside Assistance", "Emergency Services"],
    keywords: ["family owned", "licensed and insured", "heavy duty", "light duty", "medium duty", "24/7 service", "municipal towing", "commercial towing"]
  },
  "five-star-wrecker-service": {
    description: "Five Star Wrecker Service is a local towing company providing 24/7 emergency towing and recovery services to the Boerne area.",
    address: "Boerne, TX 78006",
    phone: "(830) 981-9198",
    services: ["24/7 Towing", "Emergency Roadside Assistance", "Vehicle Recovery"],
    keywords: ["24/7 towing", "emergency service", "Boerne"]
  },

  // AUTO - DETAILING
  "texas-auto-curators": {
    description: "Texas Auto Curators is a family-owned automotive detailing studio in downtown Boerne focused on preserving luxury, exotic, muscle, and classic cars. They provide premium ceramic coatings, paint protection film, paint correction, and window tinting.",
    address: "229 Market Ave Suite 100, Boerne, TX 78006",
    phone: "(830) 331-2519",
    services: ["Ceramic Coatings", "Paint Protection Film", "Paint Correction", "Auto Detailing", "Window Tinting"],
    keywords: ["ceramic coating", "paint protection film", "PPF", "paint correction", "luxury cars", "exotic cars", "classic cars", "window tint", "family owned"]
  },
  "carsmotology-auto-detailing": {
    description: "Carsmotology is a boutique auto detailing studio founded by Jen Turcotte, a 20+ year industry veteran. Operating by appointment only, they provide personalized service for vehicles ranging from daily drivers to hypercars. Developer of the Jen K.O. product line for concours-level finishes.",
    address: "529 State HWY 46 E, Unit B05, Boerne, TX 78006",
    phone: "(952) 956-2796",
    services: ["Exterior Detailing", "Paint Correction", "Ceramic Coating", "Paintless Dent Removal", "Paint Protection Film", "Window Tinting", "Custom Consultations", "Concours-Level Detailing"],
    keywords: ["boutique detailing", "luxury vehicles", "hypercars", "paint correction", "ceramic coating", "concours detailing", "Jen K.O. products", "appointment only"]
  },

  // AUTO - OTHER
  "discount-tire": {
    description: "Discount Tire is America's largest independent tire and wheel retailer. The Boerne location offers complimentary services including free air pressure checks, free flat tire repairs, and free tire safety inspections. 4.5-star rating from hundreds of reviews.",
    address: "1330 S Main St, Boerne, TX 78006",
    phone: "(830) 331-6161",
    services: ["Tire Sales and Installation", "Wheel Sales and Installation", "Free Air Pressure Check", "Free Flat Tire Repair", "Free Tire Safety Inspection", "Tire Balancing", "Tire Rotation", "Windshield Wiper Installation", "Winter Tire Changeover"],
    keywords: ["tires", "wheels", "free flat repair", "free air check", "tire installation", "tire rotation", "balancing", "all major brands"]
  },
  "w-and-w-tire-company": {
    description: "W & W Tire Company is a local tire shop serving the Boerne area with tire sales, service, and repairs.",
    address: "Boerne, TX 78006",
    phone: "",
    services: ["Tire Sales", "Tire Service", "Tire Repairs"],
    keywords: ["tires", "tire service", "Boerne"]
  },
  "take-5": {
    description: "Take 5 Oil Change offers a drive-through oil change experience where customers stay in their vehicles. The Boerne location delivers 10-minute oil changes with no appointment required. 4.8-star rating from over 600 reviews with extended hours including Sundays.",
    address: "1102 S Main St, Boerne, TX 78006",
    phone: "(830) 443-9471",
    services: ["Conventional Oil Changes", "Synthetic Oil Changes", "High Mileage Oil Changes", "State Inspections", "Emissions Testing", "Transmission Fluid Changes", "Wheel Alignments", "Coolant Exchange", "Windshield Wiper Replacement", "Air Filter Replacement", "Tire Pressure Checks", "Fluid Top-Offs"],
    keywords: ["10 minute oil change", "stay in your car", "no appointment", "state inspection", "synthetic oil", "drive-through service", "quick lube"]
  },
  "jiffy-lube": {
    description: "Jiffy Lube is a nationally recognized quick-service automotive maintenance chain. The Boerne location offers their signature 15-minute oil change service with no appointment necessary. Voted #1 Trusted Fast Oil Change brand by American shoppers.",
    address: "1345 S Main St, Boerne, TX 78006",
    phone: "(830) 249-6300",
    services: ["Signature Service Oil Change", "Battery Maintenance and Replacement", "Brake Inspection and Service", "Engine Services", "Exterior and Glass Services", "Filter Replacement", "Fluid Services", "Vehicle Inspections", "Suspension Services", "Tire Rotation and Sales"],
    keywords: ["15 minute oil change", "no appointment", "quick lube", "brake service", "battery replacement", "trusted brand", "preventative maintenance"]
  },
  "hayden-mobile-mechanics": {
    description: "Hayden Mobile Mechanics brings professional auto repair services directly to customers' locations throughout Boerne. They offer emergency repairs, routine maintenance, and diagnostic services at homes, workplaces, or roadside. 100% recommendation rate from customer reviews.",
    address: "Mobile service - Boerne, TX",
    phone: "(830) 357-8056",
    services: ["Emergency Repairs", "Routine Maintenance", "Diagnostic Services", "Oil Changes", "Engine Diagnostics", "On-Site Repairs", "Mobile Service at Home or Work"],
    keywords: ["mobile mechanic", "on-site repair", "emergency service", "convenient", "comes to you", "home service", "work service", "roadside service"]
  },

  // OUTDOOR/LAND - WELDING
  "jkr-welding-and-construction": {
    description: "JKR Welding & Construction is a Boerne-based metal building and structural steel contractor owned by Jeremy Richter. Their AWS-certified team specializes in metal building construction, structural steel fabrication, and custom metal work including floating staircases and handrails.",
    address: "Boerne, TX 78006",
    phone: "",
    services: ["Metal Buildings", "Custom Metal Fabrication", "Custom Handrail Design", "Structural Steel Repair", "Floating Staircase Construction", "Platform and Railing Restoration", "Beam and Support Repairs", "Commercial and Residential Projects"],
    keywords: ["AWS-certified", "metal buildings", "structural steel", "custom fabrication", "handrails", "staircases", "commercial welding"]
  },
  "certified-best-welding-solutions": {
    description: "Certified Best Welding Solutions LLC (CBWS) is a leading provider of steel fabrication and welding services for commercial and industrial sectors, located between Boerne and Comfort. They specialize in stainless steel fabrication for pharmaceutical, biotech, and cleanroom environments.",
    address: "203 Pecan Pkwy, Boerne, TX 78006",
    phone: "",
    services: ["Structural Steel Fabrication", "Custom Metal Fabrication", "Stainless Steel Fabrication", "Sanitary TIG Welding", "Stainless Staircases and Handrails", "Mezzanines and Platforms", "Sheet Metal Fabrication", "Ornamental Metal Fabrication", "Millwright Services", "Equipment Installation"],
    keywords: ["commercial welding", "industrial welding", "stainless steel", "pharmaceutical", "biotech", "cleanroom", "TIG welding", "millwright services"]
  },

  // OUTDOOR/LAND - AG FENCING
  "hill-country-fence-and-ranch": {
    description: "Hill Country Fence and Ranch has been serving Boerne and surrounding areas since 2009, specializing in ranch-style fencing, automatic entry gates, cattle guards, and custom entryways. They serve a three-hour radius from San Antonio covering all of Texas Hill Country.",
    address: "50 Rust Ln, Boerne, TX 78006",
    phone: "(210) 595-9121",
    services: ["Automatic Entry Gates", "Ranch Fencing", "Deer and Wildlife Fencing", "Custom Gates", "Wood Fencing", "Steel and Ornamental Iron Fencing", "Masonry Fencing", "Cattle Guards and Corrals", "Hog Control Fencing", "Custom Metal Art", "Electric Wire Fencing", "Game Fencing", "Horse Fencing"],
    keywords: ["ranch fencing", "automatic gates", "cattle guards", "wildlife fencing", "deer fencing", "hog control", "custom gates", "since 2009"]
  },
  "pro-fencing-service": {
    description: "Pro Fencing Service is a local fencing contractor serving the Boerne area with agricultural and ranch fencing services.",
    address: "Boerne, TX 78006",
    phone: "(830) 217-2555",
    services: ["Agricultural Fencing", "Ranch Fencing"],
    keywords: ["fencing", "agricultural fencing", "ranch fencing", "Boerne"]
  },

  // OUTDOOR/LAND - BRUSH CLEARING
  "hunter-land-clearing": {
    description: "Hunter Land Clearing is a full-service land clearing and landscaping company based in New Braunfels serving the Texas Hill Country including Boerne. They use large skid steers with grappler attachments to uproot cedar trees for clean removal. Available 7 days a week with free estimates.",
    address: "New Braunfels, TX (serves Boerne)",
    phone: "(830) 832-7065",
    services: ["Cedar Clearing", "Brush Clearing", "Driveway Clearing", "Tree Trimming", "Sustainable Landscaping Design", "Landscape Construction", "Landscape Lighting", "Irrigation Systems", "Water Management", "Hardscape Installation", "Outdoor Living Spaces"],
    keywords: ["cedar clearing", "brush clearing", "landscaping", "New Braunfels", "Hill Country", "7 days a week", "free estimates"]
  },
  "cedar-eaters-of-texas": {
    description: "Cedar Eaters of Texas, founded in 2001, is a family-owned land clearing company based near Comfort. With over two decades of industry reputation, they serve Texas, Oklahoma, and New Mexico using patented Root-N-All grubbing equipment for one-and-done solutions. They also provide wildfire prevention and recovery services.",
    address: "6707 TX-27, Comfort, TX 78013",
    phone: "(210) 745-2743",
    services: ["Brush Clearing", "Cedar Clearing", "Chipping", "Forestry Mulching", "Hand Crew Cutting", "Land Clearing", "Land Restoration", "Mesquite Grubbing", "Mulching", "Right-of-Way Clearing", "Tree Removal", "Wildfire Prevention", "Wildfire Recovery"],
    keywords: ["cedar removal", "forestry mulching", "land restoration", "wildfire prevention", "Root-N-All equipment", "family-owned", "since 2001"]
  },
  "4d-land-services": {
    description: "4D Land Services is a family-owned forestry mulching and land clearing operation established in 2016, serving the Texas Hill Country with over 10 years of experience. They operate multiple mulching machines, excavators, and rock crushing equipment with eco-friendly approaches to land management.",
    address: "Texas Hill Country (serves Boerne)",
    phone: "(830) 688-3936",
    services: ["Forestry Mulching", "Land Clearing", "Cedar, Mesquite, and Huisache Removal", "Ranch Brush Control", "Rock Crushing and Milling", "Brush Cutter Maintenance", "Pasture Clearing", "Sendero Maintenance", "Property Improvements", "Land Management"],
    keywords: ["forestry mulching", "rock crushing", "invasive brush removal", "eco-friendly", "wildlife habitat", "fire prevention", "family-owned", "since 2016"]
  },

  // OUTDOOR/LAND - EXCAVATION
  "hammer-next-level-excavation": {
    description: "Hammer Next Level Excavation is a locally owned excavation company in Boerne providing clean, safe, and reliable excavation services for residential, commercial, and industrial projects. Their comprehensive approach covers everything from initial site preparation through final cleanup.",
    address: "Boerne, TX 78006",
    phone: "(210) 846-4135",
    services: ["Land and Lot Preparation", "Lot Clearing and Land Grading", "Driveway Excavation", "Foundation Excavation", "Trenching Services", "Underground Utility Installation", "Water Storage Tank Excavation", "Septic System Preparation", "Demolition and Structure Removal", "Site Cleanup", "Retaining Wall Excavation", "Water Well Service"],
    keywords: ["excavation contractor", "trenching", "demolition", "land grading", "underground utilities", "foundation excavation", "septic systems", "locally owned"]
  },
  "h4-site-development": {
    description: "H4 Site Development is a professional excavating contractor based in Boerne with half a decade of experience. Available 24 hours a day, 7 days a week, they handle everything from tree removal and rock excavation to drainage systems and road construction.",
    address: "Boerne, TX 78006",
    phone: "(210) 712-9505",
    services: ["Land Clearing", "Tree Removal", "Rock Excavation", "Debris Disposal", "Drainage and Grading", "Septic System Installations", "Trenching for Underground Utilities", "Water Lines Installation", "Drainage Pipe Installation", "Road Construction", "Retaining Walls", "Concrete Work", "Demolition Services"],
    keywords: ["excavation", "land clearing", "grading", "septic installation", "trenching", "road construction", "24/7 availability"]
  },
  "clear-acre": {
    description: "Clear Acre is a family-owned excavation and land clearing company serving Boerne and San Antonio. They emphasize quality work, honest communication, and eco-friendly cedar mulching practices. Free estimates with transparent pricing.",
    address: "136 Boulder Crk, Boerne, TX 78006",
    phone: "(210) 279-0035",
    services: ["Land Clearing", "Cedar Mulching", "Tree Removal", "Hazard Tree Removal", "Excavation", "Pad Site Preparation", "Dirt Work", "Land Grading and Leveling", "Debris Removal"],
    keywords: ["family-owned", "land clearing", "cedar mulching", "excavation", "pad sites", "free estimates", "transparent pricing"]
  },

  // OUTDOOR/LAND - CONCRETE
  "boerne-concrete-co": {
    description: "Boerne Concrete Co. is a family-owned business managed by Javier Ozuna, established in 2022 with an A+ BBB rating. They specialize in concrete services and roofing, handling everything from sidewalks and patios to pickleball courts and foundation repairs.",
    address: "11 Old Comfort Road, Comfort, TX 78013",
    phone: "(830) 431-9411",
    services: ["Concrete Sidewalks", "Patios", "Garage Floors", "Pool Houses", "Generator Slabs", "Pickleball Courts", "Concrete Replacements and Repairs", "Floor Stabilization", "Foundation Repairs", "Pool Contracting", "Waterproofing", "Driveway Installation", "Concrete Leveling", "Fire Pits"],
    keywords: ["concrete contractor", "roofing", "family-owned", "A+ BBB rating", "foundations", "patios", "driveways", "pool decks"]
  },
  "cdk-concrete-construction": {
    description: "CDK Concrete Construction is a family-owned business with over 20 years of experience serving San Antonio and the Hill Country. They specialize in both commercial and residential concrete work including structural concrete, basements, sea wall builds, and hillside foundations.",
    address: "Boerne, TX 78006",
    phone: "(830) 336-2742",
    services: ["Structural Concrete", "Basements", "Sea Wall Builds", "Caissons", "Hillside Foundations", "Podium Decks", "Shoring Walls", "Tilt Walls", "Driveways", "Patios", "Sidewalks", "Concrete Slabs", "Pool Decks", "Stamped Concrete", "Colored Concrete", "Stone and Brick Work"],
    keywords: ["commercial concrete", "residential concrete", "structural concrete", "foundations", "20+ years experience", "family-owned", "stamped concrete"]
  },
  "valor-concrete-company": {
    description: "Valor Concrete Company provides professional concrete installation and site preparation services across South Central Texas with over 20 years of experience. They specialize in durable construction suited to Texas soil and weather, including barndominium concrete and ranch road building.",
    address: "635 TX-46, Suite 202, Boerne, TX 78006",
    phone: "(830) 402-6025",
    services: ["Concrete Foundations", "Driveways", "Patios and Pergolas", "Sidewalk Installations", "Foundation Piers", "Land Clearing and Site Preparation", "Home Additions", "Stamped Concrete", "Concrete Coloring and Polishing", "Barndominium Concrete", "Ranch Road Building", "Agricultural Installations"],
    keywords: ["concrete contractor", "foundations", "site preparation", "barndominium", "ranch roads", "20+ years experience", "drainage solutions"]
  },

  // OUTDOOR/LAND - WELL DRILLING
  "tr-drilling-and-service": {
    description: "TR Drilling & Service is a Central Texas water well company with over 35 years of experience serving the Northern Hill Country. They handle the region's unique geological challenges and offer financing through Hearth.",
    address: "14 FM 474, Boerne, TX 78006",
    phone: "(830) 816-3232",
    services: ["Water Well Drilling", "Water Pump Installation", "Water Storage Solutions", "Water Well Repair", "Water Well Maintenance", "Well Monitoring", "Water Well Inspections", "Water Well Acidizing", "Well Plugging", "Water Quality Testing", "Emergency Repair Services"],
    keywords: ["water well drilling", "well repair", "well maintenance", "35+ years experience", "Hill Country", "licensed", "acidizing", "well inspection"]
  },
  "h-and-h-well-services": {
    description: "H & H Well Services is a local well service provider serving the Boerne area with water well services and repairs.",
    address: "Boerne, TX 78006",
    phone: "(830) 981-4697",
    services: ["Well Services", "Well Repairs"],
    keywords: ["well services", "Boerne", "water wells"]
  },

  // OUTDOOR/LAND - BARN/SHOP
  "suburban-buildings": {
    description: "Suburban Buildings is a Texas-based metal building and barndominium construction company with over 50 years of combined experience. They specialize in durable, low-maintenance steel buildings, post-frame construction, and barndominiums with financing assistance available.",
    address: "635 State Hwy 46 E, Suite 202, Boerne, TX 78015",
    phone: "(830) 308-4100",
    services: ["Steel Buildings", "Post-Frame Construction", "Barndominiums", "Custom Metal Building Design", "Workshops and Garages", "Barns and Storage Spaces", "Residential Metal Homes", "Building Financing Assistance"],
    keywords: ["metal buildings", "barndominiums", "steel buildings", "post-frame", "50+ years experience", "energy-efficient", "custom design"]
  },
  "superior-metal-services": {
    description: "Superior Metal Services Co. is a steel building engineering, design, supply, and installation company based in Boerne with over 24 years of experience. They specialize in industrial buildings, recreational facilities, commercial structures, and self-storage construction including multi-story designs.",
    address: "17 Scenic Loop Rd., Suite 200, Boerne, TX 78006",
    phone: "(830) 388-7640",
    services: ["Industrial Buildings", "Recreational Facilities", "Metal Storage Buildings", "Steel Warehouses", "Agricultural Buildings", "Churches", "Aircraft Hangars", "Commercial Steel Buildings", "Retail Metal Buildings", "Boat/RV Storage", "Self-Storage Design and Construction", "Barndominium Structures", "Professional Engineering Services"],
    keywords: ["steel buildings", "metal buildings", "engineering", "barndominium", "self-storage", "aircraft hangars", "24+ years experience", "commercial", "industrial"]
  },

  // SPECIALTY - MOVING
  "all-my-sons-moving": {
    description: "All My Sons Moving & Storage is a nationally recognized, employee-owned moving company with over 25 years of experience and more than 100 locations. The San Antonio location serves Boerne, offering professional packing, long-distance moves, and storage solutions.",
    address: "San Antonio, TX (serves Boerne)",
    phone: "1-866-726-1579",
    services: ["Local Moving", "Long-Distance Relocations", "Apartment Moving", "Residential Moving", "Commercial Relocations", "Office Relocation", "Packing Services", "Packing Supplies", "Moving Truck Rental", "Junk Removal", "Storage Solutions"],
    keywords: ["family-owned", "employee-owned", "interstate moves", "household goods", "professional movers", "nationwide coverage", "relocation services"]
  },
  "round-table-moving-co": {
    description: "Round Table Moving Co is a trusted San Antonio-based moving company providing stress-free relocations for residential and commercial clients. They are licensed, BBB accredited, and Angi certified with military and senior discounts.",
    address: "5832 Dean Martin St, San Antonio, TX 78240",
    phone: "(210) 773-1698",
    services: ["Residential Moving", "Office Moving", "Packing and Unpacking", "Packing Supplies", "Furniture Delivery", "Long Distance Moving", "Crating Services"],
    keywords: ["licensed movers", "BBB accredited", "Angi Certified Pro", "military discounts", "senior discounts", "fragile item protection", "upfront estimates"]
  },

  // SPECIALTY - JUNK HAULING
  "kendall-county-dumpsters": {
    description: "Kendall County Dumpsters is a locally-owned Boerne-based company providing comprehensive waste disposal solutions. They offer roll-off dumpster rentals with flexible periods up to 28 days and handle specialty items including appliance removal and e-waste recycling.",
    address: "P.O. Box 1187, Boerne, TX 78006",
    phone: "(830) 443-1301",
    services: ["Roll-Off Dumpster Rentals", "Garbage Removal", "Construction Waste Removal", "Yard Waste Removal", "Appliance Removal", "Furniture Removal", "Mattress Disposal", "E-Waste Recycling", "Foreclosure Cleanouts", "Hot Tub Disposal"],
    keywords: ["dumpster rentals", "Boerne", "Kendall County", "residential waste disposal", "commercial waste disposal", "roll-off containers", "flexible rental periods"]
  },
  "toss-it-dumpsters": {
    description: "Toss It Dumpsters is a family-owned roll-off container and portable sanitation company serving the Texas Hill Country since 2019. Based in Kerrville, they operate over 300 dumpsters with 24/7 scheduling support and same-day service availability.",
    address: "Kerrville, TX (serves Boerne)",
    phone: "(830) 928-3355",
    services: ["Roll-Off Dumpster Rentals", "Portable Toilet Rentals", "Hand Washing Stations", "Portable Hand Sanitizer Dispensers", "Complete Demolition Services", "Mobile Septic Tank Services", "Residential Project Support", "Commercial Construction Waste", "Event Sanitation Services"],
    keywords: ["family-owned", "Hill Country", "portable toilets", "roll-off containers", "demolition", "same-day service", "24/7 scheduling", "event rentals"]
  },

  // SPECIALTY - PORTA POTTY
  "boerne-porta-potty-rental": {
    description: "San Antonio Porta Potty provides professional portable toilet rental services for events, construction projects, and temporary outdoor activities. They offer a complete range from standard units to luxury trailer restrooms with ADA-compliant options available.",
    address: "San Antonio, TX (serves Boerne)",
    phone: "(210) 879-9954",
    services: ["Regular Porta Potty Rental", "Deluxe Porta Potty", "Luxury Porta Potty", "ADA Wheelchair Accessible Porta Potty", "Portable Hand Washing Stations", "Delivery Service", "Weekly Cleaning Service", "Pickup Service"],
    keywords: ["construction site sanitation", "event portable restrooms", "ADA compliant", "professional delivery", "weekly cleaning", "concerts", "festivals", "parties", "weddings"]
  },

  // SPECIALTY - STORAGE
  "ten-oaks-storage": {
    description: "Ten Oaks Storage offers self-storage solutions with locations in both Boerne and Helotes. They feature climate-controlled units with month-to-month lease flexibility and a Price Lock Guarantee against unexpected rate increases. Boat and RV storage available.",
    address: "131 Old San Antonio, Boerne, TX 78006",
    phone: "(210) 858-8860",
    services: ["Climate-Controlled Self Storage", "Non-Climate Controlled Storage", "Boat & RV Storage", "Online Rental Services", "Month-to-Month Leases", "24/7 Facility Access"],
    keywords: ["climate-controlled", "self storage", "Boerne", "Helotes", "online rental", "Price Lock Guarantee", "secure storage", "RV storage", "boat storage"]
  },
  "extra-space-storage": {
    description: "Extra Space Storage is a national self-storage leader with three convenient locations serving Boerne. They offer a wide range of unit sizes with climate control, 24-hour access, drive-up units, and contactless rental options starting as low as $48 per month.",
    address: "29620 Interstate 10 W, Boerne, TX (multiple locations)",
    phone: "",
    services: ["Climate-Controlled Storage", "Indoor Storage", "Drive-Up Access Units", "24-Hour Facility Access", "Truck Rentals", "Contactless Renting", "Onsite Retail Supplies", "Various Unit Sizes"],
    keywords: ["self storage", "climate-controlled", "drive-up access", "24-hour access", "contactless rental", "national brand", "multiple Boerne locations"]
  },

  // SPECIALTY - GENERATORS
  "dspain-sales-and-service": {
    description: "D'Spain Sales and Service is a family-owned company serving Bandera and the Texas Hill Country since 1974. While offering comprehensive HVAC, plumbing, and electrical services, they specialize in backup power solutions including standby generators and whole-house generators.",
    address: "355 Mason Creek Loop, Bandera, TX 78003",
    phone: "(830) 796-3697",
    services: ["Backup Generator Installation", "Standby Generators", "Whole-House Generators", "Natural Gas Generator Services", "Commercial Generator Options", "HVAC Services", "Electrical Services", "Plumbing Services", "Water Well Services", "EV Charging Station Installation", "Panel Upgrades", "Lighting Installation"],
    keywords: ["family-owned since 1974", "standby generators", "whole-house generators", "backup power", "electrical contractor", "HVAC", "plumbing", "Hill Country"]
  },
  "hunter-service-group": {
    description: "Hunter Service Group is a family-owned company in San Antonio specializing in generator installation, electrical services, and HVAC. They are the highest-rated Generac dealer in San Antonio and the Hill Country, offering comprehensive generator services including their exclusive Total Care Membership.",
    address: "15015 Tradesman Dr Suite 101, San Antonio, TX 78249",
    phone: "(210) 701-0192",
    services: ["Home Standby Generator Installation", "Generator Maintenance", "Generator Repair", "Generator Total Care Membership", "Emergency Generator Services", "Electrical Panel Upgrades", "Wiring Repair", "Outlet Installation", "EV Charging Stations", "Outdoor Lighting", "AC Repair and Installation", "Heating Services", "Commercial HVAC and Electrical"],
    keywords: ["Generac certified dealer", "highest rated", "home standby generators", "whole home generators", "emergency services", "family-owned"]
  },

  // SPECIALTY - HOLIDAY LIGHTING
  "astoria-lighting-co": {
    description: "Astoria Lighting Co is the original permanent holiday and architectural lighting provider in San Antonio, serving since 2019. They specialize in permanent holiday lighting systems with LED bulbs featuring lifespans up to 50,000 hours. They also offer custom landscape lighting solutions.",
    address: "2638 Kerrybrook Court, Suite 104, San Antonio, TX 78230",
    phone: "(726) 268-5112",
    services: ["Permanent Holiday Lighting Installation", "Permanent Christmas Lights", "Custom Landscape Lighting", "Pathway Illumination", "Patio Lighting", "Garden Lighting", "Architectural Feature Lighting", "LED Fixture Installation", "Energy-Efficient Lighting Systems"],
    keywords: ["permanent holiday lights", "LED lighting", "50,000 hour lifespan", "architectural lighting", "landscape lighting", "energy-efficient", "year-round lighting"]
  },
  "elite-lighting-designs": {
    description: "Elite Lighting Designs has been the premier outdoor lighting specialist serving San Antonio, Austin, and the Texas Hill Country for over 25 years. They provide residential and commercial landscape lighting plus turnkey holiday lighting services with 5-year to lifetime warranties on LED fixtures.",
    address: "8442 Gault Lane, San Antonio, Texas 78209",
    phone: "(210) 573-0594",
    services: ["Residential Outdoor Lighting Design", "Commercial Landscape Lighting", "Holiday Lighting Installation", "Solar/Green Lighting Systems", "Light Maintenance Programs", "LED Fixture Installation", "Custom Lighting Design", "Architectural Lighting", "Garden and Pathway Lighting"],
    keywords: ["25+ years experience", "holiday lighting", "landscape lighting", "turnkey service", "LED fixtures", "5-year warranty", "lifetime warranty", "solar lighting"]
  },

  // SPECIALTY - COMMERCIAL CONSTRUCTION
  "huband-mantor-construction": {
    description: "Huband-Mantor Construction (HMC) is a Boerne-based commercial and industrial construction company with over 20 years of experience. They handle complex projects including municipal infrastructure, water treatment plants, pump stations, and data center construction with OSHA 30 certifications.",
    address: "43000 IH 10 West, Boerne, TX 78006",
    phone: "(830) 816-5477",
    services: ["Commercial Construction", "Industrial Construction", "Construction Management", "Municipal Projects", "Water Infrastructure Projects", "Water Treatment Plants", "Pump Stations", "Data Center Construction", "Facility Expansions", "Job Site Safety Oversight"],
    keywords: ["general contracting", "commercial development", "industrial construction", "municipal infrastructure", "water systems", "data centers", "OSHA 30 certified", "on-time delivery"]
  },
  "se-daniels-construction": {
    description: "S.E. Daniels Construction is a family-owned general contracting company established in 1995 in Boerne. They handle diverse projects including assisted living facilities, auto dealerships, banks, churches, medical offices, retail stores, apartment complexes, and grocery stores.",
    address: "28550 Interstate 10 W Unit 2, Boerne, TX 78006",
    phone: "(830) 981-4646",
    services: ["General Contracting", "Custom Home Building", "Commercial Construction", "Tenant Finish-Out", "Remodeling", "Ranch Construction", "Assisted Living Facilities", "Auto Dealership Buildings", "Banks", "Churches", "Medical Offices", "Office Buildings", "Retail Stores", "Apartments", "Grocery Stores"],
    keywords: ["family-owned", "established 1995", "custom homes", "commercial general contractor", "tenant finish-out", "ranch construction", "Hill Country"]
  },

  // SPECIALTY - SIGNAGE
  "image-master-custom-signs": {
    description: "Image Master Custom Signs is a San Antonio-based signage company specializing in custom-designed signs, graphics, and vehicle wraps. Their state-of-the-art manufacturing facility enables them to create attractive signage solutions that increase customer traffic and improve brand recognition.",
    address: "San Antonio, TX (serves Boerne)",
    phone: "(210) 640-9199",
    services: ["Outdoor Signs", "Indoor Signs", "Vehicle Wraps", "Fleet Wraps", "Vinyl Signs and Graphics", "Channel Letters", "Monument Signs", "Storefront Signs", "Wayfinding Signs", "Banners", "Vehicle Decals and Lettering"],
    keywords: ["custom signs", "sign design", "sign manufacturing", "vehicle wraps", "fleet wraps", "channel letters", "monument signs", "storefront signs", "vinyl graphics"]
  }
};

// Update each provider with researched data
data.providers = data.providers.map(provider => {
  const research = researchData[provider.id];
  if (research) {
    return {
      ...provider,
      description: research.description || provider.description,
      address: research.address || provider.address,
      phone: research.phone || provider.phone,
      services: research.services && research.services.length > 0 ? research.services : provider.services,
      keywords: research.keywords && research.keywords.length > 0 ? research.keywords : provider.keywords,
      updatedAt: new Date().toISOString()
    };
  }
  return provider;
});

// Update metadata
data.metadata.lastUpdated = new Date().toISOString().split('T')[0];

// Write updated data
fs.writeFileSync(providersPath, JSON.stringify(data, null, 2));

console.log('Successfully updated provider data!');
console.log(`Updated ${Object.keys(researchData).length} providers with real business information.`);

// Count providers with descriptions now
const withDescriptions = data.providers.filter(p => p.description && p.description.length > 0).length;
const withServices = data.providers.filter(p => p.services && p.services.length > 0).length;
const withKeywords = data.providers.filter(p => p.keywords && p.keywords.length > 0).length;

console.log(`\nCoverage stats:`);
console.log(`- Providers with descriptions: ${withDescriptions}/${data.providers.length}`);
console.log(`- Providers with services: ${withServices}/${data.providers.length}`);
console.log(`- Providers with keywords: ${withKeywords}/${data.providers.length}`);
