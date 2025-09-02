// Run this script to set up the database and migrate data
// Usage: node scripts/setup-database.js

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key-here'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Load wedding vendor data
const weddingVendorsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/data/weddingVendors.json'), 'utf8')
)

async function setupDatabase() {
  console.log('🚀 Setting up Boerne Handy Hub database...')
  
  try {
    // Test connection
    const { data, error } = await supabase.from('businesses').select('count', { count: 'exact', head: true })
    
    if (error && error.code === '42P01') {
      console.log('❌ Tables not found. Please run the schema.sql file in your Supabase SQL Editor first.')
      console.log('📁 Schema file location: /database/schema.sql')
      console.log('🌐 Supabase Dashboard: https://app.supabase.com/project/vaoeflfloctjoqnmtsuw/sql')
      return
    } else if (error) {
      console.error('❌ Database connection error:', error.message)
      return
    }

    console.log('✅ Database connection successful!')
    
    // Check if data already exists
    const { data: existingData, error: countError } = await supabase
      .from('businesses')
      .select('id', { count: 'exact', head: true })

    if (countError) {
      console.error('❌ Error checking existing data:', countError.message)
      return
    }

    if (existingData && existingData > 0) {
      console.log(`📊 Found ${existingData} existing businesses. Skipping migration.`)
      console.log('✅ Database setup complete!')
      return
    }

    // Migrate wedding vendor data
    console.log('📦 Migrating wedding vendor data...')
    
    const allVendors = []
    
    Object.entries(weddingVendorsData).forEach(([category, vendors]) => {
      vendors.forEach((vendor) => {
        allVendors.push({
          id: vendor.id,
          name: vendor.name,
          category: vendor.category,
          subcategory: vendor.subcategory,
          address: vendor.address,
          phone: vendor.phone,
          email: null,
          website: vendor.website || null,
          description: vendor.description,
          rating: vendor.rating,
          price_level: vendor.priceLevel,
          membership_tier: 'basic',
          claim_status: 'unclaimed',
          owner_id: null,
          stripe_customer_id: null,
          stripe_subscription_id: null,
          coordinates: vendor.coordinates || null,
          amenities: vendor.amenities || [],
          photos: vendor.photos || [],
          business_hours: null,
          keywords: vendor.keywords || [],
          special_offers: vendor.specialOffers || [],
          bernie_recommendation: vendor.bernieRecommendation || null,
          wedding_styles: vendor.weddingStyles || [],
          services: vendor.services || [],
          capacity: vendor.capacity || null
        })
      })
    })

    console.log(`📊 Prepared ${allVendors.length} vendors for migration`)

    // Insert in batches
    const batchSize = 50
    let successCount = 0
    
    for (let i = 0; i < allVendors.length; i += batchSize) {
      const batch = allVendors.slice(i, i + batchSize)
      
      const { data: insertData, error: insertError } = await supabase
        .from('businesses')
        .insert(batch)
        .select('id, name')

      if (insertError) {
        console.error(`❌ Error inserting batch ${Math.floor(i/batchSize) + 1}:`, insertError.message)
        continue
      }

      successCount += batch.length
      console.log(`✅ Migrated batch ${Math.floor(i/batchSize) + 1}: ${batch.length} vendors`)
    }

    // Verify migration
    const { data: finalCount, error: finalError } = await supabase
      .from('businesses')
      .select('id', { count: 'exact', head: true })

    if (finalError) {
      console.error('❌ Error getting final count:', finalError.message)
      return
    }

    console.log(`🎉 Migration complete! ${successCount} vendors successfully migrated`)
    console.log(`📊 Total businesses in database: ${finalCount}`)

    // Show sample data
    const { data: sampleData } = await supabase
      .from('businesses')
      .select('id, name, category, membership_tier, claim_status')
      .limit(5)

    if (sampleData && sampleData.length > 0) {
      console.log('\n📋 Sample migrated vendors:')
      sampleData.forEach(vendor => {
        console.log(`  • ${vendor.name} (${vendor.category}) - ${vendor.membership_tier}/${vendor.claim_status}`)
      })
    }

    console.log('\n🏁 Database setup completed successfully!')
    console.log('🌐 View your data: https://app.supabase.com/project/vaoeflfloctjoqnmtsuw/editor')
    
  } catch (error) {
    console.error('💥 Setup failed:', error.message)
  }
}

// Run setup
setupDatabase()