-- Add view_count column to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS view_count bigint DEFAULT 0;

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(post_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE posts
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
