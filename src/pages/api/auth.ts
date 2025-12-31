import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  console.log('Login attempt:', email); // Debug log

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  console.log('Expected:', adminEmail); // Debug log (Warning: Prints to console)

  if (!adminEmail || !adminPassword) {
    console.log('Missing env vars');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  if (email === adminEmail && password === adminPassword) {
    console.log('Login successful');
    res.setHeader(
      'Set-Cookie',
      `admin-auth=true; Path=/; HttpOnly; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`
    );
    return res.status(200).json({ success: true });
  }

  console.log('Login failed: Password mismatch');
  return res.status(401).json({ error: 'Invalid credentials' });
}
