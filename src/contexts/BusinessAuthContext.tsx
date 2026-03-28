'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { Business } from '@/lib/supabase';

interface BusinessAuthContextType {
  user: User | null;
  business: Business | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshBusiness: () => Promise<void>;
}

const BusinessAuthContext = createContext<BusinessAuthContextType>({
  user: null,
  business: null,
  loading: true,
  error: null,
  signIn: async () => ({}),
  signOut: async () => {},
  refreshBusiness: async () => {},
});

export const useBusinessAuth = () => useContext(BusinessAuthContext);

interface BusinessAuthProviderProps {
  children: ReactNode;
}

export function BusinessAuthProvider({ children }: BusinessAuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();

    // Listen for auth state changes
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            setUser(session.user);
            await fetchBusiness(session.user.id);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setBusiness(null);
          }
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
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
        await fetchBusiness(user.id);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      setError('Failed to check authentication');
    } finally {
      setLoading(false);
    }
  };

  const fetchBusiness = async (userId: string) => {
    if (!supabase) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 = no rows returned
        console.error('Error fetching business:', fetchError);
      }

      setBusiness(data as Business | null);
    } catch (err) {
      console.error('Failed to fetch business:', err);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { error: 'Authentication service unavailable' };
    }

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        return { error: signInError.message };
      }

      if (data.user) {
        setUser(data.user);
        await fetchBusiness(data.user.id);
      }

      return {};
    } catch (err) {
      console.error('Sign in failed:', err);
      return { error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    if (!supabase) return;

    try {
      await supabase.auth.signOut();
      setUser(null);
      setBusiness(null);
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  const refreshBusiness = async () => {
    if (user) {
      await fetchBusiness(user.id);
    }
  };

  return (
    <BusinessAuthContext.Provider
      value={{
        user,
        business,
        loading,
        error,
        signIn,
        signOut,
        refreshBusiness,
      }}
    >
      {children}
    </BusinessAuthContext.Provider>
  );
}
