import { NextResponse } from 'next/server';
import { mockDatabase } from '../../../../lib/database';

export async function GET(request: Request) {
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
        profile: {
            name: user.name,
            focusPoints: user.focusPoints,
            petMood: user.petMood,
            streak: user.streak
        }
    });
}
