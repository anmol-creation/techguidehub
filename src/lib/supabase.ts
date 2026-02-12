import { createClient } from '@supabase/supabase-js';

// Types
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  cover_image?: string;
  published: boolean;
  published_at?: string;
  category?: string;
  tags?: string[];
  reading_time?: number;
  view_count?: number;
  likes?: number;
  comments?: Comment[];
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  content: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

// Clients

// Determine if we are in a valid environment
const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project');

// Fallback values to prevent crash if env vars are missing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';

// Public client for client-side usage (uses Anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side usage (uses Service Role key)
// ONLY use this in server components or API routes
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Helper functions

export async function getPublishedPosts() {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured, returning empty posts list.');
    return [];
  }
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching published posts:', error);
    throw error;
  }
  return data as Post[];
}

export async function getAllPostsByViews() {
  if (!isSupabaseConfigured) {
    return [];
  }
  // Try to fetch with comments count, fallback if relationship fails
  try {
    const { data, error } = await supabaseAdmin
      .from('posts')
      .select('*, comments(count)') // Include comments count
      .order('view_count', { ascending: false });

    if (error) throw error;
    return data as Post[];
  } catch (err) {
    console.error('Error fetching posts by views (likely comments relationship):', err);
    // Fallback query without comments count
     const { data, error } = await supabaseAdmin
      .from('posts')
      .select('*')
      .order('view_count', { ascending: false });

    if (error) throw error;
    return data as Post[];
  }
}

export async function getPostBySlug(slug: string) {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured, returning null for slug:', slug);
    return null;
  }

  try {
    // Attempt with comments
    const { data, error } = await supabase
      .from('posts')
      .select('*, comments(*)')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error) {
       // If strict single row requirement fails, or any other error
       if (error.code !== 'PGRST116') { // PGRST116 is "The result contains 0 rows"
          console.error(`Error fetching post by slug "${slug}" with comments:`, error);
       }
       throw error;
    }
    return data as Post;
  } catch (err: any) {
    // If the error was specifically about the comments relationship (e.g. missing FK), try without it
    // Or if it was just "not found", we should return null.

    // PGRST116: JSON object requested, multiple (or no) rows returned
    if (err.code === 'PGRST116') {
        return null;
    }

    // Try fallback without comments if it wasn't a "not found" error
    try {
        console.warn(`Retrying fetch for slug "${slug}" without comments relationship...`);
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single();

        if (error) {
           if (error.code !== 'PGRST116') {
              console.error(`Error fetching post by slug "${slug}" (fallback):`, error);
           }
           return null;
        }
        return data as Post;
    } catch (fallbackErr) {
        console.error('Final failure fetching post by slug:', fallbackErr);
        return null;
    }
  }
}

export async function getAllPostsAdmin() {
  if (!isSupabaseConfigured) {
    return [];
  }

  try {
    const { data, error } = await supabaseAdmin
        .from('posts')
        .select('*, comments(count)')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Post[];
  } catch (err) {
      console.error('Error fetching admin posts (likely comments relationship):', err);
      // Fallback
      const { data, error } = await supabaseAdmin
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Post[];
  }
}
