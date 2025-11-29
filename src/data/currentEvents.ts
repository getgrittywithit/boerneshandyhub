interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string; // ISO date string
  endDate?: string;   // ISO date string for multi-day events
  location: string;
  category: 'festival' | 'market' | 'concert' | 'community' | 'outdoor' | 'family';
  isRecurring: boolean;
  recurringPattern?: 'weekly' | 'monthly' | 'seasonal';
  ticketInfo?: {
    price?: string;
    ticketUrl?: string;
    phone?: string;
  };
  organizer: {
    name: string;
    contact?: string;
    website?: string;
  };
  featured: boolean;
  tags: string[];
}

// Current and upcoming events for Boerne
export const currentEvents: Event[] = [
  {
    id: 'farmers-market-2024',
    title: 'Boerne Farmers Market',
    description: 'Weekly farmers market featuring local produce, artisan goods, live music, and community vendors in the heart of downtown Boerne on Main Plaza.',
    startDate: '2024-01-06T08:00:00-06:00', // Every Saturday
    location: 'Main Plaza, Downtown Boerne',
    category: 'market',
    isRecurring: true,
    recurringPattern: 'weekly',
    organizer: {
      name: 'City of Boerne',
      contact: '(830) 249-9511',
      website: 'https://www.ci.boerne.tx.us'
    },
    featured: true,
    tags: ['local produce', 'crafts', 'community', 'downtown', 'family friendly']
  },
  {
    id: 'berges-fest-2025',
    title: 'Berges Fest 2025',
    description: "Boerne's premier annual festival celebrating German heritage with traditional music, authentic food, dancing, arts & crafts, and family activities.",
    startDate: '2025-06-14T09:00:00-05:00',
    endDate: '2025-06-15T22:00:00-05:00',
    location: 'Main Plaza & surrounding streets, Downtown Boerne',
    category: 'festival',
    isRecurring: true,
    recurringPattern: 'seasonal',
    ticketInfo: {
      price: 'Free admission',
    },
    organizer: {
      name: 'Boerne Area Chamber of Commerce',
      contact: '(830) 249-8000',
      website: 'https://www.boernetx.com'
    },
    featured: true,
    tags: ['German heritage', 'music', 'food', 'family', 'festival', 'traditional']
  },
  {
    id: 'kendall-county-fair-2025',
    title: 'Kendall County Fair',
    description: 'Annual county fair featuring livestock shows, carnival rides, local food vendors, arts & crafts exhibitions, and live entertainment.',
    startDate: '2025-07-18T16:00:00-05:00',
    endDate: '2025-07-26T23:00:00-05:00',
    location: 'Kendall County Fairgrounds, Boerne',
    category: 'festival',
    isRecurring: true,
    recurringPattern: 'seasonal',
    ticketInfo: {
      price: 'Varies by activity',
      phone: '(830) 249-0242'
    },
    organizer: {
      name: 'Kendall County Fair Association',
      contact: '(830) 249-0242'
    },
    featured: true,
    tags: ['livestock', 'carnival', 'county fair', 'family', 'community']
  },
  {
    id: 'winter-market-2024',
    title: 'Holiday Winter Market',
    description: 'Special holiday edition of the farmers market featuring seasonal crafts, hot cocoa, holiday music, and local gift vendors.',
    startDate: '2024-12-07T10:00:00-06:00',
    endDate: '2024-12-21T15:00:00-06:00',
    location: 'Main Plaza, Downtown Boerne',
    category: 'market',
    isRecurring: false,
    organizer: {
      name: 'Boerne Main Street',
      website: 'https://www.mainstreetboerne.org'
    },
    featured: false,
    tags: ['holiday', 'winter', 'crafts', 'gifts', 'seasonal']
  },
  {
    id: 'cibolo-nature-walks',
    title: 'Guided Nature Walks at Cibolo Nature Center',
    description: 'Free guided nature walks every Saturday morning exploring 100+ acres of Hill Country habitat with experienced naturalists.',
    startDate: '2024-01-06T09:00:00-06:00',
    location: 'Cibolo Nature Center, 140 City Park Rd',
    category: 'outdoor',
    isRecurring: true,
    recurringPattern: 'weekly',
    ticketInfo: {
      price: 'Free'
    },
    organizer: {
      name: 'Cibolo Nature Center',
      contact: '(830) 249-4616',
      website: 'https://cibolo.org'
    },
    featured: false,
    tags: ['nature', 'hiking', 'educational', 'free', 'outdoor']
  },
  {
    id: 'dickens-christmas-2024',
    title: 'Dickens Christmas on Main',
    description: 'Transform downtown Boerne into Victorian England with period costumes, horse-drawn carriages, carolers, and special holiday shopping. Experience the magic of a Charles Dickens Christmas celebration!',
    startDate: '2024-12-07T10:00:00-06:00',
    endDate: '2024-12-08T21:00:00-06:00',
    location: 'Main Plaza & Historic Downtown Boerne',
    category: 'festival',
    isRecurring: true,
    recurringPattern: 'seasonal',
    ticketInfo: {
      price: 'Free admission, some activities may have fees'
    },
    organizer: {
      name: 'Boerne Main Street',
      contact: '(830) 249-8000',
      website: 'https://www.mainstreetboerne.org'
    },
    featured: true,
    tags: ['Christmas', 'Victorian', 'family', 'downtown', 'shopping', 'caroling', 'holiday']
  },
  {
    id: 'dickens-carriage-rides',
    title: 'Victorian Horse-Drawn Carriage Rides',
    description: 'Step back in time with authentic horse-drawn carriage rides through historic downtown Boerne during Dickens Christmas weekend. Experience the charm of a Victorian Christmas!',
    startDate: '2024-12-07T11:00:00-06:00',
    endDate: '2024-12-08T20:00:00-06:00',
    location: 'Main Plaza, Downtown Boerne',
    category: 'family',
    isRecurring: false,
    ticketInfo: {
      price: '$5-10 per person (varies by ride length)'
    },
    organizer: {
      name: 'Boerne Main Street',
      contact: '(830) 249-8000'
    },
    featured: true,
    tags: ['Christmas', 'Victorian', 'carriage rides', 'family', 'holiday', 'historic']
  },
  {
    id: 'dickens-carolers',
    title: 'Victorian Christmas Carolers',
    description: 'Enjoy traditional Christmas carols performed by costumed carolers strolling through downtown Boerne during Dickens Christmas. Join in or just listen to the beautiful holiday music!',
    startDate: '2024-12-07T12:00:00-06:00',
    endDate: '2024-12-08T19:00:00-06:00',
    location: 'Various locations throughout Historic Downtown',
    category: 'community',
    isRecurring: false,
    ticketInfo: {
      price: 'Free'
    },
    organizer: {
      name: 'Boerne Community Choirs',
      contact: '(830) 249-8000'
    },
    featured: false,
    tags: ['Christmas', 'caroling', 'music', 'Victorian', 'free', 'community']
  },
  {
    id: 'dickens-shopping',
    title: 'Victorian Christmas Shopping Experience',
    description: 'Browse unique holiday gifts and treasures at local boutiques and vendors during Dickens Christmas. Many shops feature special Victorian-themed displays and holiday specials!',
    startDate: '2024-12-07T10:00:00-06:00',
    endDate: '2024-12-08T21:00:00-06:00',
    location: 'Historic Downtown Boerne Shops & Main Plaza',
    category: 'community',
    isRecurring: false,
    ticketInfo: {
      price: 'Free to browse, individual shop pricing'
    },
    organizer: {
      name: 'Downtown Boerne Merchants',
      contact: '(830) 249-8000'
    },
    featured: false,
    tags: ['Christmas', 'shopping', 'Victorian', 'gifts', 'local business', 'holiday']
  }
];

// Helper functions
export function getCurrentEvents(): Event[] {
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  
  return currentEvents.filter(event => {
    if (event.isRecurring) {
      return true; // Recurring events are always "current"
    }
    
    const eventEnd = event.endDate || event.startDate;
    return eventEnd >= currentDate;
  });
}

export function getUpcomingEvents(daysAhead: number = 30): Event[] {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(now.getDate() + daysAhead);
  
  const currentDate = now.toISOString().split('T')[0];
  const endDate = futureDate.toISOString().split('T')[0];
  
  return currentEvents.filter(event => {
    if (event.isRecurring) {
      return true; // Recurring events are always upcoming
    }
    
    const eventStart = event.startDate.split('T')[0];
    return eventStart >= currentDate && eventStart <= endDate;
  });
}

export function getFeaturedEvents(): Event[] {
  return getCurrentEvents().filter(event => event.featured);
}

export function getThisWeekendEvents(): Event[] {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
  
  // Find next Saturday
  const daysUntilSaturday = (6 - dayOfWeek) % 7;
  const nextSaturday = new Date(now);
  nextSaturday.setDate(now.getDate() + daysUntilSaturday);
  
  // Find next Sunday  
  const nextSunday = new Date(nextSaturday);
  nextSunday.setDate(nextSaturday.getDate() + 1);
  
  const saturdayStr = nextSaturday.toISOString().split('T')[0];
  const sundayStr = nextSunday.toISOString().split('T')[0];
  
  return currentEvents.filter(event => {
    if (event.isRecurring && event.recurringPattern === 'weekly') {
      // Weekly events like farmers market happen this weekend
      return true;
    }
    
    const eventStart = event.startDate.split('T')[0];
    const eventEnd = (event.endDate || event.startDate).split('T')[0];
    
    // Event starts or ends this weekend
    return (eventStart === saturdayStr || eventStart === sundayStr) ||
           (eventEnd === saturdayStr || eventEnd === sundayStr) ||
           (eventStart <= saturdayStr && eventEnd >= sundayStr);
  });
}

export function formatEventForAI(event: Event): string {
  const startDate = new Date(event.startDate);
  const formattedDate = startDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric', 
    month: 'long',
    day: 'numeric'
  });
  
  let eventInfo = `${event.title}: ${event.description}`;
  
  if (event.isRecurring) {
    eventInfo += ` This is a ${event.recurringPattern} recurring event.`;
    if (event.recurringPattern === 'weekly') {
      const dayName = startDate.toLocaleDateString('en-US', { weekday: 'long' });
      eventInfo += ` Happens every ${dayName}.`;
    }
  } else {
    eventInfo += ` Date: ${formattedDate}`;
    if (event.endDate) {
      const endDate = new Date(event.endDate).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long', 
        day: 'numeric'
      });
      eventInfo += ` through ${endDate}`;
    }
  }
  
  eventInfo += ` Location: ${event.location}`;
  
  if (event.ticketInfo?.price) {
    eventInfo += ` Price: ${event.ticketInfo.price}`;
  }
  
  if (event.organizer.contact) {
    eventInfo += ` Contact: ${event.organizer.contact}`;
  }
  
  return eventInfo;
}

export function generateEventContextForAI(): string {
  const currentEvents = getCurrentEvents();
  const thisWeekend = getThisWeekendEvents();
  
  let context = '\nCURRENT EVENTS IN BOERNE:\n\n';
  
  if (thisWeekend.length > 0) {
    context += 'THIS WEEKEND:\n';
    thisWeekend.forEach(event => {
      context += `- ${formatEventForAI(event)}\n`;
    });
    context += '\n';
  }
  
  context += 'UPCOMING EVENTS:\n';
  currentEvents.forEach(event => {
    context += `- ${formatEventForAI(event)}\n`;
  });
  
  context += '\nWhen someone asks about events, always mention these current happenings and encourage them to check for the most up-to-date information!';
  
  return context;
}