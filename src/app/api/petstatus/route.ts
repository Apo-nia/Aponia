import { NextResponse } from 'next/server';
import { mockDatabase, UserData } from '../../../../lib/database';

type PetStatusResponse = {
    success: boolean;
    petMood?: 'happy' | 'sad' | 'hungry' | 'sleepy';
    error?: string;
};
// GET: Get pet info for a user
export async function GET(request: Request): Promise<NextResponse<PetStatusResponse>> {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) {
        return NextResponse.json({ success: false, error: 'Missing userId' }, { status: 400 });
    }
    const user = mockDatabase[userId];
    if (!user) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({
        success: true,
        ...user,
    });
}

// PATCH: Update pet mood or type
export async function PATCH(request: Request): Promise<NextResponse<PetStatusResponse>> {
    const body = await request.json();
    const { userId, petMood } = body;
    if (!userId) {
        return NextResponse.json({ success: false, error: 'Missing userId' }, { status: 400 });
    }
    const user = mockDatabase[userId];
    if (!user) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    if (petMood) {
        user.petMood = petMood;
    }
    return NextResponse.json({ success: true, petMood: user.petMood });
}