export default function Loading() {
  return (
    <div className="flex flex-col">
      {/* Hero Skeleton */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-800/50 via-background to-gray-800/50 py-20 px-4 sm:px-6 lg:px-8 rounded-2xl mb-12 animate-pulse">
        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
          {/* Title skeleton */}
          <div className="h-12 sm:h-14 lg:h-16 w-80 sm:w-96 bg-gray-700 rounded-lg mb-6" />
          
          {/* Description skeleton */}
          <div className="h-6 w-full max-w-2xl bg-gray-700 rounded mb-4" />
          <div className="h-6 w-3/4 max-w-xl bg-gray-700 rounded mb-8" />
          
          {/* Buttons skeleton */}
          <div className="flex gap-4">
            <div className="h-12 w-40 bg-gray-700 rounded-xl" />
            <div className="h-12 w-36 bg-gray-700 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Section Title Skeleton */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 bg-gray-700 rounded mb-2 animate-pulse" />
            <div className="h-4 w-64 bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="hidden sm:block h-5 w-32 bg-gray-700 rounded animate-pulse" />
        </div>
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {[1, 2, 3, 4].map((i) => (
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

      {/* Quick Links Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 animate-pulse"
          >
            <div className="w-12 h-12 bg-gray-700 rounded-lg mb-4" />
            <div className="h-5 w-36 bg-gray-700 rounded mb-3" />
            <div className="h-4 w-full bg-gray-700 rounded mb-2" />
            <div className="h-4 w-2/3 bg-gray-700 rounded mb-4" />
            <div className="h-4 w-24 bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
