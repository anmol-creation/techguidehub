import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const published = searchParams.get('published');

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
