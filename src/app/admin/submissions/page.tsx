'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface SubmissionStats {
  pendingGames: number;
  pendingPhotos: number;
}

interface GameSubmission {
  id: string;
  name: string;
  slug: string;
  status: string;
  createdAt: string;
  submittedBy: string | null;
}

interface PhotoSubmission {
  id: string;
  imageUrl: string;
  status: string;
  createdAt: string;
  submittedBy: string | null;
  game: { id: string; name: string; slug: string };
  parameter: { id: string; name: string } | null;
  qualityLevel: { id: string; level: string } | null;
  customParameter?: {
    name: string;
    options: string[];
    selectedOption: string;
  };
}

export default function AdminSubmissionsDashboard() {
  const [submissionStats, setSubmissionStats] = useState<SubmissionStats>({
    pendingGames: 0,
    pendingPhotos: 0,
  });
  const [totalGames, setTotalGames] = useState(0);
  const [pendingGames, setPendingGames] = useState<GameSubmission[]>([]);
  const [pendingPhotos, setPendingPhotos] = useState<PhotoSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch game submissions stats
      const pendingGamesRes = await fetch('/api/submissions/games?status=PENDING&take=5');
      const pendingGamesData = await pendingGamesRes.json();

      // Fetch photo submissions stats
      const pendingPhotosRes = await fetch('/api/submissions/photos?status=PENDING&take=5');
      const pendingPhotosData = await pendingPhotosRes.json();

      setSubmissionStats({
        pendingGames: pendingGamesData.total || 0,
        pendingPhotos: pendingPhotosData.total || 0,
      });

      setPendingGames(pendingGamesData.submissions || []);
      setPendingPhotos(pendingPhotosData.submissions || []);

      // Fetch total games count
      const gamesResponse = await fetch('/api/games');
      const gamesData = await gamesResponse.json();
      setTotalGames(gamesData.length);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Submissions Dashboard</h1>
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-6 border border-gray-700 animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-700 rounded w-16"></div>
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
        <div>
          <h1 className="text-2xl font-bold">Submissions Dashboard</h1>
          <p className="text-gray-400 mt-1">Review and manage user submissions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Total Games */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Games</p>
              <p className="text-2xl font-bold">{totalGames}</p>
            </div>
          </div>
        </div>

        {/* Pending Games */}
        <Link
          href="/admin/submissions/games?status=PENDING"
          className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-accent-primary transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-400">Pending Games</p>
              <p className="text-2xl font-bold text-yellow-500">{submissionStats.pendingGames}</p>
            </div>
          </div>
        </Link>

        {/* Pending Photos */}
        <Link
          href="/admin/submissions/photos?status=PENDING"
          className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-accent-primary transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-400">Pending Photos</p>
              <p className="text-2xl font-bold text-orange-400">{submissionStats.pendingPhotos}</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Pending Submissions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Game Submissions */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold">Pending Game Submissions</h2>
            <Link
              href="/admin/submissions/games?status=PENDING"
              className="text-sm text-accent-primary hover:text-accent-primary/80 transition-colors"
            >
              View All →
            </Link>
          </div>
          <div className="p-4">
            {pendingGames.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No pending game submissions</p>
            ) : (
              <div className="space-y-3">
                {pendingGames.map((game) => (
                  <Link
                    key={game.id}
                    href={`/admin/submissions/games/${game.id}`}
                    className="flex items-center justify-between p-3 bg-gray-750 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{game.name}</p>
                      <p className="text-sm text-gray-500">
                        Submitted by {game.submittedBy || 'Anonymous'} • {new Date(game.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-500/20 text-yellow-400">
                      Pending
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pending Photo Submissions */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold">Pending Photo Submissions</h2>
            <Link
              href="/admin/submissions/photos?status=PENDING"
              className="text-sm text-accent-primary hover:text-accent-primary/80 transition-colors"
            >
              View All →
            </Link>
          </div>
          <div className="p-4">
            {pendingPhotos.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No pending photo submissions</p>
            ) : (
              <div className="space-y-3">
                {pendingPhotos.map((photo) => (
                  <Link
                    key={photo.id}
                    href={`/admin/submissions/photos/${photo.id}`}
                    className="flex items-center gap-3 p-3 bg-gray-750 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <img
                      src={photo.imageUrl}
                      alt=""
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{photo.game.name}</p>
                      <p className="text-sm text-gray-500 truncate">
                        {photo.customParameter ? (
                          <>
                            {photo.customParameter.name} • {photo.customParameter.selectedOption}
                            <span className="ml-1 text-purple-400">(Custom)</span>
                          </>
                        ) : (
                          <>
                            {photo.parameter?.name || '-'} • {photo.qualityLevel?.level || '-'}
                          </>
                        )}
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-500/20 text-yellow-400">
                      Pending
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
