import { StreakData } from '../src/types/user';

export const RESTORE_COST = 250;
export const HOURS_24 = 24 * 60 * 60 * 1000;
export const HOURS_48 = 48 * 60 * 60 * 1000;

export function isWithin24Hours(date: string): boolean {
    const now = new Date().getTime();
    const targetDate = new Date(date).getTime();
    return now - targetDate < HOURS_24;
}

export function isWithin48Hours(date: string): boolean {
    const now = new Date().getTime();
    const targetDate = new Date(date).getTime();
    return now - targetDate < HOURS_48;
}

export function getStreakStatus(streakData: StreakData): 'Active' | 'At Risk' | 'Broken' {
    if (!streakData.lastCompletionDate) return 'Broken';
    
    const lastCompletion = new Date(streakData.lastCompletionDate);
    const now = new Date();
    const diffInHours = (now.getTime() - lastCompletion.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours <= 24) {
        return 'Active';
    } else if (diffInHours <= 48 && streakData.canRestore) {
        return 'At Risk';
    } else {
        return 'Broken';
    }
}

export function canRestoreStreak(streakData: StreakData, focusPoints: number): boolean {
    return streakData.canRestore && focusPoints >= RESTORE_COST;
}

export function getTimeSinceLastCompletion(lastCompletionDate: string): string {
    const lastCompletion = new Date(lastCompletionDate);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - lastCompletion.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than an hour ago';
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
}
