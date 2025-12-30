import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query: { id }, method } = req;
  const postId = id as string;

  const authCookie = req.cookies['admin-auth'];
  const isAuthenticated = authCookie === 'true';

  if (!isAuthenticated) return res.status(401).json({ error: 'Unauthorized' });

  if (method === 'GET') {
     const { data, error } = await supabaseAdmin.from('posts').select('*').eq('id', postId).single();
     if (error) return res.status(404).json({ error: 'Not found' });
     return res.status(200).json(data);
  }

  if (method === 'PUT') {
     const json = req.body;
     const { id: _, created_at, ...updateData } = json;
     const { data, error } = await supabaseAdmin.from('posts').update({ ...updateData, updated_at: new Date().toISOString() }).eq('id', postId).select().single();
     if (error) return res.status(500).json({ error: error.message });
     return res.status(200).json(data);
  }

  if (method === 'DELETE') {
     const { error } = await supabaseAdmin.from('posts').delete().eq('id', postId);
     if (error) return res.status(500).json({ error: error.message });
     return res.status(200).json({ message: 'Deleted' });
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
