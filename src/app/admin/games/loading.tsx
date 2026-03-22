export default function AdminGamesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gray-700 rounded w-24"></div>
        <div className="h-10 bg-gray-700 rounded w-28"></div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
        {/* Table Header */}
        <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-700 bg-gray-800/50">
          <div className="h-4 bg-gray-700 rounded w-20"></div>
          <div className="h-4 bg-gray-700 rounded w-16"></div>
          <div className="h-4 bg-gray-700 rounded w-24 ml-auto"></div>
        </div>

        {/* Table Rows */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-4 border-b border-gray-700 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-16 bg-gray-700 rounded"></div>
              <div className="h-5 bg-gray-700 rounded w-32"></div>
            </div>
            <div className="h-4 bg-gray-700 rounded w-24"></div>
            <div className="h-5 bg-gray-700 rounded w-8 ml-auto"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-700 rounded"></div>
              <div className="w-8 h-8 bg-gray-700 rounded"></div>
              <div className="w-8 h-8 bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Skeleton */}
      <div className="h-4 bg-gray-700 rounded w-24"></div>
    </div>
  );
}
