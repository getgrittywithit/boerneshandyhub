import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

interface ClaimSubmission {
  businessId: string;
  businessName: string;
  category: string;
  claimerName: string;
  claimerEmail: string;
  claimerPhone: string;
  businessRole: string;
  verificationMethod: string;
  additionalInfo?: string;
}

interface StoredClaim extends ClaimSubmission {
  id: string;
  status: 'pending' | 'under_review' | 'verified' | 'rejected';
  submittedAt: string;
  adminNotes?: string;
}

// File-based storage fallback
const CLAIMS_FILE = path.join(process.cwd(), 'data', 'claims.json');

function loadClaimsFromFile(): StoredClaim[] {
  try {
    if (fs.existsSync(CLAIMS_FILE)) {
      return JSON.parse(fs.readFileSync(CLAIMS_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Error loading claims file:', e);
  }
  return [];
}

function saveClaimsToFile(claims: StoredClaim[]) {
  try {
    const dir = path.dirname(CLAIMS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CLAIMS_FILE, JSON.stringify(claims, null, 2));
  } catch (e) {
    console.error('Error saving claims file:', e);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ClaimSubmission = await request.json();

    // Validate required fields
    if (!body.businessId || !body.claimerEmail || !body.claimerName || !body.claimerPhone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const claimData = {
      id: `claim_${Date.now()}`,
      ...body,
      status: 'pending' as const,
      submittedAt: new Date().toISOString(),
    };

    // Try Supabase first
    if (supabaseAdmin) {
      try {
        // Check for existing pending/verified claim
        const { data: existingClaims } = await supabaseAdmin
          .from('business_claims')
          .select('id, status')
          .eq('business_id', body.businessId)
          .in('status', ['pending', 'under_review', 'verified']);

        if (existingClaims && existingClaims.length > 0) {
          const existing = existingClaims[0];
          return NextResponse.json(
            {
              success: false,
              error: existing.status === 'verified'
                ? 'Business is already claimed'
                : 'A claim is already pending for this business',
            },
            { status: 409 }
          );
        }

        // Insert new claim
        const { error } = await supabaseAdmin
          .from('business_claims')
          .insert({
            business_id: body.businessId,
            business_name: body.businessName,
            category: body.category,
            claimer_name: body.claimerName,
            claimer_email: body.claimerEmail,
            claimer_phone: body.claimerPhone,
            business_role: body.businessRole,
            verification_method: body.verificationMethod,
            additional_info: body.additionalInfo,
            status: 'pending',
            submitted_at: new Date().toISOString(),
          });

        if (error) throw error;

        return NextResponse.json({
          success: true,
          message: 'Claim submitted successfully',
          claimId: claimData.id,
        });
      } catch (dbError) {
        console.error('Supabase error, falling back to file storage:', dbError);
      }
    }

    // Fallback to file storage
    const claims = loadClaimsFromFile();

    // Check for existing claim
    const existingClaim = claims.find(
      c => c.businessId === body.businessId &&
           ['pending', 'under_review', 'verified'].includes(c.status)
    );

    if (existingClaim) {
      return NextResponse.json(
        {
          success: false,
          error: existingClaim.status === 'verified'
            ? 'Business is already claimed'
            : 'A claim is already pending for this business',
        },
        { status: 409 }
      );
    }

    claims.push(claimData);
    saveClaimsToFile(claims);

    return NextResponse.json({
      success: true,
      message: 'Claim submitted successfully',
      claimId: claimData.id,
    });

  } catch (error) {
    console.error('Error processing claim:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process claim' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');

    // Try Supabase first
    if (supabaseAdmin) {
      try {
        let query = supabaseAdmin
          .from('business_claims')
          .select('*')
          .order('submitted_at', { ascending: false });

        if (businessId) {
          query = query.eq('business_id', businessId);
        }

        const { data, error } = await query;

        if (!error && data) {
          return NextResponse.json({ success: true, claims: data });
        }
      } catch (dbError) {
        console.error('Supabase error, falling back to file storage:', dbError);
      }
    }

    // Fallback to file storage
    let claims = loadClaimsFromFile();

    if (businessId) {
      claims = claims.filter(c => c.businessId === businessId);
    }

    return NextResponse.json({ success: true, claims });

  } catch (error) {
    console.error('Error retrieving claims:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve claims' },
      { status: 500 }
    );
  }
}
