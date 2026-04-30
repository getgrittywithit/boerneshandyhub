'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
  generateWelcomePacket,
  type WelcomePacketData
} from '@/lib/welcomePacket';
import {
  trackPacketView,
  trackProviderClick,
  trackGuideClick,
  trackPhoneClick,
  trackWebsiteClick,
  trackHomeTrackerClick,
  trackResourceClick,
} from '@/lib/packetAnalytics';

interface RealtorBranding {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  photo_url?: string;
  logo_url?: string;
  brand_color?: string;
  tagline?: string;
  bio?: string;
}

interface ClientInfo {
  name: string;
  address: string;
  city: string;
}

export default function PublicWelcomePacketPage() {
  const params = useParams();
  const packetId = params.packetId as string;
  const [packet, setPacket] = useState<WelcomePacketData | null>(null);
  const [realtor, setRealtor] = useState<RealtorBranding | null>(null);
  const [loading, setLoading] = useState(true);
  const hasTrackedView = useRef(false);

  useEffect(() => {
    async function loadPacket() {
      try {
        // Try to fetch real packet data from API
        const response = await fetch(`/api/packets/${packetId}`);
        const data = await response.json();

        if (data.packet && data.realtor && data.client) {
          // Real packet from database
          setRealtor(data.realtor);

          // Generate packet data with real info
          const packetData = generateWelcomePacket(
            data.client.name,
            data.client.address,
            data.client.city || 'Boerne',
            data.realtor.name,
            data.realtor.company,
            data.packet.welcome_message,
            data.packet.selected_categories || ['hvac', 'plumbing', 'electrical', 'handyman', 'landscaping', 'pest-control']
          );

          setPacket(packetData);
        } else {
          // Demo packet for development
          const demoPacket = generateWelcomePacket(
            'John & Jane Smith',
            '123 Oak Valley Drive',
            'Boerne',
            'Sarah Johnson',
            'Hill Country Realty',
            undefined,
            ['hvac', 'plumbing', 'electrical', 'handyman', 'landscaping', 'pest-control']
          );
          setPacket(demoPacket);

          // Demo realtor branding
          setRealtor({
            id: 'demo',
            name: 'Sarah Johnson',
            email: 'sarah@hillcountryrealty.com',
            company: 'Hill Country Realty',
            phone: '(830) 555-1234',
            tagline: 'Your Hill Country Home Expert',
            brand_color: '#1e3a5f',
          });
        }
      } catch (error) {
        console.error('Error loading packet:', error);
        // Fallback to demo
        const demoPacket = generateWelcomePacket(
          'John & Jane Smith',
          '123 Oak Valley Drive',
          'Boerne',
          'Sarah Johnson',
          'Hill Country Realty',
          undefined,
          ['hvac', 'plumbing', 'electrical', 'handyman', 'landscaping', 'pest-control']
        );
        setPacket(demoPacket);
      } finally {
        setLoading(false);
      }
    }

    loadPacket();
  }, [packetId]);

  // Track page view once when packet loads
  useEffect(() => {
    if (packet && !hasTrackedView.current) {
      hasTrackedView.current = true;
      trackPacketView(packetId);
    }
  }, [packet, packetId]);

  const brandColor = realtor?.brand_color || '#1e3a5f';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🏠</div>
          <p className="text-gray-500">Loading your welcome packet...</p>
        </div>
      </div>
    );
  }

  if (!packet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Packet Not Found</h1>
          <p className="text-gray-600 mb-6">
            This welcome packet may have expired or been removed.
          </p>
          <Link
            href="/"
            className="px-6 py-3 bg-boerne-gold text-boerne-navy font-medium rounded-lg hover:bg-boerne-gold-alt"
          >
            Visit Boerne's Handy Hub
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Simple Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-boerne-gold font-semibold">
            Boerne's Handy Hub
          </Link>
          <span className="text-sm text-gray-500">Welcome Packet</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header with Realtor Branding */}
          <div
            className="p-8 text-center"
            style={{ background: `linear-gradient(135deg, ${brandColor} 0%, ${brandColor}dd 100%)` }}
          >
            {/* Realtor Logo or Photo */}
            {realtor?.logo_url ? (
              <div className="mb-4">
                <Image
                  src={realtor.logo_url}
                  alt={`${realtor.company} logo`}
                  width={120}
                  height={60}
                  className="mx-auto object-contain bg-white/10 rounded-lg p-2"
                />
              </div>
            ) : realtor?.photo_url ? (
              <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white/30">
                <Image
                  src={realtor.photo_url}
                  alt={realtor.name}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-5xl">🏠</span>
              </div>
            )}

            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome to Your New Home!
            </h1>
            <p className="text-xl text-boerne-gold">
              {packet.clientName}
            </p>
            <p className="text-white/80 mt-2">
              {packet.address}, {packet.city}
            </p>

            {/* Realtor tagline */}
            {realtor?.tagline && (
              <p className="text-white/60 text-sm mt-4 italic">
                "{realtor.tagline}"
              </p>
            )}
          </div>

          <div className="p-8 lg:p-12">
            {/* Realtor Info Card */}
            {realtor && (
              <div className="mb-10 flex items-center justify-center">
                <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 pr-8">
                  {realtor.photo_url ? (
                    <Image
                      src={realtor.photo_url}
                      alt={realtor.name}
                      width={64}
                      height={64}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold"
                      style={{ backgroundColor: brandColor }}
                    >
                      {realtor.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{realtor.name}</p>
                    <p className="text-sm text-gray-500">{realtor.company}</p>
                    {realtor.phone && (
                      <a
                        href={`tel:${realtor.phone}`}
                        className="text-sm text-boerne-gold hover:text-boerne-gold-alt"
                      >
                        {realtor.phone}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Welcome Message */}
            <div className="mb-10 text-center max-w-2xl mx-auto">
              <p className="text-lg text-gray-700 leading-relaxed">
                {packet.welcomeMessage}
              </p>
              <p className="mt-6 text-gray-600 font-medium">
                — {packet.realtorName}
                <span className="block text-sm text-gray-500 font-normal mt-1">
                  {packet.realtorCompany}
                </span>
              </p>
            </div>

            {/* Service Providers */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                Trusted Local Service Providers
              </h2>
              <p className="text-gray-600 text-center mb-8">
                Hand-picked recommendations for your new home
              </p>

              <div className="space-y-8">
                {packet.categories.map(category => (
                  <div key={category.id} className="bg-gray-50 rounded-xl p-6">
                    <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-900 mb-4">
                      <span className="text-2xl">{category.icon}</span>
                      {category.name}
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      {category.providers.map(provider => (
                        <div
                          key={provider.id}
                          className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                        >
                          <h4 className="font-semibold text-gray-900 mb-2">
                            {provider.name}
                          </h4>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {provider.licensed && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                Licensed
                              </span>
                            )}
                            {provider.insured && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                Insured
                              </span>
                            )}
                          </div>
                          <div className="space-y-1 text-sm">
                            {provider.phone && (
                              <a
                                href={`tel:${provider.phone}`}
                                onClick={() => trackPhoneClick(packetId, provider.id, provider.name)}
                                className="flex items-center gap-2 text-gray-600 hover:text-boerne-gold"
                              >
                                <span>📞</span>
                                {provider.phone}
                              </a>
                            )}
                            {provider.website && (
                              <a
                                href={provider.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => trackWebsiteClick(packetId, provider.id, provider.name)}
                                className="flex items-center gap-2 text-boerne-gold hover:text-boerne-gold-alt"
                              >
                                <span>🌐</span>
                                Visit Website
                              </a>
                            )}
                          </div>
                          <Link
                            href={`/services/home/${category.id}/${provider.id}`}
                            onClick={() => trackProviderClick(packetId, provider.id, provider.name, category.name)}
                            className="block mt-3 text-sm text-center text-gray-500 hover:text-boerne-gold"
                          >
                            View Full Profile →
                          </Link>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-center">
                      <Link
                        href={`/services/home/${category.id}`}
                        className="text-sm text-boerne-gold hover:text-boerne-gold-alt"
                      >
                        See all {category.name} providers →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resource Center CTA */}
            <div className="mb-12">
              <Link
                href="/moving-to-boerne"
                onClick={() => trackResourceClick(packetId, 'Moving to Boerne Resource Center')}
                className="block bg-gradient-to-r from-boerne-gold/20 to-boerne-gold/10 rounded-xl p-6 hover:from-boerne-gold/30 hover:to-boerne-gold/20 transition-all border-2 border-boerne-gold/30 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-boerne-gold/20 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
                    🏠
                  </div>
                  <div className="flex-1">
                    <span className="inline-block px-2 py-0.5 bg-boerne-gold text-boerne-navy text-xs font-semibold rounded mb-2">
                      COMPLETE GUIDE
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-boerne-gold transition-colors">
                      Moving to Boerne Resource Center
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Everything you need: utilities, schools, neighborhoods, and local tips
                    </p>
                  </div>
                  <span className="text-2xl text-boerne-gold">→</span>
                </div>
              </Link>
            </div>

            {/* Guides Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                Helpful Guides for New Homeowners
              </h2>
              <p className="text-gray-600 text-center mb-6">
                Essential reading for your first months in your new home
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {packet.guides.map(guide => (
                  <Link
                    key={guide.slug}
                    href={`/guides/${guide.slug}`}
                    onClick={() => trackGuideClick(packetId, guide.slug, guide.title)}
                    className="p-5 bg-gray-50 rounded-xl hover:bg-boerne-gold/10 transition-colors group"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-2xl">📖</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-boerne-gold transition-colors">
                          {guide.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {guide.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Home Tracker CTA */}
            <div
              className="rounded-xl p-8 text-center"
              style={{ background: `linear-gradient(135deg, ${brandColor} 0%, ${brandColor}dd 100%)` }}
            >
              <div className="max-w-xl mx-auto">
                <span className="text-4xl">🏠</span>
                <h3 className="text-xl font-bold text-white mt-4 mb-2">
                  Never Miss a Maintenance Task
                </h3>
                <p className="text-white/80 mb-6">
                  Set up your free Home Tracker to get personalized maintenance reminders
                  tailored to your new home and Hill Country conditions.
                </p>
                <Link
                  href="/my-home"
                  onClick={() => trackHomeTrackerClick(packetId)}
                  className="inline-block px-8 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors"
                >
                  Set Up Home Tracker — Free
                </Link>
              </div>
            </div>

            {/* Emergency Services */}
            <div className="mt-8 p-6 border border-red-200 bg-red-50 rounded-xl">
              <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                <span>🚨</span>
                Emergency Services
              </h3>
              <p className="text-sm text-red-700 mb-4">
                Save these numbers for emergencies at your new home:
              </p>
              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium text-red-800">Emergency</p>
                  <p className="text-red-700">911</p>
                </div>
                <div>
                  <p className="font-medium text-red-800">City of Boerne</p>
                  <p className="text-red-700">(830) 249-9511</p>
                </div>
                <div>
                  <p className="font-medium text-red-800">CPS Energy (outages)</p>
                  <p className="text-red-700">(210) 353-4357</p>
                </div>
              </div>
              <Link
                href="/emergency-services"
                onClick={() => trackResourceClick(packetId, 'Emergency Services')}
                className="inline-block mt-4 text-sm text-red-700 hover:text-red-800 font-medium"
              >
                View all emergency services →
              </Link>
            </div>

            {/* Footer with Realtor Branding */}
            <div className="mt-12 pt-8 border-t text-center">
              <p className="text-gray-500 text-sm">
                This welcome packet was created for you by
              </p>

              {/* Realtor branding footer */}
              <div className="mt-4 flex flex-col items-center gap-4">
                {realtor?.photo_url && (
                  <Image
                    src={realtor.photo_url}
                    alt={realtor?.name || packet.realtorName}
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="text-gray-900 font-semibold text-lg">
                    {packet.realtorName}
                  </p>
                  <p className="text-gray-600">{packet.realtorCompany}</p>
                  {realtor?.phone && (
                    <a
                      href={`tel:${realtor.phone}`}
                      className="text-boerne-gold hover:text-boerne-gold-alt"
                    >
                      {realtor.phone}
                    </a>
                  )}
                </div>
                {realtor?.logo_url && (
                  <Image
                    src={realtor.logo_url}
                    alt={realtor.company}
                    width={100}
                    height={50}
                    className="object-contain mt-2"
                  />
                )}
              </div>

              <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-400">
                <span>Powered by</span>
                <Link href="/" className="text-boerne-gold hover:text-boerne-gold-alt font-medium">
                  Boerne's Handy Hub
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
