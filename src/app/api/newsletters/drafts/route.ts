import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { NewsletterDraft, NewsletterDraftInsert, NewsletterDraftUpdate } from '@/types/newsletter';

// GET /api/newsletters/drafts - List all drafts
export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    let query = supabase
      .from('newsletter_drafts')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: drafts, error } = await query;

    if (error) {
      console.error('Error fetching drafts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch drafts' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      drafts: drafts as NewsletterDraft[],
      pagination: {
        offset,
        limit,
        total: drafts?.length || 0,
      },
    });
  } catch (error) {
    console.error('Drafts GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/newsletters/drafts - Create a new draft
export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const body: NewsletterDraftInsert = await request.json();

    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const { data: draft, error } = await supabase
      .from('newsletter_drafts')
      .insert({
        title: body.title,
        subject_line: body.subject_line || null,
        subject_line_alternatives: body.subject_line_alternatives || [],
        preview_text: body.preview_text || null,
        sections: body.sections || {},
        template_id: body.template_id || null,
        status: 'draft',
        audience: body.audience || 'all',
        scheduled_for: body.scheduled_for || null,
        send_stats: {},
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating draft:', error);
      return NextResponse.json(
        { error: 'Failed to create draft' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      draft: draft as NewsletterDraft,
    });
  } catch (error) {
    console.error('Drafts POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/newsletters/drafts - Update a draft
export async function PATCH(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const { id, ...updates }: { id: string } & NewsletterDraftUpdate = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Draft ID is required' },
        { status: 400 }
      );
    }

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.subject_line !== undefined) updateData.subject_line = updates.subject_line;
    if (updates.subject_line_alternatives !== undefined) updateData.subject_line_alternatives = updates.subject_line_alternatives;
    if (updates.preview_text !== undefined) updateData.preview_text = updates.preview_text;
    if (updates.sections !== undefined) updateData.sections = updates.sections;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.audience !== undefined) updateData.audience = updates.audience;
    if (updates.scheduled_for !== undefined) updateData.scheduled_for = updates.scheduled_for;
    if (updates.sent_at !== undefined) updateData.sent_at = updates.sent_at;
    if (updates.send_stats !== undefined) updateData.send_stats = updates.send_stats;
    if (updates.resend_broadcast_id !== undefined) updateData.resend_broadcast_id = updates.resend_broadcast_id;

    const { data: draft, error } = await supabase
      .from('newsletter_drafts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating draft:', error);
      return NextResponse.json(
        { error: 'Failed to update draft' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      draft: draft as NewsletterDraft,
    });
  } catch (error) {
    console.error('Drafts PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/newsletters/drafts - Delete a draft
export async function DELETE(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Draft ID is required' },
        { status: 400 }
      );
    }

    // Only allow deleting drafts, not sent newsletters
    const { data: existing, error: fetchError } = await supabase
      .from('newsletter_drafts')
      .select('status')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: 'Draft not found' },
        { status: 404 }
      );
    }

    if (existing.status === 'sent') {
      return NextResponse.json(
        { error: 'Cannot delete sent newsletters' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('newsletter_drafts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting draft:', error);
      return NextResponse.json(
        { error: 'Failed to delete draft' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Draft deleted',
    });
  } catch (error) {
    console.error('Drafts DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
