'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface RealtorProfile {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  licenseNumber?: string;
  createdAt: string;
}

interface RealtorAuthContextType {
  user: User | null;
  profile: RealtorProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string, company: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<RealtorProfile>) => Promise<{ error: string | null }>;
}

const RealtorAuthContext = createContext<RealtorAuthContextType | undefined>(undefined);

export function RealtorAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<RealtorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();

    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          await loadProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        }
      });

      return () => subscription.unsubscribe();
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

      if (user) {
        // Check if this is a realtor account
        const { data: realtorProfile } = await supabase
          .from('realtor_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (realtorProfile) {
          setUser(user);
          setProfile({
            id: realtorProfile.id,
            name: realtorProfile.name,
            email: realtorProfile.email,
            company: realtorProfile.company,
            phone: realtorProfile.phone,
            licenseNumber: realtorProfile.license_number,
            createdAt: realtorProfile.created_at,
          });
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      // Don't set error for timeout - just proceed without auth
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = async (userId: string) => {
    if (!supabase) return;

    const { data } = await supabase
      .from('realtor_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      setProfile({
        id: data.id,
        name: data.name,
        email: data.email,
        company: data.company,
        phone: data.phone,
        licenseNumber: data.license_number,
        createdAt: data.created_at,
      });
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) return { error: 'Supabase not configured' };

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };

    return { error: null };
  };

  const signUp = async (email: string, password: string, name: string, company: string) => {
    if (!supabase) return { error: 'Supabase not configured' };

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role: 'realtor' }
      }
    });

    if (authError) return { error: authError.message };
    if (!authData.user) return { error: 'Failed to create account' };

    // Create realtor profile
    const { error: profileError } = await supabase
      .from('realtor_profiles')
      .insert({
        id: authData.user.id,
        email,
        name,
        company,
      });

    if (profileError) return { error: profileError.message };

    return { error: null };
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates: Partial<RealtorProfile>) => {
    if (!supabase || !user) return { error: 'Not authenticated' };

    const dbUpdates: Record<string, unknown> = {};
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.company) dbUpdates.company = updates.company;
    if (updates.phone) dbUpdates.phone = updates.phone;
    if (updates.licenseNumber) dbUpdates.license_number = updates.licenseNumber;

    const { error } = await supabase
      .from('realtor_profiles')
      .update(dbUpdates)
      .eq('id', user.id);

    if (error) return { error: error.message };

    // Reload profile
    await loadProfile(user.id);
    return { error: null };
  };

  return (
    <RealtorAuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, updateProfile }}>
      {children}
    </RealtorAuthContext.Provider>
  );
}

export function useRealtorAuth() {
  const context = useContext(RealtorAuthContext);
  if (context === undefined) {
    throw new Error('useRealtorAuth must be used within a RealtorAuthProvider');
  }
  return context;
}
