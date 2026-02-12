import { getAllPostsAdmin, Post } from '@/lib/supabase';
import Link from 'next/link';

interface DashboardProps {
  posts: Post[];
  error?: string;
}

export default function AdminDashboard({ posts = [], error }: DashboardProps) {
  const totalPosts = posts.length;
  const publishedPosts = posts.filter(p => p.published).length;
  const drafts = totalPosts - publishedPosts;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      {error && (
        <div className="bg-red-50 dark:bg-red-900 border-l-4 border-red-500 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-200">
                Error loading dashboard data: {error}
              </p>
            </div>
          </div>
        </div>
      )}

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
          {posts.length === 0 && !error && (
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

  try {
    const posts = await getAllPostsAdmin();
    return {
      props: { posts },
    };
  } catch (err: any) {
    console.error('Failed to load admin dashboard posts:', err);
    return {
      props: {
        posts: [],
        error: err.message || 'Failed to load data'
      }
    };
  }
}
