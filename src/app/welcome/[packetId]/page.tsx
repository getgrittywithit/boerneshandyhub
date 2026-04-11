'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  generateWelcomePacket,
  type WelcomePacketData
} from '@/lib/welcomePacket';

export default function PublicWelcomePacketPage() {
  const params = useParams();
  const packetId = params.packetId as string;
  const [packet, setPacket] = useState<WelcomePacketData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production, this would fetch from Supabase using the packetId
    // For now, we'll generate a demo packet
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
    setLoading(false);
  }, [packetId]);

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
          {/* Header */}
          <div className="bg-gradient-to-r from-boerne-navy to-boerne-dark-gray p-8 text-center">
            <div className="w-20 h-20 bg-boerne-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl">🏠</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome to Your New Home!
            </h1>
            <p className="text-xl text-boerne-gold">
              {packet.clientName}
            </p>
            <p className="text-white/80 mt-2">
              {packet.address}, {packet.city}
            </p>
          </div>

          <div className="p-8 lg:p-12">
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
                                className="flex items-center gap-2 text-boerne-gold hover:text-boerne-gold-alt"
                              >
                                <span>🌐</span>
                                Visit Website
                              </a>
                            )}
                          </div>
                          <Link
                            href={`/services/home/${category.id}/${provider.id}`}
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
            <div className="bg-gradient-to-r from-boerne-navy to-boerne-dark-gray rounded-xl p-8 text-center">
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
                className="inline-block mt-4 text-sm text-red-700 hover:text-red-800 font-medium"
              >
                View all emergency services →
              </Link>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t text-center">
              <p className="text-gray-500 text-sm">
                This welcome packet was created for you by
              </p>
              <p className="text-gray-900 font-medium mt-1">
                {packet.realtorName} • {packet.realtorCompany}
              </p>
              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
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
