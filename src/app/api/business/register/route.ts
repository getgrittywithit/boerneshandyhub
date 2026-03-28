import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

interface RegistrationData {
  name: string;
  topCategory: string;
  subcategories: string[];
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  services: string[];
  serviceArea: string[];
  yearsInBusiness?: string;
  licensed: boolean;
  insured: boolean;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  agreedToTerms: boolean;
}

function validateData(data: RegistrationData): string | null {
  if (!data.name || data.name.length < 2) {
    return 'Business name is required';
  }
  if (!data.topCategory) {
    return 'Category is required';
  }
  if (!data.subcategories || data.subcategories.length === 0) {
    return 'At least one subcategory is required';
  }
  if (!data.description || data.description.length < 50) {
    return 'Description must be at least 50 characters';
  }
  if (!data.address) {
    return 'Address is required';
  }
  if (!data.phone) {
    return 'Phone is required';
  }
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return 'Valid email is required';
  }
  if (!data.services || data.services.length < 3) {
    return 'At least 3 services are required';
  }
  if (!data.serviceArea || data.serviceArea.length === 0) {
    return 'At least one service area is required';
  }
  if (!data.ownerName) {
    return 'Owner name is required';
  }
  if (!data.ownerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.ownerEmail)) {
    return 'Valid owner email is required';
  }
  if (!data.ownerPhone) {
    return 'Owner phone is required';
  }
  if (!data.agreedToTerms) {
    return 'You must agree to the terms';
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const data: RegistrationData = await request.json();

    // Validate the data
    const validationError = validateData(data);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // Check if Supabase is configured
    if (!supabaseUrl || !supabaseKey) {
      // In development without Supabase, just log and return success
      console.log('Business registration (no Supabase):', {
        name: data.name,
        category: data.topCategory,
        subcategories: data.subcategories,
        ownerEmail: data.ownerEmail,
      });

      return NextResponse.json({
        success: true,
        message: 'Registration received. We will contact you shortly.',
        id: `temp-${Date.now()}`,
      });
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Generate a URL-friendly ID
    const id = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + '-' + Date.now().toString(36);

    // Insert into the businesses table
    const { data: insertedData, error } = await supabase
      .from('businesses')
      .insert([
        {
          id,
          name: data.name,
          category: data.subcategories[0], // Primary subcategory
          subcategories: data.subcategories,
          description: data.description,
          address: data.address,
          phone: data.phone,
          email: data.email,
          website: data.website || null,
          services: data.services,
          service_area: data.serviceArea,
          years_in_business: data.yearsInBusiness ? parseInt(data.yearsInBusiness) : null,
          licensed: data.licensed,
          insured: data.insured,
          owner_name: data.ownerName,
          owner_email: data.ownerEmail,
          owner_phone: data.ownerPhone,
          claim_status: 'pending',
          membership_tier: 'basic',
          rating: 0,
          review_count: 0,
          photos: [],
          keywords: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to register business. Please try again.' },
        { status: 500 }
      );
    }

    // TODO: Send confirmation email to owner
    // TODO: Send notification to admin

    return NextResponse.json({
      success: true,
      message: 'Business registered successfully',
      id: insertedData?.id || id,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
