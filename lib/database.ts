export async function getUser(userId: string) {
    // Return user data from mockDatabase
    const user = mockDatabase[userId];
    if (!user) {
        return {
            accessories: [],
            focusPoints: 0,
            // ...other user fields...
        };
    }
    // Add accessories array if not present
    return {
        accessories: user.accessories || [],
        focusPoints: user.focusPoints,
        // ...other user fields...
    };
}
export async function updateUserAccessory(name: string, userId: any) {
    // TODO: Implement logic to add accessory to user
    return true;
}
export async function deductFocusPoints(amount: number, userId: any) {
    // TODO: Implement logic to deduct focus points
    return true;
}
import { TaskWithStatus, TaskStatus } from './taskStatusManager';

export type UserData = {
    name: string;
    focusPoints: number;
    accessories: string[];
    petType: 'cow' | 'tutel' | 'frog';
    petMood: 'happy' | 'sad' | 'hungry' | 'sleepy';
    streak: {
        currentStreak: number;
        lastCompletionDate: string;
        canRestore: boolean;
        lastRestoreDate?: string;
    };
    tasks: TaskWithStatus[];
};

export const mockDatabase: { [userId: string]: UserData } = {
    user123: {
        name: 'Lazin Shimran',
        focusPoints: 500,
        accessories: [],
        petType: 'cow',
        petMood: 'happy',
        streak: {
            currentStreak: 3,
            lastCompletionDate: new Date().toISOString(), // ongoing streak
            canRestore: false
        },
        tasks: [
                        {
                            id: '101',
                            title: 'CSE471 Mid',
                            description: "",
                            dueDate: '2025-07-30',
                            dueTime: '14:00',
                            priority: 'Medium',
                            completedHours: 3,
                            tags: ['previous'],
                            status: TaskStatus.DID_NOT_COMPLETE
                        },
                        {
                            id: '1',
                            title: 'ECO101 Quiz 3',
                            description: 'Chapter 3',
                            dueDate: '2025-08-26',
                            dueTime: '15:00',
                            priority: 'High',
                            completedHours: 2,
                            tags: ['urgent', 'important'],
                            status: TaskStatus.DONE
                        },
                        {
                            id: '2',
                            title: 'CSE461',
                            description: 'Assignment 2',
                            dueDate: '2025-08-26',
                            dueTime: '17:00',
                            priority: 'Medium',
                            completedHours: 1,
                            tags: ['normal'],
                            status: TaskStatus.DONE
                        },
                        {
                            id: '3',
                            title: 'Visit Library',
                            description: 'Not necessary',
                            dueDate: '2025-08-26',
                            dueTime: '16:00',
                            priority: 'Low',
                            completedHours: 0,
                            tags: ['minor'],
                            status: TaskStatus.ONGOING
                        },
                        {
                            id: '5',
                            title: 'Team Meeting',
                            description: 'Weekly team sync',
                            dueDate: '2025-08-26',
                            dueTime: '10:00',
                            priority: 'Medium',
                            completedHours: 1,
                            tags: ['meeting'],
                            status: TaskStatus.UPCOMING
                        },
                        {
                            id: '6',
                            title: 'Project Update',
                            description: 'Update project Jira',
                            dueDate: '2025-08-27',
                            dueTime: '14:00',
                            priority: 'Low',
                            completedHours: 2,
                            tags: ['docs'],
                            status: TaskStatus.UPCOMING
                        },
                        {
                            id: '10',
                            title: 'Test Project',
                            description: 'Must be done',
                            dueDate: '2025-09-02',
                            dueTime: '15:00',
                            priority: 'High',
                            completedHours: 0,
                            tags: ['deployment'],
                            status: TaskStatus.UPCOMING
                        },
                        {
                            id: '201',
                            title: 'CSE350 Final',
                            description: 'Chapter 4-7',
                            dueDate: '2025-09-01',
                            dueTime: '09:00',
                            priority: 'High',
                            completedHours: 0,
                            tags: ['next'],
                            status: TaskStatus.UPCOMING
                        },
        ],
    },
    user456: {
            name: 'Jayed Bin Jamil',
            focusPoints: 300,
            accessories: [],
            petType: 'frog',
            petMood: 'sleepy',
            streak: {
                currentStreak: 0,
                lastCompletionDate: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(), // 26 hours ago
                canRestore: true
            },
            tasks: [
                        {
                            id: '7',
                            title: 'CSE450 Assignment Deadline',
                            description: 'Assignment on Theory',
                            dueDate: '2025-08-26',
                            dueTime: '09:00',
                            priority: 'High',
                            completedHours: 0,
                            tags: ['urgent'],
                            status: TaskStatus.ONGOING
                        }
        ],
    },
    user100: {
            name: 'Mahdi Noor',
            focusPoints: 10,
            accessories: [],
            petType: 'tutel',
            petMood: 'sad',
            streak: {
                currentStreak: 0,
                lastCompletionDate: new Date(Date.now() - 50 * 60 * 60 * 1000).toISOString(), // 50 hours ago
                canRestore: false
            },
        tasks: [],
    },
    user789: {
        name: 'Jerin Aktar Anika',
        focusPoints: 150,
        accessories: ['Bow'],
        petType: 'cow',
        petMood: 'happy',
        streak: {
            currentStreak: 2,
            lastCompletionDate: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
            canRestore: false
        },
        tasks: [
            {
                id: '301',
                title: 'MAT120 Final',
                description: 'Geometry',
                dueDate: '2025-09-10',
                dueTime: '10:00',
                priority: 'High',
                completedHours: 0,
                tags: ['exam'],
                status: TaskStatus.UPCOMING
            },
            {
                id: '302',
                title: 'CSE471 Project',
                description: 'Module 3',
                dueDate: '2025-09-12',
                dueTime: '13:00',
                priority: 'Medium',
                completedHours: 2,
                tags: ['project'],
                status: TaskStatus.ONGOING
            },
            {
                id: '303',
                title: 'ENG115 Quiz',
                description: 'World War II',
                dueDate: '2025-09-15',
                dueTime: '15:00',
                priority: 'Low',
                completedHours: 1,
                tags: ['essay'],
                status: TaskStatus.DONE
            }
        ],
    },
};
