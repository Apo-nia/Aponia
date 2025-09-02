export function getPetMood({ petMood, hasOngoingStreak, canRestore, hoursSinceStreak }: {
  petMood: string;
  hasOngoingStreak: boolean;
  canRestore: boolean;
  hoursSinceStreak: number;
}): string {
  let displayMood = petMood;
  if (hasOngoingStreak) {
    displayMood = 'happy';
  } else if (canRestore) {
    displayMood = 'hungry';
  } else if (hoursSinceStreak >= 24 && hoursSinceStreak < 48) {
    displayMood = 'sleepy';
  } else if (hoursSinceStreak >= 48) {
    displayMood = 'sad';
  } else {
    displayMood = petMood;
  }
  return displayMood;
}
