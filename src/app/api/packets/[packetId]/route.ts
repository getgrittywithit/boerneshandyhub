import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Get packet data with realtor branding
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ packetId: string }> }
) {
  try {
    const { packetId } = await params;

    if (!supabaseServiceKey) {
      // Return demo data in development
      return NextResponse.json({
        packet: null,
        realtor: null,
        client: null,
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get packet with realtor and client info
    const { data: packet, error } = await supabase
      .from('welcome_packets')
      .select(`
        *,
        realtor:realtor_profiles(
          id,
          name,
          email,
          company,
          phone,
          photo_url,
          logo_url,
          brand_color,
          tagline,
          bio
        ),
        client:realtor_clients(
          id,
          name,
          email,
          address,
          city,
          close_date
        )
      `)
      .eq('packet_id', packetId)
      .single();

    if (error || !packet) {
      return NextResponse.json({ packet: null, realtor: null, client: null });
    }

    return NextResponse.json({
      packet,
      realtor: packet.realtor,
      client: packet.client,
    });
  } catch (error) {
    console.error('Error fetching packet:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
