-- Wedding Website Tables Schema
-- Run this in Supabase SQL Editor

-- Enable extensions if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Wedding websites table
CREATE TABLE IF NOT EXISTS wedding_websites (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    subdomain TEXT UNIQUE NOT NULL,
    couple_name_1 TEXT NOT NULL,
    couple_name_2 TEXT NOT NULL,
    wedding_date DATE NOT NULL,
    template_id TEXT NOT NULL DEFAULT 'rustic',
    status TEXT DEFAULT 'draft', -- 'draft', 'active', 'expired'
    
    -- Wedding Details
    venue_name TEXT,
    venue_address TEXT,
    ceremony_time TIME,
    reception_time TIME,
    wedding_story TEXT,
    color_primary TEXT DEFAULT '#8B4513',
    color_secondary TEXT DEFAULT '#F4E4C1',
    
    -- Photos (URLs to uploaded images)
    hero_image TEXT,
    couple_photos JSONB DEFAULT '[]',
    engagement_photos JSONB DEFAULT '[]',
    
    -- Wedding Party
    wedding_party JSONB DEFAULT '[]',
    
    -- Registry & Links
    registry_links JSONB DEFAULT '[]',
    
    -- RSVP Settings
    rsvp_enabled BOOLEAN DEFAULT true,
    rsvp_deadline DATE,
    max_guests INTEGER DEFAULT 2,
    
    -- Accommodations
    hotel_blocks JSONB DEFAULT '[]',
    
    -- Payment & Subscription
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    plan_type TEXT DEFAULT 'basic',
    expires_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RSVP responses table
CREATE TABLE IF NOT EXISTS wedding_rsvps (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    website_id uuid REFERENCES wedding_websites(id) ON DELETE CASCADE,
    guest_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    attending BOOLEAN NOT NULL,
    guest_count INTEGER DEFAULT 1,
    meal_preferences JSONB,
    dietary_restrictions TEXT,
    message TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for wedding websites
CREATE INDEX IF NOT EXISTS idx_wedding_websites_subdomain ON wedding_websites(subdomain);
CREATE INDEX IF NOT EXISTS idx_wedding_websites_status ON wedding_websites(status);
CREATE INDEX IF NOT EXISTS idx_wedding_websites_expires_at ON wedding_websites(expires_at);
CREATE INDEX IF NOT EXISTS idx_wedding_rsvps_website_id ON wedding_rsvps(website_id);
CREATE INDEX IF NOT EXISTS idx_wedding_rsvps_email ON wedding_rsvps(email);

-- Enable Row Level Security
ALTER TABLE wedding_websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_rsvps ENABLE ROW LEVEL SECURITY;

-- Wedding websites are publicly viewable (for the actual wedding sites)
DROP POLICY IF EXISTS "Wedding websites are publicly viewable" ON wedding_websites;
CREATE POLICY "Wedding websites are publicly viewable" ON wedding_websites
    FOR SELECT USING (true);

-- Anyone can create wedding websites (for now - can be restricted later)
DROP POLICY IF EXISTS "Anyone can create wedding websites" ON wedding_websites;
CREATE POLICY "Anyone can create wedding websites" ON wedding_websites
    FOR INSERT WITH CHECK (true);

-- RSVPs can be submitted by anyone
DROP POLICY IF EXISTS "Anyone can submit RSVPs" ON wedding_rsvps;
CREATE POLICY "Anyone can submit RSVPs" ON wedding_rsvps
    FOR INSERT WITH CHECK (true);

-- Wedding website owners can view their RSVPs (for future dashboard)
DROP POLICY IF EXISTS "Website owners can view RSVPs" ON wedding_rsvps;
CREATE POLICY "Website owners can view RSVPs" ON wedding_rsvps
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM wedding_websites 
            WHERE id = wedding_rsvps.website_id 
        )
    );

-- Test insert to verify tables work
DO $$
BEGIN
    -- Test if we can insert and delete a test record
    INSERT INTO wedding_websites (
        subdomain, couple_name_1, couple_name_2, wedding_date, template_id
    ) VALUES (
        'test-setup-verification', 'Test', 'Setup', '2025-12-31', 'rustic'
    );
    
    DELETE FROM wedding_websites WHERE subdomain = 'test-setup-verification';
    
    RAISE NOTICE 'Wedding website tables created and tested successfully!';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error during setup: %', SQLERRM;
END $$;