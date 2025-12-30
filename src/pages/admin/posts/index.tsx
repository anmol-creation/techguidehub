import { getAllPostsAdmin, Post } from '@/lib/supabase';
import Link from 'next/link';

export default function PostsPage({ posts }: { posts: Post[] }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Posts</h1>
        <Link href="/admin/posts/new">
          <a className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">New Post</a>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
         <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {posts.map((post) => (
            <div key={post.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700">
              <div>
                <Link href={`/admin/posts/${post.id}/edit`}>
                  <a className="font-medium hover:text-blue-600">{post.title}</a>
                </Link>
                <div className="text-sm text-gray-500">
                  {new Date(post.created_at).toLocaleDateString()}
                  {post.category && <span className="ml-2">• {post.category}</span>}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                 <span className={`px-2 py-1 text-xs rounded-full ${
                    post.published
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {post.published ? 'Published' : 'Draft'}
                 </span>
                 <Link href={`/admin/posts/${post.id}/edit`}>
                    <a className="text-sm text-blue-600 hover:text-blue-800">Edit</a>
                 </Link>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="p-8 text-center text-gray-500">No posts found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const { req } = context;
  const authCookie = req.cookies['admin-auth'];

  if (!authCookie || authCookie !== 'true') {
    return { redirect: { destination: '/admin/login', permanent: false } };
  }

  const posts = await getAllPostsAdmin();
  return { props: { posts } };
}
