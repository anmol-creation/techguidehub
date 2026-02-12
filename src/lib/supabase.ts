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
    return [];
  }
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (error) throw error;
  return data as Post[];
}

export async function getAllPostsByViews() {
  if (!isSupabaseConfigured) {
    return [];
  }
  const { data, error } = await supabaseAdmin
    .from('posts')
    .select('*, comments(count)') // Include comments count
    .order('view_count', { ascending: false });

  if (error) throw error;
  // Map comments count correctly if needed by consumer, but for now just pass as is
  return data as Post[];
}

export async function getPostBySlug(slug: string) {
  if (!isSupabaseConfigured) {
    return null;
  }
  const { data, error } = await supabase
    .from('posts')
    .select('*, comments(*)')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) return null;
  return data as Post;
}

export async function getAllPostsAdmin() {
  if (!isSupabaseConfigured) {
    return [];
  }
  const { data, error } = await supabaseAdmin
    .from('posts')
    .select('*, comments(count)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Post[];
}
