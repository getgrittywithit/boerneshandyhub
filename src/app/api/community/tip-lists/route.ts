import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET() {
  try {
    const { data: lists, error } = await supabase
      .from('tip_lists')
      .select('*')
      .eq('is_active', true)
      .order('title');

    if (error) {
      console.error('Error fetching tip lists:', error);
      return NextResponse.json({ lists: [] });
    }

    return NextResponse.json({ lists: lists || [] });
  } catch (error) {
    console.error('Tip lists error:', error);
    return NextResponse.json({ lists: [] });
  }
}
