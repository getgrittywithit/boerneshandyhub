import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import WelcomePacketEmail from '@/emails/WelcomePacketEmail';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const resendApiKey = process.env.RESEND_API_KEY;

// Generate a short, unique packet ID
function generatePacketId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      realtor_id,
      client_id,
      client_email,
      client_name,
      client_address,
      client_city,
      welcome_message,
      selected_categories,
      selected_guides,
    } = body;

    // Validate required fields
    if (!realtor_id || !client_id || !client_email || !client_name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if Supabase is configured
    if (!supabaseServiceKey) {
      // Demo mode - return success without actually sending
      const demoPacketId = generatePacketId();
      return NextResponse.json({
        success: true,
        packet_id: demoPacketId,
        packet_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://boerneshandyhub.com'}/welcome/${demoPacketId}`,
        demo: true,
        message: 'Demo mode: Email would be sent in production',
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get realtor profile for branding
    const { data: realtor, error: realtorError } = await supabase
      .from('realtor_profiles')
      .select('*')
      .eq('id', realtor_id)
      .single();

    if (realtorError || !realtor) {
      return NextResponse.json(
        { error: 'Realtor not found' },
        { status: 404 }
      );
    }

    // Generate unique packet ID
    const packetId = generatePacketId();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://boerneshandyhub.com';
    const packetUrl = `${baseUrl}/welcome/${packetId}`;

    // Create packet in database
    const { error: packetError } = await supabase
      .from('welcome_packets')
      .insert({
        packet_id: packetId,
        realtor_id,
        client_id,
        welcome_message,
        selected_categories: selected_categories || ['hvac', 'plumbing', 'electrical', 'handyman', 'landscaping', 'pest-control'],
        selected_guides: selected_guides || [],
        status: 'sent',
        sent_at: new Date().toISOString(),
      });

    if (packetError) {
      console.error('Error creating packet:', packetError);
      return NextResponse.json(
        { error: 'Failed to create packet' },
        { status: 500 }
      );
    }

    // Update client record
    await supabase
      .from('realtor_clients')
      .update({
        welcome_packet_sent: true,
        welcome_packet_sent_at: new Date().toISOString(),
        current_packet_id: packetId,
      })
      .eq('id', client_id);

    // Send email if Resend is configured
    let emailId: string | null = null;
    if (resendApiKey) {
      const resend = new Resend(resendApiKey);

      // Render the email
      const emailHtml = await render(
        WelcomePacketEmail({
          clientName: client_name,
          address: client_address || 'your new home',
          city: client_city || 'Boerne',
          realtorName: realtor.name,
          realtorCompany: realtor.company,
          realtorPhone: realtor.phone,
          realtorPhotoUrl: realtor.photo_url,
          realtorLogoUrl: realtor.logo_url,
          brandColor: realtor.brand_color || '#1a365d',
          welcomeMessage: welcome_message,
          packetUrl,
        })
      );

      try {
        const emailResult = await resend.emails.send({
          from: 'Boerne\'s Handy Hub <hello@boerneshandyhub.com>',
          to: client_email,
          subject: `Welcome to Your New Home - From ${realtor.name}`,
          html: emailHtml,
          tags: [
            { name: 'type', value: 'welcome_packet' },
            { name: 'packet_id', value: packetId },
            { name: 'realtor_id', value: realtor_id },
          ],
        });

        emailId = emailResult.data?.id || null;

        // Update packet with email ID
        if (emailId) {
          await supabase
            .from('welcome_packets')
            .update({
              email_sent: true,
              email_id: emailId,
            })
            .eq('packet_id', packetId);
        }
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // Don't fail the whole request if email fails
        // The packet is still created and accessible via URL
      }
    }

    return NextResponse.json({
      success: true,
      packet_id: packetId,
      packet_url: packetUrl,
      email_sent: !!emailId,
      email_id: emailId,
    });
  } catch (error) {
    console.error('Error in send packet:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
