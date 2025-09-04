import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Client for browser usage (auth, RLS-protected queries)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Export createClient function for component usage
export { createClient }

// Admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

// Database types for TypeScript
export interface Business {
  id: string
  name: string
  category: string
  subcategory?: string
  address: string
  phone: string
  email?: string
  website?: string
  description: string
  rating?: number
  price_level?: string
  membership_tier: 'basic' | 'verified' | 'premium' | 'elite'
  claim_status: 'unclaimed' | 'pending' | 'verified' | 'rejected'
  owner_id?: string
  stripe_customer_id?: string
  stripe_subscription_id?: string
  coordinates?: {
    lat: number
    lng: number
  }
  amenities?: string[]
  photos?: string[]
  business_hours?: {
    [key: string]: string
  }
  keywords?: string[]
  special_offers?: string[]
  bernie_recommendation?: string
  wedding_styles?: string[]
  created_at: string
  updated_at: string
}

export interface BusinessClaim {
  id: string
  business_id: string
  claimer_email: string
  claimer_name: string
  claimer_phone: string
  business_role: 'owner' | 'manager' | 'employee'
  verification_docs?: string[]
  additional_info?: string
  status: 'pending' | 'under_review' | 'verified' | 'rejected'
  admin_notes?: string
  verification_steps: {
    emailSent: boolean
    phoneCalled: boolean
    mailSent: boolean
    documentsReviewed: boolean
  }
  submitted_at: string
  reviewed_at?: string
  reviewed_by?: string
}

export interface Profile {
  id: string
  email: string
  full_name?: string
  role: 'user' | 'business_owner' | 'admin'
  created_at: string
}

export interface Subscription {
  id: string
  business_id: string
  stripe_subscription_id: string
  status: string
  current_period_start?: string
  current_period_end?: string
  plan_id: string
  created_at: string
}