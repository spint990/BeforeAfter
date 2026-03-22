export default function QuickCompareLoading() {
  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Skeleton */}
        <div className="text-center mb-8">
          <div className="h-9 bg-gray-800/50 rounded-xl w-64 mx-auto mb-3 animate-pulse" />
          <div className="h-5 bg-gray-800/50 rounded-xl w-96 mx-auto animate-pulse" />
        </div>

        {/* Upload Areas Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Before Image Skeleton */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-gray-700 animate-pulse" />
              <div className="h-6 bg-gray-800 rounded w-28 animate-pulse" />
            </div>
            <div className="aspect-video rounded-lg border-2 border-dashed border-gray-700 bg-gray-800/50 animate-pulse" />
            <div className="mt-3 h-10 bg-gray-800/50 rounded-xl animate-pulse" />
          </div>

          {/* After Image Skeleton */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-gray-700 animate-pulse" />
              <div className="h-6 bg-gray-800 rounded w-28 animate-pulse" />
            </div>
            <div className="aspect-video rounded-lg border-2 border-dashed border-gray-700 bg-gray-800/50 animate-pulse" />
            <div className="mt-3 h-10 bg-gray-800/50 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Button Skeleton */}
        <div className="flex justify-center">
          <div className="h-12 bg-gray-800/50 rounded-xl w-48 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
