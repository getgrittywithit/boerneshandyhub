'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface NavItem {
  href?: string;
  label: string;
  featured?: boolean;
  new?: boolean;
  dropdown?: { href: string; label: string }[];
}

export default function Navigation() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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
  
  const navItems: NavItem[] = [
    { href: '/', label: '🏠 Home' },
    { 
      label: '🌲 Explore', 
      dropdown: [
        { href: '/outdoor', label: 'Outdoor Adventures' },
        { href: '/parks', label: 'Parks & Recreation' },
        { href: '/trails', label: 'Trails' },
        { href: '/nature-parks', label: 'Nature Centers' },
        { href: '/dog-parks', label: 'Dog Parks' },
      ]
    },
    { href: '/dining', label: '🍽️ Dining' },
    { href: '/stay-play', label: '🏨 Stay & Play' },
    { href: '/weddings', label: '💍 Weddings', featured: true },
    { href: '/marketplace', label: '🛍️ Marketplace', new: true },
    { 
      label: '🔧 Services', 
      dropdown: [
        { href: '/services', label: 'Professional Services' },
        { href: '/business/onboard', label: 'List Your Business' },
      ]
    },
    { href: '/about', label: 'ℹ️ About Boerne' },
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
                if (item.dropdown) {
                  // Dropdown menu item
                  const isDropdownOpen = openDropdown === item.label;
                  const isDropdownActive = item.dropdown.some(subItem => pathname === subItem.href);
                  
                  return (
                    <div key={item.label} className="relative">
                      <button
                        onClick={() => setOpenDropdown(isDropdownOpen ? null : item.label)}
                        onMouseEnter={() => setOpenDropdown(item.label)}
                        className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${
                          isDropdownActive
                            ? 'text-boerne-gold border-b-2 border-boerne-gold'
                            : 'text-boerne-white hover:text-boerne-gold'
                        }`}
                      >
                        {item.label}
                        <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {isDropdownOpen && (
                        <div 
                          className="absolute left-0 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50"
                          onMouseLeave={() => setOpenDropdown(null)}
                        >
                          <div className="py-1">
                            {item.dropdown.map((subItem) => (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className="block px-4 py-2 text-sm text-boerne-navy hover:bg-boerne-light-gray hover:text-boerne-navy transition-colors"
                                onClick={() => setOpenDropdown(null)}
                              >
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
                  const isFeatured = item.featured;
                  const isNew = item.new;
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href!}
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${
                        isActive
                          ? 'text-boerne-gold border-b-2 border-boerne-gold'
                          : isFeatured || isNew
                          ? 'text-boerne-gold hover:text-boerne-gold-alt'
                          : 'text-boerne-white hover:text-boerne-gold'
                      }`}
                    >
                      {item.label}
                      {isNew && <span className="ml-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded">NEW</span>}
                    </Link>
                  );
                }
              })}
              {isAdmin && (
                <Link
                  href="/admin"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${
                    pathname.startsWith('/admin')
                      ? 'text-boerne-gold border-b-2 border-boerne-gold'
                      : 'text-gray-400 hover:text-boerne-gold'
                  }`}
                  title="Admin Dashboard"
                >
                  ⚙️
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}