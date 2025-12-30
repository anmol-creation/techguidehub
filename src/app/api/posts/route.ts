import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const published = searchParams.get('published');

  // Check if requesting drafts/all posts (requires admin auth)
  if (published === 'false' || !published) {
    const cookie = request.headers.get('cookie');
    if (!cookie || !cookie.includes('admin-auth=true')) {
       // If unauthorized, force published=true
       // Or return 401. Let's return only published posts for public access.
       // But wait, the public blog uses getPublishedPosts from lib/supabase which uses 'supabase' client (anon key).
       // This API route uses 'supabaseAdmin'.
       // If this API is for Admin Dashboard, it must be protected.
       // If it is for public, it should use public client or filter by published=true.
       // The Admin Dashboard calls getAllPostsAdmin via Server Component directly, not via API usually?
       // Wait, Admin List page calls getAllPostsAdmin().
       // Does anything call /api/posts GET?
       // Maybe not currently used by app but good to secure.
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  let query = supabaseAdmin.from('posts').select('*').order('created_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  if (published === 'true') {
    query = query.eq('published', true);
  } else if (published === 'false') {
    query = query.eq('published', false);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  // Check auth - For now we rely on middleware to protect this route or check cookie here
  // But since we are using supabaseAdmin, we bypass RLS, so we MUST ensure the user is authenticated as admin.
  // The middleware.ts will handle the route protection for /api/posts in admin context?
  // Actually, API routes used by admin need protection.

  // Minimal auth check (can be improved with JWT or NextAuth)
  const cookie = request.headers.get('cookie');
  if (!cookie || !cookie.includes('admin-auth=true')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const json = await request.json();

    // Validate required fields
    if (!json.title || !json.content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('posts')
      .insert([json])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
