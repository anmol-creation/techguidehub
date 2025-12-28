import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Helper to get file extension
function getExtension(filename: string) {
  const parts = filename.split('.');
  return parts.length > 1 ? `.${parts.pop()}` : '';
}

export async function POST(request: Request) {
  // Auth check
  const cookie = request.headers.get('cookie');
  if (!cookie || !cookie.includes('admin-auth=true')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Check if Supabase keys are configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project')) {
      // Return a mock URL if no real Supabase credentials
      // This is for demonstration purposes in the sandbox environment
      const mockUrl = `https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80`;
      return NextResponse.json({ url: mockUrl });
    }

    // Upload to Supabase Storage
    const buffer = await file.arrayBuffer();
    const name = `${Date.now()}-${Math.random().toString(36).substring(7)}${getExtension(file.name)}`;

    const { data, error } = await supabaseAdmin
      .storage
      .from('images') // Ensure this bucket is created in Supabase
      .upload(name, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin
      .storage
      .from('images')
      .getPublicUrl(name);

    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
