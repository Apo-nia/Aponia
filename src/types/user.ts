export interface User {
    id: string;
    name: string;
    focusPoints: number;
}

export interface StreakData {
    currentStreak: number;
    lastCompletionDate: string; // ISO date string
    canRestore: boolean;
    lastRestoreDate?: string; // ISO date string
}