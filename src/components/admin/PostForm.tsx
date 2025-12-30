'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/router';
import RichEditor from './RichEditor';
import ImageUploader from './ImageUploader';
import { slugify } from '@/lib/utils';
import { Post } from '@/lib/supabase';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().optional(),
  category: z.string().optional(),
  tags: z.string().optional(), // Comma separated string for input
  cover_image: z.string().optional(),
  reading_time: z.number().int().min(1),
  published: z.boolean(),
});

type PostFormValues = z.infer<typeof postSchema>;

interface PostFormProps {
  post?: Post;
}

export default function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const [content, setContent] = useState(post?.content || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title || '',
      slug: post?.slug || '',
      excerpt: post?.excerpt || '',
      category: post?.category || '',
      tags: post?.tags?.join(', ') || '',
      cover_image: post?.cover_image || '',
      reading_time: post?.reading_time || 5,
      published: post?.published || false,
    },
  });

  // Auto-generate slug from title if creating new post
  const title = watch('title');

  useEffect(() => {
    if (!post && title) {
        const currentSlug = watch('slug');
        if (!currentSlug) {
            setValue('slug', slugify(title));
        }
    }
  }, [title, post, setValue, watch]);

  const onSubmit = async (data: PostFormValues) => {
    setIsSubmitting(true);
    setError(null);

    const postData = {
      ...data,
      content,
      tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      published_at: data.published ? (post?.published_at || new Date().toISOString()) : null,
    };

    try {
      const url = post ? `/api/posts/${post.id}` : '/api/posts';
      const method = post ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error('Failed to save post');
      }

      router.push('/admin/posts');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <input
            {...register('title')}
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            placeholder="Post Title"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Slug</label>
          <input
            {...register('slug')}
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            placeholder="post-slug"
          />
          {errors.slug && <p className="text-red-500 text-sm">{errors.slug.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Excerpt</label>
        <textarea
          {...register('excerpt')}
          className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 h-24"
          placeholder="Brief description for SEO and previews"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Content</label>
        <RichEditor content={content} onChange={setContent} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <input
            {...register('category')}
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            placeholder="Technology"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tags (comma separated)</label>
          <input
            {...register('tags')}
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            placeholder="react, nextjs, webdev"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Cover Image</label>
        <ImageUploader
          defaultImage={post?.cover_image}
          onUpload={(url) => setValue('cover_image', url)}
        />
        <input type="hidden" {...register('cover_image')} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Reading Time (minutes)</label>
          <input
            type="number"
            {...register('reading_time', { valueAsNumber: true })}
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          {...register('published')}
          id="published"
          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
        <label htmlFor="published" className="text-sm font-medium">Publish Post</label>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : (post ? 'Update Post' : 'Create Post')}
        </button>
      </div>
    </form>
  );
}
