import { NextResponse } from 'next/server';
import { getUser, updateUserAccessory, deductFocusPoints } from '../../../../lib/database';

const accessoryPrices = { Bow: 250, Shade: 350, Tie: 500 };

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }
  const user = await getUser(userId);
  return NextResponse.json({
    owned: user.accessories || [],
    points: user.focusPoints || 0,
  });
}

export async function POST(req: Request) {
  const { name, userId } = await req.json();
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  if (!(name in accessoryPrices)) return NextResponse.json({ error: 'Invalid accessory' }, { status: 400 });
  const user = await getUser(userId);
  if ((user.accessories as string[] || []).includes(name)) {
    return NextResponse.json({ error: 'Already owned', owned: user.accessories, points: user.focusPoints });
  }
  if ((user.focusPoints || 0) < accessoryPrices[name as keyof typeof accessoryPrices]) {
    return NextResponse.json({ error: 'Not enough points', owned: user.accessories, points: user.focusPoints });
  }
  await updateUserAccessory(name, userId);
  await deductFocusPoints(accessoryPrices[name as keyof typeof accessoryPrices], userId);
  const updatedUser = await getUser(userId);
  return NextResponse.json({ owned: updatedUser.accessories, points: updatedUser.focusPoints });
}
