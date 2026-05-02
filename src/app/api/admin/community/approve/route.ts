import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

function generateSlug(title: string | null, id: string): string {
  if (!title) return id.slice(0, 8);

  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 50);

  const suffix = crypto.randomBytes(3).toString('hex');
  return `${base}-${suffix}`;
}

export async function POST(request: NextRequest) {
  try {
    const { contribution_id } = await request.json();

    if (!contribution_id) {
      return NextResponse.json(
        { success: false, message: 'Missing contribution_id' },
        { status: 400 }
      );
    }

    // Get the contribution
    const { data: contribution, error: fetchError } = await supabase
      .from('contributions')
      .select('*, contributor:contributors(*)')
      .eq('id', contribution_id)
      .single();

    if (fetchError || !contribution) {
      return NextResponse.json(
        { success: false, message: 'Contribution not found' },
        { status: 404 }
      );
    }

    // Generate public slug
    const publicSlug = generateSlug(contribution.title, contribution.id);

    // Update contribution status
    const { error: updateError } = await supabase
      .from('contributions')
      .update({
        status: 'approved',
        reviewed_at: new Date().toISOString(),
        reviewed_by: 'admin', // TODO: use actual admin user
        public_slug: publicSlug,
      })
      .eq('id', contribution_id);

    if (updateError) {
      console.error('Error approving contribution:', updateError);
      return NextResponse.json(
        { success: false, message: 'Failed to approve' },
        { status: 500 }
      );
    }

    // Update contributor stats
    if (contribution.contributor_id) {
      await supabase.rpc('increment_approved_count', {
        contributor_id: contribution.contributor_id,
      });
    }

    // Log event
    await supabase.from('contribution_events').insert({
      contribution_id,
      event: 'approved',
      actor: 'admin',
      payload: { public_slug: publicSlug },
    });

    // Move assets from pending to published bucket
    if (contribution.type === 'photo' || contribution.type === 'story') {
      const { data: assets } = await supabase
        .from('contribution_assets')
        .select('*')
        .eq('contribution_id', contribution_id);

      if (assets && assets.length > 0) {
        for (const asset of assets) {
          if (asset.bucket === 'community-uploads-pending') {
            const newPath = asset.storage_path.replace('pending/', 'published/');

            // Copy to published bucket
            const { error: copyError } = await supabase.storage
              .from('community-uploads')
              .copy(
                `pending/${asset.storage_path.split('/').slice(1).join('/')}`,
                newPath
              );

            if (!copyError) {
              // Update asset record
              await supabase
                .from('contribution_assets')
                .update({
                  bucket: 'community-uploads',
                  storage_path: newPath,
                })
                .eq('id', asset.id);

              // Delete from pending bucket
              await supabase.storage
                .from('community-uploads-pending')
                .remove([asset.storage_path]);
            }
          }
        }
      }
    }

    // TODO: Send approval email to contributor
    // await sendApprovalEmail(contribution.contributor?.email, publicSlug);

    return NextResponse.json({
      success: true,
      message: 'Contribution approved',
      public_slug: publicSlug,
    });
  } catch (error) {
    console.error('Approve error:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
