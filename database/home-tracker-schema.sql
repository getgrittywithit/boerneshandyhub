-- =============================================
-- HOME TRACKER SCHEMA
-- Run this in your Supabase SQL Editor
-- =============================================

-- Homes table
CREATE TABLE IF NOT EXISTS homes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT,
    city TEXT NOT NULL DEFAULT 'Boerne',
    year_built INTEGER,
    square_feet INTEGER,
    lot_size DECIMAL(10,2),
    bedrooms INTEGER,
    bathrooms DECIMAL(3,1),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Home Systems (HVAC, plumbing, etc.)
CREATE TABLE IF NOT EXISTS home_systems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    home_id UUID NOT NULL REFERENCES homes(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    brand TEXT,
    model_number TEXT,
    install_date DATE,
    warranty_expires DATE,
    last_serviced DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Maintenance Tasks
CREATE TABLE IF NOT EXISTS maintenance_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    home_id UUID NOT NULL REFERENCES homes(id) ON DELETE CASCADE,
    system_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    frequency_months INTEGER NOT NULL DEFAULT 12,
    last_completed TIMESTAMPTZ,
    next_due TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'upcoming',
    priority TEXT NOT NULL DEFAULT 'medium',
    linked_category TEXT,
    local_tip TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service Records
CREATE TABLE IF NOT EXISTS service_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    home_id UUID NOT NULL REFERENCES homes(id) ON DELETE CASCADE,
    task_id UUID REFERENCES maintenance_tasks(id) ON DELETE SET NULL,
    system_type TEXT NOT NULL,
    service_date DATE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    provider_name TEXT,
    provider_id TEXT,
    cost DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Materials (paint colors, tiles, fixtures)
CREATE TABLE IF NOT EXISTS materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    home_id UUID NOT NULL REFERENCES homes(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    brand TEXT,
    color_code TEXT,
    finish TEXT,
    room TEXT NOT NULL,
    purchased_from TEXT,
    purchase_date DATE,
    install_date DATE,
    quantity TEXT,
    notes TEXT,
    photo_path TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_homes_user_id ON homes(user_id);
CREATE INDEX IF NOT EXISTS idx_home_systems_home_id ON home_systems(home_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_tasks_home_id ON maintenance_tasks(home_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_tasks_next_due ON maintenance_tasks(next_due);
CREATE INDEX IF NOT EXISTS idx_service_records_home_id ON service_records(home_id);
CREATE INDEX IF NOT EXISTS idx_materials_home_id ON materials(home_id);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE homes ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

-- Homes: users can only access their own
CREATE POLICY "Users manage own homes" ON homes
    FOR ALL USING (auth.uid() = user_id);

-- Home Systems: access through home ownership
CREATE POLICY "Users manage own systems" ON home_systems
    FOR ALL USING (EXISTS (
        SELECT 1 FROM homes WHERE homes.id = home_systems.home_id
        AND homes.user_id = auth.uid()
    ));

-- Maintenance Tasks: access through home ownership
CREATE POLICY "Users manage own tasks" ON maintenance_tasks
    FOR ALL USING (EXISTS (
        SELECT 1 FROM homes WHERE homes.id = maintenance_tasks.home_id
        AND homes.user_id = auth.uid()
    ));

-- Service Records: access through home ownership
CREATE POLICY "Users manage own records" ON service_records
    FOR ALL USING (EXISTS (
        SELECT 1 FROM homes WHERE homes.id = service_records.home_id
        AND homes.user_id = auth.uid()
    ));

-- Materials: access through home ownership
CREATE POLICY "Users manage own materials" ON materials
    FOR ALL USING (EXISTS (
        SELECT 1 FROM homes WHERE homes.id = materials.home_id
        AND homes.user_id = auth.uid()
    ));

-- =============================================
-- UPDATED_AT TRIGGER
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_homes_updated_at
    BEFORE UPDATE ON homes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_materials_updated_at
    BEFORE UPDATE ON materials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- STORAGE BUCKET (run in Supabase Storage UI or SQL)
-- =============================================

-- Create the bucket for material photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('home-tracker-materials', 'home-tracker-materials', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access for material photos
CREATE POLICY "Material photos publicly viewable" ON storage.objects
FOR SELECT USING (bucket_id = 'home-tracker-materials');

-- Users can upload to their own folder
CREATE POLICY "Users upload own photos" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'home-tracker-materials' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own photos
CREATE POLICY "Users delete own photos" ON storage.objects
FOR DELETE USING (
    bucket_id = 'home-tracker-materials' AND
    auth.uid()::text = (storage.foldername(name))[1]
);
