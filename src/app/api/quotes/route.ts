import { NextRequest, NextResponse } from 'next/server';

interface QuoteRequest {
  name: string;
  email: string;
  phone: string;
  serviceNeeded: string;
  description?: string;
  preferredContact: 'email' | 'phone' | 'either';
  urgency: 'flexible' | 'this_week' | 'urgent';
  providerName: string;
  providerEmail: string;
  categoryName: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: QuoteRequest = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'serviceNeeded', 'providerName', 'providerEmail'];
    for (const field of requiredFields) {
      if (!body[field as keyof QuoteRequest]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // For now, we'll log the quote request
    // In production, this would send an email to the provider and optionally store in database
    console.log('Quote Request Received:', {
      timestamp: new Date().toISOString(),
      customer: {
        name: body.name,
        email: body.email,
        phone: body.phone,
      },
      provider: {
        name: body.providerName,
        email: body.providerEmail,
      },
      service: {
        category: body.categoryName,
        needed: body.serviceNeeded,
        description: body.description,
      },
      preferences: {
        contact: body.preferredContact,
        urgency: body.urgency,
      },
    });

    // TODO: Implement email sending to provider
    // This would use a service like SendGrid, Resend, or AWS SES
    // Example:
    // await sendEmail({
    //   to: body.providerEmail,
    //   subject: `New Quote Request from ${body.name} via Boerne's Handy Hub`,
    //   body: formatQuoteEmail(body),
    // });

    // TODO: Optionally store in database for provider dashboard
    // await supabase.from('quote_requests').insert({
    //   customer_name: body.name,
    //   customer_email: body.email,
    //   customer_phone: body.phone,
    //   provider_email: body.providerEmail,
    //   service_needed: body.serviceNeeded,
    //   description: body.description,
    //   preferred_contact: body.preferredContact,
    //   urgency: body.urgency,
    //   status: 'pending',
    // });

    return NextResponse.json({
      success: true,
      message: 'Quote request submitted successfully',
    });
  } catch (error) {
    console.error('Error processing quote request:', error);
    return NextResponse.json(
      { error: 'Failed to process quote request' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
