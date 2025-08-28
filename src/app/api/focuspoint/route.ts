import { NextResponse } from 'next/server';
import { mockDatabase, type UserData } from '../../../../lib/database';

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
        name: user.name,
        focusPoints: user.focusPoints
    });
}

export async function POST(request: Request) {
    const data = await request.json();
    const { userId, amount, action } = data;

    if (!userId) {
        return NextResponse.json({ success: false, error: 'Missing userId' }, { status: 400 });
    }

    const user = mockDatabase[userId];

    if (!user) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    if (action === 'add' && amount) {
        user.focusPoints += amount;
    } else if (action === 'spend' && amount) {
        user.focusPoints = Math.max(0, user.focusPoints - amount);
    }

    return NextResponse.json({
        success: true,
        focusPoints: user.focusPoints
    });
}