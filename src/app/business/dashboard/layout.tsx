'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { Business } from '@/lib/supabase';

interface BusinessDashboardContextType {
  user: User | null;
  business: Business | null;
  loading: boolean;
  refreshBusiness: () => Promise<void>;
}

const BusinessDashboardContext = createContext<BusinessDashboardContextType>({
  user: null,
  business: null,
  loading: true,
  refreshBusiness: async () => {},
});

export const useBusinessDashboard = () => useContext(BusinessDashboardContext);

const navItems = [
  { href: '/business/dashboard', icon: '📊', label: 'Dashboard', exact: true },
  { href: '/business/dashboard/profile', icon: '🏢', label: 'My Listing' },
  { href: '/business/dashboard/leads', icon: '📩', label: 'Leads & Quotes' },
  { href: '/business/dashboard/settings', icon: '⚙️', label: 'Settings' },
];

export default function BusinessDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (!supabase) {
        router.push('/business/login');
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/business/login');
        return;
      }

      setUser(user);

      // Fetch the business for this user
      const { data: businessData, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .single();

      if (error || !businessData) {
        console.error('Error fetching business:', error);
        router.push('/business/login');
        return;
      }

      setBusiness(businessData as Business);
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/business/login');
    } finally {
      setLoading(false);
    }
  };

  const refreshBusiness = async () => {
    if (!supabase || !user) return;

    const { data: businessData } = await supabase
      .from('businesses')
      .select('*')
      .eq('owner_id', user.id)
      .single();

    if (businessData) {
      setBusiness(businessData as Business);
    }
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push('/business/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-boerne-navy"></div>
      </div>
    );
  }

  if (!user || !business) {
    return null;
  }

  return (
    <BusinessDashboardContext.Provider value={{ user, business, loading, refreshBusiness }}>
      <div className="min-h-screen bg-gray-100 flex">
        {/* Sidebar */}
        <aside
          className={`bg-boerne-navy text-white flex flex-col transition-all duration-300 ${
            sidebarCollapsed ? 'w-16' : 'w-64'
          }`}
        >
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
            {!sidebarCollapsed && (
              <Link href="/business/dashboard" className="font-bold text-boerne-gold truncate">
                {business.name}
              </Link>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded hover:bg-white/10 transition-colors"
            >
              <svg
                className={`w-5 h-5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4">
            {navItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href) && item.href !== '/business/dashboard';

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                    isActive || (item.exact && pathname === item.href)
                      ? 'bg-boerne-gold/20 text-boerne-gold border-r-2 border-boerne-gold'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <span className="text-xl">{item.icon}</span>
                  {!sidebarCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </Link>
              );
            })}

            {/* View Public Listing */}
            <a
              href={`/services/${business.category}/${business.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/5 hover:text-white transition-colors"
              title={sidebarCollapsed ? 'View Listing' : undefined}
            >
              <span className="text-xl">🔗</span>
              {!sidebarCollapsed && (
                <span className="font-medium">View Public Listing</span>
              )}
            </a>
          </nav>

          {/* User Section */}
          <div className="border-t border-white/10 p-4">
            {!sidebarCollapsed ? (
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-boerne-gold/20 flex items-center justify-center text-boerne-gold text-sm font-bold">
                  {user.email?.charAt(0).toUpperCase() || 'B'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.email}</p>
                  <p className="text-xs text-white/50">Business Owner</p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center mb-4">
                <div className="w-8 h-8 rounded-full bg-boerne-gold/20 flex items-center justify-center text-boerne-gold text-sm font-bold">
                  {user.email?.charAt(0).toUpperCase() || 'B'}
                </div>
              </div>
            )}

            <button
              onClick={handleSignOut}
              className={`flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors ${
                sidebarCollapsed ? 'justify-center w-full' : ''
              }`}
              title={sidebarCollapsed ? 'Sign Out' : undefined}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {!sidebarCollapsed && <span>Sign Out</span>}
            </button>

            {!sidebarCollapsed && (
              <Link
                href="/"
                className="mt-4 flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Site
              </Link>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </BusinessDashboardContext.Provider>
  );
}
