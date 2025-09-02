// Utility to determine pet mood based on study and planner usage
import { UserData } from './database';
import { TaskStatus } from './taskStatusManager';

export function calculatePetMood(user: UserData): 'happy' | 'sad' | 'hungry' | 'sleepy' {
    // Example logic:
    // - happy: completed 2+ tasks today
    // - sad: no completed tasks today
    // - hungry: 1 completed task today
    // - sleepy: no planner usage (no tasks with dueDate today)
    const today = new Date().toISOString().slice(0, 10);
    const completedToday = user.tasks.filter(
        t => t.status === TaskStatus.DONE && t.dueDate === today
    ).length;
    const hasPlannerTask = user.tasks.some(t => t.dueDate === today);

    if (!hasPlannerTask) return 'sleepy';
    if (completedToday >= 2) return 'happy';
    if (completedToday === 1) return 'hungry';
    return 'sad';
}
