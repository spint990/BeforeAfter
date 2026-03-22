import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-8">
      {/* 404 Icon */}
      <div className="relative">
        <div className="text-[150px] font-bold text-gray-800 select-none">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-24 h-24 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>

      {/* Message */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
        <p className="text-gray-400 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 rounded-xl transition-all font-medium text-center shadow-lg shadow-purple-500/25"
        >
          Go Home
        </Link>
        <Link
          href="/games"
          className="px-6 py-2.5 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 hover:border-gray-500/50 rounded-xl transition-all font-medium text-center"
        >
          Browse Games
        </Link>
      </div>

      {/* Suggestions */}
      <div className="mt-4 text-center">
        <p className="text-gray-500 text-sm mb-3">You might want to:</p>
        <ul className="text-gray-400 text-sm space-y-1">
          <li>• Check the URL for typos</li>
          <li>• Browse our collection of games</li>
          <li>• Return to the homepage</li>
        </ul>
      </div>
    </div>
  );
}
