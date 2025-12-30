import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const response = NextResponse.json({ success: true });

  // Clear the cookie by setting maxAge to 0 and checking other attributes
  response.cookies.set({
    name: 'admin-auth',
    value: '',
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
  });

  return response;
}
