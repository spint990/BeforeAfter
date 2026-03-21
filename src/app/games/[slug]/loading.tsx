export default function GameDetailLoading() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Game Header Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
        {/* Cover Image Skeleton */}
        <div className="relative w-24 h-32 sm:w-28 sm:h-36 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0 border border-gray-700">
          <div className="absolute inset-0 bg-gray-700 animate-pulse" />
        </div>

        {/* Game Info Skeleton */}
        <div className="flex-1">
          {/* Breadcrumb Skeleton */}
          <div className="flex items-center gap-2 mb-3">
            <div className="h-4 w-12 bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-4 bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
          </div>

          {/* Title Skeleton */}
          <div className="h-9 w-48 bg-gray-700 rounded mb-3 animate-pulse" />

          {/* Stats Skeleton */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-28 bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Back Button Skeleton */}
        <div className="h-10 w-28 bg-gray-700 rounded-lg animate-pulse self-start" />
      </div>

      {/* Parameter Selector Skeleton */}
      <div className="w-full bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-20 bg-gray-700 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-700 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center gap-3">
          <div className="h-6 w-16 bg-gray-700 rounded-full animate-pulse" />
          <div className="h-5 w-5 bg-gray-700 rounded animate-pulse" />
          <div className="h-6 w-16 bg-gray-700 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Image Comparison Skeleton */}
      <div className="w-full aspect-video rounded-xl bg-gray-800 border border-gray-700 overflow-hidden relative">
        <div className="absolute inset-0 bg-gray-700 animate-pulse" />
        
        {/* Slider Handle Skeleton */}
        <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-1 bg-gray-600">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-600 animate-pulse" />
        </div>

        {/* Loading Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-gray-600 border-t-white rounded-full animate-spin" />
            <span className="text-gray-400 text-sm">Loading comparison...</span>
          </div>
        </div>

        {/* Label Skeletons */}
        <div className="absolute top-4 left-4">
          <div className="h-7 w-16 bg-gray-600/70 rounded-md animate-pulse" />
        </div>
        <div className="absolute top-4 right-4">
          <div className="h-7 w-16 bg-gray-600/70 rounded-md animate-pulse" />
        </div>
      </div>

      {/* Parameters List Skeleton */}
      <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
        <div className="h-4 w-32 bg-gray-700 rounded mb-3 animate-pulse" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-9 w-24 bg-gray-700 rounded-lg animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
