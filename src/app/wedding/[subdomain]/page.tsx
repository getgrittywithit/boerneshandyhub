'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface WeddingWebsite {
  id: string;
  subdomain: string;
  couple_name_1: string;
  couple_name_2: string;
  wedding_date: string;
  template_id: string;
  venue_name?: string;
  venue_address?: string;
  ceremony_time?: string;
  reception_time?: string;
  wedding_story?: string;
  color_primary: string;
  color_secondary: string;
  registry_links?: Array<{name: string; url: string}>;
  hotel_blocks?: Array<{name: string; address: string; phone: string; groupCode?: string}>;
  rsvp_deadline?: string;
  max_guests: number;
  status: string;
}

interface RSVPForm {
  guestName: string;
  email: string;
  phone: string;
  attending: boolean;
  guestCount: number;
  dietaryRestrictions: string;
  message: string;
}

export default function WeddingWebsite() {
  const params = useParams();
  const subdomain = params.subdomain as string;
  
  const [website, setWebsite] = useState<WeddingWebsite | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRSVP, setShowRSVP] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  
  const [rsvpForm, setRsvpForm] = useState<RSVPForm>({
    guestName: '',
    email: '',
    phone: '',
    attending: true,
    guestCount: 1,
    dietaryRestrictions: '',
    message: ''
  });

  useEffect(() => {
    fetchWebsite();
  }, [subdomain]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchWebsite = async () => {
    try {
      const response = await fetch(`/api/wedding-websites/${subdomain}`);
      if (response.ok) {
        const data = await response.json();
        setWebsite(data);
      } else {
        // Website not found or not active
        console.error('Website not found');
      }
    } catch (error) {
      console.error('Error fetching website:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRSVPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/wedding-rsvps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          websiteId: website?.id,
          ...rsvpForm
        }),
      });

      if (response.ok) {
        setRsvpSubmitted(true);
        setShowRSVP(false);
      } else {
        alert('There was an error submitting your RSVP. Please try again.');
      }
    } catch (error) {
      console.error('RSVP submission error:', error);
      alert('There was an error submitting your RSVP. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading wedding website...</p>
        </div>
      </div>
    );
  }

  if (!website) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Wedding Website Not Found</h1>
          <p className="text-gray-600 mb-8">
            The wedding website you're looking for doesn't exist or may have expired.
          </p>
          <a 
            href="https://boerneshandyhub.com" 
            className="bg-pink-600 text-white px-8 py-3 rounded-lg hover:bg-pink-700 transition-all"
          >
            Visit Boerne Handy Hub
          </a>
        </div>
      </div>
    );
  }

  const weddingDate = new Date(website.wedding_date);
  const isRSVPOpen = website.rsvp_deadline ? new Date() <= new Date(website.rsvp_deadline) : true;

  const templateStyles = {
    rustic: {
      bg: 'bg-gradient-to-b from-amber-50 to-orange-50',
      primary: website.color_primary || '#8B4513',
      secondary: website.color_secondary || '#F4E4C1',
      accent: 'text-amber-800',
      button: 'bg-amber-700 hover:bg-amber-800'
    },
    elegant: {
      bg: 'bg-gradient-to-b from-purple-50 to-pink-50',
      primary: website.color_primary || '#DDA0DD',
      secondary: website.color_secondary || '#F8F8FF',
      accent: 'text-purple-800',
      button: 'bg-purple-600 hover:bg-purple-700'
    },
    modern: {
      bg: 'bg-gradient-to-b from-gray-50 to-blue-50',
      primary: website.color_primary || '#2F4F4F',
      secondary: website.color_secondary || '#FFFFFF',
      accent: 'text-gray-800',
      button: 'bg-gray-800 hover:bg-gray-900'
    }
  };

  const style = templateStyles[website.template_id as keyof typeof templateStyles] || templateStyles.rustic;

  return (
    <div className={`min-h-screen ${style.bg}`}>
      {/* Hero Section */}
      <div 
        className="relative py-20 px-4"
        style={{ backgroundColor: style.secondary }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className={`text-6xl md:text-7xl font-bold mb-4 ${style.accent}`}>
            {website.couple_name_1} & {website.couple_name_2}
          </h1>
          <p className="text-2xl mb-6 text-gray-700">
            {weddingDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          {website.venue_name && (
            <p className="text-xl text-gray-600 mb-8">
              {website.venue_name}
            </p>
          )}
          
          {isRSVPOpen && (
            <button
              onClick={() => setShowRSVP(true)}
              className={`${style.button} text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg`}
            >
              RSVP Now
            </button>
          )}
          
          {rsvpSubmitted && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4 inline-block">
              Thank you for your RSVP! We can't wait to celebrate with you.
            </div>
          )}
        </div>
      </div>

      {/* Wedding Details */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Ceremony & Reception */}
          {(website.ceremony_time || website.reception_time) && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className={`text-2xl font-bold mb-4 ${style.accent}`}>Schedule</h3>
              {website.ceremony_time && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900">Ceremony</h4>
                  <p className="text-gray-600">
                    {new Date(`2000-01-01T${website.ceremony_time}`).toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </p>
                </div>
              )}
              {website.reception_time && (
                <div>
                  <h4 className="font-semibold text-gray-900">Reception</h4>
                  <p className="text-gray-600">
                    {new Date(`2000-01-01T${website.reception_time}`).toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Venue */}
          {website.venue_address && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className={`text-2xl font-bold mb-4 ${style.accent}`}>Location</h3>
              <h4 className="font-semibold text-gray-900">{website.venue_name}</h4>
              <p className="text-gray-600 whitespace-pre-line">{website.venue_address}</p>
            </div>
          )}

          {/* Registry */}
          {website.registry_links && website.registry_links.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className={`text-2xl font-bold mb-4 ${style.accent}`}>Registry</h3>
              <div className="space-y-3">
                {website.registry_links.map((registry, index) => (
                  <a
                    key={index}
                    href={registry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block ${style.button} text-white px-4 py-2 rounded text-center hover:opacity-90 transition-all`}
                  >
                    {registry.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Our Story */}
        {website.wedding_story && (
          <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
            <h3 className={`text-3xl font-bold mb-6 text-center ${style.accent}`}>Our Story</h3>
            <p className="text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
              {website.wedding_story}
            </p>
          </div>
        )}

        {/* Hotels */}
        {website.hotel_blocks && website.hotel_blocks.length > 0 && (
          <div className="mt-16">
            <h3 className={`text-3xl font-bold mb-8 text-center ${style.accent}`}>Accommodations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {website.hotel_blocks.map((hotel, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{hotel.name}</h4>
                  <p className="text-gray-600 mb-2">{hotel.address}</p>
                  <p className="text-gray-600 mb-2">{hotel.phone}</p>
                  {hotel.groupCode && (
                    <p className="text-sm text-gray-500">
                      Group Code: <span className="font-semibold">{hotel.groupCode}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RSVP Modal */}
      {showRSVP && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">RSVP</h3>
                <button
                  onClick={() => setShowRSVP(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleRSVPSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={rsvpForm.guestName}
                    onChange={(e) => setRsvpForm(prev => ({ ...prev, guestName: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={rsvpForm.email}
                    onChange={(e) => setRsvpForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Will you be attending?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={rsvpForm.attending}
                        onChange={() => setRsvpForm(prev => ({ ...prev, attending: true }))}
                        className="mr-2"
                      />
                      Yes, I'll be there!
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={!rsvpForm.attending}
                        onChange={() => setRsvpForm(prev => ({ ...prev, attending: false }))}
                        className="mr-2"
                      />
                      Sorry, can't make it
                    </label>
                  </div>
                </div>

                {rsvpForm.attending && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Guests
                      </label>
                      <select
                        value={rsvpForm.guestCount}
                        onChange={(e) => setRsvpForm(prev => ({ ...prev, guestCount: parseInt(e.target.value) }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      >
                        {Array.from({ length: website.max_guests }, (_, i) => i + 1).map(num => (
                          <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dietary Restrictions
                      </label>
                      <input
                        type="text"
                        value={rsvpForm.dietaryRestrictions}
                        onChange={(e) => setRsvpForm(prev => ({ ...prev, dietaryRestrictions: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                        placeholder="Any allergies or dietary needs?"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message for the Couple (Optional)
                  </label>
                  <textarea
                    value={rsvpForm.message}
                    onChange={(e) => setRsvpForm(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    rows={3}
                    placeholder="Congratulations message..."
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full ${style.button} text-white py-3 px-6 rounded-lg font-semibold transition-all`}
                >
                  Submit RSVP
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="mb-4">
            Wedding website created with ❤️ by{' '}
            <a href="https://boerneshandyhub.com" className="text-pink-400 hover:text-pink-300">
              Boerne's Handy Hub
            </a>
          </p>
          <p className="text-gray-400 text-sm">
            Need a website for your special day?{' '}
            <a href="https://boerneshandyhub.com/wedding-websites" className="text-pink-400 hover:text-pink-300">
              Create yours today
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}