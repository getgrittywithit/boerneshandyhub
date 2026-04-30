'use client';

import Link from 'next/link';
import { getTopLevelCategory, topLevelCategories, ServiceCategory, getSubcategoriesWithCrossListings } from '@/data/serviceCategories';

interface CategoryPageClientProps {
  categorySlug: string;
}

// Helper to group subcategories by section and sort alphabetically within each section
function groupBySection(subcategories: ServiceCategory[]): Map<string, ServiceCategory[]> {
  const grouped = new Map<string, ServiceCategory[]>();

  subcategories.forEach(sub => {
    const section = sub.section || 'Other';
    if (!grouped.has(section)) {
      grouped.set(section, []);
    }
    grouped.get(section)!.push(sub);
  });

  // Sort each section alphabetically by name
  grouped.forEach((subs, section) => {
    grouped.set(section, subs.sort((a, b) => a.name.localeCompare(b.name)));
  });

  return grouped;
}

export default function CategoryPageClient({ categorySlug }: CategoryPageClientProps) {
  const category = getTopLevelCategory(categorySlug);

  if (!category) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <Link href="/services" className="text-boerne-gold hover:underline">
            Browse all services
          </Link>
        </div>
      </div>
    );
  }

  // Get subcategories including cross-listed items
  const subcategoriesWithCrossListings = getSubcategoriesWithCrossListings(categorySlug);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-boerne-navy via-boerne-dark-gray to-boerne-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-white/60">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">Services</Link>
              </li>
              <li>/</li>
              <li className="text-white font-medium">{category.name}</li>
            </ol>
          </nav>

          <div className="text-center">
            <div className="text-6xl mb-4">{category.icon}</div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              {category.name} Services
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              {category.description}
            </p>
            <p className="mt-4 text-boerne-gold font-medium">
              {subcategoriesWithCrossListings.length} service types available
            </p>
          </div>
        </div>

        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60V30C360 0 720 60 1080 30C1260 15 1380 22.5 1440 30V60H0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-gray-50 border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-3 overflow-x-auto">
            {topLevelCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/services/${cat.slug}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  cat.slug === categorySlug
                    ? 'bg-boerne-navy text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Subcategories Grid - Grouped by Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {Array.from(groupBySection(subcategoriesWithCrossListings)).map(([section, subs]) => (
            <div key={section} className="mb-10 last:mb-0">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="h-px flex-1 bg-gray-200 max-w-[40px]" />
                {section}
                <span className="h-px flex-1 bg-gray-200" />
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {subs.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/services/${categorySlug}/${sub.slug}`}
                    className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-boerne-gold hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl flex-shrink-0">{sub.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 group-hover:text-boerne-navy transition-colors">
                          {sub.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                          {sub.description}
                        </p>
                      </div>
                      <svg
                        className="w-5 h-5 text-gray-400 group-hover:text-boerne-gold group-hover:translate-x-1 transition-all flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Other Categories */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Browse Other Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {topLevelCategories
              .filter((cat) => cat.slug !== categorySlug)
              .map((cat) => (
                <Link
                  key={cat.id}
                  href={`/services/${cat.slug}`}
                  className="group bg-white border border-gray-200 rounded-xl p-6 text-center hover:border-boerne-gold hover:shadow-md transition-all"
                >
                  <div className="text-4xl mb-3">{cat.icon}</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-boerne-navy transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {cat.subcategories.length} services
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-boerne-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-semibold text-white mb-4">
            Offer {category.name} Services?
          </h2>
          <p className="text-lg text-white mb-8">
            Get your business listed and connect with customers in Boerne looking for {category.name.toLowerCase()} services.
          </p>
          <Link
            href="/business"
            className="inline-flex items-center px-8 py-4 bg-boerne-gold text-boerne-navy font-semibold rounded-full hover:bg-boerne-gold-alt transition-colors"
          >
            Get Listed Free
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
