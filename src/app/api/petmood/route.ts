import { mockDatabase } from '../../../../lib/database';
import { calculatePetMood } from '../../../../lib/petMoodUtils';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.json();
    const { userId } = body;
    if (!userId || !mockDatabase[userId]) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const user = mockDatabase[userId];
    const newMood = calculatePetMood(user);
    user.petMood = newMood;
    return NextResponse.json({ success: true, petMood: newMood });
}
