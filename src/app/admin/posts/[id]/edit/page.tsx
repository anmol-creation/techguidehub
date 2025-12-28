import PostForm from '@/components/admin/PostForm';
import { supabaseAdmin } from '@/lib/supabase';
import { notFound } from 'next/navigation';

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const revalidate = 0;

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const { data: post } = await supabaseAdmin
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (!post) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
      <PostForm post={post} />
    </div>
  );
}
