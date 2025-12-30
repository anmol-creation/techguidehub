import { getPostBySlug, getPublishedPosts, Post } from '@/lib/supabase';
import PostContent from '@/components/blog/PostContent';
import Head from 'next/head';

interface PostPageProps {
  post: Post;
}

export default function PostPage({ post }: PostPageProps) {
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
