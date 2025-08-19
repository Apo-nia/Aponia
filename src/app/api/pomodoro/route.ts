import { NextResponse } from 'next/server';

const userSessions: Record<string, number> = {};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  return NextResponse.json({ sessions: userSessions[userId] || 0 });
}

export async function POST(request: Request) {
  const data = await request.json();
  const userId = data.userId;
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

  if (data.increment) {
    userSessions[userId] = (userSessions[userId] || 0) + 1;
  }
  return NextResponse.json({ sessions: userSessions[userId] || 0 });
}