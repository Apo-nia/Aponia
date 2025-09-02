"use client";

import React, { useEffect, useState } from 'react';
import TaskPreview from './TaskPreview';
import DayView from './DayView';
import { TaskStatusManager, TaskWithStatus } from '@/lib/taskStatusManager';

interface Task extends TaskWithStatus {
    //Extends the TaskWithStatus interface from status manager
}

interface CalendarProps {
    userId: string;
}

const Calendar: React.FC<CalendarProps> = ({ userId }) => {
    const [tasks, setTasks] = useState<TaskWithStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [taskLoading, setTaskLoading] = useState(false);
    const [selectedDay, setSelectedDay] = useState<{ date: Date; tasks: TaskWithStatus[] } | null>(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch(`/api/calendar?userId=${userId}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch tasks');
                }

                const data = await response.json();
                // Auto-update statuses for all tasks when fetching
                const updatedTasks = TaskStatusManager.updateAllTaskStatuses(data.tasks);
                setTasks(updatedTasks);
            } catch (err) {
                setError('An error occurred while fetching tasks');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [userId]);

    // Auto-update calendar when day changes and update task statuses
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            if (now.getDate() !== currentDate.getDate() || 
                now.getMonth() !== currentDate.getMonth() || 
                now.getFullYear() !== currentDate.getFullYear()) {
                setCurrentDate(now);
            }
            
            // Auto-update task statuses every minute
            setTasks(prevTasks => TaskStatusManager.updateAllTaskStatuses(prevTasks, now));
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [currentDate]);

    const handleTaskClick = async (taskId: string) => {
        setTaskLoading(true);
        setSelectedDay(null);
        
        try {
            const response = await fetch(`/api/task-details/${taskId}?userId=${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch task details');
            }
            const data = await response.json();
            if (data.success) {
                setSelectedTask(data.task);
            }
        } catch (err) {
            console.error('Error fetching task details:', err);
        } finally {
            setTaskLoading(false);
        }
    };

    const closeTaskPreview = () => {
        setSelectedTask(null);
    };

    const handleDayClick = (date: Date, dayTasks: TaskWithStatus[]) => {
        setSelectedDay({ date, tasks: dayTasks });
    };

    const closeDayView = () => {
        setSelectedDay(null);
    };

    const handleTaskCompletion = async (taskId: string) => {
        try {
            const response = await fetch(`/api/task-status/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: 'complete' }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setTasks(prevTasks => 
                        prevTasks.map(task => 
                            task.id === taskId ? data.task : task
                        )
                    );
                }
            }
        } catch (error) {
            console.error('Error completing task:', error);
        }
    };

    const getTaskColor = (task: TaskWithStatus) => {
        
        // Fallback to priority colors
        switch (task.priority) {
            case 'High':
                return 'bg-red-300 hover:bg-red-400';
            case 'Medium':
                return 'bg-yellow-300 hover:bg-yellow-400';
            case 'Low':
                return 'bg-green-300 hover:bg-green-400';
            default:
                return 'bg-gray-400 hover:bg-gray-500';
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const renderCalendar = () => {
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        // Get the day of the week for the first day of the month (0 = Sunday, 1 = Monday, etc.)
        const firstDayOfWeek = startOfMonth.getDay();
        
        // Get previous month's last days
        const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        const prevMonthDays = prevMonth.getDate();
        
        // Day names
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        const calendarDays = [];
        
        // Add previous month's last days for empty cells
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            const prevDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, prevMonthDays - i);
            calendarDays.push({ date: prevDate, isCurrentMonth: false });
        }
        
        // Add all days of the current month
        for (let day = 1; day <= endOfMonth.getDate(); day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            calendarDays.push({ date, isCurrentMonth: true });
        }
        
        // Add next month's first days to complete the grid (ensure we have complete weeks)
        const remainingCells = 42 - calendarDays.length; // 6 weeks * 7 days = 42 cells
        for (let day = 1; day <= remainingCells; day++) {
            const nextDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day);
            calendarDays.push({ date: nextDate, isCurrentMonth: false });
        }

        return (
            <div className="w-full max-w-7xl">
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-6 mb-4">
                    {dayNames.map((dayName) => (
                        <div key={dayName} className="text-center font-bold text-white text-lg py-2">
                            {dayName}
                        </div>
                    ))}
                </div>
                
                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-6">
                    {calendarDays.map((dayInfo, index) => {
                        const { date, isCurrentMonth } = dayInfo;
                        
                        const taskForDay = tasks.filter(
                            (task) => new Date(task.dueDate).toDateString() === date.toDateString()
                        );
                        
                        // Check if this is today
                        const isToday = date.toDateString() === currentDate.toDateString();

                        return (
                            <div 
                                key={date.toISOString()} 
                                className={`border border-white rounded-lg p-4 shadow-lg bg-opacity-50 h-32 flex flex-col ${
                                    isToday 
                                        ? 'bg-[#2171b5] border-blue-500' 
                                        : isCurrentMonth 
                                            ? 'bg-[#9ecae1]' 
                                            : 'bg-gray-300'
                                }`}
                            >
                                <div className={`font-bold text-lg text-center mb-2 flex-shrink-0 ${
                                    isToday 
                                        ? 'text-white' 
                                        : isCurrentMonth 
                                            ? 'text-gray-800' 
                                            : 'text-gray-500'
                                }`}>
                                    {date.getDate()}
                                </div>
                                <div className="flex-1 flex flex-col justify-start space-y-1 overflow-hidden">
                                    {taskForDay.length > 0 && (
                                    <>
                                        
                                        <div
                                            key={taskForDay[0].id}
                                            onClick={() => handleTaskClick(taskForDay[0].id)}
                                            className={`w-full text-xs md:text-sm text-left px-2 py-1 mt-1 rounded-md cursor-pointer text-black transition-all duration-200 hover:scale-[1.02] ${
                                                isCurrentMonth ? getTaskColor(taskForDay[0]) : 'bg-gray-400 hover:bg-gray-500 opacity-70'
                                            }`}
                                        >
                                            <div className="truncate">{taskForDay[0].title}</div>
                                        </div>
                                        
                                        {taskForDay.length > 1 && (
                                            <div
                                                onClick={() => handleDayClick(date, taskForDay)}
                                                className={`w-full text-xs text-center px-2 py-1 mt-1 rounded-md cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                                                    isCurrentMonth 
                                                        ? 'bg-blue-200 hover:bg-blue-600 text-black' 
                                                        : 'bg-gray-500 hover:bg-gray-600 text-black opacity-70'
                                                }`}
                                            >
                                                +{taskForDay.length - 1} more
                                            </div>
                                        )}
                                    </>
                                )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="bg-[#ace2e9] bg-opacity-70 backdrop-blur-sm p-8 rounded-2xl shadow-lg w-full min-h-screen flex flex-col items-center justify-start overflow-y-auto">
                <h1 className="bg-[#569ab4] bg-opacity-70 backdrop-blur-sm p-6 rounded-2xl mb-8 shadow-lg w-1/2 text-center text-3xl font-bold text-white">Monthly Calendar</h1>
                {renderCalendar()}
            </div>
            
            {/* Task Preview Modal */}
            {selectedTask && (
                <TaskPreview 
                    task={selectedTask} 
                    onClose={closeTaskPreview} 
                />
            )}
            
            {/* Day View Modal */}
            {selectedDay && (
                <DayView 
                    date={selectedDay.date}
                    tasks={selectedDay.tasks}
                    onClose={closeDayView}
                    onTaskClick={handleTaskClick}
                />
            )}
        </>
    );
};

export default Calendar;
