'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardIndex() {
  const router = useRouter();
  
  // Redirect to the dashboard page
  React.useEffect(() => {
    router.push('/dashboard/page-with-layout');
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Loading Dashboard...</h1>
        <div className="w-16 h-16 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
}
