import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface DeleteResult {
  success: boolean;
  error?: string;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<DeleteResult>> {
  try {
    const { id: photoId } = await params;
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('business_id');

    if (!photoId || !businessId) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Get photo record
    const { data: photo, error: photoError } = await supabase
      .from('website_photos')
      .select('*, websites!inner(business_id)')
      .eq('id', photoId)
      .single();

    if (photoError || !photo) {
      return NextResponse.json(
        { success: false, error: 'Photo not found' },
        { status: 404 }
      );
    }

    // Verify business ownership
    if (photo.websites.business_id !== businessId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Get website to update photo references
    const { data: website } = await supabase
      .from('websites')
      .select('id, logo_photo_id, hero_photo_id, gallery_photo_ids')
      .eq('id', photo.website_id)
      .single();

    // Delete files from storage
    const filesToDelete = [
      photo.storage_path,
      ...(photo.derivatives
        ? Object.values(photo.derivatives as Record<string, string>)
        : []),
    ].filter(Boolean);

    if (filesToDelete.length > 0) {
      const { error: storageError } = await supabase.storage
        .from(photo.bucket)
        .remove(filesToDelete);

      if (storageError) {
        console.error('Storage delete error:', storageError);
        // Continue anyway - DB record is more important
      }
    }

    // Delete photo record
    const { error: deleteError } = await supabase
      .from('website_photos')
      .delete()
      .eq('id', photoId);

    if (deleteError) {
      console.error('Database delete error:', deleteError);
      return NextResponse.json(
        { success: false, error: 'Failed to delete photo record' },
        { status: 500 }
      );
    }

    // Update website references
    if (website) {
      const updates: Record<string, unknown> = {};

      if (website.logo_photo_id === photoId) {
        updates.logo_photo_id = null;
      }
      if (website.hero_photo_id === photoId) {
        updates.hero_photo_id = null;
      }
      if (website.gallery_photo_ids?.includes(photoId)) {
        updates.gallery_photo_ids = website.gallery_photo_ids.filter(
          (id: string) => id !== photoId
        );
      }

      if (Object.keys(updates).length > 0) {
        await supabase
          .from('websites')
          .update(updates)
          .eq('id', website.id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Photo delete error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve photo info
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id: photoId } = await params;

    const { data: photo, error } = await supabase
      .from('website_photos')
      .select('*')
      .eq('id', photoId)
      .single();

    if (error || !photo) {
      return NextResponse.json(
        { success: false, error: 'Photo not found' },
        { status: 404 }
      );
    }

    // Build public URLs for derivatives
    const baseUrl = `${supabaseUrl}/storage/v1/object/public/${photo.bucket}`;

    return NextResponse.json({
      success: true,
      photo: {
        ...photo,
        urls: {
          original: `${baseUrl}/${photo.storage_path}`,
          thumb: photo.derivatives?.thumb
            ? `${baseUrl}/${photo.derivatives.thumb}`
            : null,
          medium: photo.derivatives?.medium
            ? `${baseUrl}/${photo.derivatives.medium}`
            : null,
          large: photo.derivatives?.large
            ? `${baseUrl}/${photo.derivatives.large}`
            : null,
        },
      },
    });
  } catch (error) {
    console.error('Photo fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
