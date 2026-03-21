'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to submissions as the default admin page
    router.replace('/admin/submissions');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary mx-auto"></div>
        <p className="mt-4 text-gray-400">Redirecting to submissions...</p>
      </div>
    </div>
  );
}
