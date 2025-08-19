// src/app/profile/page.tsx (Server Component)
import { Suspense } from 'react';
import ProfileClient from './profile-client';

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-center">User Profile</h1>
      <Suspense fallback={
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      }>
        <ProfileClient />
      </Suspense>
    </div>
  );
}

