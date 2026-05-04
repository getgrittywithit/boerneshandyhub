import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { processImage, validateImageType, validateImageSize } from '@/lib/images/process';
import { moderateImage, bufferToDataUrl } from '@/lib/images/moderate';
import { getPhotoLimit, type TierKey } from '@/data/pricingTiers';
import type { PhotoStatus } from '@/lib/websites/types';

// Initialize Supabase admin client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const BUCKET_NAME = 'website-photos';

export type PhotoType = 'logo' | 'hero' | 'gallery';

interface UploadResult {
  success: boolean;
  photo?: {
    id: string;
    storage_path: string;
    derivatives: {
      thumb: string;
      medium: string;
      large: string;
    };
  };
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<UploadResult>> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const businessId = formData.get('business_id') as string;
    const websiteId = formData.get('website_id') as string;
    const photoType = formData.get('photo_type') as PhotoType;
    const altText = formData.get('alt_text') as string | null;

    // Validate required fields
    if (!file || !businessId || !websiteId || !photoType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['logo', 'hero', 'gallery'].includes(photoType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid photo type' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!validateImageType(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Allowed: JPG, PNG, WebP, GIF' },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    if (!validateImageSize(file.size)) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 5MB' },
        { status: 400 }
      );
    }

    // Verify business ownership and get tier
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id, owner_id, tier')
      .eq('id', businessId)
      .single();

    if (businessError || !business) {
      return NextResponse.json(
        { success: false, error: 'Business not found' },
        { status: 404 }
      );
    }

    // Verify website belongs to business
    const { data: website, error: websiteError } = await supabase
      .from('websites')
      .select('id, business_id, logo_photo_id, hero_photo_id, gallery_photo_ids')
      .eq('id', websiteId)
      .eq('business_id', businessId)
      .single();

    if (websiteError || !website) {
      return NextResponse.json(
        { success: false, error: 'Website not found' },
        { status: 404 }
      );
    }

    // Check photo limits based on tier
    const tierKey = (business.tier || 'claimed') as TierKey;
    const photoLimit = getPhotoLimit(tierKey);

    // Count existing photos
    const { count: photoCount } = await supabase
      .from('website_photos')
      .select('*', { count: 'exact', head: true })
      .eq('website_id', websiteId);

    if ((photoCount || 0) >= photoLimit) {
      return NextResponse.json(
        { success: false, error: `Photo limit reached (${photoLimit} photos for your tier)` },
        { status: 403 }
      );
    }

    // Read file into buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Process image into derivatives
    const processed = await processImage(buffer);

    // Generate unique ID and paths
    const photoId = uuidv4();
    const basePath = `${businessId}/${websiteId}/${photoId}`;

    // Upload all derivatives to storage
    const uploads = await Promise.all([
      supabase.storage
        .from(BUCKET_NAME)
        .upload(`${basePath}/original.webp`, processed.derivatives.original, {
          contentType: 'image/webp',
        }),
      supabase.storage
        .from(BUCKET_NAME)
        .upload(`${basePath}/thumb.webp`, processed.derivatives.thumb, {
          contentType: 'image/webp',
        }),
      supabase.storage
        .from(BUCKET_NAME)
        .upload(`${basePath}/medium.webp`, processed.derivatives.medium, {
          contentType: 'image/webp',
        }),
      supabase.storage
        .from(BUCKET_NAME)
        .upload(`${basePath}/large.webp`, processed.derivatives.large, {
          contentType: 'image/webp',
        }),
    ]);

    // Check for upload errors
    const uploadErrors = uploads.filter((u) => u.error);
    if (uploadErrors.length > 0) {
      console.error('Upload errors:', uploadErrors.map((u) => u.error));
      return NextResponse.json(
        { success: false, error: 'Failed to upload images' },
        { status: 500 }
      );
    }

    // Run moderation on the medium derivative
    const mediumUrl = bufferToDataUrl(processed.derivatives.medium, 'image/webp');
    const moderationResult = await moderateImage(mediumUrl);

    // Determine moderation status
    let moderationStatus: PhotoStatus = 'pending';
    if (moderationResult.approved) {
      moderationStatus = 'approved';
    } else if (moderationResult.flagReasons.length > 0) {
      moderationStatus = 'flagged';
    }

    // Insert photo record
    const { data: photo, error: insertError } = await supabase
      .from('website_photos')
      .insert({
        id: photoId,
        website_id: websiteId,
        storage_path: `${basePath}/original.webp`,
        bucket: BUCKET_NAME,
        original_filename: file.name,
        mime_type: 'image/webp',
        file_size: processed.derivatives.original.length,
        width: processed.metadata.width,
        height: processed.metadata.height,
        alt_text: altText,
        moderation_status: moderationStatus,
        moderation_score: moderationResult,
        moderation_notes: moderationResult.reason || null,
        flag_reasons: moderationResult.flagReasons.length > 0 ? moderationResult.flagReasons : null,
        derivatives: {
          thumb: `${basePath}/thumb.webp`,
          medium: `${basePath}/medium.webp`,
          large: `${basePath}/large.webp`,
        },
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return NextResponse.json(
        { success: false, error: 'Failed to save photo record' },
        { status: 500 }
      );
    }

    // Update website with photo reference based on type
    const websiteUpdate: Record<string, unknown> = {};

    if (photoType === 'logo') {
      websiteUpdate.logo_photo_id = photoId;
    } else if (photoType === 'hero') {
      websiteUpdate.hero_photo_id = photoId;
    } else if (photoType === 'gallery') {
      const galleryIds = website.gallery_photo_ids || [];
      websiteUpdate.gallery_photo_ids = [...galleryIds, photoId];
    }

    await supabase
      .from('websites')
      .update(websiteUpdate)
      .eq('id', websiteId);

    return NextResponse.json({
      success: true,
      photo: {
        id: photoId,
        storage_path: `${basePath}/original.webp`,
        derivatives: {
          thumb: `${basePath}/thumb.webp`,
          medium: `${basePath}/medium.webp`,
          large: `${basePath}/large.webp`,
        },
      },
    });
  } catch (error) {
    console.error('Photo upload error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
