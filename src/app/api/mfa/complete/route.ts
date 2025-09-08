import { NextResponse } from 'next/server';

export async function POST() {
  const ttlSeconds = 60 * 60 * 12; // 12 hours; change if you want
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: 'mfa_ok',
    value: '1',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: ttlSeconds,
  });
  return res;
}