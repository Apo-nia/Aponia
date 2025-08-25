// Task Status Manager
// Handles automatic status updates based on time and user actions

export enum TaskStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing', 
  DONE = 'done',
  DID_NOT_COMPLETE = 'did_not_complete'
}

export interface TaskWithStatus {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  priority: string;
  completedHours: number;
  tags: string[];
  status: TaskStatus;
  completedAt?: string;
  autoUpdatedAt?: string;
}

export class TaskStatusManager {
  /**
   * Determines the current status of a task based on current time and due date/time
   */
  static determineTaskStatus(task: TaskWithStatus, currentTime: Date = new Date()): TaskStatus {
    // If user manually marked as done, keep it done
    if (task.status === TaskStatus.DONE && task.completedAt) {
      return TaskStatus.DONE;
    }

    const dueDateTime = new Date(`${task.dueDate}T${task.dueTime}`);
    const now = currentTime;

    // If the due time has passed and task wasn't completed
    if (now > dueDateTime) {
      return TaskStatus.DID_NOT_COMPLETE;
    }

    // If due date is today and within 2 hours of due time
    const hoursUntilDue = (dueDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (hoursUntilDue <= 2 && hoursUntilDue > 0) {
      return TaskStatus.ONGOING;
    }

    // Default to upcoming
    return TaskStatus.UPCOMING;
  }

  /**
   * Updates task status automatically based on current time
   */
  static updateTaskStatus(task: TaskWithStatus, currentTime: Date = new Date()): TaskWithStatus {
    const newStatus = this.determineTaskStatus(task, currentTime);
    
    // Only update if status actually changed
    if (newStatus !== task.status) {
      return {
        ...task,
        status: newStatus,
        autoUpdatedAt: currentTime.toISOString()
      };
    }

    return task;
  }

  /**
   * Marks task as completed by user
   */
  static markTaskAsCompleted(task: TaskWithStatus, completedTime: Date = new Date()): TaskWithStatus {
    return {
      ...task,
      status: TaskStatus.DONE,
      completedAt: completedTime.toISOString()
    };
  }

  /**
   * Gets status color for UI display
   */
  static getStatusColor(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.UPCOMING:
        return 'bg-blue-500 text-white';
      case TaskStatus.ONGOING:
        return 'bg-orange-500 text-white';
      case TaskStatus.DONE:
        return 'bg-green-500 text-white';
      case TaskStatus.DID_NOT_COMPLETE:
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  }

  /**
   * Gets human-readable status text
   */
  static getStatusText(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.UPCOMING:
        return 'Upcoming';
      case TaskStatus.ONGOING:
        return 'Ongoing';
      case TaskStatus.DONE:
        return 'Done';
      case TaskStatus.DID_NOT_COMPLETE:
        return 'Did Not Complete';
      default:
        return 'Unknown';
    }
  }

  /**
   * Bulk update multiple tasks
   */
  static updateAllTaskStatuses(tasks: TaskWithStatus[], currentTime: Date = new Date()): TaskWithStatus[] {
    return tasks.map(task => this.updateTaskStatus(task, currentTime));
  }
}
