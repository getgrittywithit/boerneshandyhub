import { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

export const metadata: Metadata = {
  title: 'Boerne Realtors | Find a Local Real Estate Agent',
  description: 'Find trusted realtors in Boerne, Texas. Local real estate agents who know the Hill Country market and partner with Boerne\'s Handy Hub.',
  openGraph: {
    title: 'Boerne Realtors | Find a Local Real Estate Agent',
    description: 'Find trusted realtors in Boerne, Texas who know the Hill Country market.',
    type: 'website',
  },
};

interface RealtorProfile {
  id: string;
  name: string;
  company: string;
  phone?: string;
  tagline?: string;
  bio?: string;
  photo_url?: string;
  created_at: string;
}

async function getRealtors(): Promise<RealtorProfile[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    // Return demo data in development
    return [
      {
        id: 'demo-1',
        name: 'Sarah Johnson',
        company: 'Hill Country Realty',
        phone: '(830) 555-1234',
        tagline: 'Your Boerne real estate expert',
        bio: 'With over 15 years of experience in the Boerne market, I help families find their perfect Hill Country home.',
        photo_url: undefined,
        created_at: '2024-01-15',
      },
      {
        id: 'demo-2',
        name: 'Michael Chen',
        company: 'Texas Hill Country Properties',
        phone: '(830) 555-5678',
        tagline: 'Making Hill Country dreams come true',
        bio: 'Specializing in Fair Oaks Ranch and Cordillera Ranch luxury properties.',
        photo_url: undefined,
        created_at: '2024-02-20',
      },
      {
        id: 'demo-3',
        name: 'Amanda Rodriguez',
        company: 'Boerne Living Realty',
        tagline: 'First-time buyer specialist',
        bio: 'Helping first-time homebuyers navigate the Boerne market with confidence.',
        photo_url: undefined,
        created_at: '2024-03-10',
      },
    ];
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Get realtors who have opted into the public directory
  // For now, we'll show all realtors - in the future, add a `show_in_directory` column
  const { data, error } = await supabase
    .from('realtor_profiles')
    .select('id, name, company, phone, tagline, bio, photo_url, created_at')
    .order('name');

  if (error) {
    console.error('Error fetching realtors:', error);
    return [];
  }

  return data || [];
}

export default async function RealtorDirectoryPage() {
  const realtors = await getRealtors();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-boerne-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Find a Boerne Realtor
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Connect with local real estate agents who know the Hill Country market
            and partner with Boerne's Handy Hub to support their clients.
          </p>
        </div>
      </section>

      {/* Directory */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {realtors.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 mb-4">No realtors listed yet.</p>
              <Link
                href="/realtors/register"
                className="text-boerne-gold hover:text-boerne-gold-alt font-medium"
              >
                Are you a realtor? Join our partner program →
              </Link>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-8">
                {realtors.length} realtor{realtors.length !== 1 ? 's' : ''} in the Boerne area
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {realtors.map((realtor) => (
                  <Link
                    key={realtor.id}
                    href={`/realtors/directory/${realtor.id}`}
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-6 block"
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {realtor.photo_url ? (
                          <img
                            src={realtor.photo_url}
                            alt={realtor.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-boerne-gold/20 rounded-full flex items-center justify-center">
                            <span className="text-boerne-gold text-2xl font-bold">
                              {realtor.name[0]}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-lg truncate">
                          {realtor.name}
                        </h3>
                        <p className="text-boerne-gold text-sm font-medium truncate">
                          {realtor.company}
                        </p>
                        {realtor.tagline && (
                          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                            {realtor.tagline}
                          </p>
                        )}
                      </div>
                    </div>

                    {realtor.bio && (
                      <p className="text-gray-600 text-sm mt-4 line-clamp-3">
                        {realtor.bio}
                      </p>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                      {realtor.phone && (
                        <span className="text-sm text-gray-500">{realtor.phone}</span>
                      )}
                      <span className="text-boerne-gold text-sm font-medium">
                        View Profile →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Are You a Realtor?
          </h2>
          <p className="text-gray-600 mb-6">
            Join our Realtor Partner Program for free. Get a public profile, create welcome packets
            for your clients, and access resources to share with home buyers.
          </p>
          <Link
            href="/realtors/register"
            className="inline-block px-6 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors"
          >
            Join the Partner Program
          </Link>
        </div>
      </section>
    </div>
  );
}
