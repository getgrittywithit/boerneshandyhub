# Newsletter System Specification

This document outlines the architecture for a full-featured newsletter system with AI generation, subscriber management, and Resend integration. Use this as a reference when building a similar system in another project.

---

## Overview

| Feature | Description |
|---------|-------------|
| AI Content Generation | OpenAI GPT-4 generates newsletter content |
| Subscriber Management | Database-backed with audience segmentation |
| Email Sending | Resend for transactional + broadcast emails |
| Test Emails | Preview before sending to subscribers |
| Tracking | Opens, clicks, bounces via webhooks |
| Admin UI | Full dashboard for creation and management |

---

## Database Schema

### 1. `subscribers` Table

```sql
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  subscriber_type TEXT NOT NULL DEFAULT 'general', -- general, homeowner, realtor, business
  source TEXT, -- homepage, footer, signup-form, manual
  status TEXT NOT NULL DEFAULT 'active', -- active, unsubscribed, bounced
  metadata JSONB DEFAULT '{}',
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_subscribers_status ON subscribers(status);
CREATE INDEX idx_subscribers_type ON subscribers(subscriber_type);
```

### 2. `newsletter_drafts` Table

```sql
CREATE TABLE newsletter_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subject_line TEXT,
  subject_line_alternatives TEXT[] DEFAULT '{}',
  preview_text TEXT,
  sections JSONB DEFAULT '{}',
  template_id UUID REFERENCES newsletter_templates(id),
  status TEXT NOT NULL DEFAULT 'draft', -- draft, approved, scheduled, sending, sent, failed
  audience TEXT DEFAULT 'all', -- all, segment1, segment2, etc.
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  send_stats JSONB DEFAULT '{}',
  resend_broadcast_id TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. `newsletter_templates` Table (Optional)

```sql
CREATE TABLE newsletter_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  sections JSONB NOT NULL DEFAULT '{}',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4. `newsletter_send_log` Table

```sql
CREATE TABLE newsletter_send_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  newsletter_id UUID REFERENCES newsletter_drafts(id),
  subscriber_id UUID REFERENCES subscribers(id),
  status TEXT DEFAULT 'sent', -- sent, delivered, opened, clicked, bounced, complained
  resend_email_id TEXT,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## API Endpoints

### Subscribers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/newsletters/subscribers` | List subscribers with pagination |
| POST | `/api/newsletters/subscribers` | Subscribe new email |
| DELETE | `/api/newsletters/subscribers` | Unsubscribe email |

**Query Parameters (GET):**
- `status` - Filter by status (active, unsubscribed)
- `type` - Filter by subscriber type
- `page`, `limit` - Pagination
- `search` - Search by email/name

**Body (POST):**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "type": "homeowner",
  "source": "homepage"
}
```

### Drafts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/newsletters/drafts` | List all drafts |
| POST | `/api/newsletters/drafts` | Create new draft |
| PATCH | `/api/newsletters/drafts` | Update draft |
| DELETE | `/api/newsletters/drafts?id=xxx` | Delete draft |

**Body (POST/PATCH):**
```json
{
  "title": "May Newsletter",
  "subject_line": "Your May Update",
  "preview_text": "What's new this month...",
  "sections": {
    "intro": { "text": "Hello!" },
    "content": { "items": [...] }
  }
}
```

### AI Generation

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/newsletters/generate` | Generate newsletter with AI |

**Body:**
```json
{
  "month": "May",
  "year": 2025,
  "focus_topics": ["spring cleaning", "gardening"]
}
```

**Response:**
```json
{
  "draft_id": "uuid",
  "subject_line": "Generated subject",
  "subject_line_alternatives": ["Alt 1", "Alt 2"],
  "sections": {...}
}
```

### Test Email

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/newsletters/send-test` | Send preview to test address |

**Body:**
```json
{
  "draft_id": "uuid",
  "test_email": "you@example.com"
}
```

### Broadcast

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/newsletters/broadcast` | Get audience counts |
| POST | `/api/newsletters/broadcast` | Send to subscribers |

**Body (POST):**
```json
{
  "draft_id": "uuid",
  "audience": "all"
}
```

### Webhook

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/webhooks/resend` | Receive Resend events |

---

## Resend Integration

### Setup

```typescript
// /lib/resend.ts
import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export const emailConfig = {
  from: {
    default: 'Your App <hello@yourapp.com>',
    newsletter: 'Your App <newsletter@yourapp.com>',
  },
  replyTo: 'hello@yourapp.com',
};

export const audienceIds = {
  all: process.env.RESEND_AUDIENCE_ALL,
  segment1: process.env.RESEND_AUDIENCE_SEGMENT1,
  // Add more audiences as needed
};
```

### Helper Functions

```typescript
// Send single email
export async function sendEmail({ to, subject, react, from }) {
  return resend.emails.send({ from, to, subject, react });
}

// Add to audience
export async function addToAudience({ email, audienceId, firstName, lastName }) {
  return resend.contacts.create({ audienceId, email, firstName, lastName });
}

// Send broadcast
export async function createAndSendBroadcast({ name, audienceId, subject, html }) {
  const broadcast = await resend.broadcasts.create({
    name, audienceId, from: emailConfig.from.newsletter, subject, html
  });
  return resend.broadcasts.send(broadcast.data.id);
}
```

### Environment Variables

```bash
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_AUDIENCE_ALL=aud_xxxxxxxxxxxx
RESEND_AUDIENCE_SEGMENT1=aud_xxxxxxxxxxxx
RESEND_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
```

---

## Email Template (React Email)

```tsx
// /emails/NewsletterEmail.tsx
import {
  Html, Head, Preview, Body, Container,
  Section, Text, Link, Hr
} from '@react-email/components';

interface Props {
  previewText: string;
  sections: {
    intro?: { text: string };
    content?: { items: Array<{ title: string; body: string }> };
    footer?: { text: string };
  };
  unsubscribeUrl: string;
}

export default function NewsletterEmail({ previewText, sections, unsubscribeUrl }: Props) {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Text style={styles.logo}>Your Brand</Text>
          </Section>

          {/* Intro */}
          {sections.intro && (
            <Section style={styles.section}>
              <Text>{sections.intro.text}</Text>
            </Section>
          )}

          {/* Content */}
          {sections.content?.items.map((item, i) => (
            <Section key={i} style={styles.section}>
              <Text style={styles.heading}>{item.title}</Text>
              <Text>{item.body}</Text>
            </Section>
          ))}

          <Hr />

          {/* Footer */}
          <Section style={styles.footer}>
            <Link href={unsubscribeUrl}>Unsubscribe</Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: { backgroundColor: '#f6f9fc', fontFamily: 'sans-serif' },
  container: { backgroundColor: '#fff', margin: '0 auto', maxWidth: '600px' },
  header: { backgroundColor: '#1a365d', padding: '24px', textAlign: 'center' },
  logo: { color: '#d4a846', fontSize: '24px', fontWeight: 'bold' },
  section: { padding: '24px' },
  heading: { fontSize: '20px', fontWeight: '600', marginBottom: '12px' },
  footer: { padding: '24px', textAlign: 'center', color: '#718096' },
};
```

---

## AI Generation Prompt

```typescript
const systemPrompt = `You are a newsletter content writer. Generate engaging newsletter content.

Output JSON with this structure:
{
  "subject_line": "Main subject line",
  "subject_line_alternatives": ["Alt 1", "Alt 2"],
  "preview_text": "Email preview text (50-100 chars)",
  "sections": {
    "intro": {
      "text": "Opening paragraph welcoming readers"
    },
    "main_content": {
      "items": [
        {
          "id": "item-1",
          "title": "Section title",
          "body": "Section content",
          "icon": "emoji"
        }
      ]
    },
    "tip": {
      "headline": "Helpful tip headline",
      "text": "Tip content"
    }
  }
}`;

const response = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Generate a newsletter for ${month} ${year}` }
  ],
  response_format: { type: 'json_object' },
});
```

---

## Admin UI Components

### 1. Newsletter Dashboard (`/admin/newsletters`)

- Subscriber count stats by segment
- List of drafts with status badges
- "Generate Newsletter" button
- Quick links to subscribers, settings

### 2. Newsletter Editor (`/admin/newsletters/[id]`)

- Edit/Preview tabs
- Fields: title, subject line, preview text
- Section editors for each content block
- Action buttons: Save, Send Test, Approve, Send, Delete
- Status indicator (draft → approved → sent)

### 3. Send Modal

- Audience selection (All, Segment 1, Segment 2, etc.)
- Subscriber count for each audience
- Confirmation warning
- Send button with loading state

### 4. Subscriber List (`/admin/newsletters/subscribers`)

- Paginated table with search
- Filter by type/status
- Export CSV button
- Individual unsubscribe action

---

## Webhook Events to Handle

| Event | Action |
|-------|--------|
| `email.sent` | Log send time |
| `email.delivered` | Update status |
| `email.opened` | Record open time |
| `email.clicked` | Record click time |
| `email.bounced` | Mark subscriber as bounced |
| `email.complained` | Unsubscribe and flag |

---

## Workflow

```
1. Admin clicks "Generate Newsletter"
   ↓
2. AI creates draft with content
   ↓
3. Admin edits in editor
   ↓
4. Admin sends test to themselves
   ↓
5. Admin clicks "Approve"
   ↓
6. Admin clicks "Send to Subscribers"
   ↓
7. Select audience → Confirm → Send
   ↓
8. Resend broadcasts to audience
   ↓
9. Webhooks track opens/clicks
```

---

## Environment Variables Checklist

```bash
# Database
DATABASE_URL=
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# Resend
RESEND_API_KEY=
RESEND_WEBHOOK_SECRET=
RESEND_AUDIENCE_ALL=
RESEND_AUDIENCE_SEGMENT1=
RESEND_AUDIENCE_SEGMENT2=

# OpenAI (for AI generation)
OPENAI_API_KEY=
```

---

## Implementation Checklist

### Phase 1: Foundation
- [ ] Create database tables
- [ ] Set up Resend account and get API key
- [ ] Create audiences in Resend dashboard
- [ ] Implement `/lib/resend.ts` helper

### Phase 2: Subscribers
- [ ] Create subscribers API endpoints
- [ ] Add subscribe form to frontend
- [ ] Sync subscribers to Resend audiences
- [ ] Create admin subscriber list page

### Phase 3: Newsletter Creation
- [ ] Create drafts API endpoints
- [ ] Build newsletter editor UI
- [ ] Create email template component
- [ ] Implement test email sending

### Phase 4: AI Generation
- [ ] Create generate API endpoint
- [ ] Design AI prompt for your content
- [ ] Connect to editor UI

### Phase 5: Broadcasting
- [ ] Create broadcast API endpoint
- [ ] Add send modal to editor
- [ ] Set up webhook handler
- [ ] Track email events

### Phase 6: Polish
- [ ] Add scheduling (optional)
- [ ] Build analytics dashboard
- [ ] Add template management (optional)
- [ ] Test full workflow end-to-end

---

## Files Structure

```
/src
├── app/
│   ├── admin/
│   │   └── newsletters/
│   │       ├── page.tsx              # Dashboard
│   │       ├── [id]/page.tsx         # Editor
│   │       └── subscribers/page.tsx  # Subscriber list
│   └── api/
│       ├── newsletters/
│       │   ├── subscribers/route.ts
│       │   ├── drafts/route.ts
│       │   ├── generate/route.ts
│       │   ├── send-test/route.ts
│       │   └── broadcast/route.ts
│       └── webhooks/
│           └── resend/route.ts
├── emails/
│   └── NewsletterEmail.tsx
├── lib/
│   └── resend.ts
└── types/
    └── newsletter.ts
```

---

## Notes for New Projects

1. **Customize the AI prompt** for your specific content needs
2. **Design your email template** to match your brand
3. **Define your subscriber segments** based on your audience
4. **Set up Resend audiences** before implementing broadcast
5. **Test webhooks locally** using Resend CLI or ngrok
