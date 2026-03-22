export default function PhotoSubmissionReviewLoading() {
  return (
    <div className="max-w-5xl animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <div className="h-4 bg-gray-700 rounded w-20"></div>
        <div className="h-4 bg-gray-700 rounded w-4"></div>
        <div className="h-4 bg-gray-700 rounded w-24"></div>
        <div className="h-4 bg-gray-700 rounded w-4"></div>
        <div className="h-4 bg-gray-700 rounded w-32"></div>
        <div className="h-4 bg-gray-700 rounded w-4"></div>
        <div className="h-4 bg-gray-700 rounded w-32"></div>
      </div>

      {/* Header skeleton */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="h-8 bg-gray-700 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-48"></div>
        </div>
        <div className="h-6 bg-gray-700 rounded w-24"></div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Image Preview skeleton */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
          <div className="p-4 border-b border-gray-700">
            <div className="h-6 bg-gray-700 rounded w-32"></div>
          </div>
          <div className="p-4">
            <div className="h-4 bg-gray-700 rounded w-64 mb-4"></div>
            <div className="aspect-video bg-gray-700 rounded-lg"></div>
          </div>
        </div>

        {/* Submission Details skeleton */}
        <div className="space-y-6">
          {/* Details card */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <div className="h-6 bg-gray-700 rounded w-40"></div>
            </div>
            <div className="p-4 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <div className="h-4 bg-gray-700 rounded w-20 mb-2"></div>
                  <div className="h-5 bg-gray-700 rounded w-32"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons skeleton */}
          <div className="flex items-center gap-4">
            <div className="h-10 bg-gray-700 rounded w-28"></div>
            <div className="h-10 bg-gray-700 rounded w-24"></div>
            <div className="h-4 bg-gray-700 rounded w-16 ml-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
