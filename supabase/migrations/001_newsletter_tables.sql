-- Newsletter System Tables
-- Run this in Supabase SQL Editor

-- ============================================================================
-- SUBSCRIBERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  subscriber_type TEXT NOT NULL DEFAULT 'homeowner' CHECK (subscriber_type IN ('homeowner', 'realtor', 'business')),
  source TEXT NOT NULL DEFAULT 'website' CHECK (source IN ('homepage', 'footer', 'moving-guide', 'home-tracker', 'guide', 'manual', 'website')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  metadata JSONB DEFAULT '{}',
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
-- Index for status filtering
CREATE INDEX IF NOT EXISTS idx_subscribers_status ON subscribers(status);
-- Index for type filtering
CREATE INDEX IF NOT EXISTS idx_subscribers_type ON subscribers(subscriber_type);

-- ============================================================================
-- NEWSLETTER TEMPLATES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS newsletter_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  sections JSONB NOT NULL DEFAULT '[]',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- NEWSLETTER DRAFTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS newsletter_drafts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subject_line TEXT,
  subject_line_alternatives JSONB DEFAULT '[]',
  preview_text TEXT,
  sections JSONB NOT NULL DEFAULT '{}',
  template_id UUID REFERENCES newsletter_templates(id),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'scheduled', 'sending', 'sent', 'failed')),
  audience TEXT NOT NULL DEFAULT 'all' CHECK (audience IN ('all', 'homeowners', 'realtors', 'businesses')),
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  send_stats JSONB DEFAULT '{}',
  resend_broadcast_id TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for status filtering
CREATE INDEX IF NOT EXISTS idx_newsletter_drafts_status ON newsletter_drafts(status);

-- ============================================================================
-- NEWSLETTER SEND LOG TABLE (for tracking individual sends)
-- ============================================================================
CREATE TABLE IF NOT EXISTS newsletter_send_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  newsletter_id UUID REFERENCES newsletter_drafts(id) ON DELETE CASCADE,
  subscriber_id UUID REFERENCES subscribers(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained')),
  resend_email_id TEXT,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for newsletter lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_send_log_newsletter ON newsletter_send_log(newsletter_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_send_log ENABLE ROW LEVEL SECURITY;

-- Subscribers: Anyone can insert (signup), only admins can read/update/delete
CREATE POLICY "Anyone can subscribe" ON subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view subscribers" ON subscribers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update subscribers" ON subscribers
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete subscribers" ON subscribers
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Newsletter templates: Admins only
CREATE POLICY "Admins can manage templates" ON newsletter_templates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Newsletter drafts: Admins only
CREATE POLICY "Admins can manage drafts" ON newsletter_drafts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Send log: Admins only
CREATE POLICY "Admins can view send logs" ON newsletter_send_log
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================================================
-- UPDATED_AT TRIGGER
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_subscribers_updated_at
  BEFORE UPDATE ON subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletter_templates_updated_at
  BEFORE UPDATE ON newsletter_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletter_drafts_updated_at
  BEFORE UPDATE ON newsletter_drafts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- DEFAULT TEMPLATE
-- ============================================================================
INSERT INTO newsletter_templates (name, description, sections, is_default)
VALUES (
  'Monthly Homeowner Digest',
  'Standard monthly newsletter for Boerne homeowners',
  '[
    {"id": "intro", "name": "Introduction", "type": "text", "required": true},
    {"id": "seasonal", "name": "What Boerne Needs Now", "type": "service_list", "required": true, "max_items": 3},
    {"id": "new_providers", "name": "New on the Hub", "type": "provider_list", "required": false},
    {"id": "local_tip", "name": "Local Tip", "type": "text_with_image", "required": true},
    {"id": "featured_provider", "name": "Featured Provider", "type": "provider_spotlight", "required": false},
    {"id": "events", "name": "Community Events", "type": "event_list", "required": false}
  ]'::jsonb,
  true
)
ON CONFLICT DO NOTHING;
