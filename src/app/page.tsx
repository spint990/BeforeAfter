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
      {/* Hero Section - Redesigned */}
      <section className="relative overflow-hidden rounded-3xl mb-12">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        {/* Glowing orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-600/10 to-cyan-600/10 rounded-full blur-[100px]" />
        
        {/* Content */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
          <div className="max-w-6xl mx-auto">
            {/* Logo and Brand */}
            <div className="flex flex-col items-center text-center mb-10">
              {/* Logo Icon */}
              <div className="relative mb-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 p-[2px] shadow-2xl shadow-purple-500/25">
                  <div className="w-full h-full rounded-2xl bg-gray-900 flex items-center justify-center">
                    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="7" height="18" rx="1" className="text-purple-400 fill-purple-400/20 stroke-purple-400" />
                      <rect x="14" y="3" width="7" height="18" rx="1" className="text-cyan-400 fill-cyan-400/20 stroke-cyan-400" />
                      <line x1="12" y1="2" x2="12" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 blur-xl opacity-50" />
              </div>
              
              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight mb-4">
                <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  GFX
                </span>
                <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Lab
                </span>
              </h1>
              
              {/* Tagline */}
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-400 max-w-2xl leading-relaxed">
                The ultimate <span className="text-purple-400 font-semibold">graphics comparison</span> platform. 
                Analyze visual differences with our precision <span className="text-cyan-400 font-semibold">slider technology</span>.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="/games"
                className="group relative w-full sm:w-auto"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-300" />
                <div className="relative flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 rounded-xl font-semibold text-lg text-white group-hover:bg-gray-800 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Browse Games
                </div>
              </Link>
              
              <Link
                href="/compare/quick"
                className="group w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gray-800/50 backdrop-blur-sm text-white rounded-xl font-semibold text-lg border border-gray-700 hover:border-purple-500/50 hover:bg-gray-800 transition-all duration-300"
              >
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Quick Compare
              </Link>
              
              <Link
                href="/submit"
                className="group w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gray-800/50 backdrop-blur-sm text-white rounded-xl font-semibold text-lg border border-gray-700 hover:border-cyan-500/50 hover:bg-gray-800 transition-all duration-300"
              >
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Submit Content
              </Link>
            </div>
            
            {/* Stats badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full border border-gray-700/50">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-gray-300">Interactive Slider</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full border border-gray-700/50">
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                <span className="text-gray-300">Side-by-Side Analysis</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full border border-gray-700/50">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-gray-300">Community Driven</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-900 to-transparent" />
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
