export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-10 bg-gray-700 rounded w-48"></div>
        <div className="h-10 bg-gray-700 rounded w-24"></div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-700"></div>
              <div>
                <div className="h-4 bg-gray-700 rounded w-20 mb-2"></div>
                <div className="h-6 bg-gray-700 rounded w-12"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Skeleton */}
      <div>
        <div className="h-6 bg-gray-700 rounded w-32 mb-4"></div>
        <div className="h-12 bg-gray-700 rounded w-40"></div>
      </div>

      {/* Recent Games Skeleton */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-gray-700 rounded w-32"></div>
          <div className="h-4 bg-gray-700 rounded w-20"></div>
        </div>
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="p-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-14 bg-gray-700 rounded"></div>
                  <div>
                    <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-24"></div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-700 rounded"></div>
                  <div className="w-8 h-8 bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
