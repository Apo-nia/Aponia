import { NextResponse } from 'next/server';

const mockDatabase: { [userId: string]: { name: string; focusPoints: number; petStatus: string } } = {
    user123: { name: 'Lazin Shimran', focusPoints: 500, petStatus: 'Happy' },
    user456: { name: 'Jayed Bin Jamil', focusPoints: 300, petStatus: 'Neutral' },
};

type PetStatusResponse = {
    success: boolean;
    petStatus?: string;
    error?: string;
};

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
        petStatus: user.petStatus,
    });
}