import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const authCookie = req.cookies['admin-auth'];
  const isAuthenticated = authCookie === 'true';

  if (!isAuthenticated) {
     return res.status(401).json({ error: 'Unauthorized' });
  }

  if (method === 'GET') {
     const { data, error } = await supabaseAdmin.from('posts').select('*').order('created_at', { ascending: false });
     if (error) return res.status(500).json({ error: error.message });
     return res.status(200).json(data);
  }

  if (method === 'POST') {
     const json = req.body;
     if (!json.title || !json.content) {
        return res.status(400).json({ error: 'Title and content required' });
     }
     const { data, error } = await supabaseAdmin.from('posts').insert([json]).select().single();
     if (error) return res.status(500).json({ error: error.message });
     return res.status(200).json(data);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
