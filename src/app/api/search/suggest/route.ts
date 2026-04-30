import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { VendorLead } from '@/lib/search/types';

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    const body = await request.json() as VendorLead;

    // Validate - at least one field required
    if (!body.suggested_name && !body.query) {
      return NextResponse.json({ error: 'Business name or search query required' }, { status: 400 });
    }

    // Validate email format if provided
    if (body.contact_email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.contact_email)) {
        return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
      }
    }

    // Insert vendor lead
    const { error } = await supabaseAdmin.from('vendor_leads').insert({
      query: body.query || null,
      suggested_name: body.suggested_name || null,
      contact_email: body.contact_email || null,
      contact_phone: body.contact_phone || null,
      notes: body.notes || null,
      status: 'new',
    });

    if (error) {
      console.error('Vendor lead insert error:', error);
      return NextResponse.json({ error: 'Failed to submit suggestion' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for your suggestion! We will look into adding this business.',
    });
  } catch (error) {
    console.error('Suggest error:', error);
    return NextResponse.json({ error: 'Failed to submit suggestion' }, { status: 500 });
  }
}
