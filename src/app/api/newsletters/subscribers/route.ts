import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { addToAudience, audienceIds, sendEmail } from '@/lib/resend';
import WelcomeEmail from '@/emails/WelcomeEmail';
import type {
  SubscribeRequest,
  SubscribeResponse,
  Subscriber,
  SubscriberType,
} from '@/types/newsletter';

// POST /api/newsletters/subscribers - Subscribe a new user
export async function POST(request: NextRequest) {
  try {
    const body: SubscribeRequest = await request.json();
    const { email, name, type = 'homeowner', source = 'website' } = body;

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json<SubscribeResponse>(
        { success: false, message: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    if (!supabaseAdmin) {
      return NextResponse.json<SubscribeResponse>(
        { success: false, message: 'Database not configured' },
        { status: 500 }
      );
    }

    // Check if subscriber already exists
    const { data: existing } = await supabaseAdmin
      .from('subscribers')
      .select('id, status')
      .eq('email', normalizedEmail)
      .single();

    if (existing) {
      // If they unsubscribed, reactivate them
      if (existing.status === 'unsubscribed') {
        const { error: updateError } = await supabaseAdmin
          .from('subscribers')
          .update({
            status: 'active',
            unsubscribed_at: null,
            subscriber_type: type,
            name: name || null,
          })
          .eq('id', existing.id);

        if (updateError) {
          console.error('Error reactivating subscriber:', updateError);
          return NextResponse.json<SubscribeResponse>(
            { success: false, message: 'Error reactivating subscription' },
            { status: 500 }
          );
        }

        // Re-add to Resend audience
        await addToResendAudience(normalizedEmail, name, type);

        // Send welcome back email
        await sendEmail({
          to: normalizedEmail,
          subject: "Welcome back to Boerne's Handy Hub!",
          react: WelcomeEmail({ name }),
        });

        return NextResponse.json<SubscribeResponse>({
          success: true,
          message: 'Welcome back! Check your inbox for a confirmation.',
          subscriber_id: existing.id,
        });
      }

      // Already active
      return NextResponse.json<SubscribeResponse>({
        success: true,
        message: 'You\'re already subscribed!',
        subscriber_id: existing.id,
      });
    }

    // Create new subscriber
    const { data: newSubscriber, error: insertError } = await supabaseAdmin
      .from('subscribers')
      .insert({
        email: normalizedEmail,
        name: name || null,
        subscriber_type: type,
        source,
        status: 'active',
        metadata: {},
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('Error creating subscriber:', insertError);
      return NextResponse.json<SubscribeResponse>(
        { success: false, message: 'Error creating subscription' },
        { status: 500 }
      );
    }

    // Add to Resend audience
    await addToResendAudience(normalizedEmail, name, type);

    // Send welcome email
    await sendEmail({
      to: normalizedEmail,
      subject: "Welcome to Boerne's Handy Hub!",
      react: WelcomeEmail({ name }),
    });

    return NextResponse.json<SubscribeResponse>({
      success: true,
      message: 'Thanks for subscribing! Check your inbox for a welcome email.',
      subscriber_id: newSubscriber.id,
    });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json<SubscribeResponse>(
      { success: false, message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// GET /api/newsletters/subscribers - Get subscribers (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'active';
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Build query
    let query = supabaseAdmin
      .from('subscribers')
      .select('*', { count: 'exact' })
      .eq('status', status)
      .order('subscribed_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (type) {
      query = query.eq('subscriber_type', type);
    }

    const { data: subscribers, count, error } = await query;

    if (error) {
      console.error('Error fetching subscribers:', error);
      return NextResponse.json(
        { error: 'Error fetching subscribers' },
        { status: 500 }
      );
    }

    // Get stats
    const { data: statsData } = await supabaseAdmin
      .from('subscribers')
      .select('subscriber_type, status')
      .eq('status', 'active');

    const stats = {
      total: statsData?.length || 0,
      homeowners: statsData?.filter((s) => s.subscriber_type === 'homeowner').length || 0,
      realtors: statsData?.filter((s) => s.subscriber_type === 'realtor').length || 0,
      businesses: statsData?.filter((s) => s.subscriber_type === 'business').length || 0,
    };

    return NextResponse.json({
      subscribers,
      pagination: {
        page,
        limit,
        total: count || 0,
        total_pages: Math.ceil((count || 0) / limit),
      },
      stats,
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// DELETE /api/newsletters/subscribers - Unsubscribe
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const token = searchParams.get('token'); // For secure unsubscribe links

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Update subscriber status
    const { data: subscriber, error } = await supabaseAdmin
      .from('subscribers')
      .update({
        status: 'unsubscribed',
        unsubscribed_at: new Date().toISOString(),
      })
      .eq('email', normalizedEmail)
      .select('id')
      .single();

    if (error || !subscriber) {
      return NextResponse.json(
        { error: 'Subscriber not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'You have been unsubscribed. Sorry to see you go!',
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// Helper to add subscriber to appropriate Resend audience
async function addToResendAudience(
  email: string,
  name: string | undefined,
  type: SubscriberType
) {
  // Add to "all" audience
  if (audienceIds.all) {
    const nameParts = name?.split(' ') || [];
    await addToAudience({
      email,
      firstName: nameParts[0],
      lastName: nameParts.slice(1).join(' ') || undefined,
      audienceId: audienceIds.all,
    });
  }

  // Add to type-specific audience
  const typeAudienceId =
    type === 'homeowner'
      ? audienceIds.homeowners
      : type === 'realtor'
      ? audienceIds.realtors
      : audienceIds.businesses;

  if (typeAudienceId) {
    const nameParts = name?.split(' ') || [];
    await addToAudience({
      email,
      firstName: nameParts[0],
      lastName: nameParts.slice(1).join(' ') || undefined,
      audienceId: typeAudienceId,
    });
  }
}
