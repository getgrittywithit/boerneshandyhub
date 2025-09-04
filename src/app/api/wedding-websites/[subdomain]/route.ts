import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ subdomain: string }> }
) {
  try {
    const { subdomain } = await params;
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      );
    }

    const { data: website, error } = await supabase
      .from('wedding_websites')
      .select('*')
      .eq('subdomain', subdomain)
      .eq('status', 'active')
      .single();

    if (error || !website) {
      return NextResponse.json(
        { error: 'Wedding website not found' },
        { status: 404 }
      );
    }

    // Check if website has expired
    if (website.expires_at && new Date() > new Date(website.expires_at)) {
      return NextResponse.json(
        { error: 'Wedding website has expired' },
        { status: 410 }
      );
    }

    return NextResponse.json(website);

  } catch (error) {
    console.error('Error fetching wedding website:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}