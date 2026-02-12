import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BarChart, Eye, FileText, Heart, MessageSquare } from 'lucide-react';

interface PostInsight {
  id: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
  engagementRate: number;
  createdAt: string;
}

interface InsightsData {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  posts: PostInsight[];
}

export default function AdminInsights() {
  const [data, setData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInsights() {
      try {
        const res = await fetch('/api/admin/insights');
        if (!res.ok) {
          throw new Error('Failed to fetch insights');
        }
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center text-red-500">
          <p className="text-xl font-bold mb-2">Error loading insights</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Insights</h1>
        <div className="text-sm text-gray-500">
          Analytics for {data.totalPosts} posts
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Total Views</h3>
            <Eye className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold">{data.totalViews.toLocaleString()}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Total Likes</h3>
            <Heart className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold">{data.totalLikes.toLocaleString()}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Total Comments</h3>
            <MessageSquare className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold">{data.totalComments.toLocaleString()}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Avg. Engagement</h3>
            <BarChart className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold">
            {data.totalPosts > 0
              ? ((data.totalLikes + data.totalComments) / data.totalViews * 100).toFixed(2) + '%'
              : '0%'}
          </p>
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
                <th className="px-6 py-3 text-right">Likes</th>
                <th className="px-6 py-3 text-right">Comments</th>
                <th className="px-6 py-3 text-right">Engagement</th>
                <th className="px-6 py-3 text-right">Published</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.posts.map((post, index) => (
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
                    {post.views.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right text-green-600 dark:text-green-400 font-medium">
                    {post.likes.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right text-blue-600 dark:text-blue-400 font-medium">
                    {post.comments.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-purple-600 dark:text-purple-400">
                    {post.engagementRate.toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 text-right text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {data.posts.length === 0 && (
                <tr>
                   <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
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
