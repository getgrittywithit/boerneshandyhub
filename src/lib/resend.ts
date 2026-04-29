import { Resend } from 'resend';

// Initialize Resend client
const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey && process.env.NODE_ENV === 'production') {
  console.warn('RESEND_API_KEY is not set. Email functionality will be disabled.');
}

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Email configuration
export const emailConfig = {
  from: {
    default: 'Boerne\'s Handy Hub <hello@boerneshandyhub.com>',
    newsletter: 'Boerne\'s Handy Hub <newsletter@boerneshandyhub.com>',
    noreply: 'Boerne\'s Handy Hub <noreply@boerneshandyhub.com>',
  },
  replyTo: 'hello@boerneshandyhub.com',
};

// Audience IDs for Resend Marketing (set these after creating audiences in Resend dashboard)
export const audienceIds = {
  all: process.env.RESEND_AUDIENCE_ALL || '',
  homeowners: process.env.RESEND_AUDIENCE_HOMEOWNERS || '',
  realtors: process.env.RESEND_AUDIENCE_REALTORS || '',
  businesses: process.env.RESEND_AUDIENCE_BUSINESSES || '',
};

// Helper to check if Resend is configured
export const isResendConfigured = (): boolean => {
  return resend !== null;
};

// Send a single transactional email
export async function sendEmail({
  to,
  subject,
  react,
  text,
  from = emailConfig.from.default,
  replyTo = emailConfig.replyTo,
}: {
  to: string | string[];
  subject: string;
  react?: React.ReactElement;
  text?: string;
  from?: string;
  replyTo?: string;
}) {
  if (!resend) {
    console.warn('Resend not configured, skipping email send');
    return { error: 'Resend not configured' };
  }

  try {
    const result = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      react,
      text,
      replyTo,
    });

    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Add a contact to a Resend audience
export async function addToAudience({
  email,
  firstName,
  lastName,
  audienceId,
  unsubscribed = false,
}: {
  email: string;
  firstName?: string;
  lastName?: string;
  audienceId: string;
  unsubscribed?: boolean;
}) {
  if (!resend) {
    console.warn('Resend not configured, skipping audience add');
    return { error: 'Resend not configured' };
  }

  if (!audienceId) {
    console.warn('No audience ID provided');
    return { error: 'No audience ID provided' };
  }

  try {
    const result = await resend.contacts.create({
      audienceId,
      email,
      firstName,
      lastName,
      unsubscribed,
    });

    return result;
  } catch (error) {
    console.error('Error adding to audience:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Remove a contact from a Resend audience (unsubscribe)
export async function removeFromAudience({
  email,
  audienceId,
}: {
  email: string;
  audienceId: string;
}) {
  if (!resend) {
    console.warn('Resend not configured, skipping audience remove');
    return { error: 'Resend not configured' };
  }

  try {
    // Get the contact first to find their ID
    const contacts = await resend.contacts.list({ audienceId });
    const contact = contacts.data?.data?.find((c) => c.email === email);

    if (!contact) {
      return { error: 'Contact not found' };
    }

    // Update contact to unsubscribed
    const result = await resend.contacts.update({
      audienceId,
      id: contact.id,
      unsubscribed: true,
    });

    return result;
  } catch (error) {
    console.error('Error removing from audience:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Create and send a broadcast (marketing email to an audience)
// Resend Broadcasts API: First create, then send
export async function createAndSendBroadcast({
  name,
  audienceId,
  subject,
  html,
  from = emailConfig.from.newsletter,
  replyTo = emailConfig.replyTo,
  previewText,
  scheduledAt,
}: {
  name: string;
  audienceId: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
  previewText?: string;
  scheduledAt?: string;
}) {
  if (!resend) {
    console.warn('Resend not configured, skipping broadcast');
    return { error: 'Resend not configured' };
  }

  try {
    // Step 1: Create the broadcast
    const createResult = await resend.broadcasts.create({
      name,
      audienceId,
      from,
      subject,
      replyTo,
      previewText,
      html,
    });

    if (createResult.error || !createResult.data) {
      console.error('Error creating broadcast:', createResult.error);
      return { error: createResult.error?.message || 'Failed to create broadcast' };
    }

    const broadcastId = createResult.data.id;

    // Step 2: Send the broadcast
    const sendResult = await resend.broadcasts.send(broadcastId, {
      scheduledAt,
    });

    if (sendResult.error) {
      console.error('Error sending broadcast:', sendResult.error);
      return { error: sendResult.error.message || 'Failed to send broadcast' };
    }

    return { data: { broadcastId, sendId: sendResult.data?.id } };
  } catch (error) {
    console.error('Error with broadcast:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Get broadcast status
export async function getBroadcast(broadcastId: string) {
  if (!resend) {
    return { error: 'Resend not configured' };
  }

  try {
    const result = await resend.broadcasts.get(broadcastId);
    return result;
  } catch (error) {
    console.error('Error getting broadcast:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
