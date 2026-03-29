import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin client (for creating users)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Registration allows selecting up to 5 categories (for upsell)
const MAX_SELECTABLE_CATEGORIES = 5;
// Basic tier has 1 active category
const BASIC_ACTIVE_CATEGORIES = 1;

interface RegistrationData {
  name: string;
  topCategory: string;
  subcategories: string[];
  description: string;
  // Structured address fields
  streetAddress: string;
  suite?: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  website?: string;
  services: string[];
  serviceArea: string[];
  yearsInBusiness?: string;
  // Credentials
  licenseNumber?: string;
  licenseExpiration?: string;
  insured: boolean;
  bonded: boolean;
  certifications: string[];
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  password: string;
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
  if (data.subcategories.length > MAX_SELECTABLE_CATEGORIES) {
    return `Maximum ${MAX_SELECTABLE_CATEGORIES} categories allowed`;
  }
  if (!data.description || data.description.length < 50) {
    return 'Description must be at least 50 characters';
  }
  if (!data.streetAddress) {
    return 'Street address is required';
  }
  if (!data.city) {
    return 'City is required';
  }
  if (!data.state) {
    return 'State is required';
  }
  if (!data.zip || !/^\d{5}(-\d{4})?$/.test(data.zip)) {
    return 'Valid ZIP code is required';
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
  if (!data.password || data.password.length < 8) {
    return 'Password must be at least 8 characters';
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
    if (!supabaseUrl || !supabaseServiceKey) {
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

    // Create Supabase admin client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Step 1: Create Supabase auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: data.ownerEmail,
      password: data.password,
      email_confirm: true, // Auto-confirm email for now
      user_metadata: {
        full_name: data.ownerName,
        role: 'business_owner',
      },
    });

    if (authError) {
      console.error('Auth error:', authError);

      // Check for duplicate email
      if (authError.message.includes('already') || authError.message.includes('exists')) {
        return NextResponse.json(
          { error: 'An account with this email already exists. Please log in or use a different email.' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to create account. Please try again.' },
        { status: 500 }
      );
    }

    const userId = authData.user.id;

    // Step 2: Create profile record
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: data.ownerEmail,
        full_name: data.ownerName,
        role: 'business_owner',
        created_at: new Date().toISOString(),
      });

    if (profileError) {
      console.error('Profile error:', profileError);
      // Continue anyway - profile can be created later
    }

    // Step 3: Generate a URL-friendly business ID
    const businessId = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + '-' + Date.now().toString(36);

    // Step 4: Insert into the businesses table with owner_id
    // Store all selected subcategories, but only activate based on tier limit
    const activeSubcategories = data.subcategories.slice(0, BASIC_ACTIVE_CATEGORIES);

    // Build combined address from structured fields
    const addressParts = [data.streetAddress];
    if (data.suite) addressParts[0] += `, ${data.suite}`;
    addressParts.push(`${data.city}, ${data.state} ${data.zip}`);
    const combinedAddress = addressParts.join(', ');

    // Normalize website - auto-prepend https:// if needed
    let normalizedWebsite = data.website?.trim() || null;
    if (normalizedWebsite && !normalizedWebsite.match(/^https?:\/\//i)) {
      normalizedWebsite = `https://${normalizedWebsite}`;
    }

    const { data: insertedData, error: businessError } = await supabase
      .from('businesses')
      .insert([
        {
          id: businessId,
          name: data.name,
          category: data.subcategories[0], // Primary subcategory (active)
          subcategories: data.subcategories, // All selected (for upsell)
          active_subcategories: activeSubcategories, // Currently active based on tier
          description: data.description,
          address: combinedAddress,
          phone: data.phone,
          email: data.email,
          website: normalizedWebsite,
          services: data.services,
          service_area: data.serviceArea,
          years_in_business: data.yearsInBusiness ? parseInt(data.yearsInBusiness) : null,
          // Credentials
          license_number: data.licenseNumber || null,
          license_expiration: data.licenseExpiration || null,
          insured: data.insured,
          bonded: data.bonded,
          certifications: data.certifications || [],
          owner_id: userId, // Link to auth user
          owner_name: data.ownerName,
          owner_email: data.ownerEmail,
          owner_phone: data.ownerPhone,
          claim_status: 'verified', // Auto-verified since owner registered it
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

    if (businessError) {
      console.error('Business insert error:', businessError);

      // Try to clean up the auth user if business insert fails
      await supabase.auth.admin.deleteUser(userId);

      return NextResponse.json(
        { error: 'Failed to register business. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Business registered successfully',
      id: insertedData?.id || businessId,
      userId: userId,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
