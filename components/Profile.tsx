"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';


interface ProfilePageProps {
  userId: string;
}

export default function ProfilePage({ userId }: ProfilePageProps) {
    const [profileData, setProfileData] = useState<{ name: string; focusPoints: number; petMood: string; streak?: { currentStreak: number; lastCompletionDate: string } } | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`/api/profile?userId=${userId}`);
                const data = await response.json();
                
                if (data.success) {
                    setProfileData(data.profile);
                } else {
                    setError(data.error);
                }
            } catch (err) {
                setError('Failed to fetch profile data');
            }
        };

        fetchProfile();
    }, [userId]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!profileData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-[#ace2e9] bg-opacity-70 backdrop-blur-sm p-10 rounded-2xl shadow-lg w-full max-w-md flex flex-col items-center">
            <h1 className="bg-[#569ab4] bg-opacity-70 backdrop-blur-sm p-5 rounded-xl shadow-lg w-full max-w-md flex flex-col items-center text-2xl font-bold mb-6 text-white">User Profile</h1>
            <p className="w-full text-center text-xl">Name: {profileData.name}</p>
            <p className="w-full text-center text-lg">Focus Points: {profileData.focusPoints}</p>
            <p className="w-full text-center text-lg">Pet Mood: {profileData.petMood}</p>
            <p className="w-full text-center text-lg">Streak Points: 🔥 {profileData.streak?.currentStreak || 0}</p>
            <p className="w-full text-center text-sm text-gray-600 mb-5">
                Last Completion: {profileData.streak?.lastCompletionDate 
                    ? new Date(profileData.streak.lastCompletionDate).toLocaleDateString()
                    : 'No completions yet'
                }
            </p>
            <div className="bg-[#569ad2] hover:bg-[#566aa9] text-white font-bold py-2.5 px-7 rounded-lg text-l transition-colors">
                <Link href="/calendar">
                    View Tasks in Calendar
                </Link>
            </div>
        </div>
    );
};
