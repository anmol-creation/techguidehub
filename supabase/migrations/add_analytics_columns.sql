-- Add likes column to posts
ALTER TABLE posts ADD COLUMN IF NOT EXISTS likes integer DEFAULT 0;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0;

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Allow public read access to comments
CREATE POLICY "Allow public read comments" ON comments FOR SELECT USING (true);

-- Allow public insert access to comments (usually for anonymous comments, or change to authenticated if required)
-- Assuming public for now as per "simple blog" context
CREATE POLICY "Allow public insert comments" ON comments FOR INSERT WITH CHECK (true);

-- Allow admin to delete comments
CREATE POLICY "Allow admin delete comments" ON comments FOR DELETE USING (auth.role() = 'authenticated' or auth.role() = 'service_role');
