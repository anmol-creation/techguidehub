import { supabase } from '@/lib/supabase';
import PostCard from '@/components/blog/PostCard';
import { notFound } from 'next/navigation';
import { Post } from '@/lib/supabase';

interface CategoryPageProps {
  params: Promise<{
    name: string;
  }>;
}

// Revalidate every hour
export const revalidate = 3600;

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { name } = await params;
  const categoryName = decodeURIComponent(name);

  // Fetch posts for category
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .eq('category', categoryName) // Assuming exact match on category name
    .order('published_at', { ascending: false });

  if (error || !posts) {
    // Ideally we should check if category exists, but for now just show empty or 404
    // If we have a categories table, we should check there first.
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          Category: <span className="text-blue-600 dark:text-blue-500">{categoryName}</span>
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
        {posts?.map((post: Post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {(!posts || posts.length === 0) && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No posts found in this category.</p>
        </div>
      )}
    </div>
  );
}
