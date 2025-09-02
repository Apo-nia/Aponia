"use client";

import Profile from '../../../components/Profile';
import StreakPoints from '../../../components/StreakPoints';
import Link from 'next/link';

export default function ProfilePage()  {
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
          <div>
            <Profile userId="user456" />
          </div>
        </div>
        <Link href="/streaks">
          <button className="absolute top-10 right-10 px-6 py-3 bg-[#ace2e9] bg-opacity-70 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:bg-[#569ab4] transition z-10">
            <h2 className="text-lg font-semibold">Streaks</h2>
          </button>
        </Link>

      </main>

    );
};
