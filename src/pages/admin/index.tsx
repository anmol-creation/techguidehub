import { getAllPostsAdmin, Post } from '@/lib/supabase';
import Link from 'next/link';

interface DashboardProps {
  posts: Post[];
}

export default function AdminDashboard({ posts }: DashboardProps) {
  const totalPosts = posts.length;
  const publishedPosts = posts.filter(p => p.published).length;
  const drafts = totalPosts - publishedPosts;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Posts</h3>
          <p className="text-3xl font-bold mt-2">{totalPosts}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Published</h3>
          <p className="text-3xl font-bold mt-2 text-green-600">{publishedPosts}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Drafts</h3>
          <p className="text-3xl font-bold mt-2 text-yellow-600">{drafts}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="font-bold">Recent Posts</h3>
          <Link
            href="/admin/posts/new"
            className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition-colors"
          >
            New Post
          </Link>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {posts.slice(0, 5).map((post) => (
            <div key={post.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700">
              <div>
                <Link href={`/admin/posts/${post.id}/edit`} className="font-medium hover:text-blue-600">
                  {post.title}
                </Link>
                <p className="text-sm text-gray-500">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                post.published
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              }`}>
                {post.published ? 'Published' : 'Draft'}
              </span>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="px-6 py-8 text-center text-gray-500">
              No posts found. Start writing!
            </div>
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
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }

  const posts = await getAllPostsAdmin();
  return {
    props: { posts },
  };
}
