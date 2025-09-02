
"use client";

import React, { useState, useEffect } from 'react';

interface StreakData {
  currentStreak: number;
  lastCompletionDate: string;
  canRestore: boolean;
  lastRestoreDate?: string;
}

interface StreakPointsProps {
  userId?: string;
}


const StreakPoints: React.FC<StreakPointsProps> = ({ userId }) => {
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [focusPoints, setFocusPoints] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStreakData = async () => {
    try {
      const response = await fetch(`/api/streak?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setStreakData(data.streak);
        // Get focus points from streak API response
        if (data.focusPoints !== undefined) {
          setFocusPoints(data.focusPoints);
        }
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch streak data');
    }
  };

  const restoreStreak = async () => {
    if (!streakData?.canRestore || focusPoints < 250) return;

    setRestoring(true);
    setError(null);

    try {
      const response = await fetch('/api/streak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          action: 'restore' 
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStreakData(data.streak);
        setFocusPoints(data.focusPoints);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to restore streak');
    } finally {
      setRestoring(false);
    }
  };

  useEffect(() => {
    if (userId) {
      const loadData = async () => {
        setLoading(true);
        await fetchStreakData();
        setLoading(false);
      };

      loadData();
    }
  }, [userId]);

  const getTimeSinceLastCompletion = () => {
    if (!streakData?.lastCompletionDate) return '';
    
    const lastCompletion = new Date(streakData.lastCompletionDate);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - lastCompletion.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than an hour ago';
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
  };

  const getStreakStatus = () => {
    if (!streakData) return 'Loading...';
    
    const lastCompletion = new Date(streakData.lastCompletionDate);
    const now = new Date();
    const diffInHours = (now.getTime() - lastCompletion.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours <= 24) {
      return 'Active';
    } else if (diffInHours <= 48 && streakData.canRestore) {
      return 'At Risk';
    } else {
      return 'Broken';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 text-sm">Error: {error}</p>
      </div>
    );
  }

  const status = getStreakStatus();
  const statusColor = status === 'Active' ? 'text-green-600' : 
                     status === 'At Risk' ? 'text-yellow-600' : 'text-red-600';
  
  const canRestore = streakData?.canRestore && focusPoints >= 250;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Streak Points</h3>
        <span className={`text-sm font-medium ${statusColor}`}>
          {status}
        </span>
      </div>
      
      <div className="text-center mb-4">
        <div className="text-4xl font-bold text-gray-800 mb-2">
          🔥 {streakData?.currentStreak || 0}
        </div>
        <p className="text-gray-600 text-sm">
          {streakData?.currentStreak === 0 
            ? 'Start your streak by completing a Pomodoro session!'
            : streakData?.currentStreak === 1 
            ? 'Day streak'
            : 'Days streak'
          }
        </p>
      </div>

      {streakData?.lastCompletionDate && (
        <div className="text-center mb-4">
          <p className="text-gray-500 text-xs">
            Last completion: {getTimeSinceLastCompletion()}
          </p>
        </div>
      )}

      {status === 'At Risk' && canRestore && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-yellow-800 text-sm mb-3">
            Your streak is at risk! You can restore it using 250 focus points.
          </p>
          <button
            onClick={restoreStreak}
            disabled={restoring}
            className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              restoring 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-yellow-600 text-white hover:bg-yellow-700'
            }`}
          >
            {restoring ? 'Restoring...' : 'Restore Streak (250 FP)'}
          </button>
        </div>
      )}

      {status === 'At Risk' && !canRestore && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800 text-sm">
            {focusPoints < 250 
              ? 'Not enough focus points to restore streak. You need 250 FP.'
              : 'Streak restoration not available. Complete a Pomodoro session to maintain your streak.'
            }
          </p>
        </div>
      )}

      {status === 'Broken' && streakData?.currentStreak === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-gray-600 text-sm text-center">
            Complete a Pomodoro session to start building your streak!
          </p>
        </div>
      )}

      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Focus Points:</span>
          <span className="font-medium">{focusPoints}</span>
        </div>
      </div>
    </div>
  );
};

export default StreakPoints;