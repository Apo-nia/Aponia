import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

type IncomingTask = {
  title?: string;
  description?: string;
  deadline?: string | null;
  reminder?: string | null;
  category_no?: number | string | null;
  priority_no?: number | string | null;
  completed?: boolean;
  task_type?: string;
};

function supabaseHeaders() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  return {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  } as const;
}

function isUUID(v?: string): boolean {
  if (!v) return false;
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(v);
}

function genUUID(): string {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  } catch {}
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function toISOorNull(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === 'string') {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d.toISOString();
  }
  if (value instanceof Date) return value.toISOString();
  return null;
}

function toInt2(value: unknown, defaultVal = 0): number {
  if (value === null || value === undefined || value === '') return defaultVal;
  const n = typeof value === 'string' ? parseInt(value, 10) : Number(value);
  if (!Number.isFinite(n)) return defaultVal;
  return Math.max(-32768, Math.min(32767, Math.trunc(n)));
}

export async function POST(request: Request) {
  try {
    const { userId, schedule } = (await request.json()) as {
      userId?: string;
      schedule?: IncomingTask[];
    };

    if (!schedule || !Array.isArray(schedule)) {
      return NextResponse.json(
        { error: 'schedule array is required' },
        { status: 400 }
      );
    }

    const headers = supabaseHeaders();
    if (!headers || !SUPABASE_URL) {
      return NextResponse.json(
        { error: 'Server database is not configured' },
        { status: 500 }
      );
    }

    const base = SUPABASE_URL.replace(/\/$/, '');
    const url = `${base}/rest/v1/tasks`;
    const nowISO = new Date().toISOString();
    const user_id = isUUID(userId) ? userId! : null; 

    const rows = schedule.map((item: IncomingTask) => {
      const id = genUUID();
      const title = (item.title && String(item.title).trim()) || 'Untitled Task';
      const description = item.description ?? '';
      const deadline = toISOorNull(item.deadline);
      const reminder = toISOorNull(item.reminder);
      const category_no = toInt2(item.category_no, 0);
      const priority_no = toInt2(item.priority_no, 0);
      const completed = Boolean(item.completed);
      const task_type = (item.task_type && String(item.task_type)) || 'schedule';

      return {
        id, 
        user_id, 
        created_at: nowISO, 
        title, 
        description, 
        deadline, 
        reminder, 
        category_no, 
        priority_no, 
        completed,
        task_type, 
      };
    });

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(rows),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('Supabase insert failed:', res.status, text);
      return NextResponse.json(
        { error: 'Failed to save schedule' },
        { status: 500 }
      );
    }

    const inserted = (await res.json()) as Array<{ id: string }>;
    const taskIds = inserted.map((r) => r.id);

    return NextResponse.json({
      success: true,
      message: 'Schedule saved successfully',
      taskIds,
      createdCount: taskIds.length,
    });
  } catch (error) {
    console.error('Error saving schedule:', error);
    return NextResponse.json(
      { error: 'Failed to save schedule' },
      { status: 500 }
    );
  }
}