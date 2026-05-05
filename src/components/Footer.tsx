'use client';

import Link from 'next/link';
import SubscribeForm from './SubscribeForm';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-boerne-navy text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Get Monthly Hill Country Home Tips
              </h3>
              <p className="text-white/70">
                Join Boerne homeowners getting seasonal maintenance reminders,
                local recommendations, and exclusive tips.
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-6">
              <SubscribeForm
                source="footer"
                variant="minimal"
                buttonText="Subscribe"
                className="[&_input]:bg-white/10 [&_input]:border-white/20 [&_input]:text-white [&_input]:placeholder-white/50 [&_input:focus]:ring-boerne-gold"
              />
              <p className="text-xs text-white/50 mt-3">
                No spam, ever. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Services */}
          <div>
            <h4 className="font-semibold text-boerne-gold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/services/home" className="text-white/70 hover:text-white transition-colors text-sm">
                  Home Services
                </Link>
              </li>
              <li>
                <Link href="/services/outdoor" className="text-white/70 hover:text-white transition-colors text-sm">
                  Outdoor Services
                </Link>
              </li>
              <li>
                <Link href="/services/auto" className="text-white/70 hover:text-white transition-colors text-sm">
                  Auto Services
                </Link>
              </li>
              <li>
                <Link href="/services/business-services" className="text-white/70 hover:text-white transition-colors text-sm">
                  Business Services
                </Link>
              </li>
              <li>
                <Link href="/services/specialty" className="text-white/70 hover:text-white transition-colors text-sm">
                  Specialty Services
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-white/70 hover:text-white transition-colors text-sm">
                  All Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-boerne-gold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/moving-to-boerne" className="text-white/70 hover:text-white transition-colors text-sm">
                  Moving to Boerne
                </Link>
              </li>
              <li>
                <Link href="/my-home" className="text-white/70 hover:text-white transition-colors text-sm">
                  Home Tracker
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-white/70 hover:text-white transition-colors text-sm">
                  Guides & Tips
                </Link>
              </li>
              <li>
                <Link href="/guides/new-homeowner-checklist" className="text-white/70 hover:text-white transition-colors text-sm">
                  New Homeowner Guide
                </Link>
              </li>
              <li>
                <Link href="/weather" className="text-white/70 hover:text-white transition-colors text-sm">
                  Weather & Rainfall
                </Link>
              </li>
              <li>
                <Link href="/emergency-services" className="text-white/70 hover:text-white transition-colors text-sm">
                  Emergency Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold text-boerne-gold mb-4">Community</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/contribute" className="text-white/70 hover:text-white transition-colors text-sm">
                  Share a Story or Photo
                </Link>
              </li>
              <li>
                <Link href="/dining" className="text-white/70 hover:text-white transition-colors text-sm">
                  Dining
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-white/70 hover:text-white transition-colors text-sm">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/parks" className="text-white/70 hover:text-white transition-colors text-sm">
                  Parks & Recreation
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/70 hover:text-white transition-colors text-sm">
                  About Boerne
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="text-white/70 hover:text-white transition-colors text-sm">
                  About the Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* For Business */}
          <div>
            <h4 className="font-semibold text-boerne-gold mb-4">For Business</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/business" className="text-white/70 hover:text-white transition-colors text-sm">
                  Get Listed
                </Link>
              </li>
              <li>
                <Link href="/business/login" className="text-white/70 hover:text-white transition-colors text-sm">
                  Business Login
                </Link>
              </li>
              <li>
                <Link href="/realtors" className="text-white/70 hover:text-white transition-colors text-sm">
                  Realtor Partners
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-boerne-gold font-bold">Boerne's Handy Hub</span>
              <span className="text-white/50 text-sm">
                &copy; {currentYear} All rights reserved.
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="text-white/50 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-white/50 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
          <p className="text-center text-white/30 text-xs mt-4">
            Serving Boerne, Fair Oaks Ranch, and the Texas Hill Country
          </p>
        </div>
      </div>
    </footer>
  );
}
