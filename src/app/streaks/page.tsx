"use client";

import StreakPoints from '../../../components/StreakPoints';
import Link from 'next/link';

export default function StreaksPage() {
    return (
        <main 
            className="relative flex min-h-screen flex-col items-center justify-center p-12"
            style={{
                backgroundImage: `url('/background.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="flex justify-center items-center w-full max-w-4xl">
                <div className="bg-[#ace2e9] bg-opacity-70 backdrop-blur-sm p-8 rounded-2xl shadow-lg w-full max-w-md">
                    <h1 className="text-2xl font-bold text-center mb-6">Streak Management</h1>
                    <StreakPoints userId="user123" />
                </div>
            </div>
            
            {/* Navigation buttons */}
            <div className="absolute top-10 right-10 flex gap-4">
                <Link href="/profile">
                    <button className="px-6 py-3 bg-[#ace2e9] bg-opacity-70 backdrop-blur-sm rounded-xl shadow-lg hover:bg-[#569ab4] transition">
                        <h2 className="text-lg font-semibold">Profile</h2>
                    </button>
                </Link>
                <Link href="/calendar">
                    <button className="px-6 py-3 bg-[#ace2e9] bg-opacity-70 backdrop-blur-sm rounded-xl shadow-lg hover:bg-[#569ab4] transition">
                        <h2 className="text-lg font-semibold">Calendar</h2>
                    </button>
                </Link>
                <Link href="/">
                    <button className="px-6 py-3 bg-[#ace2e9] bg-opacity-70 backdrop-blur-sm rounded-xl shadow-lg hover:bg-[#569ab4] transition">
                        <h2 className="text-lg font-semibold">Home</h2>
                    </button>
                </Link>
            </div>
        </main>
    );
}
