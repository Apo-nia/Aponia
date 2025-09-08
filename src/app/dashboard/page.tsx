// src/app/page.tsx (Server Component)
import { Suspense } from 'react';
import DashboardClient from './dashboard-client';

export default function HomePage() {
  return (
    <div
      className="min-h-screen page-gradient"
      style={{
        backgroundImage:
          'linear-gradient(to bottom right, var(--g1), var(--g2), var(--g3))',
      }}
    >
      <Suspense fallback={
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      }>
        <DashboardClient />
      </Suspense>
    </div>
  );
}