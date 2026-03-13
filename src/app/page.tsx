import Link from "next/link";
import FloatingChat from "@/components/FloatingChat";

export default function Home() {
  const categories = [
    {
      title: "Dining",
      description: "From German fare to Texas BBQ, discover the best local restaurants.",
      href: "/dining",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
    },
    {
      title: "Weddings",
      description: "Plan your dream Hill Country wedding with local vendors.",
      href: "/weddings",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      title: "Events",
      description: "Stay updated on festivals, markets, and community happenings.",
      href: "/events",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: "Stay & Play",
      description: "Find charming accommodations and plan your perfect getaway.",
      href: "/stay-play",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      title: "Outdoors",
      description: "Explore trails, parks, and Hill Country natural beauty.",
      href: "/outdoor",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
    },
    {
      title: "Marketplace",
      description: "Shop local artisans, farmers, and small businesses.",
      href: "/marketplace",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      badge: "New",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-24 lg:pt-32 lg:pb-32">
          <div className="max-w-3xl">
            <h1 className="text-5xl lg:text-7xl font-semibold tracking-tight text-gray-900 leading-[1.1]">
              Your guide to
              <span className="block text-boerne-navy">Boerne, Texas</span>
            </h1>
            <p className="mt-8 text-xl text-gray-600 leading-relaxed max-w-2xl">
              Discover the heart of Texas Hill Country. From local dining and outdoor adventures
              to wedding planning and community events.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/about"
                className="inline-flex items-center px-6 py-3 bg-boerne-navy text-white font-medium rounded-full hover:bg-boerne-navy/90 transition-colors"
              >
                Explore Boerne
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/business"
                className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-900 font-medium rounded-full hover:bg-gray-200 transition-colors"
              >
                List Your Business
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative element */}
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-l from-gray-50 to-transparent" />
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mb-16">
            <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900">
              Explore by category
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need to discover, plan, and enjoy Boerne.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className="group relative bg-white p-8 rounded-2xl border border-gray-200 hover:border-boerne-navy/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 bg-boerne-navy/5 rounded-xl flex items-center justify-center text-boerne-navy group-hover:bg-boerne-navy group-hover:text-white transition-colors">
                    {category.icon}
                  </div>
                  {category.badge && (
                    <span className="px-2.5 py-1 bg-boerne-green/10 text-boerne-green text-xs font-medium rounded-full">
                      {category.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-boerne-navy transition-colors">
                  {category.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {category.description}
                </p>
                <div className="mt-6 flex items-center text-boerne-navy font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Learn more</span>
                  <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 leading-tight">
                A charming Hill Country town since 1849
              </h2>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                Pronounced &quot;BURN-ee,&quot; Boerne blends German heritage with modern Texas charm.
                Just 30 miles from San Antonio, we offer small-town warmth with easy access
                to everything the Hill Country has to offer.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center mt-8 text-boerne-navy font-medium hover:underline"
              >
                Learn our history
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="text-center p-8 bg-gray-50 rounded-2xl">
                <div className="text-4xl lg:text-5xl font-semibold text-boerne-navy">1849</div>
                <div className="mt-2 text-gray-600">Founded</div>
              </div>
              <div className="text-center p-8 bg-gray-50 rounded-2xl">
                <div className="text-4xl lg:text-5xl font-semibold text-boerne-navy">24K+</div>
                <div className="mt-2 text-gray-600">Population</div>
              </div>
              <div className="text-center p-8 bg-gray-50 rounded-2xl">
                <div className="text-4xl lg:text-5xl font-semibold text-boerne-navy">30</div>
                <div className="mt-2 text-gray-600">Miles to SA</div>
              </div>
              <div className="text-center p-8 bg-gray-50 rounded-2xl">
                <div className="text-4xl lg:text-5xl font-semibold text-boerne-navy">100+</div>
                <div className="mt-2 text-gray-600">Local Businesses</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-boerne-navy">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-semibold text-white">
            Own a local business?
          </h2>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
            Join Boerne Handy Hub and connect with visitors and locals looking for what you offer.
          </p>
          <Link
            href="/business"
            className="inline-flex items-center mt-8 px-8 py-4 bg-white text-boerne-navy font-semibold rounded-full hover:bg-gray-100 transition-colors"
          >
            Get Listed
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer spacing for floating chat */}
      <div className="h-20" />

      {/* Floating Chat */}
      <FloatingChat />
    </div>
  );
}
