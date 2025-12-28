import Link from 'next/link';
import { Post } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-800 transition-all hover:shadow-xl">
      {post.cover_image && (
        <div className="flex-shrink-0 h-48 w-full relative">
          <img
            className="h-full w-full object-cover"
            src={post.cover_image}
            alt={post.title}
          />
        </div>
      )}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div className="flex-1">
          {post.category && (
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
              <Link href={`/category/${post.category}`} className="hover:underline">
                {post.category}
              </Link>
            </p>
          )}
          <Link href={`/posts/${post.slug}`} className="block mt-2">
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              {post.title}
            </p>
            <p className="mt-3 text-base text-gray-500 dark:text-gray-400 line-clamp-3">
              {post.excerpt}
            </p>
          </Link>
        </div>
        <div className="mt-6 flex items-center">
          <div className="flex-shrink-0">
            <span className="sr-only">{post.reading_time} min read</span>
          </div>
          <div className="">
            <div className="flex space-x-1 text-sm text-gray-500 dark:text-gray-400">
              <time dateTime={post.published_at}>{post.published_at ? formatDate(post.published_at) : 'Draft'}</time>
              <span aria-hidden="true">&middot;</span>
              <span>{post.reading_time} min read</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
