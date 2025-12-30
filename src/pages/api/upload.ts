import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const authCookie = req.cookies['admin-auth'];
  if (authCookie !== 'true') return res.status(401).json({ error: 'Unauthorized' });

  const form = formidable({});

  try {
    const [fields, files] = await form.parse(req);
    const file = files.file?.[0];

    if (!file) return res.status(400).json({ error: 'No file' });

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project')) {
         return res.status(200).json({ url: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' });
    }

    const fileContent = fs.readFileSync(file.filepath);
    const name = `${Date.now()}-${file.originalFilename}`;

    const { error } = await supabaseAdmin
            .storage.from('images').upload(name, fileContent, {
                contentType: file.mimetype || 'application/octet-stream'
            });

    if (error) throw error;

    const { data: { publicUrl } } = supabaseAdmin.storage.from('images').getPublicUrl(name);
    return res.status(200).json({ url: publicUrl });

  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Upload failed' });
  }
}
