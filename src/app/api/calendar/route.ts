import { NextResponse } from 'next/server';
import { TaskWithStatus, TaskStatus } from '@/lib/taskStatusManager';

const mockDatabase: { [userId: string]: { tasks: TaskWithStatus[] } } = {
    user123: {
        tasks: [
            // Previous month (July 2025)
            { 
                id: '101', 
                title: 'July Task 1', 
                description: 'Previous month task',
                dueDate: '2025-07-30', 
                dueTime: '14:00',
                priority: 'Medium',
                completedHours: 3,
                tags: ['previous'],
                status: TaskStatus.UPCOMING
            },
            { 
                id: '102', 
                title: 'July Task 2', 
                description: 'Another previous month task',
                dueDate: '2025-07-31', 
                dueTime: '16:00',
                priority: 'Low',
                completedHours: 1,
                tags: ['previous'],
                status: TaskStatus.UPCOMING
            },
            
            // Current month (August 2025)
            { 
                id: '1', 
                title: 'High Priority Task', 
                description: 'Important task that needs attention',
                dueDate: '2025-08-26', 
                dueTime: '15:00',
                priority: 'High',
                completedHours: 2,
                tags: ['urgent', 'important'],
                status: TaskStatus.UPCOMING
            },
            { 
                id: '2', 
                title: 'Medium Priority Task', 
                description: 'Regular task',
                dueDate: '2025-08-26', 
                dueTime: '17:00',
                priority: 'Medium',
                completedHours: 1,
                tags: ['normal'],
                status: TaskStatus.UPCOMING
            },
            { 
                id: '3', 
                title: 'Low Priority Task', 
                description: 'Less urgent task',
                dueDate: '2025-08-26', 
                dueTime: '20:00',
                priority: 'Low',
                completedHours: 0,
                tags: ['minor'],
                status: TaskStatus.UPCOMING
            },
            { 
                id: '4', 
                title: 'Critical Review', 
                description: 'Critical code review',
                dueDate: '2025-08-26', 
                dueTime: '12:00',
                priority: 'High',
                completedHours: 0,
                tags: ['review', 'critical'],
                status: TaskStatus.UPCOMING
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
                title: 'Documentation Update', 
                description: 'Update project documentation',
                dueDate: '2025-08-27', 
                dueTime: '14:00',
                priority: 'Low',
                completedHours: 2,
                tags: ['docs'],
                status: TaskStatus.UPCOMING
            },
            { 
                id: '7', 
                title: 'Code Review', 
                description: 'Review pull requests',
                dueDate: '2025-08-27', 
                dueTime: '16:00',
                priority: 'Medium',
                completedHours: 1,
                tags: ['review'],
                status: TaskStatus.UPCOMING
            },
            { 
                id: '8', 
                title: 'Testing Phase', 
                description: 'Run comprehensive tests',
                dueDate: '2025-08-28', 
                dueTime: '13:00',
                priority: 'High',
                completedHours: 0,
                tags: ['testing'],
                status: TaskStatus.UPCOMING
            },
            { 
                id: '9', 
                title: 'Bug Fixes', 
                description: 'Fix reported bugs',
                dueDate: '2025-08-28', 
                dueTime: '18:00',
                priority: 'High',
                completedHours: 3,
                tags: ['bugs'],
                status: TaskStatus.UPCOMING
            },
            { 
                id: '10', 
                title: 'Deployment', 
                description: 'Deploy to production',
                dueDate: '2025-08-29', 
                dueTime: '15:00',
                priority: 'High',
                completedHours: 0,
                tags: ['deployment'],
                status: TaskStatus.UPCOMING
            },
            { 
                id: '11', 
                title: 'Client Meeting', 
                description: 'Meet with client for feedback',
                dueDate: '2025-08-29', 
                dueTime: '11:00',
                priority: 'Medium',
                completedHours: 1,
                tags: ['client'],
                status: TaskStatus.UPCOMING
            },
            { 
                id: '12', 
                title: 'Weekly Report', 
                description: 'Submit weekly progress report',
                dueDate: '2025-08-30', 
                dueTime: '17:00',
                priority: 'Low',
                completedHours: 0,
                tags: ['report'],
                status: TaskStatus.UPCOMING
            },
            
            // Next month (September 2025)
            { 
                id: '201', 
                title: 'September Task 1', 
                description: 'Next month task',
                dueDate: '2025-09-01', 
                dueTime: '09:00',
                priority: 'High',
                completedHours: 0,
                tags: ['next'],
                status: TaskStatus.UPCOMING
            },
            { 
                id: '202', 
                title: 'September Task 2', 
                description: 'Another next month task',
                dueDate: '2025-09-02', 
                dueTime: '14:00',
                priority: 'Medium',
                completedHours: 0,
                tags: ['next'],
                status: TaskStatus.UPCOMING
            },
            { 
                id: '203', 
                title: 'September Task 3', 
                description: 'Third next month task',
                dueDate: '2025-09-03', 
                dueTime: '16:00',
                priority: 'Low',
                completedHours: 0,
                tags: ['next'],
                status: TaskStatus.UPCOMING
            }
        ],
    },
    user456: {
        tasks: [
            { 
                id: '7', 
                title: 'Urgent Deadline', 
                description: 'Urgent task with tight deadline',
                dueDate: '2025-08-26', 
                dueTime: '09:00',
                priority: 'High',
                completedHours: 0,
                tags: ['urgent'],
                status: TaskStatus.UPCOMING
            },
        ],
    },
};


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
        tasks: user.tasks,
    });
}