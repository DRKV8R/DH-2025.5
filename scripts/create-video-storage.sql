-- Create storage bucket for intro videos
-- Create a public bucket for videos
INSERT INTO storage.buckets (id, name, public) VALUES ('intro-videos', 'intro-videos', true);

-- Set up RLS policy for public read access
CREATE POLICY "Public video access" ON storage.objects
FOR SELECT USING (bucket_id = 'intro-videos');

-- Allow authenticated uploads to intro-videos bucket
CREATE POLICY "Authenticated video upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'intro-videos' AND auth.role() = 'authenticated');
