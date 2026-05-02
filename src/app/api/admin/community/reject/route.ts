import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const { contribution_id, reason, message } = await request.json();

    if (!contribution_id) {
      return NextResponse.json(
        { success: false, message: 'Missing contribution_id' },
        { status: 400 }
      );
    }

    if (!reason) {
      return NextResponse.json(
        { success: false, message: 'Missing rejection reason' },
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

    // Update contribution status
    const { error: updateError } = await supabase
      .from('contributions')
      .update({
        status: 'rejected',
        reviewed_at: new Date().toISOString(),
        reviewed_by: 'admin', // TODO: use actual admin user
        reject_reason: reason,
      })
      .eq('id', contribution_id);

    if (updateError) {
      console.error('Error rejecting contribution:', updateError);
      return NextResponse.json(
        { success: false, message: 'Failed to reject' },
        { status: 500 }
      );
    }

    // Update contributor stats
    if (contribution.contributor_id) {
      await supabase.rpc('increment_rejected_count', {
        contributor_id: contribution.contributor_id,
      });
    }

    // Log event
    await supabase.from('contribution_events').insert({
      contribution_id,
      event: 'rejected',
      actor: 'admin',
      payload: { reason, message },
    });

    // Delete assets from pending bucket (no need to keep rejected content)
    if (contribution.type === 'photo' || contribution.type === 'story') {
      const { data: assets } = await supabase
        .from('contribution_assets')
        .select('*')
        .eq('contribution_id', contribution_id);

      if (assets && assets.length > 0) {
        const paths = assets.map((a) => a.storage_path);
        await supabase.storage.from('community-uploads-pending').remove(paths);
      }
    }

    // TODO: Send rejection email to contributor
    // await sendRejectionEmail(contribution.contributor?.email, reason, message);

    return NextResponse.json({
      success: true,
      message: 'Contribution rejected',
    });
  } catch (error) {
    console.error('Reject error:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
