import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Wedding website service temporarily unavailable' },
        { status: 503 }
      );
    }

    // Validate required fields
    const requiredFields = ['coupleName1', 'coupleName2', 'weddingDate', 'subdomain', 'email'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check if subdomain is available
    const { data: existingWebsite } = await supabase
      .from('wedding_websites')
      .select('id')
      .eq('subdomain', data.subdomain)
      .single();

    if (existingWebsite) {
      return NextResponse.json(
        { error: 'This website address is already taken. Please choose another.' },
        { status: 400 }
      );
    }

    // Calculate pricing based on template
    const templatePricing = {
      'rustic': 99,
      'elegant': 129,
      'modern': 149
    };

    const price = templatePricing[data.template as keyof typeof templatePricing] || 99;

    // Create wedding website record
    const { data: website, error } = await supabase
      .from('wedding_websites')
      .insert({
        subdomain: data.subdomain,
        couple_name_1: data.coupleName1,
        couple_name_2: data.coupleName2,
        wedding_date: data.weddingDate,
        template_id: data.template,
        venue_name: data.venueName,
        venue_address: data.venueAddress,
        ceremony_time: data.ceremonyTime,
        reception_time: data.receptionTime,
        wedding_story: data.weddingStory,
        color_primary: data.colorPrimary,
        color_secondary: data.colorSecondary,
        rsvp_deadline: data.rsvpDeadline,
        max_guests: data.maxGuestsPerRsvp,
        registry_links: data.registryLinks.filter((link: {name: string; url: string}) => link.name && link.url),
        hotel_blocks: data.hotelBlocks.filter((hotel: {name: string; address: string; phone: string; groupCode?: string}) => hotel.name),
        status: 'draft', // Will be activated after payment
        expires_at: new Date(new Date(data.weddingDate).getTime() + (30 * 24 * 60 * 60 * 1000)), // 30 days after wedding
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating wedding website:', error);
      return NextResponse.json(
        { error: 'Failed to create website' },
        { status: 500 }
      );
    }

    // Create Stripe checkout session (you'll need to implement this)
    const websiteUrl = `https://${data.subdomain}.boerneweddings.com`;
    const paymentUrl = `/wedding-websites/payment?website_id=${website.id}&price=${price}`;

    return NextResponse.json({
      success: true,
      website,
      websiteUrl,
      paymentUrl,
      price
    });

  } catch (error) {
    console.error('Wedding website creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}