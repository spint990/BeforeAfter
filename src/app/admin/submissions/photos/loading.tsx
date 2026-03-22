export default function PhotoSubmissionsLoading() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400">
        <div className="h-4 bg-gray-700 rounded w-16 animate-pulse"></div>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <div className="h-4 bg-gray-700 rounded w-20 animate-pulse"></div>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <div className="h-4 bg-gray-700 rounded w-28 animate-pulse"></div>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 bg-gray-700 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-700 rounded w-64 animate-pulse"></div>
        </div>
        <div className="h-4 bg-gray-700 rounded w-32 animate-pulse"></div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex gap-1 bg-gray-800 p-1 rounded-lg">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 bg-gray-700 rounded-md w-20 animate-pulse"></div>
          ))}
        </div>
        <div className="h-10 bg-gray-700 rounded-lg w-40 animate-pulse"></div>
      </div>

      {/* Table */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
        <div className="p-4">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-700 rounded animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-700 rounded w-32 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded w-48 animate-pulse"></div>
                </div>
                <div className="h-6 bg-gray-700 rounded w-20 animate-pulse"></div>
                <div className="h-8 bg-gray-700 rounded w-24 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
