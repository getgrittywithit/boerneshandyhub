import type { Metadata } from 'next';
import WeatherDashboard from '@/components/WeatherDashboard';
import RainfallTracker from '@/components/RainfallTracker';
import HillCountryConditions from '@/components/HillCountryConditions';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Boerne Weather | 10-Day Forecast, Cibolo Creek Level, Burn Ban Status',
  description: 'Boerne TX weather with 10-day forecast, Cibolo Creek water level, drought stage, burn ban status, and rainfall tracking. The complete Hill Country weather resource.',
  keywords: 'Boerne weather, Boerne TX forecast, Cibolo Creek level, Kendall County burn ban, Texas drought monitor, Hill Country weather, Boerne rain totals, NWS alerts Boerne, flash flood warning',
  openGraph: {
    title: 'Boerne Weather | Forecast, Creek Level, Burn Ban',
    description: 'Live weather, 10-day forecast, Cibolo Creek gauge, drought status, and burn ban for Boerne, TX.',
    type: 'website',
    locale: 'en_US',
  },
  alternates: {
    canonical: '/weather'
  }
};

export default function WeatherPage() {
  return (
    <div className="bg-boerne-light-gray min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-boerne-navy to-boerne-light-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 text-sm mb-4">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span>Weather</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Boerne Weather & Hill Country Conditions
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl opacity-90">
            10-day forecast, Cibolo Creek level, drought stage, burn ban status, and rainfall tracking.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Current Conditions & Forecast */}
        <WeatherDashboard />

        {/* Divider */}
        <div className="my-12 flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 font-medium">Rainfall Tracking</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Rainfall Tracker */}
        <RainfallTracker />

        {/* Hill Country Conditions - Cibolo Creek, Drought, Burn Ban */}
        <div className="mt-12">
          <HillCountryConditions />
        </div>

        {/* Why Rainfall Matters Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-boerne-navy mb-6">
            Why Rainfall Matters for Your Home
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="w-12 h-12 bg-boerne-gold rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="text-lg font-semibold text-boerne-navy mb-2">Foundation Health</h3>
              <p className="text-gray-600">
                The clay-rich soil in the Hill Country expands and contracts with moisture levels.
                Extended dry periods can cause foundation movement and cracks.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-boerne-gold rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🌳</span>
              </div>
              <h3 className="text-lg font-semibold text-boerne-navy mb-2">Landscape & Trees</h3>
              <p className="text-gray-600">
                Established oak trees need supplemental watering during droughts.
                Above-average rain can encourage rapid growth and potential storm damage.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-boerne-gold rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">💧</span>
              </div>
              <h3 className="text-lg font-semibold text-boerne-navy mb-2">Water Management</h3>
              <p className="text-gray-600">
                Gutters, drainage systems, and septic tanks all need attention based on
                rainfall patterns. Heavy rains can overwhelm poorly maintained systems.
              </p>
            </div>
          </div>
        </div>

        {/* Local Climate Info */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-boerne-navy mb-6">
            Hill Country Climate Facts
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-boerne-navy">34"</p>
              <p className="text-sm text-gray-600">Average Annual Rainfall</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-boerne-navy">May & Oct</p>
              <p className="text-sm text-gray-600">Wettest Months</p>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <p className="text-3xl font-bold text-boerne-navy">Dec-Feb</p>
              <p className="text-sm text-gray-600">Driest Months</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-boerne-navy">Flash Floods</p>
              <p className="text-sm text-gray-600">Primary Weather Risk</p>
            </div>
          </div>
          <p className="mt-6 text-gray-600">
            Boerne sits at the intersection of humid subtropical and semi-arid climates, creating
            a distinctive bimodal rainfall pattern with peaks in spring (May) and fall (September-October).
            The area is prone to intense thunderstorms that can drop several inches of rain in hours,
            leading to flash flooding along Cibolo Creek and low-water crossings.
          </p>
        </div>

        {/* CTA Section */}
        <div className="mt-8 bg-gradient-to-r from-boerne-navy to-boerne-dark-gray rounded-xl shadow-lg p-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Need Help with Weather-Related Repairs?</h2>
              <p className="opacity-90">
                Find trusted local contractors for gutters, foundation repair, drainage, and more.
              </p>
            </div>
            <Link
              href="/services"
              className="bg-boerne-gold hover:bg-yellow-500 text-boerne-navy font-semibold px-8 py-3 rounded-lg transition-colors whitespace-nowrap"
            >
              Browse Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
