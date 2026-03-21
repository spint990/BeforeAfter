export default function PhotosSubmitLoading() {
  return (
    <div className="max-w-2xl mx-auto animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-5 w-24 bg-gray-700 rounded mb-4" />
        <div className="h-9 w-48 bg-gray-700 rounded mb-2" />
        <div className="h-5 w-full max-w-md bg-gray-700 rounded" />
      </div>

      {/* Progress Steps Skeleton */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center">
              <div className="w-10 h-10 bg-gray-700 rounded-full" />
              <div className="h-4 w-24 bg-gray-700 rounded ml-3 hidden sm:block" />
              {i < 3 && (
                <div className="flex-1 h-0.5 bg-gray-700 mx-4 sm:hidden md:block" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content Card Skeleton */}
      <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
        <div className="h-6 w-32 bg-gray-700 rounded mb-4" />
        
        {/* Select Skeleton */}
        <div className="space-y-1.5 mb-4">
          <div className="h-4 w-16 bg-gray-700 rounded" />
          <div className="h-10 w-full bg-gray-800 border border-gray-700 rounded-lg" />
        </div>

        {/* Info Box Skeleton */}
        <div className="mt-4 p-4 bg-gray-700/30 rounded-lg">
          <div className="h-4 w-3/4 bg-gray-700 rounded" />
        </div>
      </div>

      {/* Navigation Buttons Skeleton */}
      <div className="flex justify-between pt-4">
        <div className="h-10 w-24 bg-gray-700 rounded-lg" />
        <div className="h-10 w-28 bg-gray-700 rounded-lg" />
      </div>

      {/* Notice Skeleton */}
      <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 mt-6">
        <div className="h-4 w-full bg-gray-700 rounded" />
      </div>
    </div>
  );
}
