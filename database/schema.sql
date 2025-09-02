-- Boerne Handy Hub Database Schema
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE membership_tier_type AS ENUM ('basic', 'verified', 'premium', 'elite');
CREATE TYPE claim_status_type AS ENUM ('unclaimed', 'pending', 'verified', 'rejected');
CREATE TYPE business_role_type AS ENUM ('owner', 'manager', 'employee');
CREATE TYPE user_role_type AS ENUM ('user', 'business_owner', 'admin');
CREATE TYPE claim_review_status_type AS ENUM ('pending', 'under_review', 'verified', 'rejected');

-- Business listings table
CREATE TABLE businesses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    website TEXT,
    description TEXT,
    rating DECIMAL(2,1) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
    price_level TEXT DEFAULT '$$',
    membership_tier membership_tier_type DEFAULT 'basic',
    claim_status claim_status_type DEFAULT 'unclaimed',
    owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    stripe_customer_id TEXT UNIQUE,
    stripe_subscription_id TEXT UNIQUE,
    coordinates JSONB,
    amenities JSONB DEFAULT '[]',
    photos JSONB DEFAULT '[]',
    business_hours JSONB,
    keywords JSONB DEFAULT '[]',
    special_offers JSONB DEFAULT '[]',
    bernie_recommendation TEXT,
    wedding_styles JSONB DEFAULT '[]',
    services JSONB DEFAULT '[]',
    capacity JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business claims table
CREATE TABLE business_claims (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    claimer_email TEXT NOT NULL,
    claimer_name TEXT NOT NULL,
    claimer_phone TEXT NOT NULL,
    business_role business_role_type NOT NULL,
    verification_docs JSONB DEFAULT '[]',
    additional_info TEXT,
    status claim_review_status_type DEFAULT 'pending',
    admin_notes TEXT,
    verification_steps JSONB DEFAULT '{
        "emailSent": false,
        "phoneCalled": false,
        "mailSent": false,
        "documentsReviewed": false
    }',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by uuid REFERENCES auth.users(id)
);

-- User profiles (extends Supabase auth.users)
CREATE TABLE profiles (
    id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role user_role_type DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions tracking
CREATE TABLE subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    stripe_subscription_id TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL,
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    plan_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_businesses_category ON businesses(category);
CREATE INDEX idx_businesses_claim_status ON businesses(claim_status);
CREATE INDEX idx_businesses_membership_tier ON businesses(membership_tier);
CREATE INDEX idx_businesses_owner_id ON businesses(owner_id);
CREATE INDEX idx_business_claims_business_id ON business_claims(business_id);
CREATE INDEX idx_business_claims_status ON business_claims(status);
CREATE INDEX idx_subscriptions_business_id ON subscriptions(business_id);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Businesses policies
CREATE POLICY "Businesses are viewable by everyone" ON businesses
    FOR SELECT USING (true);

CREATE POLICY "Business owners can update their own businesses" ON businesses
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Admins can manage all businesses" ON businesses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Business claims policies
CREATE POLICY "Anyone can create business claims" ON business_claims
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Claimers can view their own claims" ON business_claims
    FOR SELECT USING (claimer_email = auth.email());

CREATE POLICY "Business owners can view claims for their businesses" ON business_claims
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE id = business_claims.business_id 
            AND owner_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all claims" ON business_claims
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Profiles are created on signup" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Subscriptions policies
CREATE POLICY "Business owners can view their subscriptions" ON subscriptions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE id = subscriptions.business_id 
            AND owner_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all subscriptions" ON subscriptions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Functions and Triggers

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_businesses_updated_at 
    BEFORE UPDATE ON businesses 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at 
    BEFORE UPDATE ON subscriptions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Storage buckets (run these in the Supabase Storage section)
/*
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('business-photos', 'business-photos', true),
    ('verification-docs', 'verification-docs', false),
    ('user-avatars', 'user-avatars', true);

-- Storage policies
CREATE POLICY "Business photos are publicly viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'business-photos');

CREATE POLICY "Business owners can upload photos"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'business-photos' AND
    auth.role() = 'authenticated'
);

CREATE POLICY "Verification docs are private"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'verification-docs' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can upload verification docs"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'verification-docs' AND
    auth.uid()::text = (storage.foldername(name))[1]
);
*/