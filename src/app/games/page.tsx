import Link from 'next/link';
import GameCard from '@/components/games/GameCard';
import { prisma } from '@/lib/prisma';

// Fetch all games server-side (using Prisma directly)
async function getGames() {
  try {
    const games = await prisma.game.findMany({
      include: {
        parameters: {
          include: {
            _count: {
              select: { qualityLevels: true },
            },
          },
        },
        _count: {
          select: { parameters: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return games;
  } catch (error) {
    console.error('Error fetching games:', error);
    return [];
  }
}

export default async function GamesPage() {
  const games = await getGames();
  
  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-purple-400 transition-colors">
            Home
          </Link>
          <svg
            className="w-4 h-4 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span className="text-white">Games</span>
        </nav>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Browse
              </span>{' '}
              Games
            </h1>
            <p className="text-gray-400">
              {games.length > 0
                ? `${games.length} ${games.length === 1 ? 'game' : 'games'} available for comparison`
                : 'No games available yet'}
            </p>
          </div>
          
          <Link
            href="/admin"
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 bg-gray-800/50 backdrop-blur-sm text-white rounded-xl font-medium border border-gray-700 hover:border-purple-500/50 transition-all duration-300"
          >
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Game
          </Link>
        </div>
      </div>

      {/* Games Grid */}
      {games.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game: { 
            id: string; 
            name: string; 
            slug: string; 
            coverImage: string | null; 
            parameters: { id: string }[] 
          }) => (
            <GameCard
              key={game.id}
              game={game}
              href={`/games/${game.slug}`}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="relative bg-gray-800/30 backdrop-blur-sm rounded-3xl p-12 border border-gray-700/50 text-center max-w-md overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600/20 to-cyan-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-purple-500/20">
                <svg
                  className="w-10 h-10 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-3">
                No Games Yet
              </h2>
              
              <p className="text-gray-400 mb-8">
                Get started by adding your first game to the collection. You can then add parameters and quality levels.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/admin"
                  className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 text-white rounded-xl font-semibold"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-300" />
                  <div className="relative flex items-center gap-2 px-6 py-3 bg-gray-900 rounded-xl">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add Your First Game
                  </div>
                </Link>
                
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-800/50 backdrop-blur-sm text-white rounded-xl font-medium border border-gray-700 hover:border-gray-600 hover:bg-gray-800 transition-all"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
