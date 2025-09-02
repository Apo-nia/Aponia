"use client";

import React, { useState, useEffect } from 'react';


interface PomodoroTimerProps {
  userId: string;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ userId }) => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState<'work' | 'break'>('work');

  const incrementSessions = async () => {
    if (!userId) return;
    await fetch('/api/pomodoro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ increment: true, userId }),
    });
  };

  const updateStreak = async () => {
    if (!userId) return;
    try {
      await fetch('/api/streak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'complete' }),
      });
    } catch (error) {
      console.error('Failed to update streak:', error);
    }
  };

  const updateFocusPoints = async () => {
    if (!userId) return;
    try {
      await fetch('/api/focuspoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'add', amount: 25 }),
      });
    } catch (error) {
      console.error('Failed to update focus points:', error);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes !== 0) {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (isActive && minutes === 0 && seconds === 0) {
      if (sessionType === 'work') {
        incrementSessions();
        updateStreak();
        updateFocusPoints(); 
        setSessionType('break');
        setMinutes(5);
        setSeconds(0);
        setIsActive(true);
      } else {
        setSessionType('work');
        setMinutes(25);
        setSeconds(0);
        setIsActive(true);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds, minutes, sessionType, userId]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    if (sessionType === 'work') {
      setMinutes(25);
    } else {
      setMinutes(5);
    }
    setSeconds(0);
  };

  const selectSessionType = (type: 'work' | 'break') => {
    setSessionType(type);
    setIsActive(false);
    if (type === 'work') {
      setMinutes(25);
    } else {
      setMinutes(5);
    }
    setSeconds(0);
  };

  const getButtonClass = (type: 'work' | 'break') => {
    return sessionType === type ? 'bg-teal-600 bg-opacity-20' : '';
  };

  return (
    <div className="bg-[#ace2e9] bg-opacity-70 backdrop-blur-sm p-8 rounded-2xl shadow-lg w-full max-w-md flex flex-col items-center">
      <div className="flex justify-center gap-40 w-full mb-6">
        <button
          onClick={() => selectSessionType('work')}
          className={`bg-[#90d4cf] px-4 py-2 rounded-lg transition-colors ${getButtonClass('work')}`}
        >
          Pomodoro
        </button>
        <button
          onClick={() => selectSessionType('break')}
          className={`bg-[#90d4cf] px-4 py-2 rounded-lg transition-colors ${getButtonClass('break')}`}
        >
          Short Break
        </button>
      </div>

      <div className="text-8xl font-sans my-4 text-gray-800">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      <div className="flex justify-center gap-28 mt-6">
        <button
          onClick={toggleTimer}
          className="bg-[#569aa2] hover:bg-teal-600 text-white font-bold py-3 px-10 rounded-lg text-xl transition-colors"
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={resetTimer}
          className="bg-[#569aa2] hover:bg-teal-600 text-white font-bold py-3 px-10 rounded-lg text-xl transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimer;