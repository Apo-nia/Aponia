"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ProfilePage() {
    const [profileData, setProfileData] = useState<{ name: string; focusPoints: number; petStatus: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userId = 'user123';

                const focusPointResponse = await fetch(`/api/focuspoint?userId=${userId}`);
                const petStatusResponse = await fetch(`/api/petstatus?userId=${userId}`);

                if (!focusPointResponse.ok || !petStatusResponse.ok) {
                    throw new Error('Failed to fetch profile data');
                }

                const focusPointData = await focusPointResponse.json();
                const petStatusData = await petStatusResponse.json();

                setProfileData({
                    name: focusPointData.name,
                    focusPoints: focusPointData.focusPoints,
                    petStatus: petStatusData.petStatus,
                });
            } catch (err) {
                setError('An error occurred while fetching profile data');
                console.error(err);
            }
        };

        fetchProfile();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!profileData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-[#ace2e9] bg-opacity-70 backdrop-blur-sm p-8 rounded-2xl shadow-lg w-full max-w-md flex flex-col items-center">
            <h1 className="bg-[#569ab4] bg-opacity-70 backdrop-blur-sm p-5 rounded-xl shadow-lg w-full max-w-md flex flex-col items-center text-2xl font-bold mb-6 text-white">User Profile</h1>
            <p className="w-full text-center text-xl">Name: {profileData.name}</p>
            <p className="w-full text-center text-lg">Focus Points: {profileData.focusPoints}</p>
            <p className="w-full text-center text-lg mb-5">Pet Status: {profileData.petStatus}</p>
            <div className="bg-[#569ad2] hover:bg-[#566aa9] text-white font-bold py-2.5 px-7 rounded-lg text-l transition-colors">
                <Link href="/calendar">
                    View Tasks in Calendar
                </Link>
            </div>
        </div>
    );
};
