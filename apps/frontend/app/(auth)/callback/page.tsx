
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CallbackHandlingPage() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push('/home');
    }, 2000);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800">Logging you in</h2>
        <p className="text-gray-500 mt-2">Please wait while we prepare your dashboard...</p>
      </div>
    </div>
  );
}
