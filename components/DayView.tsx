"use client";

import React from 'react';
import { TaskStatusManager, TaskStatus, TaskWithStatus } from '@/lib/taskStatusManager';

interface DayViewProps {
    date: Date;
    tasks: TaskWithStatus[];
    onClose: () => void;
    onTaskClick: (taskId: string) => void;
}

const DayView: React.FC<DayViewProps> = ({ date, tasks, onClose, onTaskClick }) => {
    const getTaskColor = (task: TaskWithStatus) => {

        switch (task.priority) {
            case 'High': return 'bg-red-300 hover:bg-red-400';
            case 'Medium': return 'bg-yellow-300 hover:bg-yellow-400';
            case 'Low': return 'bg-green-300 hover:bg-green-400';
            default: return 'bg-gray-300 hover:bg-gray-400';
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-[#569ab4] bg-opacity-90 text-white p-6 rounded-t-2xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold mb-1">Tasks for</h2>
                            <p className="text-blue-100">{formatDate(date)}</p>
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
                <div className="p-6">
                    {tasks.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            <p>No tasks for this day</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {tasks.map((task) => (
                                <div
                                    key={task.id}
                                    onClick={() => onTaskClick(task.id)}
                                    className={`p-4 rounded-lg cursor-pointer text-white transition-all duration-200 hover:scale-[1.02] ${getTaskColor(task)}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-sm mb-1 text-black">{task.title}</h3>
                                            <div className="flex gap-2 text-xs text-gray-800">
                                                <span>{task.priority} Priority</span>
                                                <span>•</span>
                                                <span>{TaskStatusManager.getStatusText(task.status)}</span>
                                                <span>•</span>
                                                <span>{task.dueTime}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 p-4 rounded-b-2xl">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                            {tasks.length} task{tasks.length !== 1 ? 's' : ''} total
                        </span>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DayView;
