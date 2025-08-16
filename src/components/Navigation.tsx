'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/weddings', label: 'Weddings & Events', featured: true },
    { href: '/dining', label: 'Dining' },
    { href: '/stay-play', label: 'Stay & Play' },
    { href: '/shopping', label: 'Shopping' },
    { href: '/outdoor', label: 'Outdoor Adventures' },
    { href: '/services', label: 'Professional Services' },
    { href: '/about', label: 'About Boerne' },
  ];

  return (
    <nav className="bg-boerne-navy shadow-lg border-b border-boerne-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-boerne-gold hover:text-boerne-gold-alt transition-colors">
                Boerne Handy Hub
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const isFeatured = item.featured;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-boerne-gold border-b-2 border-boerne-gold'
                        : isFeatured
                        ? 'text-boerne-gold hover:text-boerne-gold-alt'
                        : 'text-boerne-white hover:text-boerne-gold'
                    }`}
                  >
                    {item.label}
                    {isFeatured && <span className="ml-1">💍</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}