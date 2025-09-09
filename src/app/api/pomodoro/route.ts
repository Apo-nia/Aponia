import { NextResponse } from 'next/server';

const userSessions: Record<string, { count: number; last?: string }> = {};

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

type UserRow = {
  session_count: number | null;
  last_session_update?: string | null;
};

function supabaseHeaders() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  return {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
  } as const;
}

async function supabaseSelectSessions(id: string): Promise<UserRow | null> {
  const headers = supabaseHeaders();
  if (!headers) return null;
  const base = SUPABASE_URL!.replace(/\/$/, '');
  const url = `${base}/rest/v1/users?select=session_count,last_session_update&id=eq.${encodeURIComponent(id)}`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`Supabase select failed: ${res.status}`);
  const rows = (await res.json()) as UserRow[];
  if (!Array.isArray(rows) || rows.length === 0) return { session_count: 0, last_session_update: null };
  const row = rows[0];
  return { session_count: row.session_count ?? 0, last_session_update: row.last_session_update ?? null };
}

async function supabaseUpdateSessions(
  id: string,
  sessions: number,
  lastSessionUpdateISO: string
): Promise<UserRow> {
  const headers = supabaseHeaders();
  if (!headers) throw new Error('Supabase not configured');
  const base = SUPABASE_URL!.replace(/\/$/, '');
  const url = `${base}/rest/v1/users?id=eq.${encodeURIComponent(id)}`;

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({ session_count: sessions, last_session_update: lastSessionUpdateISO }),
  });
  if (!res.ok) throw new Error(`Supabase update failed: ${res.status}`);
  const rows = (await res.json()) as UserRow[];
  const row = rows[0] ?? { session_count: sessions, last_session_update: lastSessionUpdateISO };
  return row;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  try {
    const row = await supabaseSelectSessions(id);
    if (row !== null) {
      return NextResponse.json({ sessions: row.session_count ?? 0, lastUpdated: row.last_session_update ?? null });
    }
  } catch (e) {
    console.error('pomodoro GET supabase error', e);
  }

  const fallback = userSessions[id] || { count: 0, last: undefined };
  return NextResponse.json({ sessions: fallback.count, lastUpdated: fallback.last ?? null });
}

export async function POST(request: Request) {
  const data = await request.json();
  const id = data.id as string | undefined;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const increment = Boolean(data.increment);

  try {
    const current = await supabaseSelectSessions(id);
    if (current !== null) {
      const nowISO = new Date().toISOString();
      const newVal = increment ? (current.session_count || 0) + 1 : (current.session_count || 0);
      const updated = await supabaseUpdateSessions(id, newVal, nowISO);
      return NextResponse.json({ sessions: updated.session_count ?? newVal, lastUpdated: updated.last_session_update ?? nowISO });
    }
  } catch (e) {
    console.error('pomodoro POST supabase error', e);
  }

  if (!userSessions[id]) userSessions[id] = { count: 0 };
  if (increment) userSessions[id].count += 1;
  userSessions[id].last = new Date().toISOString();
  return NextResponse.json({ sessions: userSessions[id].count, lastUpdated: userSessions[id].last });
}