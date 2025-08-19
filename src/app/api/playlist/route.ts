import { NextResponse } from 'next/server';

let playlist = [
  { title: "Lofi-1", src: '/music/lofi-1.mp3' },
  { title: "Lofi-2", src: '/music/lofi-2.mp3' },
  { title: "Lofi-3", src: '/music/lofi-3.mp3' },
];

export async function GET() {
  return NextResponse.json(playlist);
}

export async function POST(request: Request) {
  const data = await request.json();
  playlist.push({ title: data.title, src: data.src });
  return NextResponse.json(playlist);
}