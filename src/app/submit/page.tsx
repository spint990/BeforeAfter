import Link from 'next/link';

export const metadata = {
  title: 'Submit Content | GFXLab',
  description: 'Contribute to our game graphics comparison database by submitting games and photos.',
};

export default function SubmitHubPage() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-full border border-purple-500/20 mb-6">
          <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-sm font-medium text-purple-400">Community Contributions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
          Submit{' '}
          <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Content
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Help us grow our database of game graphics comparisons. Submit new games or contribute 
          comparison photos to existing entries.
        </p>
      </div>

      {/* Important Notice */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-2xl p-5 mb-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />
        <div className="relative flex items-start gap-4">
          <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-1">Submissions Require Approval</h3>
            <p className="text-gray-400 text-sm">
              All submissions are reviewed by our admin team before being published. 
              This helps maintain the quality and accuracy of our database. You'll receive 
              a notification once your submission is reviewed.
            </p>
          </div>
        </div>
      </div>

      {/* Submission Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Submit a Game Card */}
        <Link
          href="/submit/game"
          className="group relative overflow-hidden bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors" />
          <div className="relative">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600/20 to-purple-600/5 rounded-xl flex items-center justify-center flex-shrink-0 border border-purple-500/20 group-hover:border-purple-500/40 transition-colors">
                <svg
                  className="w-7 h-7 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  Submit a Game
                </h2>
                <p className="text-gray-400 text-sm mb-4">
                  Add a new game to our database. Include basic information like the game name, 
                  description, developer, and cover image.
                </p>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Game name and description</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Developer and publisher info</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Cover image upload</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700/50 flex items-center justify-between">
              <span className="text-sm text-gray-500">Takes about 2-3 minutes</span>
              <span className="text-purple-400 flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all">
                Get started
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </Link>

        {/* Submit Photos Card */}
        <Link
          href="/submit/photos"
          className="group relative overflow-hidden bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors" />
          <div className="relative">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-600/20 to-cyan-600/5 rounded-xl flex items-center justify-center flex-shrink-0 border border-cyan-500/20 group-hover:border-cyan-500/40 transition-colors">
                <svg
                  className="w-7 h-7 text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  Submit Photos
                </h2>
                <p className="text-gray-400 text-sm mb-4">
                  Contribute comparison photos for existing games. Select a game, parameter, 
                  and quality level, then upload your screenshot.
                </p>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Choose from existing games</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Select parameter and quality level</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>High-quality image upload</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700/50 flex items-center justify-between">
              <span className="text-sm text-gray-500">Takes about 1-2 minutes</span>
              <span className="text-cyan-400 flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all">
                Get started
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Guidelines */}
      <div className="mt-12 relative overflow-hidden bg-gray-800/20 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="relative">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Submission Guidelines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-400">
            <div>
              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                Game Submissions
              </h4>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 mt-0.5">•</span>
                  <span>Verify the game doesn't already exist in our database</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 mt-0.5">•</span>
                  <span>Use accurate and complete information</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 mt-0.5">•</span>
                  <span>Provide high-quality cover images (min 500x700px)</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-500" />
                Photo Submissions
              </h4>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  <span>Use original screenshots you've captured yourself</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  <span>Capture at native resolution without compression</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  <span>Ensure the parameter settings are clearly visible</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
