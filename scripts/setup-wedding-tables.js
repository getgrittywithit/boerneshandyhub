#!/usr/bin/env node

// Script to create wedding website tables in Supabase
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://vaoeflfloctjoqnmtsuw.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhb2VmbGZsb2N0am9xbm10c3V3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njg1NDE4NywiZXhwIjoyMDcyNDMwMTg3fQ.1uteI6vMN_-7li_j4rlkrJ4k3X6RZfH43VS1WoE7qPc'

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createWeddingTables() {
  console.log('🚀 Setting up wedding website tables...')

  try {
    // Create wedding websites table
    console.log('📝 Creating wedding_websites table...')
    const { error: websiteTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS wedding_websites (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          subdomain TEXT UNIQUE NOT NULL,
          couple_name_1 TEXT NOT NULL,
          couple_name_2 TEXT NOT NULL,
          wedding_date DATE NOT NULL,
          template_id TEXT NOT NULL DEFAULT 'rustic',
          status TEXT DEFAULT 'draft',
          
          -- Wedding Details
          venue_name TEXT,
          venue_address TEXT,
          ceremony_time TIME,
          reception_time TIME,
          wedding_story TEXT,
          color_primary TEXT DEFAULT '#8B4513',
          color_secondary TEXT DEFAULT '#F4E4C1',
          
          -- Photos
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
      `
    })

    if (websiteTableError) {
      console.error('❌ Error creating wedding_websites table:', websiteTableError)
      return
    }

    // Create RSVP table
    console.log('📝 Creating wedding_rsvps table...')
    const { error: rsvpTableError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    })

    if (rsvpTableError) {
      console.error('❌ Error creating wedding_rsvps table:', rsvpTableError)
      return
    }

    // Create indexes
    console.log('📝 Creating indexes...')
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_wedding_websites_subdomain ON wedding_websites(subdomain);
        CREATE INDEX IF NOT EXISTS idx_wedding_websites_status ON wedding_websites(status);
        CREATE INDEX IF NOT EXISTS idx_wedding_websites_expires_at ON wedding_websites(expires_at);
        CREATE INDEX IF NOT EXISTS idx_wedding_rsvps_website_id ON wedding_rsvps(website_id);
        CREATE INDEX IF NOT EXISTS idx_wedding_rsvps_email ON wedding_rsvps(email);
      `
    })

    if (indexError) {
      console.error('❌ Error creating indexes:', indexError)
      return
    }

    // Enable RLS
    console.log('🔒 Setting up Row Level Security...')
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE wedding_websites ENABLE ROW LEVEL SECURITY;
        ALTER TABLE wedding_rsvps ENABLE ROW LEVEL SECURITY;

        -- Wedding websites are publicly viewable
        CREATE POLICY IF NOT EXISTS "Wedding websites are publicly viewable" 
        ON wedding_websites FOR SELECT USING (true);

        -- RSVPs can be submitted by anyone
        CREATE POLICY IF NOT EXISTS "Anyone can submit RSVPs" 
        ON wedding_rsvps FOR INSERT WITH CHECK (true);

        -- Only authenticated users can create wedding websites
        CREATE POLICY IF NOT EXISTS "Authenticated users can create wedding websites" 
        ON wedding_websites FOR INSERT WITH CHECK (auth.role() = 'authenticated');
      `
    })

    if (rlsError) {
      console.error('❌ Error setting up RLS:', rlsError)
      return
    }

    // Test the tables
    console.log('✅ Testing table creation...')
    const { data: testData, error: testError } = await supabase
      .from('wedding_websites')
      .select('*')
      .limit(1)

    if (testError) {
      console.error('❌ Error testing tables:', testError)
      return
    }

    console.log('🎉 Wedding website tables created successfully!')
    console.log('📊 Tables ready:')
    console.log('  ✅ wedding_websites')
    console.log('  ✅ wedding_rsvps')
    console.log('  ✅ Indexes created')
    console.log('  ✅ Row Level Security enabled')
    
    console.log('\n🌐 You can now test wedding website creation at:')
    console.log('   https://boerneshandyhub.com/wedding-websites')

  } catch (error) {
    console.error('💥 Setup failed:', error.message)
  }
}

// Check if we have access to the exec_sql function first
async function checkAccess() {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql: 'SELECT 1 as test;' 
    })
    
    if (error) {
      console.error('❌ Cannot execute SQL. Error:', error.message)
      console.log('💡 You may need to create the exec_sql function in Supabase first.')
      console.log('📝 Go to Supabase SQL Editor and run:')
      console.log(`
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
  RETURN 'OK';
END;
$$;`)
      return false
    }
    
    return true
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    return false
  }
}

// Run setup
async function main() {
  console.log('🔍 Checking database access...')
  const hasAccess = await checkAccess()
  
  if (hasAccess) {
    await createWeddingTables()
  } else {
    console.log('❌ Cannot proceed without exec_sql function')
  }
}

main()