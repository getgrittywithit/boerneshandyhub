'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, Shield, Star, ArrowRight, Menu, X } from 'lucide-react';
import type { Website, WebsitePhoto } from '@/lib/websites/types';

interface ModernTemplateProps {
  website: Website;
  preview?: boolean;
}

const NAV_SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'contact', label: 'Contact' },
];

export default function ModernTemplate({ website, preview = false }: ModernTemplateProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const business = website.business;
  const phone = business?.phone;
  const email = business?.email;
  const city = business?.city || 'Boerne';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
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
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, i) => {
      const hours = website.hours[day];
      return {
        day: dayNames[i],
        hours: hours ? `${formatTime(hours.open)}-${formatTime(hours.close)}` : 'Closed',
      };
    });
  };

  const formatTime = (time: string) => {
    const [hours] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'p' : 'a';
    const h12 = h % 12 || 12;
    return `${h12}${ampm}`;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Minimal Sticky Nav */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-gray-950/95 backdrop-blur border-b border-white/10' : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-3"
            >
              {logoUrl ? (
                <Image src={logoUrl} alt="" width={36} height={36} className="rounded" />
              ) : (
                <div
                  className="w-9 h-9 rounded flex items-center justify-center text-lg font-bold"
                  style={{ backgroundColor: website.accent_color, color: website.primary_color }}
                >
                  {business?.name?.charAt(0)}
                </div>
              )}
              <span className="font-semibold text-lg tracking-tight hidden sm:block">
                {business?.name}
              </span>
            </button>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {section.label}
                </button>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-4">
              {phone && (
                <a
                  href={preview ? '#' : `tel:${phone}`}
                  className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-105"
                  style={{ backgroundColor: website.accent_color, color: website.primary_color }}
                  onClick={preview ? (e) => e.preventDefault() : undefined}
                >
                  <Phone size={16} />
                  Call
                </a>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-white/60 hover:text-white"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-6 border-t border-white/10 pt-4">
              {NAV_SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="block w-full text-left px-4 py-3 text-white/60 hover:text-white"
                >
                  {section.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero - Full viewport, minimal */}
      <section className="relative min-h-screen flex items-center">
        {heroUrl && (
          <>
            <Image src={heroUrl} alt="" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-gray-950/40" />
          </>
        )}
        {!heroUrl && (
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, ${website.primary_color} 0%, ${website.primary_color}80 100%)` }}
          />
        )}

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-32">
          <div className="max-w-2xl">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-8"
              style={{ backgroundColor: `${website.accent_color}20`, color: website.accent_color }}
            >
              <Shield size={12} />
              Boerne Verified
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              {business?.name}
            </h1>

            {website.tagline && (
              <p className="text-xl md:text-2xl text-white/70 mb-8 leading-relaxed">
                {website.tagline}
              </p>
            )}

            <div className="flex flex-wrap gap-4">
              {phone && (
                <a
                  href={preview ? '#' : `tel:${phone}`}
                  className="flex items-center gap-3 px-8 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105"
                  style={{ backgroundColor: website.accent_color, color: website.primary_color }}
                  onClick={preview ? (e) => e.preventDefault() : undefined}
                >
                  <Phone size={20} />
                  {phone}
                </a>
              )}
              <button
                onClick={() => scrollToSection('services')}
                className="flex items-center gap-3 px-8 py-4 rounded-full text-lg font-semibold bg-white/10 hover:bg-white/20 transition-colors"
              >
                View Services
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center pt-2">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Quick Stats Bar */}
      <section className="bg-gray-900 border-y border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-center">
            {website.years_in_business && (
              <div>
                <div className="text-3xl font-bold" style={{ color: website.accent_color }}>
                  {website.years_in_business}+
                </div>
                <div className="text-sm text-white/50 mt-1">Years Experience</div>
              </div>
            )}
            {website.service_area?.cities && (
              <div>
                <div className="text-3xl font-bold" style={{ color: website.accent_color }}>
                  {website.service_area.cities.length}
                </div>
                <div className="text-sm text-white/50 mt-1">Cities Served</div>
              </div>
            )}
            {website.testimonials && website.testimonials.length > 0 && (
              <div>
                <div className="text-3xl font-bold flex items-center justify-center gap-1" style={{ color: website.accent_color }}>
                  5.0 <Star size={20} fill="currentColor" />
                </div>
                <div className="text-sm text-white/50 mt-1">{website.testimonials.length} Reviews</div>
              </div>
            )}
            {website.emergency_available && (
              <div>
                <div className="text-3xl font-bold" style={{ color: website.accent_color }}>24/7</div>
                <div className="text-sm text-white/50 mt-1">Emergency</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About */}
      {website.about_text && (
        <section id="about" className="py-24 md:py-32">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-8">About Us</h2>
                <p className="text-lg text-white/70 leading-relaxed whitespace-pre-line">
                  {website.about_text}
                </p>
                <div className="flex flex-wrap gap-4 mt-8">
                  {website.license_number && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg text-sm">
                      <Shield size={16} className="text-white/50" />
                      License #{website.license_number}
                    </div>
                  )}
                  {website.insurance_carrier && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg text-sm">
                      <Shield size={16} className="text-white/50" />
                      Fully Insured
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {website.gallery_photos?.slice(0, 4).map((photo) => {
                  const url = getPhotoUrl(photo);
                  if (!url) return null;
                  return (
                    <div key={photo.id} className="relative aspect-square rounded-2xl overflow-hidden">
                      <Image src={url} alt="" fill className="object-cover" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      {website.services && website.services.length > 0 && (
        <section id="services" className="py-24 md:py-32 bg-gray-900">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Services</h2>
            <p className="text-white/50 mb-12">What we offer</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {website.services.map((service, i) => (
                <div
                  key={i}
                  className="group p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold">{service.name}</h3>
                    <ArrowRight size={20} className="text-white/30 group-hover:text-white/60 transition-colors" />
                  </div>
                  {service.description && (
                    <p className="text-white/50 text-sm mb-4">{service.description}</p>
                  )}
                  {service.priceRange && (
                    <p className="text-sm font-medium" style={{ color: website.accent_color }}>
                      {service.priceRange}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      {website.testimonials && website.testimonials.length > 0 && (
        <section id="reviews" className="py-24 md:py-32">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Reviews</h2>
            <p className="text-white/50 mb-12">What clients say</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {website.testimonials.map((testimonial, i) => (
                <div key={i} className="p-6 bg-white/5 rounded-2xl">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        size={16}
                        fill={j < (testimonial.rating || 5) ? website.accent_color : 'transparent'}
                        stroke={j < (testimonial.rating || 5) ? website.accent_color : '#ffffff30'}
                      />
                    ))}
                  </div>
                  <p className="text-white/70 mb-4">&ldquo;{testimonial.text}&rdquo;</p>
                  <p className="text-sm font-medium">{testimonial.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Hours + Area */}
      <section className="py-24 md:py-32 bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Clock size={24} />
                <h2 className="text-2xl font-bold">Hours</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {formatHours().map(({ day, hours }) => (
                  <div
                    key={day}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      hours === 'Closed' ? 'bg-white/5 text-white/30' : 'bg-white/10'
                    }`}
                  >
                    <span className="font-medium">{day}</span> {hours}
                  </div>
                ))}
              </div>
              {website.emergency_available && (
                <p className="mt-6 text-sm" style={{ color: website.accent_color }}>
                  + 24/7 Emergency Service
                </p>
              )}
            </div>
            {website.service_area?.cities && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <MapPin size={24} />
                  <h2 className="text-2xl font-bold">Service Area</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {website.service_area.cities.map((cityName) => (
                    <span key={cityName} className="px-4 py-2 bg-white/10 rounded-lg text-sm">
                      {cityName}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section id="contact" className="py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to start?
          </h2>
          <p className="text-xl text-white/50 mb-10">
            Get in touch for a free estimate
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {phone && (
              <a
                href={preview ? '#' : `tel:${phone}`}
                className="flex items-center justify-center gap-3 px-10 py-5 rounded-full text-lg font-semibold transition-all hover:scale-105"
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
                className="flex items-center justify-center gap-3 px-10 py-5 rounded-full text-lg font-semibold bg-white/10 hover:bg-white/20 transition-colors"
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
      <footer className="py-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
          <div className="flex items-center gap-2">
            <Shield size={16} />
            Boerne Verified
          </div>
          <div className="flex gap-6">
            <Link href="/services" className="hover:text-white transition-colors">Find Services</Link>
            <Link href={`/report?site=${website.slug}`} className="hover:text-white transition-colors">Report</Link>
          </div>
          <div>
            Powered by <Link href="/" className="text-white hover:underline">Boerne&apos;s Handy Hub</Link>
          </div>
        </div>
      </footer>

      {/* Mobile CTA */}
      {phone && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-gray-950/95 backdrop-blur border-t border-white/10 z-40">
          <a
            href={preview ? '#' : `tel:${phone}`}
            className="flex items-center justify-center gap-2 w-full py-4 rounded-full text-lg font-bold"
            style={{ backgroundColor: website.accent_color, color: website.primary_color }}
            onClick={preview ? (e) => e.preventDefault() : undefined}
          >
            <Phone size={20} />
            Call Now
          </a>
        </div>
      )}
      <div className="md:hidden h-24" />
    </div>
  );
}
