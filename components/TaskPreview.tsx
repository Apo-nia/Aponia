"use client";

import React from 'react';
import { TaskStatusManager, TaskStatus, TaskWithStatus } from '@/lib/taskStatusManager';

interface TaskPreviewProps {
  task: TaskWithStatus;
  onClose: () => void;
  onTaskComplete?: (taskId: string) => void;
}

const TaskPreview: React.FC<TaskPreviewProps> = ({ task, onClose, onTaskComplete }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    return TaskStatusManager.getStatusColor(status);
  };

  const getStatusText = (status: TaskStatus) => {
    return TaskStatusManager.getStatusText(status);
  };

  const handleCompleteTask = () => {
    if (onTaskComplete) {
      onTaskComplete(task.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#569ab4] bg-opacity-90 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">{task.title}</h2>
              <p className="text-blue-100">Task ID: {task.id}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-red-300 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Priority and Status */}
          <div className="flex gap-4 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority} Priority
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
              {getStatusText(task.status)}
            </span>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">{task.description}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-800">Due Date</h4>
              <p className="text-gray-600">{new Date(task.dueDate).toLocaleDateString()}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Due Time</h4>
              <p className="text-gray-600">{task.dueTime}</p>
            </div>
            {task.completedAt && (
              <div>
                <h4 className="font-semibold text-gray-800">Completed At</h4>
                <p className="text-gray-600">{new Date(task.completedAt).toLocaleString()}</p>
              </div>
            )}
            {task.autoUpdatedAt && (
              <div>
                <h4 className="font-semibold text-gray-800">Last Updated</h4>
                <p className="text-gray-600">{new Date(task.autoUpdatedAt).toLocaleString()}</p>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {task.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 rounded-b-2xl">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              Close
            </button>
            {task.status !== TaskStatus.DONE && task.status !== TaskStatus.DID_NOT_COMPLETE && (
              <button 
                onClick={handleCompleteTask}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Mark as Complete
              </button>
            )}
            <button className="px-6 py-2 bg-[#569ab4] text-white rounded-lg hover:bg-[#4a8a9e] transition">
              Edit Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskPreview;
