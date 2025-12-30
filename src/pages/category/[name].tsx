import { supabase, Post, getPublishedPosts } from '@/lib/supabase';
import PostCard from '@/components/blog/PostCard';
import Head from 'next/head';

interface CategoryPageProps {
  posts: Post[];
  categoryName: string;
}

export default function CategoryPage({ posts, categoryName }: CategoryPageProps) {
  return (
    <>
      <Head>
        <title>{categoryName} - Blog</title>
      </Head>
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
    </>
  );
}

export async function getStaticPaths() {
  const posts = await getPublishedPosts();
  const categories = Array.from(new Set(posts.map(p => p.category).filter(Boolean)));

  const paths = categories.map(cat => ({
    params: { name: cat as string },
  }));

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }: { params: { name: string } }) {
  const categoryName = params.name;

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .eq('category', categoryName)
    .order('published_at', { ascending: false });

  return {
    props: { posts: posts || [], categoryName },
    revalidate: 3600,
  };
}
