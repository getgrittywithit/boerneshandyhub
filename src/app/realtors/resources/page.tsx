'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Resource {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'guide' | 'checklist' | 'tool' | 'template';
  link: string;
  printable: boolean;
  featured?: boolean;
}

const resources: Resource[] = [
  {
    id: 'moving-guide',
    title: 'Moving to Boerne Guide',
    description: 'Complete relocation resource with utilities, schools, neighborhoods, and local tips. Share with any client moving to the area.',
    icon: '📍',
    type: 'guide',
    link: '/moving-to-boerne',
    printable: false,
    featured: true,
  },
  {
    id: 'homeowner-checklist',
    title: 'New Homeowner 30-Day Checklist',
    description: 'Essential tasks for the first month after closing. Print-friendly format for closing gifts.',
    icon: '✅',
    type: 'checklist',
    link: '/guides/new-homeowner-checklist',
    printable: true,
    featured: true,
  },
  {
    id: 'texas-tips',
    title: 'Texas Homeowner Tips',
    description: 'Homestead exemption, property tax advice, insurance requirements. Help clients save thousands.',
    icon: '💰',
    type: 'guide',
    link: '/guides/texas-homeowner-tips',
    printable: true,
    featured: true,
  },
  {
    id: 'utility-setup',
    title: 'Utility Setup Guide',
    description: 'CPS Energy, GVTC, city water, trash service contacts. Everything clients need to get connected.',
    icon: '⚡',
    type: 'guide',
    link: '/guides/boerne-utility-setup-guide',
    printable: true,
  },
  {
    id: 'school-guide',
    title: 'Boerne ISD School Guide',
    description: 'Elementary, middle, and high schools. Enrollment info and school zone details.',
    icon: '🎓',
    type: 'guide',
    link: '/guides/boerne-isd-school-guide',
    printable: true,
  },
  {
    id: 'neighborhoods',
    title: 'Boerne Neighborhoods Guide',
    description: 'Downtown, Fair Oaks Ranch, Cordillera Ranch, and more. Help clients find their perfect area.',
    icon: '🏘️',
    type: 'guide',
    link: '/guides/boerne-neighborhoods-guide',
    printable: false,
  },
  {
    id: 'wildlife',
    title: 'Hill Country Wildlife Guide',
    description: 'Deer, snakes, scorpions, fire ants. What clients need to know about Hill Country critters.',
    icon: '🦌',
    type: 'guide',
    link: '/guides/hill-country-wildlife-guide',
    printable: false,
  },
  {
    id: 'home-tracker',
    title: 'Home Tracker Tool',
    description: 'Free online tool for maintenance tracking. Gift your clients their own personalized home dashboard.',
    icon: '🏠',
    type: 'tool',
    link: '/my-home',
    printable: false,
  },
  {
    id: 'hvac-maintenance',
    title: 'HVAC Maintenance Checklist',
    description: 'Seasonal maintenance tasks to keep systems running efficiently. Essential for Texas summers.',
    icon: '❄️',
    type: 'checklist',
    link: '/guides/hvac-maintenance-checklist',
    printable: true,
  },
  {
    id: 'weather',
    title: 'Boerne Weather & Rainfall',
    description: 'Local conditions, rainfall tracking, and climate info for the Hill Country.',
    icon: '🌧️',
    type: 'tool',
    link: '/weather',
    printable: false,
  },
  {
    id: 'emergency',
    title: 'Emergency Services',
    description: '24/7 emergency plumbers, HVAC techs, electricians, and other urgent services.',
    icon: '🚨',
    type: 'guide',
    link: '/emergency-services',
    printable: true,
  },
  {
    id: 'services',
    title: 'Service Provider Directory',
    description: 'Complete directory of vetted local service providers. HVAC, plumbing, electrical, and more.',
    icon: '🔧',
    type: 'tool',
    link: '/services',
    printable: false,
  },
];

export default function RealtorResourcesPage() {
  const [filter, setFilter] = useState<'all' | 'guide' | 'checklist' | 'tool'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyLink = async (resource: Resource) => {
    const url = `https://boerneshandyhub.com${resource.link}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(resource.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredResources = filter === 'all'
    ? resources
    : resources.filter(r => r.type === filter);

  const featuredResources = resources.filter(r => r.featured);
  const regularResources = filteredResources.filter(r => !r.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-boerne-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <span className="inline-block px-4 py-1 bg-boerne-gold/20 text-boerne-gold text-sm font-medium rounded-full mb-4">
                REALTOR RESOURCES
              </span>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                Resource Library
              </h1>
              <p className="text-lg text-white/80">
                Guides, checklists, and tools to share with your clients
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/realtors/dashboard"
                className="px-6 py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/realtors"
                className="px-6 py-3 bg-boerne-gold text-boerne-navy font-medium rounded-lg hover:bg-boerne-gold-alt transition-colors"
              >
                Partner Program
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-12 bg-gradient-to-br from-boerne-gold/10 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Most Popular Resources
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredResources.map((resource) => (
              <div
                key={resource.id}
                className="bg-white rounded-xl p-6 shadow-sm border-2 border-boerne-gold/30 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-boerne-gold/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    {resource.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-boerne-gold/20 text-boerne-gold-dark text-xs font-semibold rounded">
                        FEATURED
                      </span>
                      {resource.printable && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                          Printable
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      {resource.title}
                    </h3>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-4">
                  {resource.description}
                </p>
                <div className="flex gap-2 mt-4">
                  <Link
                    href={resource.link}
                    className="flex-1 px-3 py-2 bg-boerne-navy text-white text-sm font-medium rounded-lg hover:bg-boerne-dark-gray transition-colors text-center"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => copyLink(resource)}
                    className="px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {copiedId === resource.id ? '✓ Copied' : '📋 Copy Link'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Resources */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900">
              All Resources
            </h2>
            <div className="flex gap-2">
              {(['all', 'guide', 'checklist', 'tool'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    filter === type
                      ? 'bg-boerne-navy text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}s
                  {type === 'all' && ' Resources'}
                </button>
              ))}
            </div>
          </div>

          {/* Resource Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularResources.map((resource) => (
              <div
                key={resource.id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                    {resource.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                        resource.type === 'guide' ? 'bg-blue-100 text-blue-700' :
                        resource.type === 'checklist' ? 'bg-green-100 text-green-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                      </span>
                      {resource.printable && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                          Printable
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      {resource.title}
                    </h3>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  {resource.description}
                </p>
                <div className="flex gap-2">
                  <Link
                    href={resource.link}
                    className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors text-center"
                  >
                    View Resource
                  </Link>
                  <button
                    onClick={() => copyLink(resource)}
                    className="px-3 py-2 text-gray-500 hover:text-gray-700 text-sm transition-colors"
                  >
                    {copiedId === resource.id ? '✓' : '📋'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Usage Tips */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            How to Use These Resources
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-boerne-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">📨</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Share Links</h3>
              <p className="text-sm text-gray-600">
                Copy links to include in emails, texts, or your welcome packets.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-boerne-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">🖨️</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Print for Gifts</h3>
              <p className="text-sm text-gray-600">
                Printable resources make great additions to closing gifts and folders.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-boerne-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">🎁</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Welcome Packets</h3>
              <p className="text-sm text-gray-600">
                Create welcome packets from your dashboard with curated resources.
              </p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link
              href="/realtors/dashboard"
              className="inline-block px-6 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors"
            >
              Create a Welcome Packet
            </Link>
          </div>
        </div>
      </section>

      {/* Back to Partner Program */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link
            href="/realtors"
            className="text-boerne-gold hover:text-boerne-gold-alt font-medium"
          >
            ← Back to Partner Program
          </Link>
        </div>
      </section>
    </div>
  );
}
