-- Migration: Complete Realtor Portal Setup
-- Creates base tables + analytics + branding enhancements

-- ============================================
-- 1. BASE REALTOR TABLES
-- ============================================

-- Realtor profiles table
CREATE TABLE IF NOT EXISTS realtor_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  phone TEXT,
  license_number TEXT,
  -- Branding fields
  photo_url TEXT,
  logo_url TEXT,
  brand_color TEXT DEFAULT '#1e3a5f',
  tagline TEXT,
  bio TEXT,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE realtor_profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for realtor_profiles
DROP POLICY IF EXISTS "Realtors can view own profile" ON realtor_profiles;
CREATE POLICY "Realtors can view own profile"
  ON realtor_profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Realtors can update own profile" ON realtor_profiles;
CREATE POLICY "Realtors can update own profile"
  ON realtor_profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Realtors can insert own profile" ON realtor_profiles;
CREATE POLICY "Realtors can insert own profile"
  ON realtor_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Service role access
DROP POLICY IF EXISTS "Service can manage realtor profiles" ON realtor_profiles;
CREATE POLICY "Service can manage realtor profiles"
  ON realtor_profiles FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- 2. REALTOR CLIENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS realtor_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  realtor_id UUID NOT NULL REFERENCES realtor_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Boerne',
  close_date DATE NOT NULL,
  home_year_built INTEGER,
  home_sqft INTEGER,
  notes TEXT,
  welcome_packet_sent BOOLEAN DEFAULT FALSE,
  welcome_packet_sent_at TIMESTAMPTZ,
  homeowner_account_created BOOLEAN DEFAULT FALSE,
  current_packet_id TEXT, -- Reference to active packet
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE realtor_clients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Realtors can view own clients" ON realtor_clients;
CREATE POLICY "Realtors can view own clients"
  ON realtor_clients FOR SELECT
  USING (auth.uid() = realtor_id);

DROP POLICY IF EXISTS "Realtors can insert own clients" ON realtor_clients;
CREATE POLICY "Realtors can insert own clients"
  ON realtor_clients FOR INSERT
  WITH CHECK (auth.uid() = realtor_id);

DROP POLICY IF EXISTS "Realtors can update own clients" ON realtor_clients;
CREATE POLICY "Realtors can update own clients"
  ON realtor_clients FOR UPDATE
  USING (auth.uid() = realtor_id);

DROP POLICY IF EXISTS "Realtors can delete own clients" ON realtor_clients;
CREATE POLICY "Realtors can delete own clients"
  ON realtor_clients FOR DELETE
  USING (auth.uid() = realtor_id);

DROP POLICY IF EXISTS "Service can manage realtor clients" ON realtor_clients;
CREATE POLICY "Service can manage realtor clients"
  ON realtor_clients FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- 3. WELCOME PACKETS TABLE (with tracking)
-- ============================================

CREATE TABLE IF NOT EXISTS welcome_packets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  packet_id TEXT UNIQUE NOT NULL, -- Short shareable ID like "abc123"
  realtor_id UUID NOT NULL REFERENCES realtor_profiles(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES realtor_clients(id) ON DELETE CASCADE,

  -- Packet content
  welcome_message TEXT,
  selected_categories TEXT[] DEFAULT '{}',
  selected_guides TEXT[] DEFAULT '{}',

  -- Status tracking
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed')),
  sent_at TIMESTAMPTZ,
  first_viewed_at TIMESTAMPTZ,
  last_viewed_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,

  -- Email tracking
  email_sent BOOLEAN DEFAULT FALSE,
  email_id TEXT, -- Resend email ID for tracking
  email_opened_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast packet lookups
CREATE INDEX IF NOT EXISTS idx_welcome_packets_packet_id ON welcome_packets(packet_id);
CREATE INDEX IF NOT EXISTS idx_welcome_packets_realtor ON welcome_packets(realtor_id);
CREATE INDEX IF NOT EXISTS idx_welcome_packets_client ON welcome_packets(client_id);

ALTER TABLE welcome_packets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Realtors can view own packets" ON welcome_packets;
CREATE POLICY "Realtors can view own packets" ON welcome_packets
  FOR SELECT USING (realtor_id = auth.uid());

DROP POLICY IF EXISTS "Realtors can insert own packets" ON welcome_packets;
CREATE POLICY "Realtors can insert own packets" ON welcome_packets
  FOR INSERT WITH CHECK (realtor_id = auth.uid());

DROP POLICY IF EXISTS "Realtors can update own packets" ON welcome_packets;
CREATE POLICY "Realtors can update own packets" ON welcome_packets
  FOR UPDATE USING (realtor_id = auth.uid());

DROP POLICY IF EXISTS "Service can manage welcome packets" ON welcome_packets;
CREATE POLICY "Service can manage welcome packets" ON welcome_packets
  FOR ALL USING (auth.role() = 'service_role');

-- Public can view packets by packet_id (for the public welcome page)
DROP POLICY IF EXISTS "Public can view packets by id" ON welcome_packets;
CREATE POLICY "Public can view packets by id" ON welcome_packets
  FOR SELECT USING (true);

-- ============================================
-- 4. PACKET ANALYTICS TABLE
-- ============================================

-- Drop and recreate to ensure correct structure
DROP TABLE IF EXISTS packet_analytics CASCADE;
CREATE TABLE packet_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  packet_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'view', 'provider_click', 'guide_click',
    'phone_click', 'website_click', 'email_click',
    'home_tracker_click', 'resource_click'
  )),

  -- Event details
  target_id TEXT, -- Provider ID, guide slug, etc.
  target_name TEXT, -- Human readable name
  target_category TEXT, -- Category for providers

  -- Session info
  session_id TEXT,
  user_agent TEXT,
  referrer TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_packet_analytics_packet ON packet_analytics(packet_id);
CREATE INDEX IF NOT EXISTS idx_packet_analytics_type ON packet_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_packet_analytics_date ON packet_analytics(created_at);

ALTER TABLE packet_analytics ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (for tracking from public pages)
DROP POLICY IF EXISTS "Anyone can insert packet analytics" ON packet_analytics;
CREATE POLICY "Anyone can insert packet analytics" ON packet_analytics
  FOR INSERT WITH CHECK (true);

-- Realtors can view analytics for their packets
DROP POLICY IF EXISTS "Realtors can view own packet analytics" ON packet_analytics;
CREATE POLICY "Realtors can view own packet analytics" ON packet_analytics
  FOR SELECT USING (
    packet_id IN (
      SELECT wp.packet_id FROM welcome_packets wp WHERE wp.realtor_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Service can manage packet analytics" ON packet_analytics;
CREATE POLICY "Service can manage packet analytics" ON packet_analytics
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- 5. PACKET EMAIL EVENTS
-- ============================================

DROP TABLE IF EXISTS packet_email_events CASCADE;
CREATE TABLE packet_email_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_id TEXT NOT NULL,
  packet_id TEXT,
  event_type TEXT NOT NULL,
  recipient_email TEXT,
  click_url TEXT,
  user_agent TEXT,
  event_timestamp TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_packet_email_events_email ON packet_email_events(email_id);
CREATE INDEX IF NOT EXISTS idx_packet_email_events_packet ON packet_email_events(packet_id);

ALTER TABLE packet_email_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service can manage packet email events" ON packet_email_events;
CREATE POLICY "Service can manage packet email events" ON packet_email_events
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- 6. WELCOME PACKET TEMPLATES
-- ============================================

CREATE TABLE IF NOT EXISTS welcome_packet_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  realtor_id UUID NOT NULL REFERENCES realtor_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Default Template',
  welcome_message TEXT,
  include_categories TEXT[] DEFAULT ARRAY['hvac', 'plumbing', 'electrical', 'handyman', 'landscaping', 'pest-control'],
  include_guides TEXT[] DEFAULT ARRAY['new-homeowner-checklist', 'home-maintenance-schedule'],
  custom_providers TEXT[],
  footer_message TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE welcome_packet_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Realtors can view own templates" ON welcome_packet_templates;
CREATE POLICY "Realtors can view own templates"
  ON welcome_packet_templates FOR SELECT
  USING (auth.uid() = realtor_id);

DROP POLICY IF EXISTS "Realtors can insert own templates" ON welcome_packet_templates;
CREATE POLICY "Realtors can insert own templates"
  ON welcome_packet_templates FOR INSERT
  WITH CHECK (auth.uid() = realtor_id);

DROP POLICY IF EXISTS "Realtors can update own templates" ON welcome_packet_templates;
CREATE POLICY "Realtors can update own templates"
  ON welcome_packet_templates FOR UPDATE
  USING (auth.uid() = realtor_id);

DROP POLICY IF EXISTS "Realtors can delete own templates" ON welcome_packet_templates;
CREATE POLICY "Realtors can delete own templates"
  ON welcome_packet_templates FOR DELETE
  USING (auth.uid() = realtor_id);

-- ============================================
-- 7. HELPER FUNCTIONS & TRIGGERS
-- ============================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-update packet stats when analytics event is inserted
CREATE OR REPLACE FUNCTION update_packet_view_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.event_type = 'view' THEN
    UPDATE welcome_packets
    SET
      view_count = view_count + 1,
      first_viewed_at = COALESCE(first_viewed_at, NOW()),
      last_viewed_at = NOW(),
      status = CASE WHEN status = 'sent' THEN 'viewed' ELSE status END,
      updated_at = NOW()
    WHERE packet_id = NEW.packet_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
DROP TRIGGER IF EXISTS update_realtor_profiles_updated_at ON realtor_profiles;
CREATE TRIGGER update_realtor_profiles_updated_at
  BEFORE UPDATE ON realtor_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_realtor_clients_updated_at ON realtor_clients;
CREATE TRIGGER update_realtor_clients_updated_at
  BEFORE UPDATE ON realtor_clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_welcome_packets_updated_at ON welcome_packets;
CREATE TRIGGER update_welcome_packets_updated_at
  BEFORE UPDATE ON welcome_packets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_packet_view_stats ON packet_analytics;
CREATE TRIGGER trigger_update_packet_view_stats
  AFTER INSERT ON packet_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_packet_view_stats();

-- ============================================
-- 8. INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_realtor_clients_realtor ON realtor_clients(realtor_id);
CREATE INDEX IF NOT EXISTS idx_realtor_clients_close_date ON realtor_clients(close_date);
CREATE INDEX IF NOT EXISTS idx_welcome_templates_realtor ON welcome_packet_templates(realtor_id);
