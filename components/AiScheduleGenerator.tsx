"use client";

import React, { useState } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime?: string;
  priority: string;
  completedHours: number;
}

const AiScheduleGenerator = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subjects, setSubjects] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedSchedule, setGeneratedSchedule] = useState<Task[] | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneratedSchedule(null);
    setError('');

    try {
      const response = await fetch('/api/generate-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjects }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to generate a schedule. Please try again.');
      } else {
        const data = await response.json();
        if (data.tasks && Array.isArray(data.tasks)) {
          setGeneratedSchedule(data.tasks);
        } else {
          setError('Invalid response format from the server.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to generate a schedule. Please try again.');
    }
    setIsLoading(false);
  };

  const handleAccept = async () => {
    if (!generatedSchedule) return;
    setIsSaving(true);
    try {
      let userId = localStorage.getItem('scheduleUserId');
      if (!userId) {
        userId = Math.random().toString(36).substring(2, 15);
        localStorage.setItem('scheduleUserId', userId);
      }

      const response = await fetch('/api/save-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          schedule: generatedSchedule
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const created = data?.createdCount ?? (Array.isArray(data?.taskIds) ? data.taskIds.length : 0);
        alert(`Schedule saved successfully! Created ${created} task${created === 1 ? '' : 's'}.`);
      } else {
        const errorData = await response.json();
        alert(`Failed to save schedule: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert('Failed to save schedule. Please try again.');
    } finally {
      setIsSaving(false);
    }

    setGeneratedSchedule(null);
    setSubjects('');
    setIsModalOpen(false);
  };

  const handleDecline = () => {
    setGeneratedSchedule(null);
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 px-5 py-3 rounded-full shadow-xl backdrop-blur-xl
                   bg-white/20 border border-white/20 text-gray-900 hover:bg-white/30
                   transition-transform hover:scale-105"
        title="Generate AI Schedule"
      >
        AI Scheduler
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-2xl text-gray-800 border border-gray-200/10">
            <div className="px-6 py-5 border-b border-gray-200/30">
              <h2 className="text-2xl font-bold tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-cyan-600">
                  Generate AI Study Plan
                </span>
              </h2>
            </div>
            
            {generatedSchedule ? (
              <div className="px-6 py-5">
                <h3 className="font-semibold mb-3">Suggested Schedule</h3>
                <div className="max-h-64 overflow-y-auto space-y-3 border border-gray-200/20 p-3 rounded-lg bg-white/10">
                  {generatedSchedule.map((task, index) => (
                    <div key={index} className="bg-white/20 border border-gray-200/20 hover:bg-white/30 transition-colors p-3 rounded-lg">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {task.title}
                            <span className="ml-2 text-xs text-gray-700 font-normal">
                              ({task.dueDate}{task.dueTime ? ` at ${task.dueTime}` : ''})
                            </span>
                          </p>
                          <p className="text-sm text-gray-800 mt-1">{task.description}</p>
                        </div>
                        <span className="text-[11px] px-2 py-1 rounded-full bg-teal-600 text-white/95">
                          Priority: {task.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={handleDecline} className="px-4 py-2 rounded-lg bg-white/30 border border-gray-200/30 hover:bg-white/40 transition-colors">
                    Decline
                  </button>
                  <button onClick={handleAccept} disabled={isSaving} className="px-4 py-2 rounded-lg text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    {isSaving ? 'Saving…' : 'Accept'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="px-6 py-5">
                <div className="mb-4">
                  <label htmlFor="subjects" className="block mb-2 font-semibold">What do you need help with?</label>
                  <textarea
                    id="subjects"
                    value={subjects}
                    onChange={(e) => setSubjects(e.target.value)}
                    className="w-full p-3 rounded-lg bg-white/10 border border-gray-300/10 focus:outline-none focus:ring-2 focus:ring-teal-500/30 placeholder-gray-700 transition"
                    placeholder="Describe your study needs"
                    rows={4}
                    required
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg bg-white/30 border border-gray-200/30 hover:bg-white/40 transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded-lg text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50" disabled={isLoading}>
                    {isLoading ? 'Generating…' : 'Generate'}
                  </button>
                </div>
                {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AiScheduleGenerator;