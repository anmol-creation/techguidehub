import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  res.setHeader(
    'Set-Cookie',
    'admin-auth=; Path=/; HttpOnly; Max-Age=0'
  );

  return res.status(200).json({ success: true });
}
