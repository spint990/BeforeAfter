export default function SubmitLoading() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse">
      {/* Header Skeleton */}
      <div className="text-center mb-12">
        <div className="h-10 sm:h-12 w-64 sm:w-80 bg-gray-700 rounded-lg mx-auto mb-4" />
        <div className="h-5 w-full max-w-2xl bg-gray-700 rounded mx-auto" />
      </div>

      {/* Notice Skeleton */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 mb-8">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-gray-700 rounded flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-40 bg-gray-700 rounded" />
            <div className="h-3 w-full bg-gray-700 rounded" />
          </div>
        </div>
      </div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gray-700 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-6 w-32 bg-gray-700 rounded" />
                <div className="h-4 w-full bg-gray-700 rounded" />
                <div className="h-4 w-3/4 bg-gray-700 rounded" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
              <div className="h-4 w-28 bg-gray-700 rounded" />
              <div className="h-4 w-20 bg-gray-700 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Guidelines Skeleton */}
      <div className="mt-12 bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
        <div className="h-6 w-40 bg-gray-700 rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-5 w-32 bg-gray-700 rounded" />
              <div className="space-y-2">
                <div className="h-3 w-full bg-gray-700 rounded" />
                <div className="h-3 w-full bg-gray-700 rounded" />
                <div className="h-3 w-3/4 bg-gray-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
