# Wedding Website Setup Instructions

The wedding website rental system requires additional database tables that need to be created in your Supabase database.

## Error: "Wedding website service is not yet set up"

If you're seeing this error, it means the `wedding_websites` and `wedding_rsvps` tables haven't been created yet.

## Setup Steps

### 1. Create Database Tables

Go to your Supabase SQL Editor and run the wedding-specific parts of the schema:

```sql
-- Wedding websites table
CREATE TABLE wedding_websites (
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
CREATE TABLE wedding_rsvps (
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
CREATE INDEX idx_wedding_websites_subdomain ON wedding_websites(subdomain);
CREATE INDEX idx_wedding_websites_status ON wedding_websites(status);
CREATE INDEX idx_wedding_websites_expires_at ON wedding_websites(expires_at);
CREATE INDEX idx_wedding_rsvps_website_id ON wedding_rsvps(website_id);
CREATE INDEX idx_wedding_rsvps_email ON wedding_rsvps(email);
```

### 2. Set Up Row Level Security (Optional)

If you want to add security policies:

```sql
-- Enable RLS
ALTER TABLE wedding_websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_rsvps ENABLE ROW LEVEL SECURITY;

-- Wedding websites can be viewed by everyone (for public wedding sites)
CREATE POLICY "Wedding websites are publicly viewable" ON wedding_websites
    FOR SELECT USING (true);

-- Only authenticated users can create wedding websites
CREATE POLICY "Authenticated users can create wedding websites" ON wedding_websites
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RSVPs can be submitted by anyone
CREATE POLICY "Anyone can submit RSVPs" ON wedding_rsvps
    FOR INSERT WITH CHECK (true);

-- Wedding website owners can view their RSVPs
CREATE POLICY "Wedding website owners can view RSVPs" ON wedding_rsvps
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM wedding_websites 
            WHERE id = wedding_rsvps.website_id 
            AND auth.uid()::text = stripe_customer_id
        )
    );
```

### 3. Environment Variables

Make sure these are set in your Vercel environment:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for admin operations)

### 4. DNS Setup (Future)

For subdomain routing like `john-jane.boerneweddings.com`, you'll need to:

1. Register `boerneweddings.com` domain
2. Set up wildcard DNS record `*.boerneweddings.com` → Vercel
3. Configure Vercel to handle the subdomain routing

## Testing

After creating the tables, try creating a wedding website again. You should now see proper error messages if there are any issues.

## Features Included

- ✅ 3 Beautiful templates (Rustic, Elegant, Modern)
- ✅ 4-step onboarding process
- ✅ RSVP management system
- ✅ Registry links
- ✅ Hotel accommodation blocks
- ✅ Custom colors and styling
- ✅ Mobile-responsive design
- 🚧 Payment integration (Stripe - to be implemented)
- 🚧 Email notifications (to be implemented)