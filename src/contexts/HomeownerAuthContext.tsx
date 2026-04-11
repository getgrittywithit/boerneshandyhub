'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface HomeownerAuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const HomeownerAuthContext = createContext<HomeownerAuthContextType>({
  user: null,
  loading: true,
  error: null,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => {},
});

export const useHomeownerAuth = () => useContext(HomeownerAuthContext);

interface HomeownerAuthProviderProps {
  children: ReactNode;
}

export function HomeownerAuthProvider({ children }: HomeownerAuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
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
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
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

      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise<null>((_, reject) => {
        setTimeout(() => reject(new Error('Auth check timeout')), 10000);
      });

      const authPromise = supabase.auth.getUser().then(({ data }) => data.user);

      const user = await Promise.race([authPromise, timeoutPromise]);
      setUser(user);
    } catch (err) {
      console.error('Auth check failed:', err);
      // Don't set error for timeout - just proceed without auth
      setUser(null);
    } finally {
      setLoading(false);
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
      }

      return {};
    } catch (err) {
      console.error('Sign in failed:', err);
      return { error: 'An unexpected error occurred' };
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    if (!supabase) {
      return { error: 'Authentication service unavailable' };
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || email.split('@')[0],
            role: 'homeowner',
          },
        },
      });

      if (signUpError) {
        return { error: signUpError.message };
      }

      if (data.user) {
        setUser(data.user);
      }

      return {};
    } catch (err) {
      console.error('Sign up failed:', err);
      return { error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    if (!supabase) return;

    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  return (
    <HomeownerAuthContext.Provider
      value={{
        user,
        loading,
        error,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </HomeownerAuthContext.Provider>
  );
}
