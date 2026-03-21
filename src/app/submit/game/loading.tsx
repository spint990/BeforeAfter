export default function GameSubmitLoading() {
  return (
    <div className="max-w-2xl mx-auto animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-5 w-24 bg-gray-700 rounded mb-4" />
        <div className="h-9 w-56 bg-gray-700 rounded mb-2" />
        <div className="h-5 w-full max-w-md bg-gray-700 rounded" />
      </div>

      {/* Form Skeleton */}
      <div className="space-y-6">
        {/* Game Name */}
        <div className="space-y-1.5">
          <div className="h-4 w-24 bg-gray-700 rounded" />
          <div className="h-10 w-full bg-gray-800 border border-gray-700 rounded-lg" />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <div className="h-4 w-24 bg-gray-700 rounded" />
          <div className="h-24 w-full bg-gray-800 border border-gray-700 rounded-lg" />
          <div className="h-3 w-32 bg-gray-700 rounded" />
        </div>

        {/* Developer and Publisher */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="h-4 w-24 bg-gray-700 rounded" />
            <div className="h-10 w-full bg-gray-800 border border-gray-700 rounded-lg" />
          </div>
          <div className="space-y-1.5">
            <div className="h-4 w-24 bg-gray-700 rounded" />
            <div className="h-10 w-full bg-gray-800 border border-gray-700 rounded-lg" />
          </div>
        </div>

        {/* Release Year */}
        <div className="space-y-1.5">
          <div className="h-4 w-28 bg-gray-700 rounded" />
          <div className="h-10 w-32 bg-gray-800 border border-gray-700 rounded-lg" />
        </div>

        {/* Cover Image */}
        <div className="space-y-1.5">
          <div className="h-4 w-24 bg-gray-700 rounded" />
          <div className="h-3 w-64 bg-gray-700 rounded mb-2" />
          <div className="aspect-video w-full bg-gray-800 border border-gray-700 rounded-lg" />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <div className="h-4 w-36 bg-gray-700 rounded" />
          <div className="h-10 w-full bg-gray-800 border border-gray-700 rounded-lg" />
          <div className="h-3 w-64 bg-gray-700 rounded" />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <div className="h-10 w-36 bg-gray-700 rounded-lg" />
          <div className="h-10 w-24 bg-gray-700 rounded-lg" />
        </div>

        {/* Notice */}
        <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4">
          <div className="h-4 w-full bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
}
