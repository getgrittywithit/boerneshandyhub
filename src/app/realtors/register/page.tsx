'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Redirect to login page with signup mode
export default function RealtorRegisterPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page - it handles both login and signup
    router.replace('/realtors/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-500">Redirecting...</div>
    </div>
  );
}
