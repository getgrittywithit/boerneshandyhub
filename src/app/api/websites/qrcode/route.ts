import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateWebsiteQRCode, generatePrintableQRCode } from '@/lib/qrcode/generate';
import { tierIncludesWebsite, type TierKey } from '@/data/pricingTiers';

// Initialize Supabase admin client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const websiteId = searchParams.get('website_id');
    const businessId = searchParams.get('business_id');
    const format = searchParams.get('format') || 'dataurl'; // 'dataurl' or 'download'
    const size = searchParams.get('size') || 'standard'; // 'standard' or 'print'

    if (!websiteId || !businessId) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Verify business ownership and tier
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id, tier')
      .eq('id', businessId)
      .single();

    if (businessError || !business) {
      return NextResponse.json(
        { success: false, error: 'Business not found' },
        { status: 404 }
      );
    }

    // Check if tier includes website feature (Verified+ required)
    const tierKey = (business.tier || 'claimed') as TierKey;
    if (!tierIncludesWebsite(tierKey)) {
      return NextResponse.json(
        { success: false, error: 'QR codes require Verified+ tier' },
        { status: 403 }
      );
    }

    // Get website
    const { data: website, error: websiteError } = await supabase
      .from('websites')
      .select('id, slug, primary_color, business_id')
      .eq('id', websiteId)
      .eq('business_id', businessId)
      .single();

    if (websiteError || !website) {
      return NextResponse.json(
        { success: false, error: 'Website not found' },
        { status: 404 }
      );
    }

    // Generate QR code
    if (format === 'download' || size === 'print') {
      // Return as downloadable PNG
      const buffer = await generatePrintableQRCode(
        website.slug,
        website.primary_color
      );

      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': `attachment; filename="${website.slug}-qrcode.png"`,
          'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        },
      });
    }

    // Return as data URL (for display)
    const result = await generateWebsiteQRCode(website.slug, {
      primaryColor: website.primary_color,
    });

    return NextResponse.json({
      success: true,
      qrCode: {
        dataUrl: result.dataUrl,
        websiteUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/site/${website.slug}`,
      },
    });
  } catch (error) {
    console.error('QR code generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}
