'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AdminContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType>({
  user: null,
  isAdmin: false,
  loading: true,
});

export const useAdmin = () => useContext(AdminContext);

const navItems = [
  { href: '/admin', icon: '📊', label: 'Dashboard', exact: true },
  { href: '/admin/providers', icon: '🏢', label: 'Providers' },
  { href: '/admin/categories', icon: '📁', label: 'Categories' },
  { href: '/admin/quotes', icon: '📩', label: 'Quotes' },
  { href: '/admin/claims', icon: '✅', label: 'Claims' },
  { href: '/admin/settings', icon: '⚙️', label: 'Settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (!supabase) {
        setLoading(false);
        return;
      }
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        setIsAdmin(profile?.role === 'admin');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const enableDevAdmin = () => {
    setIsAdmin(true);
    setUser({ id: 'dev-admin', email: 'admin@boernehub.com' } as User);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-boerne-navy"></div>
      </div>
    );
  }

  if (!user && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-center">
            <div className="text-4xl mb-4">🔐</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Access</h1>
            <p className="text-gray-600 mb-6">Sign in to access the admin dashboard.</p>

            {/* Development bypass */}
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700 mb-3">Development Mode</p>
              <button
                onClick={enableDevAdmin}
                className="w-full px-4 py-2 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Enable Dev Admin
              </button>
            </div>

            <div className="mt-6">
              <Link href="/" className="text-sm text-gray-500 hover:text-boerne-gold">
                ← Back to Site
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminContext.Provider value={{ user, isAdmin, loading }}>
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
              <Link href="/admin" className="font-bold text-boerne-gold">
                Boerne Admin
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
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                    isActive
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
          </nav>

          {/* User Section */}
          <div className="border-t border-white/10 p-4">
            {!sidebarCollapsed ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-boerne-gold/20 flex items-center justify-center text-boerne-gold text-sm font-bold">
                  {user?.email?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.email || 'Admin'}</p>
                  <p className="text-xs text-white/50">Administrator</p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-8 h-8 rounded-full bg-boerne-gold/20 flex items-center justify-center text-boerne-gold text-sm font-bold">
                  {user?.email?.charAt(0).toUpperCase() || 'A'}
                </div>
              </div>
            )}

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
    </AdminContext.Provider>
  );
}
