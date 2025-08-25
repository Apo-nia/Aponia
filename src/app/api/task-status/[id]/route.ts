import { NextRequest, NextResponse } from 'next/server';
import { TaskStatusManager, TaskStatus, TaskWithStatus } from '@/lib/taskStatusManager';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = params.id;
    const body = await request.json();
    const { action } = body; // 'complete' or 'auto-update'

    // Mock database - in real app, this would be your actual database
    const mockTasks: { [key: string]: TaskWithStatus } = {
      '1': {
        id: '1',
        title: 'High Priority Task',
        description: 'Important task that needs attention',
        dueDate: '2025-08-26',
        dueTime: '15:00', // 3 PM
        priority: 'High',
        completedHours: 2,
        tags: ['urgent', 'important'],
        status: TaskStatus.UPCOMING
      },
      '2': {
        id: '2',
        title: 'Medium Priority Task',
        description: 'Regular task',
        dueDate: '2025-08-26',
        dueTime: '17:00', // 5 PM
        priority: 'Medium',
        completedHours: 1,
        tags: ['normal'],
        status: TaskStatus.UPCOMING
      }
    };

    const task = mockTasks[taskId];
    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    let updatedTask: TaskWithStatus;

    if (action === 'complete') {
      // User manually completed the task
      updatedTask = TaskStatusManager.markTaskAsCompleted(task);
    } else {
      // Auto-update based on current time
      updatedTask = TaskStatusManager.updateTaskStatus(task);
    }

    // In real app, save to database here
    mockTasks[taskId] = updatedTask;

    return NextResponse.json({
      success: true,
      task: updatedTask,
      message: action === 'complete' ? 'Task marked as completed' : 'Task status updated'
    });

  } catch (error) {
    console.error('Error updating task status:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update task status' 
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = params.id;
    
    // Mock task data with time-based status
    const mockTask: TaskWithStatus = {
      id: taskId,
      title: 'Sample Task',
      description: 'This is a detailed description of the task.',
      dueDate: '2025-08-26',
      dueTime: '15:00',
      priority: 'High',
      completedHours: 2,
      tags: ['urgent', 'project-alpha'],
      status: TaskStatus.UPCOMING
    };

    // Auto-update status based on current time
    const updatedTask = TaskStatusManager.updateTaskStatus(mockTask);

    // Simulate different tasks
    if (taskId === "1") {
      updatedTask.title = "Complete Project Documentation";
      updatedTask.description = "Write comprehensive documentation for the new project.";
      updatedTask.dueTime = "15:00";
    } else if (taskId === "2") {
      updatedTask.title = "Review Code Changes";
      updatedTask.description = "Review the latest pull requests and provide feedback.";
      updatedTask.dueTime = "17:00";
    }

    return NextResponse.json({
      success: true,
      task: updatedTask
    });

  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch task' },
      { status: 500 }
    );
  }
}
