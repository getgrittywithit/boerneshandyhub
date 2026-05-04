import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createPortalSession } from '@/lib/stripe';

// Initialize Supabase admin client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId } = body as { businessId: string };

    if (!businessId) {
      return NextResponse.json(
        { error: 'Missing businessId' },
        { status: 400 }
      );
    }

    // Get business with Stripe customer ID
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id, stripe_customer_id')
      .eq('id', businessId)
      .single();

    if (businessError || !business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    if (!business.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No active subscription. Please upgrade first.' },
        { status: 400 }
      );
    }

    // Build return URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://boerneshandyhub.com';
    const returnUrl = `${baseUrl}/business/dashboard/settings`;

    // Create portal session
    const session = await createPortalSession({
      customerId: business.stripe_customer_id,
      returnUrl,
    });

    return NextResponse.json({
      success: true,
      portalUrl: session.url,
    });
  } catch (error) {
    console.error('Portal session error:', error);
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}
