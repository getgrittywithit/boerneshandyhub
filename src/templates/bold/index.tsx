'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, Shield, Star, CheckCircle2, Menu, X, Zap } from 'lucide-react';
import type { Website, WebsitePhoto } from '@/lib/websites/types';

interface BoldTemplateProps {
  website: Website;
  preview?: boolean;
}

const NAV_SECTIONS = [
  { id: 'about', label: 'ABOUT' },
  { id: 'services', label: 'SERVICES' },
  { id: 'reviews', label: 'REVIEWS' },
  { id: 'hours', label: 'HOURS' },
  { id: 'contact', label: 'CONTACT' },
];

export default function BoldTemplate({ website, preview = false }: BoldTemplateProps) {
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
    const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

    return days.map((day, i) => {
      const hours = website.hours[day];
      return {
        day: dayNames[i],
        hours: hours ? `${formatTime(hours.open)} - ${formatTime(hours.close)}` : 'CLOSED',
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
      className="min-h-screen bg-black"
      style={{
        '--primary': website.primary_color,
        '--accent': website.accent_color,
      } as React.CSSProperties}
    >
      {/* Sticky Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-black ${
          scrolled ? 'border-b border-white/10' : ''
        }`}
      >
        <div className="max-w-6xl mx-auto px-4">
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
              <span className="text-white font-black text-xl tracking-tight hidden sm:block uppercase">
                {business?.name}
              </span>
              <span className="text-white font-black text-lg sm:hidden truncate max-w-[140px] uppercase">
                {business?.name}
              </span>
            </button>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-0">
              {NAV_SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`px-4 py-2 text-xs font-black tracking-wider transition-colors ${
                    activeSection === section.id
                      ? 'text-white'
                      : 'text-white/50 hover:text-white'
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
                  className="flex items-center gap-2 px-6 py-2 text-sm font-black tracking-wider transition-all hover:scale-105"
                  style={{ backgroundColor: website.accent_color, color: 'white' }}
                  onClick={preview ? (e) => e.preventDefault() : undefined}
                >
                  <Phone size={16} />
                  <span className="hidden sm:inline">CALL NOW</span>
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
            <div className="md:hidden pb-4 border-t border-white/10 mt-2 pt-4">
              {NAV_SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`block w-full text-left px-4 py-3 text-white/70 hover:text-white font-black text-sm tracking-wider ${
                    activeSection === section.id ? 'text-white bg-white/5' : ''
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - Full Height */}
      <section className="relative min-h-screen flex items-center pt-16">
        {heroUrl ? (
          <>
            <Image
              src={heroUrl}
              alt={website.tagline || business?.name || 'Hero'}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/70" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
        )}

        <div className="relative w-full px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <span
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-black tracking-widest"
                style={{ backgroundColor: website.accent_color }}
              >
                <Zap size={14} />
                BOERNE VERIFIED
              </span>
              {website.years_in_business && (
                <span className="text-white/60 text-xs font-bold tracking-wider uppercase">
                  {website.years_in_business}+ YEARS
                </span>
              )}
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 uppercase tracking-tight leading-none">
              {business?.name}
            </h1>

            {website.tagline && (
              <p className="text-xl md:text-2xl text-white/70 max-w-2xl mb-10 font-medium">
                {website.tagline}
              </p>
            )}

            {/* Quick credentials */}
            <div className="flex flex-wrap items-center gap-4 mb-12">
              {website.license_number && (
                <div className="flex items-center gap-2 text-white/60 text-sm font-bold uppercase tracking-wider">
                  <Shield size={16} />
                  <span>LICENSE #{website.license_number}</span>
                </div>
              )}
              {website.insurance_carrier && (
                <div className="flex items-center gap-2 text-white/60 text-sm font-bold uppercase tracking-wider">
                  <CheckCircle2 size={16} />
                  <span>INSURED</span>
                </div>
              )}
              {website.emergency_available && (
                <div
                  className="flex items-center gap-2 text-sm font-black uppercase tracking-wider px-3 py-1"
                  style={{ color: website.accent_color }}
                >
                  <Phone size={16} />
                  <span>24/7 EMERGENCY</span>
                </div>
              )}
            </div>

            {/* Big CTA */}
            {phone && (
              <a
                href={preview ? '#' : `tel:${phone}`}
                className="inline-flex items-center gap-4 px-10 py-5 text-xl font-black tracking-wider transition-transform hover:scale-105"
                style={{ backgroundColor: website.accent_color, color: 'white' }}
                onClick={preview ? (e) => e.preventDefault() : undefined}
              >
                <Phone size={28} />
                CALL NOW: {phone}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-4 uppercase tracking-tight">
            Who We Are
          </h2>
          <div className="w-24 h-1 mb-10" style={{ backgroundColor: website.accent_color }} />

          <div className="grid md:grid-cols-3 gap-10">
            <div className="md:col-span-2">
              {website.about_text && (
                <p className="text-gray-700 text-lg md:text-xl leading-relaxed whitespace-pre-line">
                  {website.about_text}
                </p>
              )}
            </div>
            <div className="space-y-4">
              {fullAddress && (
                <div className="p-5 bg-black text-white">
                  <MapPin size={24} className="mb-3" style={{ color: website.accent_color }} />
                  <p className="font-black text-sm uppercase tracking-wider mb-1">Location</p>
                  <p className="text-white/70 text-sm">{fullAddress}</p>
                </div>
              )}
              {phone && (
                <a
                  href={preview ? '#' : `tel:${phone}`}
                  className="block p-5 bg-black text-white hover:opacity-90 transition-opacity"
                  onClick={preview ? (e) => e.preventDefault() : undefined}
                >
                  <Phone size={24} className="mb-3" style={{ color: website.accent_color }} />
                  <p className="font-black text-sm uppercase tracking-wider mb-1">Phone</p>
                  <p className="text-white/70 text-sm">{phone}</p>
                </a>
              )}
              {email && (
                <a
                  href={preview ? '#' : `mailto:${email}`}
                  className="block p-5 bg-black text-white hover:opacity-90 transition-opacity"
                  onClick={preview ? (e) => e.preventDefault() : undefined}
                >
                  <Mail size={24} className="mb-3" style={{ color: website.accent_color }} />
                  <p className="font-black text-sm uppercase tracking-wider mb-1">Email</p>
                  <p className="text-white/70 text-sm">{email}</p>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      {website.services && website.services.length > 0 && (
        <section id="services" className="py-20 md:py-28 bg-black">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight">
              What We Do
            </h2>
            <div className="w-24 h-1 mb-10" style={{ backgroundColor: website.accent_color }} />

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {website.services.map((service, i) => (
                <div
                  key={i}
                  className="p-6 border border-white/10 hover:border-white/30 transition-colors group"
                >
                  <div
                    className="w-12 h-12 flex items-center justify-center mb-4"
                    style={{ backgroundColor: website.accent_color }}
                  >
                    <CheckCircle2 size={24} className="text-white" />
                  </div>
                  <h3 className="font-black text-white text-xl mb-2 uppercase tracking-tight">
                    {service.name}
                  </h3>
                  {service.description && (
                    <p className="text-white/60 text-sm mb-3">{service.description}</p>
                  )}
                  {service.priceRange && (
                    <p
                      className="text-sm font-black uppercase tracking-wider"
                      style={{ color: website.accent_color }}
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
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-black text-black mb-4 uppercase tracking-tight">
              Our Work
            </h2>
            <div className="w-24 h-1 mb-10" style={{ backgroundColor: website.accent_color }} />

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
              {website.gallery_photos.map((photo) => {
                const url = getPhotoUrl(photo);
                if (!url) return null;
                return (
                  <div key={photo.id} className="relative aspect-square overflow-hidden group">
                    <Image
                      src={url}
                      alt={photo.alt_text || 'Project photo'}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {website.testimonials && website.testimonials.length > 0 && (
        <section id="reviews" className="py-20 md:py-28 bg-gray-100">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-black text-black mb-4 uppercase tracking-tight">
              What They Say
            </h2>
            <div className="w-24 h-1 mb-10" style={{ backgroundColor: website.accent_color }} />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {website.testimonials.map((testimonial, i) => (
                <div key={i} className="bg-white p-8 border-l-4" style={{ borderColor: website.accent_color }}>
                  {testimonial.rating && (
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star
                          key={j}
                          size={16}
                          fill={j < testimonial.rating! ? website.accent_color : 'none'}
                          stroke={j < testimonial.rating! ? website.accent_color : '#d1d5db'}
                        />
                      ))}
                    </div>
                  )}
                  <p className="text-gray-700 mb-4 text-lg">&ldquo;{testimonial.text}&rdquo;</p>
                  <p className="font-black text-black uppercase tracking-wider text-sm">
                    — {testimonial.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Hours & Service Area Section */}
      <section id="hours" className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Hours */}
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-black mb-4 uppercase tracking-tight flex items-center gap-3">
                <Clock size={32} />
                Hours
              </h2>
              <div className="w-16 h-1 mb-8" style={{ backgroundColor: website.accent_color }} />

              <div className="space-y-2">
                {formatHours().map(({ day, hours }) => (
                  <div key={day} className="flex justify-between py-3 border-b border-gray-200">
                    <span className="font-black text-gray-900 tracking-wider">{day}</span>
                    <span className={`font-bold ${hours === 'CLOSED' ? 'text-gray-400' : 'text-black'}`}>
                      {hours}
                    </span>
                  </div>
                ))}
              </div>

              {website.emergency_available && (
                <div
                  className="mt-8 px-6 py-4 font-black text-white text-center uppercase tracking-wider"
                  style={{ backgroundColor: website.accent_color }}
                >
                  24/7 EMERGENCY SERVICE
                </div>
              )}
            </div>

            {/* Service Area */}
            {website.service_area && (
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-black mb-4 uppercase tracking-tight flex items-center gap-3">
                  <MapPin size={32} />
                  Service Area
                </h2>
                <div className="w-16 h-1 mb-8" style={{ backgroundColor: website.accent_color }} />

                {website.service_area.radiusMiles && (
                  <p className="text-gray-700 mb-6 text-lg">
                    Serving customers within <span className="font-black">{website.service_area.radiusMiles} miles</span> of Boerne
                  </p>
                )}
                {website.service_area.cities && website.service_area.cities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {website.service_area.cities.map((cityName) => (
                      <span
                        key={cityName}
                        className="px-4 py-2 bg-black text-white text-sm font-bold uppercase tracking-wider"
                      >
                        {cityName}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section
        id="contact"
        className="py-20 md:py-28"
        style={{ backgroundColor: website.accent_color }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight">
            Don&apos;t Wait
          </h2>
          <p className="text-xl text-white/80 mb-10 font-medium">
            Get the job done right. Contact us now.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {phone && (
              <a
                href={preview ? '#' : `tel:${phone}`}
                className="flex items-center gap-3 px-10 py-5 bg-black text-white text-xl font-black tracking-wider transition-transform hover:scale-105 w-full sm:w-auto justify-center uppercase"
                onClick={preview ? (e) => e.preventDefault() : undefined}
              >
                <Phone size={24} />
                {phone}
              </a>
            )}
            {email && (
              <a
                href={preview ? '#' : `mailto:${email}`}
                className="flex items-center gap-3 px-10 py-5 bg-white/10 text-white text-xl font-black tracking-wider hover:bg-white/20 transition-colors w-full sm:w-auto justify-center uppercase"
                onClick={preview ? (e) => e.preventDefault() : undefined}
              >
                <Mail size={24} />
                EMAIL
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-10 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-white/50">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider">
              <Zap size={16} style={{ color: website.accent_color }} />
              <span>Boerne Verified</span>
            </div>
            <div className="flex items-center gap-6 font-bold uppercase tracking-wider text-xs">
              <Link href="/services" className="hover:text-white transition-colors">
                Services
              </Link>
              <Link href={`/report?site=${website.slug}`} className="hover:text-white transition-colors">
                Report
              </Link>
            </div>
            <div className="text-xs">
              Powered by{' '}
              <Link href="/" className="text-white hover:underline font-bold">
                Boerne&apos;s Handy Hub
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom CTA (fixed) */}
      {phone && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-3 bg-black border-t border-white/10 z-40">
          <a
            href={preview ? '#' : `tel:${phone}`}
            className="flex items-center justify-center gap-2 w-full py-4 text-lg font-black tracking-wider uppercase"
            style={{ backgroundColor: website.accent_color, color: 'white' }}
            onClick={preview ? (e) => e.preventDefault() : undefined}
          >
            <Phone size={22} />
            CALL NOW
          </a>
        </div>
      )}

      {/* Extra padding for mobile fixed CTA */}
      <div className="md:hidden h-24" />
    </div>
  );
}
