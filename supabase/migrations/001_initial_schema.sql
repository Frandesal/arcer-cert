-- Arcer Certificate Verification System
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Students table (graduates with certificates)
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  date_entered DATE NOT NULL,
  date_graduated DATE NOT NULL,
  modules_completed TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_dates CHECK (date_graduated >= date_entered)
);

-- Admin users (link to Supabase Auth)
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookups by ID (used in verify URLs)
CREATE INDEX idx_students_id ON students(id);
CREATE INDEX idx_students_full_name ON students(full_name);

-- Row Level Security (RLS)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public: Anyone can read students (for verification and listing)
CREATE POLICY "Students are viewable by everyone"
  ON students FOR SELECT
  USING (true);

-- Only admins can insert/update/delete students
CREATE POLICY "Only admins can insert students"
  ON students FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

CREATE POLICY "Only admins can update students"
  ON students FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

CREATE POLICY "Only admins can delete students"
  ON students FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

-- Admin users: only viewable by authenticated admins
CREATE POLICY "Admins can view admin users"
  ON admin_users FOR SELECT
  USING (auth.uid() = id);

-- Function to add new admin (run manually or via trigger)
CREATE OR REPLACE FUNCTION public.handle_new_admin()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.admin_users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: When a user signs up with admin email domain, add to admin_users
-- For now, admins must be manually added - run:
-- INSERT INTO admin_users (id, email) SELECT id, email FROM auth.users WHERE email = 'your@admin.email';

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

