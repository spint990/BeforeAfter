export default function GameSubmissionReviewLoading() {
  return (
    <div className="max-w-4xl animate-pulse">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <div className="h-4 bg-gray-700 rounded w-16 animate-pulse"></div>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <div className="h-4 bg-gray-700 rounded w-20 animate-pulse"></div>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <div className="h-4 bg-gray-700 rounded w-28 animate-pulse"></div>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <div className="h-4 bg-gray-700 rounded w-24 animate-pulse"></div>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="h-8 bg-gray-700 rounded w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-700 rounded w-48 animate-pulse"></div>
        </div>
        <div className="h-8 bg-gray-700 rounded w-24 animate-pulse"></div>
      </div>

      {/* Submission Details */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-700">
          <div className="h-6 bg-gray-700 rounded w-40 mb-4 animate-pulse"></div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {/* Cover Image placeholder */}
            <div className="md:col-span-2">
              <div className="h-4 bg-gray-700 rounded w-24 mb-2 animate-pulse"></div>
              <div className="w-48 h-64 bg-gray-700 rounded-lg animate-pulse"></div>
            </div>

            {/* Fields */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i}>
                <div className="h-4 bg-gray-700 rounded w-20 mb-1 animate-pulse"></div>
                <div className="h-5 bg-gray-700 rounded w-32 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <div className="h-10 bg-gray-700 rounded w-28 animate-pulse"></div>
        <div className="h-10 bg-gray-700 rounded w-24 animate-pulse"></div>
        <div className="h-4 bg-gray-700 rounded w-16 ml-auto animate-pulse"></div>
      </div>
    </div>
  );
}
