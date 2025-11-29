'use client';

import { useState, useEffect } from 'react';
import { getCurrentEvents, getThisWeekendEvents } from '@/data/currentEvents';

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
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

export default function Events() {
  const [currentEventsList, setCurrentEventsList] = useState<Event[]>([]);
  const [weekendEvents, setWeekendEvents] = useState<Event[]>([]);

  useEffect(() => {
    setCurrentEventsList(getCurrentEvents());
    setWeekendEvents(getThisWeekendEvents());
  }, []);

  const formatDate = (dateString: string, endDate?: string) => {
    const start = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    };
    
    let formatted = start.toLocaleDateString('en-US', options);
    
    if (endDate) {
      const end = new Date(endDate);
      const endFormatted = end.toLocaleDateString('en-US', options);
      formatted += ` through ${endFormatted}`;
    }
    
    return formatted;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'festival': return '🎪';
      case 'market': return '🛒';
      case 'concert': return '🎵';
      case 'community': return '🏘️';
      case 'outdoor': return '🌲';
      case 'family': return '👨‍👩‍👧‍👦';
      default: return '📅';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'festival': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'market': return 'bg-green-100 text-green-800 border-green-200';
      case 'concert': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'community': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'outdoor': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'family': return 'bg-pink-100 text-pink-800 border-pink-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-boerne-navy mb-4">🎉 Events in Boerne</h1>
        <p className="text-xl text-boerne-dark-gray">
          Discover what's happening in our vibrant Hill Country community
        </p>
      </div>

      {/* This Weekend Section */}
      {weekendEvents.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-boerne-navy mb-4">🌟 This Weekend</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {weekendEvents.map((event) => (
              <div key={event.id} className={`rounded-lg border-2 p-4 ${getCategoryColor(event.category)}`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getCategoryIcon(event.category)}</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
                    <p className="text-sm mb-2">📍 {event.location}</p>
                    {event.ticketInfo?.price && (
                      <p className="text-sm font-medium">💰 {event.ticketInfo.price}</p>
                    )}
                  </div>
                  {event.featured && (
                    <span className="bg-boerne-gold text-white text-xs px-2 py-1 rounded">FEATURED</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Current Events */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-boerne-navy mb-6">📅 Current & Upcoming Events</h2>
        <div className="grid gap-6">
          {currentEventsList.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div className="flex items-start gap-3 mb-3 md:mb-0">
                  <span className="text-3xl">{getCategoryIcon(event.category)}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{event.title}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(event.category)}`}>
                      {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                    </span>
                  </div>
                </div>
                {event.featured && (
                  <span className="bg-boerne-gold text-white text-sm px-3 py-1 rounded-full">FEATURED</span>
                )}
              </div>
              
              <p className="text-gray-600 mb-4">{event.description}</p>
              
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-700 mb-2">
                    <strong>📅 When:</strong> {
                      event.isRecurring 
                        ? `${event.recurringPattern} recurring event` 
                        : formatDate(event.startDate, event.endDate)
                    }
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>📍 Where:</strong> {event.location}
                  </p>
                  {event.ticketInfo?.price && (
                    <p className="text-gray-700 mb-2">
                      <strong>💰 Price:</strong> {event.ticketInfo.price}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-gray-700 mb-2">
                    <strong>👥 Organizer:</strong> {event.organizer.name}
                  </p>
                  {event.organizer.contact && (
                    <p className="text-gray-700 mb-2">
                      <strong>📞 Contact:</strong> {event.organizer.contact}
                    </p>
                  )}
                  {event.organizer.website && (
                    <a 
                      href={event.organizer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-boerne-navy hover:text-boerne-light-blue transition-colors"
                    >
                      🌐 Visit Website →
                    </a>
                  )}
                </div>
              </div>
              
              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Bernie's Tip */}
      <div className="bg-gradient-to-r from-boerne-light-blue to-blue-400 text-white rounded-lg p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🤠</span>
          <div>
            <h3 className="text-lg font-bold mb-2">Bernie's Event Tips</h3>
            <p className="text-sm opacity-90">
              Hey there! Want to know about upcoming events? Just ask me in the chat - I always have the latest scoop on what's happening around our beautiful town! 
              I can tell you about this weekend's activities, upcoming festivals, and recurring events like our weekly farmers market.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-purple-50 rounded-lg">
        <p className="text-purple-800">
          <strong>Stay Updated:</strong> Follow the City of Boerne and local Facebook groups to stay 
          informed about last-minute changes and additional community activities!
        </p>
      </div>
    </div>
  );
}