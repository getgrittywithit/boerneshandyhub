import { Metadata } from 'next';
import Link from 'next/link';
import {
  utilityProviders,
  boerneISDSchools,
  neighborhoods,
  movingTimeline,
  localEssentials,
  getSchoolsByType
} from '@/data/movingResources';

export const metadata: Metadata = {
  title: 'Moving to Boerne, TX | Your Complete Relocation Guide',
  description: 'Everything you need to know about moving to Boerne, Texas. Utility setup, school info, neighborhoods, local resources, and insider tips for your Hill Country relocation.',
  keywords: 'moving to Boerne, relocating to Boerne TX, Boerne utilities, Boerne ISD schools, Boerne neighborhoods, Hill Country relocation',
  openGraph: {
    title: 'Moving to Boerne, TX | Your Complete Relocation Guide',
    description: 'Everything you need to know about moving to Boerne, Texas. Utility setup, school info, neighborhoods, and local resources.',
    type: 'website',
  }
};

export default function MovingToBoernePage() {
  const elementarySchools = getSchoolsByType('elementary');
  const highSchools = getSchoolsByType('high');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-boerne-navy via-boerne-navy to-boerne-dark-gray text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1 bg-boerne-gold/20 text-boerne-gold rounded-full text-sm font-medium mb-6">
              Your Complete Relocation Guide
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Moving to Boerne?
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Welcome to the Texas Hill Country! Everything you need to set up utilities,
              find the right neighborhood, enroll in schools, and become a true Boernite.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#timeline" className="px-6 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors">
                View Moving Checklist
              </a>
              <a href="#utilities" className="px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors">
                Set Up Utilities
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Moving Timeline Overview */}
      <section id="timeline" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Moving Timeline</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Follow these phases to ensure a smooth transition to your new Boerne home
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {movingTimeline.map((phase, idx) => (
              <div key={phase.phase} className="relative">
                {/* Connector line for desktop */}
                {idx < movingTimeline.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-8 h-0.5 bg-boerne-gold/30 z-0" />
                )}

                <div className="bg-gray-50 rounded-xl p-6 relative z-10 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                      phase.phase === 'before' ? 'bg-blue-100 text-blue-600' :
                      phase.phase === 'during' ? 'bg-boerne-gold/20 text-boerne-gold-dark' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{phase.title}</h3>
                      <p className="text-sm text-gray-500">{phase.timing}</p>
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {phase.tasks.slice(0, 4).map((task, taskIdx) => (
                      <li key={taskIdx} className="flex items-start gap-2">
                        <span className="text-boerne-gold mt-1">&#10003;</span>
                        <div>
                          <span className="text-gray-700 text-sm">{task.task}</span>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {phase.tasks.length > 4 && (
                    <p className="text-sm text-gray-500 mt-3">
                      +{phase.tasks.length - 4} more tasks
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/guides/new-homeowner-checklist"
              className="text-boerne-gold hover:text-boerne-gold-alt font-medium"
            >
              View Complete 30-Day Checklist &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Essential Guides - Highlighted */}
      <section className="py-16 bg-gradient-to-br from-boerne-gold/10 to-boerne-gold/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Essential Guides for New Residents</h2>
            <p className="text-lg text-gray-600">Start here for the most important information</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Utility Setup - Priority */}
            <Link
              href="/guides/boerne-utility-setup-guide"
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow border-2 border-boerne-gold group"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-boerne-gold/20 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                  &#9889;
                </div>
                <div>
                  <span className="inline-block px-2 py-0.5 bg-boerne-gold/20 text-boerne-gold-dark text-xs font-semibold rounded mb-2">
                    START HERE
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-boerne-gold transition-colors">
                    Utility Setup Guide
                  </h3>
                  <p className="text-gray-600 mt-2">
                    CPS Energy, GVTC internet, city water, trash service - everything you need to get connected.
                  </p>
                </div>
              </div>
            </Link>

            {/* Texas Homeowner Tips - Priority */}
            <Link
              href="/guides/texas-homeowner-tips"
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow border-2 border-boerne-gold group"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-boerne-gold/20 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                  &#127968;
                </div>
                <div>
                  <span className="inline-block px-2 py-0.5 bg-boerne-gold/20 text-boerne-gold-dark text-xs font-semibold rounded mb-2">
                    SAVE MONEY
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-boerne-gold transition-colors">
                    Texas Homeowner Tips
                  </h3>
                  <p className="text-gray-600 mt-2">
                    File homestead exemption, protest property taxes, understand insurance - save thousands annually.
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Additional Guides */}
          <div className="grid sm:grid-cols-3 gap-4 mt-8 max-w-4xl mx-auto">
            <Link
              href="/guides/boerne-isd-school-guide"
              className="bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow group"
            >
              <span className="text-2xl">&#127891;</span>
              <h4 className="font-semibold text-gray-900 mt-2 group-hover:text-boerne-gold transition-colors">
                Boerne ISD School Guide
              </h4>
              <p className="text-sm text-gray-500 mt-1">Schools, enrollment, zones</p>
            </Link>

            <Link
              href="/guides/boerne-neighborhoods-guide"
              className="bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow group"
            >
              <span className="text-2xl">&#127969;</span>
              <h4 className="font-semibold text-gray-900 mt-2 group-hover:text-boerne-gold transition-colors">
                Neighborhoods Guide
              </h4>
              <p className="text-sm text-gray-500 mt-1">Find your perfect area</p>
            </Link>

            <Link
              href="/guides/hill-country-wildlife-guide"
              className="bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow group"
            >
              <span className="text-2xl">&#129420;</span>
              <h4 className="font-semibold text-gray-900 mt-2 group-hover:text-boerne-gold transition-colors">
                Hill Country Wildlife
              </h4>
              <p className="text-sm text-gray-500 mt-1">Deer, snakes, scorpions</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Utilities Quick Reference */}
      <section id="utilities" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Utility Providers</h2>
            <p className="text-lg text-gray-600">Contact info for essential services in Boerne</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Group utilities by type */}
            {['Electricity', 'Internet/Phone/TV', 'Water/Sewer', 'Natural Gas', 'Trash/Recycling'].map((type) => {
              const providers = utilityProviders.filter(u =>
                u.type === type || u.type.includes(type.split('/')[0])
              );
              if (providers.length === 0) return null;

              return (
                <div key={type} className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-xl">
                      {type.includes('Electric') ? '&#9889;' :
                       type.includes('Internet') ? '&#128225;' :
                       type.includes('Water') ? '&#128167;' :
                       type.includes('Gas') ? '&#128293;' : '&#128465;'}
                    </span>
                    {type.split('/')[0]}
                  </h3>
                  <div className="space-y-4">
                    {providers.slice(0, 2).map((provider) => (
                      <div key={provider.name} className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900">{provider.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{provider.notes.split('.')[0]}.</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <a
                            href={`tel:${provider.phone.replace(/[^0-9]/g, '')}`}
                            className="text-sm text-boerne-gold hover:text-boerne-gold-alt"
                          >
                            {provider.phone}
                          </a>
                          <span className="text-gray-300">|</span>
                          <a
                            href={provider.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-boerne-gold hover:text-boerne-gold-alt"
                          >
                            Website
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/guides/boerne-utility-setup-guide"
              className="px-6 py-3 bg-boerne-navy text-white font-semibold rounded-lg hover:bg-boerne-dark-gray transition-colors inline-block"
            >
              View Complete Utility Guide
            </Link>
          </div>
        </div>
      </section>

      {/* Schools Section */}
      <section id="schools" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Boerne ISD Schools</h2>
            <p className="text-lg text-gray-600">
              One of Texas&apos;s top-rated school districts with excellent academics and athletics
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Elementary Schools */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-xl">&#127891;</span>
                Elementary Schools (K-5)
              </h3>
              <div className="space-y-3">
                {elementarySchools.map((school) => (
                  <div key={school.name} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <span className="text-gray-700">{school.name}</span>
                    <span className="text-sm text-gray-500">{school.phone}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* High Schools */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-xl">&#127942;</span>
                High Schools (9-12)
              </h3>
              <div className="space-y-4">
                {highSchools.map((school) => (
                  <div key={school.name} className="py-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">{school.name}</span>
                      <span className="text-sm text-gray-500">{school.phone}</span>
                    </div>
                    {school.notes && (
                      <p className="text-sm text-gray-600 mt-1">{school.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/guides/boerne-isd-school-guide"
              className="text-boerne-gold hover:text-boerne-gold-alt font-medium"
            >
              View Complete School Guide &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Neighborhoods Section */}
      <section id="neighborhoods" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Neighborhoods</h2>
            <p className="text-lg text-gray-600">
              From historic downtown to luxury golf communities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {neighborhoods.slice(0, 6).map((neighborhood) => (
              <div key={neighborhood.slug} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-gray-900 text-lg mb-2">{neighborhood.name}</h3>
                <p className="text-sm text-boerne-gold font-medium mb-3">{neighborhood.priceRange}</p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{neighborhood.description}</p>
                <div className="flex flex-wrap gap-2">
                  {neighborhood.highlights.slice(0, 2).map((highlight, idx) => (
                    <span key={idx} className="px-2 py-1 bg-white text-gray-600 text-xs rounded-full">
                      {highlight.length > 25 ? highlight.substring(0, 25) + '...' : highlight}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/guides/boerne-neighborhoods-guide"
              className="px-6 py-3 bg-boerne-navy text-white font-semibold rounded-lg hover:bg-boerne-dark-gray transition-colors inline-block"
            >
              Explore All Neighborhoods
            </Link>
          </div>
        </div>
      </section>

      {/* Weather & Climate */}
      <section className="py-16 bg-gradient-to-br from-boerne-navy to-boerne-dark-gray text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Hill Country Weather</h2>
              <p className="text-white/80 mb-6">{localEssentials.climate.overview}</p>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-white/10 rounded-lg p-4">
                  <span className="text-2xl">&#9728;&#65039;</span>
                  <p className="font-semibold mt-2">Summer Highs</p>
                  <p className="text-white/70 text-sm">{localEssentials.climate.summerHighs}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <span className="text-2xl">&#10052;&#65039;</span>
                  <p className="font-semibold mt-2">Winter Lows</p>
                  <p className="text-white/70 text-sm">{localEssentials.climate.winterLows}</p>
                </div>
              </div>

              <ul className="space-y-2">
                {localEssentials.climate.keyWeatherNotes.map((note, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-white/80 text-sm">
                    <span className="text-boerne-gold mt-1">&#10003;</span>
                    {note}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">Local Weather Tools</h3>
              <p className="text-white/70 mb-6">
                Track rainfall, view forecasts, and get severe weather alerts for the Boerne area.
              </p>
              <Link
                href="/weather"
                className="inline-flex items-center gap-2 px-6 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors"
              >
                <span>&#127782;&#65039;</span>
                View Boerne Weather
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Find Service Providers CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-2xl p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Find Trusted Local Service Providers
                </h2>
                <p className="text-gray-600 mb-6">
                  From HVAC technicians to plumbers to home inspectors, find vetted professionals
                  who know Hill Country homes. Build your team before you need emergency help.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/services/home/hvac"
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:border-boerne-gold hover:text-boerne-gold transition-colors text-sm"
                  >
                    &#10052;&#65039; HVAC
                  </Link>
                  <Link
                    href="/services/home/plumbing"
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:border-boerne-gold hover:text-boerne-gold transition-colors text-sm"
                  >
                    &#128295; Plumbing
                  </Link>
                  <Link
                    href="/services/home/electrical"
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:border-boerne-gold hover:text-boerne-gold transition-colors text-sm"
                  >
                    &#9889; Electrical
                  </Link>
                  <Link
                    href="/services/home/home-inspections"
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:border-boerne-gold hover:text-boerne-gold transition-colors text-sm"
                  >
                    &#128269; Home Inspections
                  </Link>
                  <Link
                    href="/services/home/handyman"
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:border-boerne-gold hover:text-boerne-gold transition-colors text-sm"
                  >
                    &#128736;&#65039; Handyman
                  </Link>
                </div>
              </div>
              <div className="text-center lg:text-right">
                <Link
                  href="/services"
                  className="inline-block px-8 py-4 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors text-lg"
                >
                  Browse All Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Home Tracker CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-5xl">&#127968;</span>
          <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-4">
            Set Up Your Home Tracker
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Get personalized maintenance reminders tailored to your home and Hill Country conditions.
            Track rainfall, schedule seasonal tasks, and never miss important home maintenance.
          </p>
          <Link
            href="/my-home"
            className="inline-block px-8 py-4 bg-boerne-navy text-white font-semibold rounded-lg hover:bg-boerne-dark-gray transition-colors text-lg"
          >
            Set Up Home Tracker - Free
          </Link>
        </div>
      </section>

      {/* Realtor Callout */}
      <section className="py-12 bg-boerne-gold/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl p-8 shadow-sm text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Are You a Realtor?
            </h3>
            <p className="text-gray-600 mb-6">
              Share this resource center with your clients moving to Boerne.
              Create personalized welcome packets with trusted service provider recommendations.
            </p>
            <Link
              href="/realtors"
              className="text-boerne-gold hover:text-boerne-gold-alt font-semibold"
            >
              Learn About Our Realtor Partner Program &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Emergency Numbers */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="font-bold text-red-800 text-lg mb-4 flex items-center gap-2">
              <span>&#128680;</span>
              Emergency Numbers
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <p className="font-medium text-red-800">Emergency</p>
                <p className="text-red-700">911</p>
              </div>
              <div>
                <p className="font-medium text-red-800">Boerne Police (non-emergency)</p>
                <p className="text-red-700">{localEssentials.emergencyNumbers.boernePolice}</p>
              </div>
              <div>
                <p className="font-medium text-red-800">CPS Energy Outages</p>
                <p className="text-red-700">{localEssentials.emergencyNumbers.cpsEnergyOutages}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
