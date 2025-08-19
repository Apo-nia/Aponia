// src/app/dashboard-client.tsx (Client Component)
"use client";

import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, ChevronUp, Clock, Calendar, CheckCircle2, Circle } from 'lucide-react';

interface User {
  id: string;
  first_name: string | null;
  last_name: string | null;
}

interface Task {
  id: string;
  title: string | null;
  description: string | null;
  deadline: string | null;
  category_no: number | null;
  priority_no: number | null;
  completed: boolean | null;
}

interface DashboardData {
  user: User;
  tasks: {
    incomplete: Task[];
    completed: Task[];
    total: number;
    completedCount: number;
    completionPercentage: number;
  };
}

export default function DashboardClient() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showDialog, setShowDialog] = useState(true);
  const [userIdInput, setUserIdInput] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showCompleted, setShowCompleted] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchDashboardData = async (userId: string) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/dashboard/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setDashboardData(data.data);
        setShowDialog(false);
      } else {
        setError(data.error || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDialogSubmit = () => {
    if (userIdInput.trim()) {
      fetchDashboardData(userIdInput.trim());
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    const firstName = dashboardData?.user?.first_name || 'User';
    
    if (hour < 12) {
      return `Good Morning, ${firstName}`;
    } else if (hour < 18) {
      return `Good Afternoon, ${firstName}`;
    } else {
      return `Good Evening, ${firstName}`;
    }
  };

  const getPriorityColor = (priority: number | null) => {
    if (!priority) return 'bg-gray-500';
    if (priority >= 4) return 'bg-red-500';
    if (priority >= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getCategoryName = (categoryNo: number | null) => {
    const categories = {
      1: 'University',
      2: 'Home',
      3: 'Work'
    };
    return categoryNo ? categories[categoryNo as keyof typeof categories] || 'Other' : 'General';
  };

  const getCategoryColor = (categoryNo: number | null) => {
    const colors = {
      1: 'bg-blue-500',
      2: 'bg-red-500', 
      3: 'bg-orange-500'
    };
    return categoryNo ? colors[categoryNo as keyof typeof colors] || 'bg-gray-500' : 'bg-gray-500';
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'h:mm a');
  };

  // Calendar Component
  const CalendarView = () => {
    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    // Pad the beginning of the month
    const startDay = monthStart.getDay();
    const paddedDays = Array(startDay).fill(null).concat(days);

    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-center">
            {format(today, 'MMMM, yyyy')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-slate-400 font-medium p-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {paddedDays.map((day, index) => (
              <div
                key={index}
                className={`
                  h-8 flex items-center justify-center text-sm rounded
                  ${day === null 
                    ? 'text-transparent' 
                    : isToday(day)
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-300 hover:bg-slate-700'
                  }
                `}
              >
                {day ? format(day, 'd') : ''}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      {/* User ID Input Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Welcome to Dashboard</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="userId" className="text-slate-300">User ID (UUID)</Label>
              <Input
                id="userId"
                value={userIdInput}
                onChange={(e) => setUserIdInput(e.target.value)}
                placeholder="Enter user UUID..."
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            {error && (
              <div className="text-red-400 text-sm">{error}</div>
            )}
            <div className="flex gap-2">
              <Button 
                onClick={handleDialogSubmit}
                disabled={!userIdInput.trim() || loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Loading...' : 'Load Dashboard'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Dashboard */}
      {dashboardData && (
        <div className="container mx-auto px-4 py-6 min-h-screen">
          {/* Header Section */}
          <div className="text-center mb-8">
            {/* Digital Clock */}
            <div className="text-6xl md:text-8xl font-light text-white mb-2 tracking-wider">
              {format(currentTime, 'HH:mm a')}
            </div>
            
            {/* Date */}
            <div className="text-lg text-slate-300 mb-4">
              {format(currentTime, 'EEEE, MMMM d')}
            </div>
            
            {/* Greeting */}
            <div className="text-3xl md:text-4xl text-white font-light mb-8">
              {getGreeting()}
            </div>
          </div>

          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Progress Card */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        className="text-slate-600"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 28}`}
                        strokeDashoffset={`${2 * Math.PI * 28 * (1 - dashboardData.tasks.completionPercentage / 100)}`}
                        className="text-teal-400 transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {dashboardData.tasks.completionPercentage}%
                      </span>
                    </div>
                  </div>
                  <div className="text-white">
                    <p className="text-sm text-slate-300">You are halfway through.</p>
                    <p className="font-semibold">Keep it Going !!</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mood Check Card */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="text-white text-center">
                  <p className="mb-4">{dashboardData.user.first_name || 'User'}, How are you feeling today?</p>
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    Mood Check Up
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Hydration Reminder Card */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="text-white text-center">
                  <p className="mb-4">Don&apos;t forget to stay hydrated!!</p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Water Consumption Checkup
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Today's Tasks Section */}
            <div>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">Today&apos;s Tasks:</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Incomplete Tasks */}
                  {dashboardData.tasks.incomplete.map((task, index) => (
                    <div key={task.id} className="bg-slate-700/50 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <Circle className="w-5 h-5 text-slate-400 mt-0.5" />
                          <div className="flex-1">
                            <h3 className="text-white font-medium">
                              {task.title || 'Untitled Task'}
                            </h3>
                            {task.deadline && (
                              <p className="text-slate-400 text-sm">
                                Today At {formatTime(task.deadline)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`${getCategoryColor(task.category_no)} text-white`}>
                            {getCategoryName(task.category_no)}
                          </Badge>
                          <Badge className="bg-slate-600 text-white">
                            P {task.priority_no || 1}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Completed Tasks Collapsible */}
                  {dashboardData.tasks.completed.length > 0 && (
                    <Collapsible open={showCompleted} onOpenChange={setShowCompleted}>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-between text-slate-300 hover:text-white hover:bg-slate-700"
                        >
                          <span>Completed {dashboardData.tasks.completed.length}</span>
                          {showCompleted ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-2 mt-2">
                        {dashboardData.tasks.completed.map((task) => (
                          <div key={task.id} className="bg-slate-700/30 rounded-lg p-4 opacity-75">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3 flex-1">
                                <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                                <div className="flex-1">
                                  <h3 className="text-slate-300 font-medium line-through">
                                    {task.title || 'Untitled Task'}
                                  </h3>
                                  {task.deadline && (
                                    <p className="text-slate-500 text-sm">
                                      Today At {formatTime(task.deadline)}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge className={`${getCategoryColor(task.category_no)} opacity-75`}>
                                  {getCategoryName(task.category_no)}
                                </Badge>
                                <Badge className="bg-slate-600 opacity-75">
                                  P {task.priority_no || 1}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  )}

                  {/* No tasks message */}
                  {dashboardData.tasks.total === 0 && (
                    <div className="text-center py-8">
                      <p className="text-slate-400">No tasks for today. Great job!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Calendar Section */}
            <div>
              <CalendarView />
            </div>
          </div>

          {/* Load Different User Button */}
          <div className="fixed bottom-6 right-6">
            <Button 
              onClick={() => setShowDialog(true)}
              className="bg-slate-700 hover:bg-slate-600 text-white shadow-lg"
            >
              Switch User
            </Button>
          </div>
        </div>
      )}
    </>
  );
}