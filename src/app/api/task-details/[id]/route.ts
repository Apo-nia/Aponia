import { NextRequest, NextResponse } from 'next/server';
import { mockDatabase } from '../../../../../lib/database';
import { TaskWithStatus } from '../../../../../lib/taskStatusManager';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = params.id;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user123'; // Default to user123

    const user = mockDatabase[userId];
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Find the task in user's tasks
    const task: TaskWithStatus | undefined = user.tasks.find((t: TaskWithStatus) => t.id === taskId);
    
    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      task: task
    });

  } catch (error) {
    console.error('Error fetching task details:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch task details' 
      },
      { status: 500 }
    );
  }
}
