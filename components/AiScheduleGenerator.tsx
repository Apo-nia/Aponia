"use client";

import React, { useState } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  completedHours: number;
}

const AiScheduleGenerator = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subjects, setSubjects] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
        body: JSON.stringify({ subjects, deadline }),
      });

      if (!response.ok) {
        setError('Failed to generate a schedule. Please try again.');
      } else {
        const data = await response.json();
        setGeneratedSchedule(data.tasks);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to generate a schedule. Please try again.');
    }
    setIsLoading(false);
  };

  const handleAccept = async () => {
    if (!generatedSchedule) return;
    
    alert("Schedule accepted!");
    
    setGeneratedSchedule(null);
    setSubjects('');
    setDeadline('');
    setIsModalOpen(false);
  };

  const handleDecline = () => {
    setGeneratedSchedule(null);
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 bg-teal-600 text-white p-4 rounded-full shadow-lg hover:bg-teal-700 transition-transform hover:scale-110"
        title="Generate AI Schedule"
      >
        AI Scheduler
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg text-black">
            <h2 className="text-2xl font-bold mb-4">Generate AI Study Plan</h2>
            
            {generatedSchedule ? (
              <div>
                <h3 className="font-semibold mb-2">Suggested Schedule:</h3>
                <div className="max-h-64 overflow-y-auto space-y-2 border p-3 rounded-md">
                  {generatedSchedule.map((task, index) => (
                    <div key={index} className="bg-gray-100 p-2 rounded">
                      <p className="font-bold">{task.title} ({task.dueDate})</p>
                      <p className="text-sm">{task.description}</p>
                      <p className="text-xs text-gray-600">Priority: {task.priority}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button onClick={handleDecline} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Decline</button>
                  <button onClick={handleAccept} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Accept</button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="subjects" className="block mb-2 font-semibold">Subjects/Topics</label>
                  <textarea
                    id="subjects"
                    value={subjects}
                    onChange={(e) => setSubjects(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="e.g., I have subject A and subject B to study, A will take 5 hours and B will take 3 hours. B is harder than A. I'm busy from 2PM to 4PM on Monday."
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="deadline" className="block mb-2 font-semibold">Deadline</label>
                  <input
                    type="date"
                    id="deadline"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700" disabled={isLoading}>
                    {isLoading ? 'Generating...' : 'Generate'}
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