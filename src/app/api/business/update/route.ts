import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

interface UpdateData {
  businessId: string;
  name?: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  services?: string[];
  serviceArea?: string[];
}

export async function PUT(request: NextRequest) {
  try {
    const data: UpdateData = await request.json();

    if (!data.businessId) {
      return NextResponse.json({ error: 'Business ID is required' }, { status: 400 });
    }

    // Check if Supabase is configured
    if (!supabaseUrl || !supabaseAnonKey) {
      console.log('Business update (no Supabase):', data);
      return NextResponse.json({ success: true });
    }

    // Create a client with the user's session to verify ownership
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
      global: {
        headers: {
          Authorization: request.headers.get('Authorization') || '',
          cookie: (await cookies()).toString(),
        },
      },
    });

    // Get the current user
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use admin client for the update
    if (!supabaseServiceKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Verify the user owns this business
    const { data: business, error: fetchError } = await supabaseAdmin
      .from('businesses')
      .select('owner_id')
      .eq('id', data.businessId)
      .single();

    if (fetchError || !business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    if (business.owner_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Build update object
    const updateFields: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (data.name !== undefined) updateFields.name = data.name;
    if (data.description !== undefined) updateFields.description = data.description;
    if (data.phone !== undefined) updateFields.phone = data.phone;
    if (data.email !== undefined) updateFields.email = data.email;
    if (data.website !== undefined) updateFields.website = data.website || null;
    if (data.address !== undefined) updateFields.address = data.address;
    if (data.services !== undefined) updateFields.services = data.services;
    if (data.serviceArea !== undefined) updateFields.service_area = data.serviceArea;

    // Update the business
    const { error: updateError } = await supabaseAdmin
      .from('businesses')
      .update(updateFields)
      .eq('id', data.businessId);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update business' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
