'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, Shield, Star, CheckCircle2, Menu, X } from 'lucide-react';
import type { Website, WebsitePhoto } from '@/lib/websites/types';

interface ClassicTemplateProps {
  website: Website;
  preview?: boolean;
}

const NAV_SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'hours', label: 'Hours' },
  { id: 'contact', label: 'Contact' },
];

export default function ClassicTemplate({ website, preview = false }: ClassicTemplateProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const business = website.business;
  const phone = business?.phone;
  const email = business?.email;
  const address = business?.address;
  const city = business?.city || 'Boerne';
  const state = business?.state || 'TX';
  const zip = business?.zip;

  const fullAddress = [address, city, state, zip].filter(Boolean).join(', ');

  // Track scroll for sticky nav styling and active section
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);

      // Find active section
      const sections = NAV_SECTIONS.map(s => document.getElementById(s.id));
      const scrollPos = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPos) {
          setActiveSection(NAV_SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const top = element.offsetTop - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const getPhotoUrl = (photo: WebsitePhoto | undefined) => {
    if (!photo) return null;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${photo.bucket}/${photo.storage_path}`;
  };

  const heroUrl = getPhotoUrl(website.hero_photo);
  const logoUrl = getPhotoUrl(website.logo_photo);

  const formatHours = () => {
    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return days.map((day, i) => {
      const hours = website.hours[day];
      return {
        day: dayNames[i],
        hours: hours ? `${formatTime(hours.open)} - ${formatTime(hours.close)}` : 'Closed',
      };
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  return (
    <div
      className="min-h-screen bg-white"
      style={{
        '--primary': website.primary_color,
        '--accent': website.accent_color,
      } as React.CSSProperties}
    >
      {/* Sticky Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'shadow-md' : ''
        }`}
        style={{ backgroundColor: website.primary_color }}
      >
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Name */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-3"
            >
              {logoUrl && (
                <Image
                  src={logoUrl}
                  alt={business?.name || 'Logo'}
                  width={40}
                  height={40}
                  className="rounded"
                />
              )}
              <span className="text-white font-bold text-lg hidden sm:block">
                {business?.name}
              </span>
              <span className="text-white font-bold text-sm sm:hidden truncate max-w-[120px]">
                {business?.name}
              </span>
            </button>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`px-3 py-2 text-sm font-medium rounded transition-colors ${
                    activeSection === section.id
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>

            {/* CTA Button */}
            <div className="flex items-center gap-2">
              {phone && (
                <a
                  href={preview ? '#' : `tel:${phone}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-transform hover:scale-105"
                  style={{ backgroundColor: website.accent_color, color: website.primary_color }}
                  onClick={preview ? (e) => e.preventDefault() : undefined}
                >
                  <Phone size={16} />
                  <span className="hidden sm:inline">Call Now</span>
                </a>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-white"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Nav Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 border-t border-white/20 mt-2 pt-4">
              {NAV_SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`block w-full text-left px-4 py-3 text-white/90 hover:bg-white/10 rounded ${
                    activeSection === section.id ? 'bg-white/20' : ''
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="relative pt-16"
        style={{ backgroundColor: website.primary_color }}
      >
        {heroUrl ? (
          <div className="relative h-[350px] md:h-[450px]">
            <Image
              src={heroUrl}
              alt={website.tagline || business?.name || 'Hero'}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          </div>
        ) : (
          <div className="h-[250px] md:h-[350px]" />
        )}

        <div className="relative md:absolute md:bottom-0 md:left-0 md:right-0 px-4 py-10 md:py-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
                style={{ backgroundColor: website.accent_color, color: website.primary_color }}
              >
                <Shield size={14} />
                Boerne Verified
              </span>
              {website.years_in_business && (
                <span className="text-white/80 text-sm">
                  {website.years_in_business}+ years in business
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
              {business?.name}
            </h1>
            {website.tagline && (
              <p className="text-xl md:text-2xl text-white/90 max-w-2xl">{website.tagline}</p>
            )}

            {/* Quick credentials */}
            <div className="flex flex-wrap items-center gap-4 mt-6 text-white/80 text-sm">
              {website.license_number && (
                <div className="flex items-center gap-1.5">
                  <Shield size={16} />
                  <span>License #{website.license_number}</span>
                </div>
              )}
              {website.insurance_carrier && (
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} />
                  <span>Fully Insured</span>
                </div>
              )}
              {website.emergency_available && (
                <div className="flex items-center gap-1.5 text-white font-medium">
                  <Phone size={16} />
                  <span>24/7 Emergency</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">About Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {website.about_text && (
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                  {website.about_text}
                </p>
              )}
            </div>
            <div className="space-y-4">
              {fullAddress && (
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <MapPin size={20} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Location</p>
                    <p className="text-gray-600 text-sm">{fullAddress}</p>
                  </div>
                </div>
              )}
              {phone && (
                <a
                  href={preview ? '#' : `tel:${phone}`}
                  className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors block"
                  onClick={preview ? (e) => e.preventDefault() : undefined}
                >
                  <Phone size={20} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Phone</p>
                    <p className="text-gray-600 text-sm">{phone}</p>
                  </div>
                </a>
              )}
              {email && (
                <a
                  href={preview ? '#' : `mailto:${email}`}
                  className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors block"
                  onClick={preview ? (e) => e.preventDefault() : undefined}
                >
                  <Mail size={20} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600 text-sm">{email}</p>
                  </div>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      {website.services && website.services.length > 0 && (
        <section id="services" className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Services</h2>
            <p className="text-gray-600 mb-8">Quality work at fair prices</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {website.services.map((service, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${website.accent_color}20` }}
                  >
                    <CheckCircle2
                      size={20}
                      style={{ color: website.primary_color }}
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{service.name}</h3>
                  {service.description && (
                    <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                  )}
                  {service.priceRange && (
                    <p
                      className="text-sm font-semibold"
                      style={{ color: website.primary_color }}
                    >
                      {service.priceRange}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {website.gallery_photos && website.gallery_photos.length > 0 && (
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Work</h2>
            <p className="text-gray-600 mb-8">Recent projects in the Hill Country</p>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {website.gallery_photos.map((photo) => {
                const url = getPhotoUrl(photo);
                if (!url) return null;
                return (
                  <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden group">
                    <Image
                      src={url}
                      alt={photo.alt_text || 'Project photo'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {website.testimonials && website.testimonials.length > 0 && (
        <section id="reviews" className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Customer Reviews</h2>
            <p className="text-gray-600 mb-8">What our customers are saying</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {website.testimonials.map((testimonial, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                  {testimonial.rating && (
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star
                          key={j}
                          size={18}
                          fill={j < testimonial.rating! ? website.accent_color : 'none'}
                          stroke={j < testimonial.rating! ? website.accent_color : '#d1d5db'}
                        />
                      ))}
                    </div>
                  )}
                  <p className="text-gray-700 mb-4">&ldquo;{testimonial.text}&rdquo;</p>
                  <p className="text-sm font-semibold text-gray-900">— {testimonial.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Hours & Service Area Section */}
      <section id="hours" className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Hours */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Clock size={28} />
                Hours
              </h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="space-y-3">
                  {formatHours().map(({ day, hours }) => (
                    <div key={day} className="flex justify-between">
                      <span className="font-medium text-gray-700">{day}</span>
                      <span className={hours === 'Closed' ? 'text-gray-400' : 'text-gray-900'}>
                        {hours}
                      </span>
                    </div>
                  ))}
                </div>
                {website.emergency_available && (
                  <div
                    className="mt-6 px-4 py-3 rounded-lg text-center font-semibold"
                    style={{ backgroundColor: `${website.accent_color}20`, color: website.primary_color }}
                  >
                    24/7 Emergency Service Available
                  </div>
                )}
              </div>
            </div>

            {/* Service Area */}
            {website.service_area && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <MapPin size={28} />
                  Service Area
                </h2>
                <div className="bg-gray-50 rounded-xl p-6">
                  {website.service_area.radiusMiles && (
                    <p className="text-gray-700 mb-4 text-lg">
                      Proudly serving customers within <strong>{website.service_area.radiusMiles} miles</strong> of Boerne
                    </p>
                  )}
                  {website.service_area.cities && website.service_area.cities.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {website.service_area.cities.map((cityName) => (
                        <span
                          key={cityName}
                          className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700"
                        >
                          {cityName}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section
        id="contact"
        className="py-16 md:py-20"
        style={{ backgroundColor: website.primary_color }}
      >
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Contact us today for a free estimate
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {phone && (
              <a
                href={preview ? '#' : `tel:${phone}`}
                className="flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-bold shadow-lg transition-transform hover:scale-105 w-full sm:w-auto justify-center"
                style={{ backgroundColor: website.accent_color, color: website.primary_color }}
                onClick={preview ? (e) => e.preventDefault() : undefined}
              >
                <Phone size={22} />
                Call {phone}
              </a>
            )}
            {email && (
              <a
                href={preview ? '#' : `mailto:${email}`}
                className="flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors w-full sm:w-auto justify-center"
                onClick={preview ? (e) => e.preventDefault() : undefined}
              >
                <Mail size={22} />
                Email Us
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Shield size={18} />
              <span>Boerne Verified Business</span>
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="/services"
                className="hover:text-white transition-colors"
              >
                Find More Services
              </Link>
              <Link
                href={`/report?site=${website.slug}`}
                className="hover:text-white transition-colors"
              >
                Report Issue
              </Link>
            </div>
            <div>
              Powered by{' '}
              <Link href="/" className="text-white hover:underline">
                Boerne&apos;s Handy Hub
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom CTA (fixed) */}
      {phone && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur border-t shadow-lg z-40">
          <a
            href={preview ? '#' : `tel:${phone}`}
            className="flex items-center justify-center gap-2 w-full py-4 rounded-xl text-lg font-bold"
            style={{ backgroundColor: website.primary_color, color: 'white' }}
            onClick={preview ? (e) => e.preventDefault() : undefined}
          >
            <Phone size={22} />
            Call Now
          </a>
        </div>
      )}

      {/* Extra padding for mobile fixed CTA */}
      <div className="md:hidden h-24" />
    </div>
  );
}
