'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

interface Game {
  id: string;
  name: string;
  slug: string;
  coverImage: string | null;
  _count: {
    parameters: number;
  };
}

export default function AdminGamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; game: Game | null }>({
    isOpen: false,
    game: null,
  });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games');
      const data = await response.json();
      
      // API returns { games, total }, so we need to access data.games
      const gamesList = data.games || data;
      
      // Fetch parameter counts for each game
      const gamesWithCounts = await Promise.all(
        gamesList.map(async (game: Game) => {
          const paramsResponse = await fetch(`/api/parameters?gameId=${game.id}`);
          const params = await paramsResponse.json();
          return {
            ...game,
            _count: { parameters: params.length },
          };
        })
      );
      
      setGames(gamesWithCounts);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (game: Game) => {
    setDeleteModal({ isOpen: true, game });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.game) return;
    
    setDeleting(true);
    try {
      const response = await fetch(`/api/games/${deleteModal.game.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete game');

      // Remove from local state
      setGames((prev) => prev.filter((g) => g.id !== deleteModal.game!.id));
    } catch (error) {
      console.error('Error deleting game:', error);
    } finally {
      setDeleting(false);
      setDeleteModal({ isOpen: false, game: null });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-700 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-700 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 animate-pulse">
              <div className="h-40 bg-gray-700"></div>
              <div className="p-4">
                <div className="h-5 bg-gray-700 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Games</h1>
        <Link
          href="/submit/game"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white px-4 py-2 rounded-xl font-medium transition-all shadow-lg shadow-purple-500/25"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Game
        </Link>
      </div>

      {/* Games Grid */}
      {games.length === 0 ? (
        <div className="bg-gray-800/50 rounded-xl p-12 text-center border border-gray-700/50">
          <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-300 mb-2">No games yet</h3>
          <p className="text-gray-500 mb-6">Get started by adding your first game</p>
          <Link
            href="/submit/game"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add your first game
          </Link>
        </div>
      ) : (
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-800/50">
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Game</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Slug</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-400">Parameters</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => (
                <tr key={game.id} className="border-b border-gray-700 last:border-0 hover:bg-gray-750 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {game.coverImage ? (
                        <img
                          src={game.coverImage}
                          alt={game.name}
                          className="w-12 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-16 bg-gray-700 rounded flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <span className="font-medium">{game.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <code className="text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded">
                      {game.slug}
                    </code>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                      {game._count.parameters}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/games/${game.slug}`}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                        title="View on site"
                        target="_blank"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Link>
                      <Link
                        href={`/admin/games/${game.id}`}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(game)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary */}
      {games.length > 0 && (
        <div className="text-sm text-gray-500">
          Total: {games.length} game{games.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, game: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Game"
        message={`Are you sure you want to delete "${deleteModal.game?.name}"? This will also delete all associated parameters and quality levels.`}
        confirmText="Delete Game"
        loading={deleting}
      />
    </div>
  );
}
