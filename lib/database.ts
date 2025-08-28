import { TaskWithStatus, TaskStatus } from './taskStatusManager';

interface UserData {
    name: string;
    focusPoints: number;
    petStatus: string;
    streak: {
        currentStreak: number;
        lastCompletionDate: string;
        canRestore: boolean;
        lastRestoreDate?: string;
    };
    tasks: TaskWithStatus[];
}

export const mockDatabase: { [userId: string]: UserData } = {
    user123: { 
        name: 'Lazin Shimran', 
        focusPoints: 500, 
        petStatus: 'Happy',
        streak: {
            currentStreak: 3,
            lastCompletionDate: new Date().toISOString(),
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
                dueDate: '2025-08-02', 
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
        ]
    },
    user456: { 
        name: 'Jayed Bin Jamil', 
        focusPoints: 300, 
        petStatus: 'Neutral',
        streak: {
            currentStreak: 1,
            lastCompletionDate: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(), // 25 hours ago
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
        ]
    },
    user100: { 
        name: 'Mahdi Noor', 
        focusPoints: 10, 
        petStatus: 'Sad',
        streak: {
            currentStreak: 0,
            lastCompletionDate: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(), // 25 hours ago
            canRestore: true
        },
        tasks: []
    },
};

export type { UserData };
