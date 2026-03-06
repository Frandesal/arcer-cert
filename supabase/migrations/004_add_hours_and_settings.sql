-- Migration 004: Add hours to students and create certificate_settings
-- Run this in Supabase SQL Editor

-- 1. Add "hours" to students
ALTER TABLE students ADD COLUMN IF NOT EXISTS hours INTEGER NOT NULL DEFAULT 120;

-- 2. Create certificate settings table
CREATE TABLE IF NOT EXISTS certificate_settings (
  id INTEGER PRIMARY KEY,
  layout_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default row with ID 1 so we have a single row to update
-- These defaults match exactly what was hardcoded previously in the frontend React component
INSERT INTO certificate_settings (id, layout_config)
VALUES (
  1,
  '{
    "name": { "top": "830px", "fontSize": "60px" },
    "startDate": { "top": "1050px", "left": "1175px", "fontSize": "33px" },
    "endDate": { "top": "1050px", "left": "1560px", "fontSize": "33px" },
    "givenDay": { "top": "1240px", "left": "680px", "fontSize": "35px" },
    "givenMonthYear": { "top": "1240px", "left": "1070px", "fontSize": "35px" },
    "hours": { "top": "1400px", "left": "1100px", "fontSize": "30px" },
    "qrCode": { "bottom": "70px", "left": "70px", "size": "290px", "textBottom": "35px", "textFontSize": "22px" }
  }'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- 3. Row Level Security for settings
ALTER TABLE certificate_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read the settings (to generate the PDF on the client)
CREATE POLICY "Allow public read-access on certificate_settings"
  ON certificate_settings FOR SELECT
  USING (true);

-- Only authenticated admins can update the settings
CREATE POLICY "Allow authenticated update on certificate_settings"
  ON certificate_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
