import { getPostBySlug, getPublishedPosts, Post, supabase } from '@/lib/supabase';
import PostContent from '@/components/blog/PostContent';
import Head from 'next/head';
import { useEffect } from 'react';

interface PostPageProps {
  post: Post;
}

export default function PostPage({ post }: PostPageProps) {
  useEffect(() => {
    if (post?.id) {
      const incrementView = async () => {
        try {
          // Check if supabase is configured correctly before attempting RPC
          // Although the client won't crash now, the request would fail
          if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project')) {
             await supabase.rpc('increment_view_count', { post_id: post.id });
          }
        } catch (error) {
          console.error('Failed to increment view count:', error);
        }
      };
      incrementView();
    }
  }, [post?.id]);

  if (!post) return <div>Not Found</div>;

  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.excerpt} />
        {post.cover_image && <meta property="og:image" content={post.cover_image} />}
      </Head>
      <PostContent post={post} />
    </>
  );
}

export async function getStaticPaths() {
  const posts = await getPublishedPosts();
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: { post },
    revalidate: 3600,
  };
}
