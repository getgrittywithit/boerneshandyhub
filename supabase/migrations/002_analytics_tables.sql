-- Analytics Tables for Business Dashboard and Newsletter Tracking
-- Run this migration after 001_newsletter_tables.sql

-- ============================================================================
-- BUSINESS ANALYTICS EVENTS
-- ============================================================================

-- Track all business-related events (views, clicks, impressions)
CREATE TABLE IF NOT EXISTS business_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('profile_view', 'search_impression', 'search_click', 'phone_click', 'website_click', 'quote_request')),

  -- Context
  source TEXT, -- 'search', 'direct', 'category', 'guide', etc.
  search_query TEXT, -- What the user searched for (if from search)
  referrer TEXT, -- Page they came from

  -- User info (anonymous)
  session_id TEXT, -- Anonymous session tracking
  user_agent TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- For date-based queries
  event_date DATE DEFAULT CURRENT_DATE
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_business_analytics_business_id ON business_analytics(business_id);
CREATE INDEX IF NOT EXISTS idx_business_analytics_event_type ON business_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_business_analytics_event_date ON business_analytics(event_date);
CREATE INDEX IF NOT EXISTS idx_business_analytics_business_date ON business_analytics(business_id, event_date);

-- ============================================================================
-- DAILY AGGREGATES (for faster dashboard queries)
-- ============================================================================

CREATE TABLE IF NOT EXISTS business_analytics_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id TEXT NOT NULL,
  event_date DATE NOT NULL,

  -- Counts
  profile_views INT DEFAULT 0,
  search_impressions INT DEFAULT 0,
  search_clicks INT DEFAULT 0,
  phone_clicks INT DEFAULT 0,
  website_clicks INT DEFAULT 0,
  quote_requests INT DEFAULT 0,

  -- Calculated
  click_through_rate DECIMAL(5,2), -- (search_clicks / search_impressions) * 100

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(business_id, event_date)
);

CREATE INDEX IF NOT EXISTS idx_business_analytics_daily_lookup ON business_analytics_daily(business_id, event_date);

-- ============================================================================
-- NEWSLETTER EMAIL EVENTS (from Resend webhooks)
-- ============================================================================

CREATE TABLE IF NOT EXISTS newsletter_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Resend identifiers
  email_id TEXT, -- Resend email ID
  broadcast_id TEXT, -- Our newsletter draft ID or Resend broadcast ID

  -- Event info
  event_type TEXT NOT NULL CHECK (event_type IN ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained', 'unsubscribed')),

  -- Recipient
  recipient_email TEXT,
  subscriber_id UUID REFERENCES subscribers(id) ON DELETE SET NULL,

  -- Click details
  click_url TEXT, -- Which link was clicked

  -- Metadata from Resend
  user_agent TEXT,
  ip_address TEXT,

  -- Timestamps
  event_timestamp TIMESTAMPTZ, -- When Resend says it happened
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_events_broadcast ON newsletter_events(broadcast_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_events_email ON newsletter_events(email_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_events_type ON newsletter_events(event_type);
CREATE INDEX IF NOT EXISTS idx_newsletter_events_recipient ON newsletter_events(recipient_email);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to update daily aggregates
CREATE OR REPLACE FUNCTION update_business_daily_aggregate()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO business_analytics_daily (business_id, event_date, profile_views, search_impressions, search_clicks, phone_clicks, website_clicks, quote_requests)
  VALUES (
    NEW.business_id,
    NEW.event_date,
    CASE WHEN NEW.event_type = 'profile_view' THEN 1 ELSE 0 END,
    CASE WHEN NEW.event_type = 'search_impression' THEN 1 ELSE 0 END,
    CASE WHEN NEW.event_type = 'search_click' THEN 1 ELSE 0 END,
    CASE WHEN NEW.event_type = 'phone_click' THEN 1 ELSE 0 END,
    CASE WHEN NEW.event_type = 'website_click' THEN 1 ELSE 0 END,
    CASE WHEN NEW.event_type = 'quote_request' THEN 1 ELSE 0 END
  )
  ON CONFLICT (business_id, event_date) DO UPDATE SET
    profile_views = business_analytics_daily.profile_views + CASE WHEN NEW.event_type = 'profile_view' THEN 1 ELSE 0 END,
    search_impressions = business_analytics_daily.search_impressions + CASE WHEN NEW.event_type = 'search_impression' THEN 1 ELSE 0 END,
    search_clicks = business_analytics_daily.search_clicks + CASE WHEN NEW.event_type = 'search_click' THEN 1 ELSE 0 END,
    phone_clicks = business_analytics_daily.phone_clicks + CASE WHEN NEW.event_type = 'phone_click' THEN 1 ELSE 0 END,
    website_clicks = business_analytics_daily.website_clicks + CASE WHEN NEW.event_type = 'website_click' THEN 1 ELSE 0 END,
    quote_requests = business_analytics_daily.quote_requests + CASE WHEN NEW.event_type = 'quote_request' THEN 1 ELSE 0 END,
    click_through_rate = CASE
      WHEN (business_analytics_daily.search_impressions + CASE WHEN NEW.event_type = 'search_impression' THEN 1 ELSE 0 END) > 0
      THEN ((business_analytics_daily.search_clicks + CASE WHEN NEW.event_type = 'search_click' THEN 1 ELSE 0 END)::DECIMAL /
            (business_analytics_daily.search_impressions + CASE WHEN NEW.event_type = 'search_impression' THEN 1 ELSE 0 END)) * 100
      ELSE 0
    END,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update daily aggregates
DROP TRIGGER IF EXISTS trigger_update_daily_aggregate ON business_analytics;
CREATE TRIGGER trigger_update_daily_aggregate
  AFTER INSERT ON business_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_business_daily_aggregate();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE business_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_analytics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_events ENABLE ROW LEVEL SECURITY;

-- Business analytics: businesses can only see their own data
CREATE POLICY "Businesses can view own analytics" ON business_analytics
  FOR SELECT USING (
    business_id IN (
      SELECT id::TEXT FROM businesses WHERE owner_id = auth.uid()::TEXT
    )
  );

-- Allow insert from API (service role)
CREATE POLICY "Service can insert analytics" ON business_analytics
  FOR INSERT WITH CHECK (true);

-- Daily aggregates: same policy
CREATE POLICY "Businesses can view own daily stats" ON business_analytics_daily
  FOR SELECT USING (
    business_id IN (
      SELECT id::TEXT FROM businesses WHERE owner_id = auth.uid()::TEXT
    )
  );

-- Newsletter events: admin only
CREATE POLICY "Admins can view newsletter events" ON newsletter_events
  FOR SELECT USING (
    auth.uid()::TEXT IN (
      SELECT id::TEXT FROM profiles WHERE role = 'admin'
    )
  );

CREATE POLICY "Service can insert newsletter events" ON newsletter_events
  FOR INSERT WITH CHECK (true);
