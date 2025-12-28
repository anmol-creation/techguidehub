import { Post } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

interface PostContentProps {
  post: Post;
}

export default function PostContent({ post }: PostContentProps) {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-10 text-center">
        {post.category && (
          <Link
            href={`/category/${post.category}`}
            className="text-blue-600 dark:text-blue-400 font-medium tracking-wide uppercase text-sm hover:underline"
          >
            {post.category}
          </Link>
        )}
        <h1 className="mt-2 text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
          {post.title}
        </h1>
        <div className="mt-4 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
          <time dateTime={post.published_at}>{post.published_at ? formatDate(post.published_at) : 'Draft'}</time>
          <span className="mx-2">&middot;</span>
          <span>{post.reading_time} min read</span>
        </div>
      </header>

      {post.cover_image && (
        <div className="mb-10 rounded-xl overflow-hidden shadow-lg">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-auto object-cover max-h-[500px]"
          />
        </div>
      )}

      <div
        className="prose prose-lg dark:prose-invert mx-auto"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.tags && post.tags.length > 0 && (
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wider mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
