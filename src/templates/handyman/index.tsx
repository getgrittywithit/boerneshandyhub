'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, Shield, Star, CheckCircle2 } from 'lucide-react';
import type { Website, WebsitePhoto } from '@/lib/websites/types';

interface HandymanTemplateProps {
  website: Website;
  preview?: boolean;
}

export default function HandymanTemplate({ website, preview = false }: HandymanTemplateProps) {
  const business = website.business;
  const phone = business?.phone;
  const email = business?.email;
  const address = business?.address;
  const city = business?.city || 'Boerne';
  const state = business?.state || 'TX';
  const zip = business?.zip;

  const fullAddress = [address, city, state, zip].filter(Boolean).join(', ');

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
      className="min-h-screen"
      style={{
        '--primary': website.primary_color,
        '--accent': website.accent_color,
      } as React.CSSProperties}
    >
      {/* Mobile Sticky Header */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-50 shadow-md"
        style={{ backgroundColor: website.primary_color }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            {logoUrl && (
              <Image
                src={logoUrl}
                alt={business?.name || 'Logo'}
                width={32}
                height={32}
                className="rounded"
              />
            )}
            <span className="text-white font-semibold text-sm truncate max-w-[150px]">
              {business?.name}
            </span>
          </div>
          {phone && (
            <a
              href={preview ? '#' : `tel:${phone}`}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
              style={{ backgroundColor: website.accent_color, color: website.primary_color }}
              onClick={preview ? (e) => e.preventDefault() : undefined}
            >
              <Phone size={16} />
              Call Now
            </a>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <section
        className="relative pt-20 lg:pt-0"
        style={{ backgroundColor: website.primary_color }}
      >
        {heroUrl ? (
          <div className="relative h-[300px] lg:h-[400px]">
            <Image
              src={heroUrl}
              alt={website.tagline || business?.name || 'Hero'}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
          </div>
        ) : (
          <div className="h-[200px] lg:h-[300px]" />
        )}

        <div className="relative lg:absolute lg:bottom-0 lg:left-0 lg:right-0 px-4 py-8 lg:py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              {logoUrl && (
                <Image
                  src={logoUrl}
                  alt={business?.name || 'Logo'}
                  width={80}
                  height={80}
                  className="rounded-lg shadow-lg hidden lg:block"
                />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: website.accent_color, color: website.primary_color }}
                  >
                    <Shield size={12} />
                    Boerne Verified
                  </span>
                </div>
                <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2">
                  {business?.name}
                </h1>
                {website.tagline && (
                  <p className="text-lg text-white/90">{website.tagline}</p>
                )}
              </div>
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-4 mt-6">
              {phone && (
                <a
                  href={preview ? '#' : `tel:${phone}`}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg text-lg font-semibold shadow-lg transition-transform hover:scale-105"
                  style={{ backgroundColor: website.accent_color, color: website.primary_color }}
                  onClick={preview ? (e) => e.preventDefault() : undefined}
                >
                  <Phone size={20} />
                  {phone}
                </a>
              )}
              {email && (
                <a
                  href={preview ? '#' : `mailto:${email}`}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg text-lg font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors"
                  onClick={preview ? (e) => e.preventDefault() : undefined}
                >
                  <Mail size={20} />
                  Email Us
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="bg-gray-100 border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            {fullAddress && (
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                <span>{fullAddress}</span>
              </div>
            )}
            {website.years_in_business && (
              <div className="flex items-center gap-1">
                <CheckCircle2 size={16} />
                <span>{website.years_in_business}+ years in business</span>
              </div>
            )}
            {website.license_number && (
              <div className="flex items-center gap-1">
                <Shield size={16} />
                <span>License #{website.license_number}</span>
              </div>
            )}
            {website.insurance_carrier && (
              <div className="flex items-center gap-1">
                <Shield size={16} />
                <span>Insured</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      {website.about_text && (
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About Us</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {website.about_text}
            </p>
          </div>
        </section>
      )}

      {/* Services Section */}
      {website.services && website.services.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Services</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {website.services.map((service, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${website.accent_color}20` }}
                    >
                      <CheckCircle2
                        size={16}
                        style={{ color: website.primary_color }}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{service.name}</h3>
                      {service.description && (
                        <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                      )}
                      {service.priceRange && (
                        <p
                          className="text-sm font-medium mt-1"
                          style={{ color: website.primary_color }}
                        >
                          {service.priceRange}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {website.gallery_photos && website.gallery_photos.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Work</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {website.gallery_photos.map((photo) => {
                const url = getPhotoUrl(photo);
                if (!url) return null;
                return (
                  <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden">
                    <Image
                      src={url}
                      alt={photo.alt_text || 'Project photo'}
                      fill
                      className="object-cover hover:scale-105 transition-transform"
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
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What Our Customers Say</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {website.testimonials.map((testimonial, i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                  {testimonial.rating && (
                    <div className="flex items-center gap-1 mb-3">
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
                  <p className="text-gray-700 italic mb-4">&ldquo;{testimonial.text}&rdquo;</p>
                  <p className="text-sm font-medium text-gray-900">— {testimonial.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Hours & Service Area Section */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Hours */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock size={24} />
                Hours of Operation
              </h2>
              <div className="space-y-2">
                {formatHours().map(({ day, hours }) => (
                  <div key={day} className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{day}</span>
                    <span className={hours === 'Closed' ? 'text-gray-400' : 'text-gray-900'}>
                      {hours}
                    </span>
                  </div>
                ))}
              </div>
              {website.emergency_available && (
                <div
                  className="mt-4 px-4 py-2 rounded-lg text-sm font-medium"
                  style={{ backgroundColor: `${website.accent_color}20`, color: website.primary_color }}
                >
                  24/7 Emergency Service Available
                </div>
              )}
            </div>

            {/* Service Area */}
            {website.service_area && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin size={24} />
                  Service Area
                </h2>
                {website.service_area.radiusMiles && (
                  <p className="text-gray-700 mb-2">
                    Serving customers within {website.service_area.radiusMiles} miles of Boerne
                  </p>
                )}
                {website.service_area.cities && website.service_area.cities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {website.service_area.cities.map((city) => (
                      <span
                        key={city}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                      >
                        {city}
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
        className="py-12"
        style={{ backgroundColor: website.primary_color }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/80 mb-6">
            Contact us today for a free estimate
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {phone && (
              <a
                href={preview ? '#' : `tel:${phone}`}
                className="flex items-center gap-2 px-8 py-4 rounded-lg text-lg font-semibold shadow-lg transition-transform hover:scale-105 w-full sm:w-auto justify-center"
                style={{ backgroundColor: website.accent_color, color: website.primary_color }}
                onClick={preview ? (e) => e.preventDefault() : undefined}
              >
                <Phone size={20} />
                Call {phone}
              </a>
            )}
            {email && (
              <a
                href={preview ? '#' : `mailto:${email}`}
                className="flex items-center gap-2 px-8 py-4 rounded-lg text-lg font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors w-full sm:w-auto justify-center"
                onClick={preview ? (e) => e.preventDefault() : undefined}
              >
                <Mail size={20} />
                Send Email
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Shield size={16} />
              <span>Boerne Verified Business</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href={`/services`}
                className="hover:text-white transition-colors"
              >
                Browse More Services
              </Link>
              <span>•</span>
              <Link
                href={`/report?site=${website.slug}`}
                className="hover:text-white transition-colors"
              >
                Report This Listing
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
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg">
          <a
            href={preview ? '#' : `tel:${phone}`}
            className="flex items-center justify-center gap-2 w-full py-4 rounded-lg text-lg font-semibold"
            style={{ backgroundColor: website.primary_color, color: 'white' }}
            onClick={preview ? (e) => e.preventDefault() : undefined}
          >
            <Phone size={20} />
            Call Now - {phone}
          </a>
        </div>
      )}

      {/* Extra padding for mobile fixed CTA */}
      <div className="lg:hidden h-24" />
    </div>
  );
}
