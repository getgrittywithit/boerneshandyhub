import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import {
  type ContributionType,
  type DisplayPref,
  RATE_LIMITS,
  ATTESTATION_VERSION,
} from '@/lib/community/types';

// Initialize Supabase admin client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';

    // Check per-IP rate limit (1 per minute)
    if (!checkRateLimit(`ip:${ip}`, RATE_LIMITS.SUBMISSIONS_PER_IP_PER_MINUTE, 60000)) {
      return NextResponse.json(
        { success: false, message: 'Please slow down. You can submit again in a minute.' },
        { status: 429 }
      );
    }

    // Parse the request body (JSON or FormData)
    const contentType = request.headers.get('content-type') || '';
    let data: Record<string, unknown>;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      data = Object.fromEntries(formData.entries());
    } else {
      data = await request.json();
    }

    const type = data.type as ContributionType;
    const email = (data.email as string)?.toLowerCase().trim();

    // Validate required fields
    if (!type || !['feedback', 'photo', 'story', 'tip'].includes(type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid submission type' },
        { status: 400 }
      );
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Check per-email rate limit (5 per day)
    if (!checkRateLimit(`email:${email}`, RATE_LIMITS.SUBMISSIONS_PER_EMAIL_PER_DAY, 86400000)) {
      return NextResponse.json(
        { success: false, message: "You've reached the daily submission limit. Please try again tomorrow." },
        { status: 429 }
      );
    }

    // Get or create contributor
    let { data: contributor } = await supabase
      .from('contributors')
      .select('*')
      .eq('email', email)
      .single();

    const isNewContributor = !contributor;

    if (!contributor) {
      const { data: newContributor, error: createError } = await supabase
        .from('contributors')
        .insert({
          email,
          name: data.name || null,
          display_pref: (data.display_pref as DisplayPref) || 'first_name',
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating contributor:', createError);
        return NextResponse.json(
          { success: false, message: 'Failed to create contributor' },
          { status: 500 }
        );
      }

      contributor = newContributor;
    } else {
      // Update last active
      await supabase
        .from('contributors')
        .update({
          last_active_at: new Date().toISOString(),
          name: data.name || contributor.name,
        })
        .eq('id', contributor.id);
    }

    // Check if contributor is banned
    if (contributor.status === 'banned') {
      return NextResponse.json(
        { success: false, message: 'Your account has been suspended' },
        { status: 403 }
      );
    }

    // Build contribution based on type
    const contributionId = uuidv4();
    let contribution: Record<string, unknown> = {
      id: contributionId,
      contributor_id: contributor.id,
      type,
      status: 'submitted',
      submission_ip: ip,
    };

    switch (type) {
      case 'feedback':
        contribution = {
          ...contribution,
          title: data.subject as string,
          body: data.message as string,
          metadata: {},
        };
        break;

      case 'photo':
        if (!data.ip_attestation || data.ip_attestation === 'false') {
          return NextResponse.json(
            { success: false, message: 'You must confirm the attestation' },
            { status: 400 }
          );
        }
        contribution = {
          ...contribution,
          ip_attestation: true,
          metadata: {
            attestation_version: ATTESTATION_VERSION,
          },
        };
        break;

      case 'story':
        if (!data.ip_attestation || data.ip_attestation === 'false') {
          return NextResponse.json(
            { success: false, message: 'You must confirm the attestations' },
            { status: 400 }
          );
        }
        contribution = {
          ...contribution,
          title: data.title as string,
          body: data.body as string,
          ip_attestation: true,
          accuracy_attestation: data.accuracy_attestation === 'true' || data.accuracy_attestation === true,
          metadata: {
            era: data.era || null,
            attestation_version: ATTESTATION_VERSION,
          },
        };
        break;

      case 'tip':
        contribution = {
          ...contribution,
          body: data.pick as string,
          metadata: {
            list_slug: data.list_slug as string,
            why_pick: data.why_pick || null,
            suggest_new_list: data.suggest_new_list || null,
          },
        };
        break;
    }

    // Insert contribution
    const { error: insertError } = await supabase
      .from('contributions')
      .insert(contribution);

    if (insertError) {
      console.error('Error inserting contribution:', insertError);
      return NextResponse.json(
        { success: false, message: 'Failed to save contribution' },
        { status: 500 }
      );
    }

    // Handle photo uploads if present
    if (type === 'photo' || type === 'story') {
      const photoCount = Object.keys(data).filter((k) => k.startsWith('photo_') && !k.includes('_meta')).length;

      for (let i = 0; i < photoCount; i++) {
        const file = data[`photo_${i}`] as File;
        const metaStr = data[`photo_${i}_meta`] as string;
        const meta = metaStr ? JSON.parse(metaStr) : {};

        if (file && file instanceof File) {
          // Generate storage path
          const ext = file.name.split('.').pop() || 'jpg';
          const storagePath = `pending/${contributionId}/${i}.${ext}`;

          // Upload to Supabase Storage
          const { error: uploadError } = await supabase.storage
            .from('community-uploads-pending')
            .upload(storagePath, file, {
              contentType: file.type,
            });

          if (uploadError) {
            console.error('Error uploading file:', uploadError);
            continue;
          }

          // Insert asset record
          await supabase.from('contribution_assets').insert({
            contribution_id: contributionId,
            storage_path: storagePath,
            bucket: 'community-uploads-pending',
            mime_type: file.type,
            file_size: file.size,
            caption: meta.caption || null,
            year: meta.year || null,
            location: meta.location || null,
            neighborhood: meta.neighborhood || null,
            ordering: i,
          });

          // Insert target if related category/business specified
          if (meta.related_category) {
            await supabase.from('contribution_targets').insert({
              contribution_id: contributionId,
              target_type: 'category',
              target_slug: meta.related_category,
            });
          }
        }
      }
    }

    // Handle related places for stories
    if (type === 'story' && data.related_places) {
      const places = typeof data.related_places === 'string'
        ? JSON.parse(data.related_places)
        : data.related_places;

      for (const place of places as string[]) {
        await supabase.from('contribution_targets').insert({
          contribution_id: contributionId,
          target_type: 'global', // We'll refine this based on actual slug matching
          target_slug: place.toLowerCase().replace(/\s+/g, '-'),
        });
      }
    }

    // Log event
    await supabase.from('contribution_events').insert({
      contribution_id: contributionId,
      event: 'submitted',
      actor: 'system',
      payload: { type, ip },
    });

    // Generate magic link token for verification if new contributor
    let requiresVerification = false;
    if (isNewContributor || !contributor.email_verified_at) {
      requiresVerification = true;
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      await supabase.from('contributor_tokens').insert({
        contributor_id: contributor.id,
        token,
        expires_at: expiresAt.toISOString(),
      });

      // TODO: Send verification email with magic link
      // await sendVerificationEmail(email, token, contributor.name);
    }

    // Trigger AI screening (async)
    // TODO: Call screen endpoint
    // fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/community/screen`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ contribution_id: contributionId }),
    // }).catch(console.error);

    // For now, move directly to admin_pending
    await supabase
      .from('contributions')
      .update({ status: 'admin_pending' })
      .eq('id', contributionId);

    return NextResponse.json({
      success: true,
      contribution_id: contributionId,
      requires_verification: requiresVerification,
      message: requiresVerification
        ? 'Check your email to verify your submission'
        : 'Submission received! We\'ll review it within 48 hours.',
    });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
