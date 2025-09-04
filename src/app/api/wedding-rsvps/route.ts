import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'RSVP service temporarily unavailable' },
        { status: 503 }
      );
    }

    // Validate required fields
    if (!data.websiteId || !data.guestName || !data.email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if wedding website exists and RSVP is still open
    const { data: website, error: websiteError } = await supabase
      .from('wedding_websites')
      .select('rsvp_deadline, max_guests')
      .eq('id', data.websiteId)
      .eq('status', 'active')
      .single();

    if (websiteError || !website) {
      return NextResponse.json(
        { error: 'Wedding website not found' },
        { status: 404 }
      );
    }

    // Check RSVP deadline
    if (website.rsvp_deadline && new Date() > new Date(website.rsvp_deadline)) {
      return NextResponse.json(
        { error: 'RSVP deadline has passed' },
        { status: 400 }
      );
    }

    // Validate guest count
    if (data.guestCount > website.max_guests) {
      return NextResponse.json(
        { error: `Maximum ${website.max_guests} guests allowed per RSVP` },
        { status: 400 }
      );
    }

    // Check for duplicate RSVP (same email for same website)
    const { data: existingRsvp } = await supabase
      .from('wedding_rsvps')
      .select('id')
      .eq('website_id', data.websiteId)
      .eq('email', data.email)
      .single();

    if (existingRsvp) {
      return NextResponse.json(
        { error: 'An RSVP has already been submitted with this email address' },
        { status: 400 }
      );
    }

    // Create RSVP record
    const { data: rsvp, error } = await supabase
      .from('wedding_rsvps')
      .insert({
        website_id: data.websiteId,
        guest_name: data.guestName,
        email: data.email,
        phone: data.phone || null,
        attending: data.attending,
        guest_count: data.attending ? data.guestCount : 0,
        dietary_restrictions: data.dietaryRestrictions || null,
        message: data.message || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating RSVP:', error);
      return NextResponse.json(
        { error: 'Failed to submit RSVP' },
        { status: 500 }
      );
    }

    // TODO: Send confirmation email to guest
    // TODO: Send notification email to couple

    return NextResponse.json({
      success: true,
      rsvp
    });

  } catch (error) {
    console.error('RSVP submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}