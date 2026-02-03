import { getAllPostsByViews, Post } from '@/lib/supabase';
import Link from 'next/link';
import { BarChart, Eye, FileText } from 'lucide-react';

interface InsightsProps {
  posts: Post[];
}

export default function AdminInsights({ posts }: InsightsProps) {
  const totalViews = posts.reduce((sum, post) => sum + (post.view_count || 0), 0);
  const avgViews = posts.length > 0 ? Math.round(totalViews / posts.length) : 0;
  const mostViewed = posts.length > 0 ? posts[0] : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Insights</h1>
        <div className="text-sm text-gray-500">
          Analytics for {posts.length} posts
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Total Views</h3>
            <Eye className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold">{totalViews.toLocaleString()}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Avg. Views / Post</h3>
            <BarChart className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold">{avgViews.toLocaleString()}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Top Performer</h3>
            <FileText className="w-5 h-5 text-green-500" />
          </div>
          <div className="truncate">
            <p className="text-lg font-bold truncate" title={mostViewed?.title || 'N/A'}>
              {mostViewed?.title || 'No posts'}
            </p>
            {mostViewed && (
               <p className="text-sm text-gray-500 mt-1">
                 {mostViewed.view_count || 0} views
               </p>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-bold">Detailed Post Insights</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 font-medium border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 w-16 text-center">#</th>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3 text-right">Views</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-right">Published</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {posts.map((post, index) => (
                <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 text-center text-gray-400 font-mono">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/posts/${post.id}/edit`}>
                      <a className="font-medium hover:text-blue-600 dark:hover:text-blue-400 block truncate max-w-md" title={post.title}>
                        {post.title}
                      </a>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    {(post.view_count || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      post.published
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-500">
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                   <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                     No analytics data available yet.
                   </td>
                </tr>
              )}
            </tbody>
          </table>
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

  const posts = await getAllPostsByViews();
  return {
    props: { posts },
  };
}
