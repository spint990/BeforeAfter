export default function GamesLoading() {
  return (
    <div className="flex flex-col">
      {/* Page Header Skeleton */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-4 w-12 bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-4 bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-12 bg-gray-700 rounded animate-pulse" />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="h-9 w-48 bg-gray-700 rounded mb-2 animate-pulse" />
            <div className="h-5 w-56 bg-gray-700 rounded animate-pulse" />
          </div>
          
          <div className="h-10 w-32 bg-gray-700 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Games Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-800 border border-gray-700 animate-pulse"
          >
            <div className="absolute inset-0 bg-gray-700" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="h-5 w-3/4 bg-gray-600 rounded" />
            </div>
            <div className="absolute top-3 right-3">
              <div className="h-5 w-14 bg-gray-600 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
