import type { Home, MaintenanceTask, HomeSystemType } from '@/types/homeTracker';

// Generate unique IDs
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

interface MaintenanceTemplate {
  title: string;
  description: string;
  frequencyMonths: number;
  priority: MaintenanceTask['priority'];
  linkedCategory: string;
  localTip?: string;
  // Seasonal overrides for specific months
  seasonalOverride?: {
    months: number[]; // 1-12
    frequencyMonths: number;
    localTip: string;
  };
}

// Boerne/Hill Country specific maintenance schedules
export const maintenanceTemplates: Record<HomeSystemType, MaintenanceTemplate[]> = {
  hvac: [
    {
      title: 'HVAC System Service',
      description: 'Professional inspection and tune-up of your heating and cooling system',
      frequencyMonths: 6,
      priority: 'high',
      linkedCategory: 'hvac',
      localTip: 'Schedule before May - Hill Country HVAC pros book up fast when temps hit 90+',
    },
    {
      title: 'Replace HVAC Filters',
      description: 'Check and replace air filters for optimal efficiency and air quality',
      frequencyMonths: 3,
      priority: 'medium',
      linkedCategory: 'hvac',
      seasonalOverride: {
        months: [2, 3, 4, 5], // Feb-May: Cedar and oak pollen season
        frequencyMonths: 1,
        localTip: 'During Hill Country allergy season (Feb-May), check filters monthly. Cedar and oak pollen can clog them fast.',
      },
    },
    {
      title: 'Clean AC Condenser Coils',
      description: 'Clean outdoor unit coils to maintain cooling efficiency',
      frequencyMonths: 12,
      priority: 'medium',
      linkedCategory: 'hvac',
      localTip: 'Hill Country dust and pollen buildup reduces AC efficiency. Clean before summer.',
    },
    {
      title: 'Check Refrigerant Levels',
      description: 'Professional check of refrigerant levels and system pressure',
      frequencyMonths: 12,
      priority: 'medium',
      linkedCategory: 'hvac',
    },
  ],

  plumbing: [
    {
      title: 'Check for Leaks',
      description: 'Inspect under sinks, around toilets, and water heater for any signs of leaks',
      frequencyMonths: 6,
      priority: 'medium',
      linkedCategory: 'plumbing',
    },
    {
      title: 'Clean Faucet Aerators',
      description: 'Remove and clean mineral buildup from faucet aerators',
      frequencyMonths: 6,
      priority: 'low',
      linkedCategory: 'plumbing',
      localTip: "Boerne's hard water causes mineral buildup faster than average. Check aerators every 6 months.",
    },
    {
      title: 'Test Water Pressure',
      description: 'Check water pressure and adjust pressure regulator if needed',
      frequencyMonths: 12,
      priority: 'low',
      linkedCategory: 'plumbing',
    },
    {
      title: 'Inspect Hose Bibs',
      description: 'Check outdoor faucets for leaks and proper operation',
      frequencyMonths: 12,
      priority: 'medium',
      linkedCategory: 'plumbing',
      localTip: 'Before first freeze (usually December), disconnect hoses and cover bibs. Hill Country freezes are rare but hard.',
    },
  ],

  waterHeater: [
    {
      title: 'Flush Water Heater',
      description: 'Drain and flush sediment from water heater tank',
      frequencyMonths: 6,
      priority: 'high',
      linkedCategory: 'plumbing',
      localTip: "Boerne's hard water causes faster sediment buildup. Flush every 6 months to extend tank life.",
    },
    {
      title: 'Test T&P Relief Valve',
      description: 'Test temperature and pressure relief valve for proper operation',
      frequencyMonths: 12,
      priority: 'high',
      linkedCategory: 'plumbing',
    },
    {
      title: 'Check Anode Rod',
      description: 'Inspect sacrificial anode rod and replace if corroded',
      frequencyMonths: 24,
      priority: 'medium',
      linkedCategory: 'plumbing',
      localTip: 'Hard water eats anode rods faster. Checking every 2 years (vs 3-5 nationally) can add years to your tank.',
    },
  ],

  electrical: [
    {
      title: 'Test GFCI Outlets',
      description: 'Test all GFCI outlets in bathrooms, kitchen, garage, and exterior',
      frequencyMonths: 6,
      priority: 'high',
      linkedCategory: 'electrical',
    },
    {
      title: 'Check Smoke Detectors',
      description: 'Test smoke detectors and replace batteries',
      frequencyMonths: 6,
      priority: 'critical',
      linkedCategory: 'electrical',
    },
    {
      title: 'Inspect Electrical Panel',
      description: 'Visual inspection of electrical panel for signs of damage or corrosion',
      frequencyMonths: 12,
      priority: 'medium',
      linkedCategory: 'electrical',
    },
    {
      title: 'Test CO Detectors',
      description: 'Test carbon monoxide detectors and replace batteries',
      frequencyMonths: 6,
      priority: 'critical',
      linkedCategory: 'electrical',
    },
    {
      title: 'Check Surge Protectors',
      description: 'Inspect whole-house surge protector indicator lights',
      frequencyMonths: 12,
      priority: 'medium',
      linkedCategory: 'electrical',
      localTip: 'Hill Country thunderstorms can be intense. Surge protectors save expensive electronics.',
    },
  ],

  roof: [
    {
      title: 'Roof Inspection',
      description: 'Professional inspection of shingles, flashing, and overall roof condition',
      frequencyMonths: 12,
      priority: 'high',
      linkedCategory: 'roofing',
      localTip: 'Schedule after hail season (March-May). Hill Country storms can cause damage you cant see from the ground.',
    },
    {
      title: 'Check Attic Ventilation',
      description: 'Inspect attic vents and ensure proper airflow',
      frequencyMonths: 12,
      priority: 'medium',
      linkedCategory: 'roofing',
      localTip: 'Proper attic ventilation is critical in Texas heat - can reduce cooling costs 10-15%.',
    },
    {
      title: 'Inspect Roof Penetrations',
      description: 'Check seals around vents, pipes, and skylights',
      frequencyMonths: 12,
      priority: 'medium',
      linkedCategory: 'roofing',
    },
  ],

  foundation: [
    {
      title: 'Foundation Inspection',
      description: 'Check for cracks, settling, or movement in foundation',
      frequencyMonths: 12,
      priority: 'high',
      linkedCategory: 'foundation',
      localTip: 'Hill Country limestone soil expands and contracts with moisture. Annual checks catch problems early.',
    },
    {
      title: 'Check Door & Window Alignment',
      description: 'Test doors and windows for sticking - early sign of foundation movement',
      frequencyMonths: 6,
      priority: 'medium',
      linkedCategory: 'foundation',
    },
    {
      title: 'Maintain Foundation Moisture',
      description: 'Ensure consistent moisture levels around foundation perimeter',
      frequencyMonths: 3,
      priority: 'medium',
      linkedCategory: 'foundation',
      localTip: 'During dry Hill Country summers, run soaker hoses around foundation 2-3x weekly to prevent soil shrinkage.',
    },
  ],

  gutters: [
    {
      title: 'Clean Gutters',
      description: 'Remove leaves, debris, and check for proper drainage',
      frequencyMonths: 6,
      priority: 'medium',
      linkedCategory: 'gutters',
      localTip: 'Clean after fall leaf drop (December) and after spring oak pollen (May).',
    },
    {
      title: 'Check Downspout Extensions',
      description: 'Ensure downspouts direct water away from foundation',
      frequencyMonths: 12,
      priority: 'medium',
      linkedCategory: 'gutters',
    },
  ],

  septic: [
    {
      title: 'Septic Tank Inspection',
      description: 'Professional inspection of septic tank and drain field',
      frequencyMonths: 12,
      priority: 'high',
      linkedCategory: 'septic',
    },
    {
      title: 'Septic Tank Pumping',
      description: 'Pump septic tank to remove accumulated solids',
      frequencyMonths: 36,
      priority: 'high',
      linkedCategory: 'septic',
      localTip: 'Many Boerne homes have septic. Pumping every 3 years prevents expensive drain field replacement.',
    },
  ],

  well: [
    {
      title: 'Test Well Water Quality',
      description: 'Test for bacteria, nitrates, and other contaminants',
      frequencyMonths: 12,
      priority: 'high',
      linkedCategory: 'plumbing',
      localTip: 'Hill Country aquifers can be affected by agricultural runoff. Annual testing is essential.',
    },
    {
      title: 'Inspect Well Pump',
      description: 'Check well pump pressure and operation',
      frequencyMonths: 12,
      priority: 'medium',
      linkedCategory: 'plumbing',
    },
    {
      title: 'Check Pressure Tank',
      description: 'Test pressure tank air charge and inspect for waterlogging',
      frequencyMonths: 12,
      priority: 'medium',
      linkedCategory: 'plumbing',
    },
  ],

  pool: [
    {
      title: 'Professional Pool Service',
      description: 'Full inspection of pump, filter, and equipment',
      frequencyMonths: 6,
      priority: 'medium',
      linkedCategory: 'pool',
    },
    {
      title: 'Check Pool Chemistry',
      description: 'Test and balance pool water chemistry',
      frequencyMonths: 1,
      priority: 'medium',
      linkedCategory: 'pool',
      localTip: 'Hot Hill Country summers mean higher evaporation and chemical use. Test weekly in peak season.',
    },
  ],

  sprinkler: [
    {
      title: 'Sprinkler System Inspection',
      description: 'Check all zones, heads, and controller programming',
      frequencyMonths: 6,
      priority: 'medium',
      linkedCategory: 'landscaping',
      localTip: 'Follow Boerne water restrictions. Adjust schedules for seasonal watering limits.',
    },
    {
      title: 'Winterize Sprinkler System',
      description: 'Blow out lines and protect from freeze damage',
      frequencyMonths: 12,
      priority: 'medium',
      linkedCategory: 'landscaping',
      localTip: 'Even in mild Hill Country winters, one hard freeze can crack PVC lines.',
    },
  ],

  garage: [
    {
      title: 'Garage Door Service',
      description: 'Lubricate tracks, check springs, and test safety features',
      frequencyMonths: 12,
      priority: 'medium',
      linkedCategory: 'garage-doors',
    },
    {
      title: 'Test Garage Door Safety Reverse',
      description: 'Test auto-reverse safety feature with obstruction',
      frequencyMonths: 6,
      priority: 'high',
      linkedCategory: 'garage-doors',
    },
  ],

  appliances: [
    {
      title: 'Clean Refrigerator Coils',
      description: 'Vacuum dust from refrigerator condenser coils',
      frequencyMonths: 12,
      priority: 'low',
      linkedCategory: 'appliances',
    },
    {
      title: 'Clean Dryer Vent',
      description: 'Clean dryer vent duct from dryer to exterior',
      frequencyMonths: 12,
      priority: 'high',
      linkedCategory: 'appliances',
      localTip: 'Lint buildup is a fire hazard. Clean annually or more if you do heavy laundry.',
    },
    {
      title: 'Clean Dishwasher',
      description: 'Clean filter, spray arms, and run cleaning cycle',
      frequencyMonths: 6,
      priority: 'low',
      linkedCategory: 'appliances',
      localTip: "Hard water mineral buildup affects dishwasher performance. Clean filter monthly if dishes aren't getting clean.",
    },
  ],

  exterior: [
    {
      title: 'Power Wash Exterior',
      description: 'Clean siding, walkways, and driveway',
      frequencyMonths: 12,
      priority: 'low',
      linkedCategory: 'exterior',
      localTip: 'Hill Country dust and pollen accumulate fast. Annual power washing protects surfaces.',
    },
    {
      title: 'Inspect Caulking & Weatherstripping',
      description: 'Check seals around windows, doors, and exterior penetrations',
      frequencyMonths: 12,
      priority: 'medium',
      linkedCategory: 'exterior',
    },
    {
      title: 'Touch Up Exterior Paint',
      description: 'Inspect and touch up any peeling or damaged paint',
      frequencyMonths: 12,
      priority: 'low',
      linkedCategory: 'exterior',
      localTip: 'Texas sun is brutal on paint, especially south and west facing walls.',
    },
  ],

  windows: [
    {
      title: 'Clean Window Weep Holes',
      description: 'Clear weep holes in window frames to allow drainage',
      frequencyMonths: 12,
      priority: 'low',
      linkedCategory: 'windows',
    },
    {
      title: 'Lubricate Window Hardware',
      description: 'Lubricate window locks, cranks, and tracks',
      frequencyMonths: 12,
      priority: 'low',
      linkedCategory: 'windows',
    },
    {
      title: 'Inspect Window Seals',
      description: 'Check for foggy double-pane windows indicating seal failure',
      frequencyMonths: 12,
      priority: 'medium',
      linkedCategory: 'windows',
    },
  ],

  fireplace: [
    {
      title: 'Chimney Inspection & Cleaning',
      description: 'Professional chimney sweep and inspection',
      frequencyMonths: 12,
      priority: 'high',
      linkedCategory: 'chimney',
      localTip: 'Schedule in early fall before fireplace season. Creosote buildup is a fire hazard.',
    },
    {
      title: 'Check Fireplace Damper',
      description: 'Ensure damper opens and closes properly',
      frequencyMonths: 12,
      priority: 'medium',
      linkedCategory: 'chimney',
    },
  ],
};

// Generate maintenance tasks for a home based on its systems
export function generateMaintenanceTasks(home: Home): MaintenanceTask[] {
  const tasks: MaintenanceTask[] = [];
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 1-12

  home.systems.forEach(system => {
    const templates = maintenanceTemplates[system.type] || [];

    templates.forEach(template => {
      // Check for seasonal override
      let frequencyMonths = template.frequencyMonths;
      let localTip = template.localTip;

      if (template.seasonalOverride) {
        const { months, frequencyMonths: seasonalFreq, localTip: seasonalTip } = template.seasonalOverride;
        if (months.includes(currentMonth)) {
          frequencyMonths = seasonalFreq;
          localTip = seasonalTip;
        }
      }

      // Calculate next due date (for new tasks, start from now)
      const nextDue = new Date();
      nextDue.setMonth(nextDue.getMonth() + frequencyMonths);

      // Determine initial status
      const daysUntilDue = Math.ceil((nextDue.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      let status: MaintenanceTask['status'] = 'upcoming';
      if (daysUntilDue <= 14) {
        status = 'due-soon';
      }

      tasks.push({
        id: generateId(),
        homeId: home.id,
        systemType: system.type,
        title: template.title,
        description: template.description,
        frequencyMonths,
        nextDue: nextDue.toISOString(),
        status,
        linkedCategory: template.linkedCategory,
        localTip,
        priority: template.priority,
      });
    });
  });

  return tasks;
}

// Seasonal reminders for Boerne area
export const seasonalReminders = [
  {
    months: [2, 3],
    title: 'Cedar Fever Season',
    description: 'Change HVAC filters more frequently during peak cedar pollen season.',
    icon: '🌲',
  },
  {
    months: [4, 5],
    title: 'Storm Season Prep',
    description: 'Check roof and gutters before spring storm season. Review insurance coverage.',
    icon: '⛈️',
  },
  {
    months: [5],
    title: 'AC Tune-Up Time',
    description: 'Schedule HVAC service before the summer rush. Pros book up fast.',
    icon: '❄️',
  },
  {
    months: [6, 7, 8],
    title: 'Foundation Watering',
    description: 'Run soaker hoses around foundation during dry months to prevent soil shrinkage.',
    icon: '💧',
  },
  {
    months: [11],
    title: 'Freeze Prep',
    description: 'Disconnect hoses, cover outdoor faucets, know your main water shutoff.',
    icon: '🥶',
  },
  {
    months: [12],
    title: 'Chimney Check',
    description: 'If you have a fireplace, schedule cleaning before heavy use season.',
    icon: '🔥',
  },
];

export function getCurrentSeasonalReminders(): typeof seasonalReminders {
  const currentMonth = new Date().getMonth() + 1;
  return seasonalReminders.filter(r => r.months.includes(currentMonth));
}
