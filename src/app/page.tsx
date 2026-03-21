import Link from 'next/link';
import GameCard from '@/components/games/GameCard';
import { prisma } from '@/lib/prisma';

// Fetch featured games server-side (using Prisma directly)
async function getFeaturedGames() {
  try {
    const games = await prisma.game.findMany({
      take: 4,
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
    console.error('Error fetching featured games:', error);
    return [];
  }
}

// Fetch latest games server-side (using Prisma directly)
async function getLatestGames() {
  try {
    const games = await prisma.game.findMany({
      take: 8,
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
    console.error('Error fetching latest games:', error);
    return [];
  }
}

export default async function Home() {
  const games = await getFeaturedGames();
  const latestGames = await getLatestGames();
  
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-accent-primary/20 via-background to-accent-secondary/20 py-20 px-4 sm:px-6 lg:px-8 rounded-2xl mb-12">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-primary/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-secondary/30 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            <span className="bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
              Graphics Comparison Tool
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-2xl animate-fade-in animation-delay-100">
            Compare game graphics side by side. See the difference between quality settings with our interactive slider interface.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center animate-fade-in animation-delay-200">
            <Link
              href="/games"
              className="px-8 py-4 bg-gradient-to-r from-accent-primary to-accent-secondary text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-lg shadow-accent-primary/25"
            >
              Browse Games
            </Link>
            <Link
              href="/compare/quick"
              className="px-8 py-4 bg-gray-800 text-white rounded-xl font-semibold text-lg hover:bg-gray-700 transition-all duration-300 border border-gray-700 hover:border-gray-600"
            >
              Quick Compare
            </Link>
            <Link
              href="/submit"
              className="px-8 py-4 bg-gray-800 text-white rounded-xl font-semibold text-lg hover:bg-gray-700 transition-all duration-300 border border-gray-700 hover:border-gray-600"
            >
              Submit Content
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Quick Compare Card */}
        <Link
          href="/compare/quick"
          className="group relative overflow-hidden bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-accent-primary/50 transition-all duration-300"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/10 rounded-full blur-2xl group-hover:bg-accent-primary/20 transition-colors" />
          <div className="relative z-10">
            <div className="w-12 h-12 bg-accent-primary/20 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Quick Comparison</h3>
            <p className="text-gray-400">
              Upload and compare any two images instantly. Perfect for quick quality comparisons without setting up a full game entry.
            </p>
            <div className="mt-4 flex items-center text-accent-primary font-medium">
              Start Comparing
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </Link>

        {/* Community Submissions Card */}
        <Link
          href="/submit"
          className="group relative overflow-hidden bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-accent-secondary/50 transition-all duration-300"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-secondary/10 rounded-full blur-2xl group-hover:bg-accent-secondary/20 transition-colors" />
          <div className="relative z-10">
            <div className="w-12 h-12 bg-accent-secondary/20 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-accent-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Community Submissions</h3>
            <p className="text-gray-400">
              Contribute to our collection! Submit new games or upload comparison photos to help grow our database.
            </p>
            <div className="mt-4 flex items-center text-accent-secondary font-medium">
              Submit Content
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </Link>
      </section>

      {/* Featured Games Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Featured Games
            </h2>
            <p className="text-gray-400 mt-1">
              Explore graphics comparisons for these titles
            </p>
          </div>
          {games.length > 0 && (
            <Link
              href="/games"
              className="hidden sm:flex items-center gap-2 text-accent-primary hover:text-accent-secondary transition-colors font-medium"
            >
              View All Games
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
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          )}
        </div>

        {games.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {games.map((game: { id: string; name: string; slug: string; coverImage: string | null; parameters: { id: string }[] }) => (
                <GameCard
                  key={game.id}
                  game={game}
                  href={`/games/${game.slug}`}
                />
              ))}
            </div>
            
            {/* Mobile View All Link */}
            <div className="mt-6 sm:hidden">
              <Link
                href="/games"
                className="flex items-center justify-center gap-2 text-accent-primary hover:text-accent-secondary transition-colors font-medium"
              >
                View All Games
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
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-gray-800/50 rounded-xl border border-gray-700">
            <svg
              className="w-16 h-16 text-gray-500 mx-auto mb-4"
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
            <h3 className="text-xl font-semibold text-white mb-2">No games yet</h3>
            <p className="text-gray-400 mb-6">
              Get started by adding your first game in the admin panel
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent-primary text-white rounded-lg font-medium hover:bg-accent-primary/90 transition-colors"
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
          </div>
        )}
      </section>

      {/* Latest Games Section */}
      {latestGames.length > 0 && (
        <section className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Latest Games
              </h2>
              <p className="text-gray-400 mt-1">
                Recently added to our collection
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestGames.map((game: { id: string; name: string; slug: string; coverImage: string | null; parameters: { id: string }[] }) => (
              <GameCard
                key={game.id}
                game={game}
                href={`/games/${game.slug}`}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
