import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next');

  // Handle hash-based tokens (for magic links and OAuth)
  // Note: Hash fragments don't reach the server, so this handles code-based flow

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.redirect(new URL('/login?error=config', requestUrl.origin));
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(new URL('/login?error=auth', requestUrl.origin));
    }

    if (data.user) {
      // Route user based on their roles
      const destination = await getUserDestination(supabaseUrl, supabaseAnonKey, data.user.id);
      return NextResponse.redirect(new URL(next || destination, requestUrl.origin));
    }
  }

  // Default redirect if no code
  return NextResponse.redirect(new URL('/login', requestUrl.origin));
}

async function getUserDestination(supabaseUrl: string, supabaseKey: string, userId: string): Promise<string> {
  const supabase = createClient(supabaseUrl, supabaseKey);
  // Check admin first
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (profile?.role === 'admin') {
    return '/admin';
  }

  // Check if business owner
  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', userId)
    .single();

  if (business) {
    return '/business/dashboard';
  }

  // Check if realtor
  const { data: realtor } = await supabase
    .from('realtor_profiles')
    .select('id')
    .eq('id', userId)
    .single();

  if (realtor) {
    return '/realtors/dashboard';
  }

  // Default to resident dashboard
  return '/my-home';
}
