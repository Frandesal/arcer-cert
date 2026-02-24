-- 1. Create the announcements table
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    images JSONB DEFAULT '[]'::jsonb,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS) on the table
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies for announcements
-- Public read access for published announcements
CREATE POLICY "Public can view published announcements" 
ON public.announcements FOR SELECT 
USING (is_published = true);

-- Authenticated (Admin) access for full CRUD
CREATE POLICY "Admins have full access to announcements" 
ON public.announcements FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- 4. Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER handle_announcements_updated_at
    BEFORE UPDATE ON public.announcements
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 5. Set up Storage Bucket for bulletin images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('bulletin_images', 'bulletin_images', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Storage Policies
-- Allow public access to view images
CREATE POLICY "Public can view bulletin images"
ON storage.objects FOR SELECT
USING (bucket_id = 'bulletin_images');

-- Allow authenticated (admin) users to upload/update/delete images
CREATE POLICY "Admins can upload bulletin images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'bulletin_images');

CREATE POLICY "Admins can update bulletin images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'bulletin_images');

CREATE POLICY "Admins can delete bulletin images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'bulletin_images');
