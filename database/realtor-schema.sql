-- Realtor Partner Portal Schema
-- Run this in Supabase SQL Editor

-- Realtor profiles table
CREATE TABLE IF NOT EXISTS realtor_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  phone TEXT,
  license_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE realtor_profiles ENABLE ROW LEVEL SECURITY;

-- Realtors can read and update their own profile
CREATE POLICY "Realtors can view own profile"
  ON realtor_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Realtors can update own profile"
  ON realtor_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Realtors can insert own profile"
  ON realtor_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Realtor clients table
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
  welcome_packet_sent_at TIMESTAMP WITH TIME ZONE,
  homeowner_account_created BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE realtor_clients ENABLE ROW LEVEL SECURITY;

-- Realtors can only access their own clients
CREATE POLICY "Realtors can view own clients"
  ON realtor_clients FOR SELECT
  USING (auth.uid() = realtor_id);

CREATE POLICY "Realtors can insert own clients"
  ON realtor_clients FOR INSERT
  WITH CHECK (auth.uid() = realtor_id);

CREATE POLICY "Realtors can update own clients"
  ON realtor_clients FOR UPDATE
  USING (auth.uid() = realtor_id);

CREATE POLICY "Realtors can delete own clients"
  ON realtor_clients FOR DELETE
  USING (auth.uid() = realtor_id);

-- Welcome packet customizations
CREATE TABLE IF NOT EXISTS welcome_packet_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  realtor_id UUID NOT NULL REFERENCES realtor_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Default Template',
  welcome_message TEXT,
  include_categories TEXT[] DEFAULT ARRAY['hvac', 'plumbing', 'electrical', 'handyman', 'landscaping', 'pest-control'],
  include_guides TEXT[] DEFAULT ARRAY['new-homeowner-checklist', 'home-maintenance-schedule'],
  custom_providers TEXT[], -- Array of provider IDs the realtor specifically recommends
  footer_message TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE welcome_packet_templates ENABLE ROW LEVEL SECURITY;

-- Realtors can only access their own templates
CREATE POLICY "Realtors can view own templates"
  ON welcome_packet_templates FOR SELECT
  USING (auth.uid() = realtor_id);

CREATE POLICY "Realtors can insert own templates"
  ON welcome_packet_templates FOR INSERT
  WITH CHECK (auth.uid() = realtor_id);

CREATE POLICY "Realtors can update own templates"
  ON welcome_packet_templates FOR UPDATE
  USING (auth.uid() = realtor_id);

CREATE POLICY "Realtors can delete own templates"
  ON welcome_packet_templates FOR DELETE
  USING (auth.uid() = realtor_id);

-- Indexes for performance
CREATE INDEX idx_realtor_clients_realtor ON realtor_clients(realtor_id);
CREATE INDEX idx_realtor_clients_close_date ON realtor_clients(close_date);
CREATE INDEX idx_welcome_templates_realtor ON welcome_packet_templates(realtor_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_realtor_profiles_updated_at
  BEFORE UPDATE ON realtor_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_realtor_clients_updated_at
  BEFORE UPDATE ON realtor_clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_welcome_templates_updated_at
  BEFORE UPDATE ON welcome_packet_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
