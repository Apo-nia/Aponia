"use client";

import Profile from '../../../components/Profile';

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
        <Profile />
      </main>

    );
};
