import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

interface RealtorProfile {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  license_number?: string;
  tagline?: string;
  bio?: string;
  photo_url?: string;
  logo_url?: string;
  brand_color?: string;
  created_at: string;
}

const demoRealtors: Record<string, RealtorProfile> = {
  'demo-1': {
    id: 'demo-1',
    name: 'Sarah Johnson',
    email: 'sarah@hillcountryrealty.com',
    company: 'Hill Country Realty',
    phone: '(830) 555-1234',
    license_number: '123456789',
    tagline: 'Your Boerne real estate expert',
    bio: 'With over 15 years of experience in the Boerne market, I help families find their perfect Hill Country home. Whether you\'re looking for a starter home near downtown or a luxury estate in Cordillera Ranch, I\'m here to guide you through every step of the process.\n\nI specialize in relocation clients and love helping newcomers discover everything our wonderful community has to offer.',
    photo_url: undefined,
    brand_color: '#1e3a5f',
    created_at: '2024-01-15',
  },
  'demo-2': {
    id: 'demo-2',
    name: 'Michael Chen',
    email: 'michael@txhillcountry.com',
    company: 'Texas Hill Country Properties',
    phone: '(830) 555-5678',
    tagline: 'Making Hill Country dreams come true',
    bio: 'Specializing in Fair Oaks Ranch and Cordillera Ranch luxury properties. With a background in architecture, I bring a unique perspective to finding homes that perfectly match your lifestyle.',
    photo_url: undefined,
    brand_color: '#1e3a5f',
    created_at: '2024-02-20',
  },
  'demo-3': {
    id: 'demo-3',
    name: 'Amanda Rodriguez',
    email: 'amanda@boerneliving.com',
    company: 'Boerne Living Realty',
    tagline: 'First-time buyer specialist',
    bio: 'Helping first-time homebuyers navigate the Boerne market with confidence. I believe everyone deserves to find their perfect home, and I work tirelessly to make that dream a reality.',
    photo_url: undefined,
    brand_color: '#1e3a5f',
    created_at: '2024-03-10',
  },
};

async function getRealtor(realtorId: string): Promise<RealtorProfile | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    // Return demo data in development
    return demoRealtors[realtorId] || null;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data, error } = await supabase
    .from('realtor_profiles')
    .select('*')
    .eq('id', realtorId)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ realtorId: string }>;
}): Promise<Metadata> {
  const { realtorId } = await params;
  const realtor = await getRealtor(realtorId);

  if (!realtor) {
    return {
      title: 'Realtor Not Found | Boerne\'s Handy Hub',
    };
  }

  return {
    title: `${realtor.name} - ${realtor.company} | Boerne Realtor`,
    description: realtor.tagline || `${realtor.name} is a real estate agent at ${realtor.company} serving the Boerne, Texas area.`,
    openGraph: {
      title: `${realtor.name} - ${realtor.company}`,
      description: realtor.tagline || `Real estate agent serving Boerne, Texas`,
      type: 'profile',
    },
  };
}

export default async function RealtorProfilePage({
  params,
}: {
  params: Promise<{ realtorId: string }>;
}) {
  const { realtorId } = await params;
  const realtor = await getRealtor(realtorId);

  if (!realtor) {
    notFound();
  }

  const brandColor = realtor.brand_color || '#1e3a5f';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with brand color */}
      <div
        className="h-32 lg:h-48"
        style={{ backgroundColor: brandColor }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 lg:-mt-24 pb-16">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {realtor.photo_url ? (
                  <img
                    src={realtor.photo_url}
                    alt={realtor.name}
                    className="w-24 h-24 lg:w-32 lg:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div
                    className="w-24 h-24 lg:w-32 lg:h-32 rounded-full flex items-center justify-center border-4 border-white shadow-lg"
                    style={{ backgroundColor: `${brandColor}20` }}
                  >
                    <span
                      className="text-4xl lg:text-5xl font-bold"
                      style={{ color: brandColor }}
                    >
                      {realtor.name[0]}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {realtor.name}
                </h1>
                <p className="text-lg font-medium" style={{ color: brandColor }}>
                  {realtor.company}
                </p>
                {realtor.tagline && (
                  <p className="text-gray-600 mt-2">{realtor.tagline}</p>
                )}

                {/* Contact buttons */}
                <div className="flex flex-wrap gap-3 mt-4">
                  {realtor.phone && (
                    <a
                      href={`tel:${realtor.phone.replace(/[^0-9]/g, '')}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-boerne-gold text-boerne-navy font-medium rounded-lg hover:bg-boerne-gold-alt transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {realtor.phone}
                    </a>
                  )}
                  <a
                    href={`mailto:${realtor.email}`}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email
                  </a>
                </div>
              </div>

              {/* Logo */}
              {realtor.logo_url && (
                <div className="flex-shrink-0 hidden lg:block">
                  <img
                    src={realtor.logo_url}
                    alt={`${realtor.company} logo`}
                    className="h-16 object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Bio section */}
          {realtor.bio && (
            <div className="px-6 lg:px-8 pb-6 lg:pb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">About {realtor.name.split(' ')[0]}</h2>
              <div className="prose prose-gray max-w-none">
                {realtor.bio.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-gray-600 mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* License info */}
          {realtor.license_number && (
            <div className="px-6 lg:px-8 pb-6 lg:pb-8">
              <p className="text-sm text-gray-500">
                Texas Real Estate License: {realtor.license_number}
              </p>
            </div>
          )}
        </div>

        {/* Resources section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6 lg:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Helpful Resources
          </h2>
          <p className="text-gray-600 mb-6">
            {realtor.name.split(' ')[0]} recommends these resources for anyone moving to Boerne:
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/moving-to-boerne"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-boerne-gold hover:bg-boerne-gold/5 transition-colors"
            >
              <span className="text-2xl">📍</span>
              <div>
                <div className="font-medium text-gray-900">Moving to Boerne Guide</div>
                <div className="text-sm text-gray-500">Complete relocation resource</div>
              </div>
            </Link>

            <Link
              href="/guides/new-homeowner-checklist"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-boerne-gold hover:bg-boerne-gold/5 transition-colors"
            >
              <span className="text-2xl">✅</span>
              <div>
                <div className="font-medium text-gray-900">New Homeowner Checklist</div>
                <div className="text-sm text-gray-500">First 30 days essentials</div>
              </div>
            </Link>

            <Link
              href="/services"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-boerne-gold hover:bg-boerne-gold/5 transition-colors"
            >
              <span className="text-2xl">🔧</span>
              <div>
                <div className="font-medium text-gray-900">Find Service Providers</div>
                <div className="text-sm text-gray-500">HVAC, plumbing, electrical & more</div>
              </div>
            </Link>

            <Link
              href="/my-home"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-boerne-gold hover:bg-boerne-gold/5 transition-colors"
            >
              <span className="text-2xl">🏠</span>
              <div>
                <div className="font-medium text-gray-900">Home Tracker</div>
                <div className="text-sm text-gray-500">Maintenance reminders</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link
            href="/realtors/directory"
            className="text-boerne-gold hover:text-boerne-gold-alt font-medium"
          >
            ← View All Boerne Realtors
          </Link>
        </div>
      </div>
    </div>
  );
}
