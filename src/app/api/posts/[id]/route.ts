import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: Request, { params }: Params) {
  // Auth check
  const cookie = request.headers.get('cookie');
  if (!cookie || !cookie.includes('admin-auth=true')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { data, error } = await supabaseAdmin
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: Request, { params }: Params) {
  // Auth check
  const cookie = request.headers.get('cookie');
  if (!cookie || !cookie.includes('admin-auth=true')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: postId } = await params;

  try {
    const json = await request.json();

    // Remove id and created_at from update payload if present
    const { id, created_at, ...updateData } = json;

    const { data, error } = await supabaseAdmin
      .from('posts')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', postId)
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

export async function DELETE(request: Request, { params }: Params) {
  // Auth check
  const cookie = request.headers.get('cookie');
  if (!cookie || !cookie.includes('admin-auth=true')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const { error } = await supabaseAdmin
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Post deleted' });
}
