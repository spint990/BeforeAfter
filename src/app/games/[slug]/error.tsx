'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GameDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Game detail page error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-8">
      {/* Error Icon */}
      <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
        <svg
          className="w-10 h-10 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      {/* Error Message */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Something went wrong!
        </h2>
        <p className="text-gray-400 max-w-md">
          We encountered an error while loading this game. Please try again or
          browse other games.
        </p>
        {error.digest && (
          <p className="text-gray-500 text-sm mt-2">
            Error ID: {error.digest}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={reset}
          className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 rounded-xl transition-all font-medium shadow-lg shadow-purple-500/25"
        >
          Try Again
        </button>
        <Link
          href="/games"
          className="px-6 py-2.5 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 hover:border-gray-500/50 rounded-xl transition-all font-medium text-center"
        >
          Back to Games
        </Link>
      </div>

      {/* Help Text */}
      <p className="text-gray-500 text-sm">
        If this problem persists, please contact support.
      </p>
    </div>
  );
}
