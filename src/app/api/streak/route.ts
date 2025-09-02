import { NextResponse } from 'next/server';
import { mockDatabase, type UserData } from '../../../../lib/database';

const RESTORE_COST = 250;
const HOURS_24 = 24 * 60 * 60 * 1000;
const HOURS_48 = 48 * 60 * 60 * 1000;

function isWithin24Hours(date: string): boolean {
    const now = new Date().getTime();
    const targetDate = new Date(date).getTime();
    return now - targetDate < HOURS_24;
}

function isWithin48Hours(date: string): boolean {
    const now = new Date().getTime();
    const targetDate = new Date(date).getTime();
    return now - targetDate < HOURS_48;
}

function updateStreakStatus(userData: UserData): UserData {
    const now = new Date().getTime();
    const lastCompletion = new Date(userData.streak.lastCompletionDate).getTime();
    const timeSinceCompletion = now - lastCompletion;

    // If more than 48 hours without completion or restore, reset streak
    if (timeSinceCompletion > HOURS_48) {
        userData.streak.currentStreak = 0;
        userData.streak.canRestore = false;
        userData.streak.lastRestoreDate = undefined;
        return userData;
    }

    // If between 24-48 hours, allow restore if not already restored today
    if (timeSinceCompletion > HOURS_24) {
        const lastRestore = userData.streak.lastRestoreDate;
        userData.streak.canRestore = !lastRestore || !isWithin24Hours(lastRestore);
    } else {
        userData.streak.canRestore = false;
    }

    return userData;
}

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

    const updatedUser = updateStreakStatus(user);
    mockDatabase[userId] = updatedUser;

    return NextResponse.json({
        success: true,
        streak: updatedUser.streak,
        focusPoints: updatedUser.focusPoints
    });
}

export async function POST(request: Request) {
    const data = await request.json();
    const { userId, action } = data;

    if (!userId) {
        return NextResponse.json({ success: false, error: 'Missing userId' }, { status: 400 });
    }

    const user = mockDatabase[userId];

    if (!user) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const updatedUser = updateStreakStatus(user);

    if (action === 'complete') {
        // User completed a pomodoro session
        const now = new Date().toISOString();
        const lastCompletion = new Date(updatedUser.streak.lastCompletionDate).getTime();
        const currentTime = new Date(now).getTime();

        // Only increment if it's been more than 23 hours since last completion
        if (currentTime - lastCompletion >= (23 * 60 * 60 * 1000)) {
            updatedUser.streak.currentStreak += 1;
            updatedUser.streak.lastCompletionDate = now;
            updatedUser.streak.canRestore = false;
        }
    } else if (action === 'restore') {
        // User wants to restore streak using focus points
        if (!updatedUser.streak.canRestore) {
            return NextResponse.json({ 
                success: false, 
                error: 'Streak cannot be restored at this time' 
            }, { status: 400 });
        }

        if (updatedUser.focusPoints < RESTORE_COST) {
            return NextResponse.json({ 
                success: false, 
                error: 'Insufficient focus points' 
            }, { status: 400 });
        }

        updatedUser.focusPoints -= RESTORE_COST;
        updatedUser.streak.lastCompletionDate = new Date().toISOString();
        updatedUser.streak.canRestore = false;
        updatedUser.streak.lastRestoreDate = new Date().toISOString();
    }

    mockDatabase[userId] = updatedUser;

    return NextResponse.json({
        success: true,
        streak: updatedUser.streak,
        focusPoints: updatedUser.focusPoints
    });
}
