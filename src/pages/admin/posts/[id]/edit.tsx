import PostForm from '@/components/admin/PostForm';
import { supabaseAdmin, Post } from '@/lib/supabase';

export default function EditPostPage({ post }: { post: Post }) {
  return (
    <div>
       <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
       <PostForm post={post} />
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const { req, params } = context;
  const authCookie = req.cookies['admin-auth'];

  if (!authCookie || authCookie !== 'true') {
     return { redirect: { destination: '/admin/login', permanent: false } };
  }

  const { data: post } = await supabaseAdmin.from('posts').select('*').eq('id', params.id).single();

  if (!post) return { notFound: true };

  return { props: { post } };
}
