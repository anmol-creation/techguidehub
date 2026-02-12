import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';

interface PostInsight {
  id: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
  engagementRate: number;
  createdAt: string;
}

interface InsightsResponse {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  posts: PostInsight[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. Authentication Check
  const authCookie = req.cookies['admin-auth'];
  if (authCookie !== 'true') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // 2. Fetch Data
    // We need to fetch all posts along with their likes, views, and count of comments
    const { data: postsData, error } = await supabaseAdmin
      .from('posts')
      .select('id, title, view_count, likes, created_at, comments(count)', { count: 'exact' });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    if (!postsData) {
      return res.status(200).json({
        totalPosts: 0,
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0,
        posts: []
      });
    }

    // 3. Process & Aggregate Data
    let totalViews = 0;
    let totalLikes = 0;
    let totalComments = 0;

    const posts: PostInsight[] = postsData.map((post: any) => {
      const views = post.view_count || 0;
      const likes = post.likes || 0;
      // supabase returns comments as [{ count: N }] or similar depending on query,
      // but with select('..., comments(count)') and count: 'exact' it usually returns count in the response object wrapper or as an array if not careful.
      // Actually, with `comments(count)`, `post.comments` will be `[{ count: N }]` or similar structure.
      // Let's verify standard Supabase behavior.
      // Usually `comments: { count: number }` isn't directly returned unless we alias it or it's a join.
      // Standard PostgREST: `select=*,comments(count)` -> `comments: [{ count: 5 }]`.
      const commentsCount = post.comments?.[0]?.count || 0;

      totalViews += views;
      totalLikes += likes;
      totalComments += commentsCount;

      // Engagement Rate = (likes + comments) / views
      // Avoid division by zero
      let engagementRate = 0;
      if (views > 0) {
        engagementRate = ((likes + commentsCount) / views) * 100;
      }

      // Round to 2 decimal places
      engagementRate = Math.round(engagementRate * 100) / 100;

      return {
        id: post.id,
        title: post.title,
        views,
        likes,
        comments: commentsCount,
        engagementRate,
        createdAt: post.created_at
      };
    });

    const response: InsightsResponse = {
      totalPosts: posts.length,
      totalViews,
      totalLikes,
      totalComments,
      posts
    };

    return res.status(200).json(response);

  } catch (error: any) {
    console.error('Insights API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
