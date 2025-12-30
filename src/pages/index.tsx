import { getPublishedPosts, Post } from '@/lib/supabase';
import PostCard from '@/components/blog/PostCard';

interface HomeProps {
  posts: Post[];
}

export default function HomePage({ posts }: HomeProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
          Welcome to <span className="text-blue-600 dark:text-blue-500">My Blog</span>
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-400">
          Thoughts, stories, and ideas.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No posts yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}

export async function getStaticProps() {
  const posts = await getPublishedPosts();
  return {
    props: { posts },
    revalidate: 3600,
  };
}
