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
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <svg
            className="w-4 h-4"
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
              Browse Games
            </h1>
            <p className="text-gray-400">
              {games.length > 0
                ? `${games.length} ${games.length === 1 ? 'game' : 'games'} available for comparison`
                : 'No games available yet'}
            </p>
          </div>
          
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors border border-gray-700"
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
          <div className="bg-gray-800/50 rounded-2xl p-12 border border-gray-700 text-center max-w-md">
            <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-gray-400"
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
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-accent-primary to-accent-secondary text-white rounded-lg font-semibold hover:opacity-90 transition-all"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Your First Game
              </Link>
              
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
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
      )}
    </div>
  );
}
