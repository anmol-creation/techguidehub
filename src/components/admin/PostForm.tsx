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
import { Save, X } from 'lucide-react';

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
             {post ? 'Edit Post' : 'Create New Post'}
          </h1>
          <p className="text-slate-400 mt-1">Fill in the details below to {post ? 'update your' : 'publish a new'} article.</p>
        </div>
        <div className="flex gap-3">
           <button
             type="button"
             onClick={() => router.back()}
             className="btn-secondary flex items-center gap-2"
           >
             <X size={16} />
             Cancel
           </button>
           <button
             type="submit"
             disabled={isSubmitting}
             className="btn-primary flex items-center gap-2"
           >
             <Save size={16} />
             {isSubmitting ? 'Saving...' : (post ? 'Update Post' : 'Create Post')}
           </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Content Column */}
         <div className="lg:col-span-2 space-y-8">
            {/* Basic Info Card */}
            <div className="admin-card p-6 space-y-6">
                <h3 className="text-lg font-medium text-white border-b border-slate-800 pb-4 mb-4">Basic Information</h3>

                <div className="space-y-2">
                  <label className="admin-label">Title</label>
                  <input
                    {...register('title')}
                    className="admin-input text-lg font-medium"
                    placeholder="Enter post title"
                  />
                  {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="admin-label">Slug</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-800 bg-slate-900 text-slate-500 text-sm">
                      /posts/
                    </span>
                    <input
                      {...register('slug')}
                      className="admin-input rounded-l-none"
                      placeholder="post-slug"
                    />
                  </div>
                  {errors.slug && <p className="text-red-400 text-xs mt-1">{errors.slug.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="admin-label">Excerpt</label>
                  <textarea
                    {...register('excerpt')}
                    className="admin-input min-h-[100px] resize-y"
                    placeholder="Brief description for SEO and previews..."
                  />
                </div>
            </div>

             {/* Editor Card */}
            <div className="admin-card overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50">
                    <h3 className="text-lg font-medium text-white">Content</h3>
                </div>
               <div className="p-0">
                 <RichEditor content={content} onChange={setContent} />
               </div>
            </div>
         </div>

         {/* Sidebar Column */}
         <div className="space-y-8">
            {/* Publishing Card */}
            <div className="admin-card p-6">
               <h3 className="text-lg font-medium text-white border-b border-slate-800 pb-4 mb-4">Publishing</h3>
               <div className="space-y-6">
                   <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                      <div className="flex flex-col">
                         <span className="text-sm font-medium text-white">Status</span>
                         <span className="text-xs text-slate-500">{watch('published') ? 'Visible to public' : 'Draft only'}</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" {...register('published')} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                   </div>

                   <div className="space-y-2">
                      <label className="admin-label">Reading Time (min)</label>
                      <input
                        type="number"
                        {...register('reading_time', { valueAsNumber: true })}
                        className="admin-input"
                      />
                   </div>
               </div>
            </div>

            {/* Metadata Card */}
            <div className="admin-card p-6 space-y-6">
               <h3 className="text-lg font-medium text-white border-b border-slate-800 pb-4 mb-4">Metadata</h3>

               <div className="space-y-2">
                  <label className="admin-label">Category</label>
                  <input
                    {...register('category')}
                    className="admin-input"
                    placeholder="e.g. Technology"
                  />
               </div>

               <div className="space-y-2">
                  <label className="admin-label">Tags</label>
                  <input
                    {...register('tags')}
                    className="admin-input"
                    placeholder="react, nextjs, webdev"
                  />
                  <p className="text-xs text-slate-500">Separate tags with commas</p>
               </div>
            </div>

            {/* Cover Image Card */}
            <div className="admin-card p-6 space-y-4">
               <h3 className="text-lg font-medium text-white border-b border-slate-800 pb-4 mb-4">Cover Image</h3>
               <div className="space-y-2">
                  <ImageUploader
                    defaultImage={post?.cover_image}
                    onUpload={(url) => setValue('cover_image', url)}
                  />
                  <input type="hidden" {...register('cover_image')} />
               </div>
            </div>
         </div>
      </div>
    </form>
  );
}
