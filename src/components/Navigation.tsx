'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { topLevelCategories } from '@/data/serviceCategories';

interface NavItem {
  href?: string;
  label: string;
  featured?: boolean;
  new?: boolean;
  dropdown?: { href: string; label: string; icon?: string }[];
}

export default function Navigation() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      if (!supabase) return; // No Supabase configured
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        setIsAdmin(profile?.role === 'admin');
      }
    } catch {
      // Silently fail - just don't show admin link
    }
  };

  // Generate services dropdown from top-level categories
  const servicesDropdown = topLevelCategories.map(cat => ({
    href: `/services/${cat.slug}`,
    label: cat.name,
    icon: cat.icon,
  }));

  const navItems: NavItem[] = [
    { href: '/', label: 'Home' },
    {
      label: 'Services',
      featured: true,
      dropdown: [
        { href: '/services', label: 'All Services', icon: '🔍' },
        ...servicesDropdown, // Show all 5 top-level categories
      ]
    },
    { href: '/weddings', label: 'Weddings' },
    { href: '/resources', label: 'Resources' },
    { href: '/business', label: 'Get Listed' },
  ];

  // Secondary nav items (shown in more dropdown on desktop, full on mobile)
  const secondaryNavItems: NavItem[] = [
    { href: '/my-home', label: 'Home Tracker' },
    { href: '/outdoor', label: 'Outdoors' },
    { href: '/dining', label: 'Dining' },
    { href: '/events', label: 'Events' },
    { href: '/about', label: 'About' },
  ];

  return (
    <nav className="bg-boerne-navy shadow-lg border-b border-boerne-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-boerne-gold hover:text-boerne-gold-alt transition-colors">
                Boerne's Handy Hub
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:ml-10 lg:flex lg:space-x-6">
              {navItems.map((item) => {
                if (item.dropdown) {
                  // Dropdown menu item
                  const isDropdownOpen = openDropdown === item.label;
                  const isDropdownActive = item.dropdown.some(subItem => pathname.startsWith(subItem.href));

                  return (
                    <div key={item.label} className="relative">
                      <button
                        onClick={() => setOpenDropdown(isDropdownOpen ? null : item.label)}
                        onMouseEnter={() => setOpenDropdown(item.label)}
                        className={`inline-flex items-center px-1 py-2 text-sm font-medium transition-colors ${
                          isDropdownActive || item.featured
                            ? 'text-boerne-gold'
                            : 'text-white hover:text-boerne-gold'
                        }`}
                      >
                        {item.label}
                        <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {isDropdownOpen && (
                        <div
                          className="absolute left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                          onMouseLeave={() => setOpenDropdown(null)}
                        >
                          <div className="py-2">
                            {item.dropdown.map((subItem, idx) => (
                              <Link
                                key={subItem.href + idx}
                                href={subItem.href}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-boerne-navy hover:bg-boerne-light-gray transition-colors"
                                onClick={() => setOpenDropdown(null)}
                              >
                                {subItem.icon && <span>{subItem.icon}</span>}
                                {subItem.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                } else {
                  // Regular menu item
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href!}
                      className={`inline-flex items-center px-1 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? 'text-boerne-gold border-b-2 border-boerne-gold'
                          : 'text-white hover:text-boerne-gold'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                }
              })}

              {/* More dropdown for secondary items */}
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'More' ? null : 'More')}
                  onMouseEnter={() => setOpenDropdown('More')}
                  className="inline-flex items-center px-1 py-2 text-sm font-medium text-white/70 hover:text-boerne-gold transition-colors"
                >
                  More
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {openDropdown === 'More' && (
                  <div
                    className="absolute left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <div className="py-2">
                      {secondaryNavItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href!}
                          className="block px-4 py-2 text-sm text-boerne-navy hover:bg-boerne-light-gray transition-colors"
                          onClick={() => setOpenDropdown(null)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {isAdmin && (
                <Link
                  href="/admin"
                  className={`inline-flex items-center px-1 py-2 text-sm font-medium transition-colors ${
                    pathname.startsWith('/admin')
                      ? 'text-boerne-gold'
                      : 'text-gray-400 hover:text-boerne-gold'
                  }`}
                  title="Admin Dashboard"
                >
                  ⚙️
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-boerne-gold focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* CTA Button (Desktop) */}
          <div className="hidden lg:flex lg:items-center">
            <Link
              href="/services"
              className="px-4 py-2 bg-boerne-gold text-boerne-navy text-sm font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors"
            >
              Find a Pro
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4">
            <div className="space-y-1">
              {navItems.map((item) => {
                if (item.dropdown) {
                  return (
                    <div key={item.label}>
                      <div className="px-3 py-2 text-sm font-medium text-boerne-gold">
                        {item.label}
                      </div>
                      <div className="ml-4 space-y-1">
                        {item.dropdown.map((subItem, idx) => (
                          <Link
                            key={subItem.href + idx}
                            href={subItem.href}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-white hover:text-boerne-gold"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {subItem.icon && <span>{subItem.icon}</span>}
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }
                return (
                  <Link
                    key={item.href}
                    href={item.href!}
                    className="block px-3 py-2 text-sm font-medium text-white hover:text-boerne-gold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <div className="border-t border-white/10 mt-4 pt-4">
                <div className="px-3 py-2 text-xs font-medium text-white/50 uppercase">
                  More
                </div>
                {secondaryNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href!}
                    className="block px-3 py-2 text-sm text-white/70 hover:text-boerne-gold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="px-3 pt-4">
                <Link
                  href="/services"
                  className="block w-full px-4 py-2 bg-boerne-gold text-boerne-navy text-sm font-semibold rounded-lg text-center hover:bg-boerne-gold-alt transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Find a Pro
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
