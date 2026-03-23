-- Migration 005: Create certificate_assets bucket
-- Run this in Supabase SQL Editor

-- 1. Set up Storage Bucket for certificate backgrounds and other assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificate_assets', 'certificate_assets', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Policies
-- Allow public access to view images
CREATE POLICY "Public can view certificate assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'certificate_assets');

-- Allow authenticated (admin) users to upload images
CREATE POLICY "Admins can upload certificate assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'certificate_assets');

-- Allow authenticated (admin) users to update images
CREATE POLICY "Admins can update certificate assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'certificate_assets');

-- Allow authenticated (admin) users to delete images
CREATE POLICY "Admins can delete certificate assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'certificate_assets');
