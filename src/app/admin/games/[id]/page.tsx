'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import AdminGameForm from '@/components/admin/AdminGameForm';
import ParameterManager from '@/components/admin/ParameterManager';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

interface QualityLevel {
  id: string;
  level: string;
  imageUrl: string | null;
}

interface Parameter {
  id: string;
  name: string;
  slug: string;
  qualityLevels: QualityLevel[] | null;
}

interface Game {
  id: string;
  name: string;
  slug: string;
  coverImage: string | null;
}

export default function EditGamePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [game, setGame] = useState<Game | null>(null);
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'parameters'>('details');

  useEffect(() => {
    fetchGameData();
  }, [params.id]);

  const fetchGameData = async () => {
    try {
      // Fetch game details
      const gameResponse = await fetch(`/api/games/${params.id}`);
      if (!gameResponse.ok) {
        router.push('/admin/games');
        return;
      }
      const gameData = await gameResponse.json();
      setGame(gameData);

      // Fetch parameters with quality levels
      const paramsResponse = await fetch(`/api/parameters?gameId=${params.id}`);
      const paramsData = await paramsResponse.json();
      
      // The API returns { data: parameters }, so extract the data array
      const parametersArray = paramsData.data || paramsData;
      
      // Fetch quality levels for each parameter
      const paramsWithLevels = await Promise.all(
        parametersArray.map(async (param: Parameter) => {
          try {
            const qlResponse = await fetch(`/api/quality-levels?parameterId=${param.id}`);
            const qlData = await qlResponse.json();
            // Handle both { data: [...] } and direct array responses
            const qualityLevels = Array.isArray(qlData) ? qlData : (qlData.data || []);
            return { ...param, qualityLevels };
          } catch {
            return { ...param, qualityLevels: [] };
          }
        })
      );
      
      setParameters(paramsWithLevels);
    } catch (error) {
      console.error('Error fetching game data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGame = async (data: { name: string; slug: string; coverImage?: string }) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/games/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update game');
      }

      const updatedGame = await response.json();
      setGame(updatedGame);
    } catch (error) {
      console.error('Error updating game:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGame = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/games/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete game');

      router.push('/admin/games');
    } catch (error) {
      console.error('Error deleting game:', error);
    } finally {
      setDeleting(false);
      setDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-48 mb-6"></div>
        <div className="h-10 bg-gray-700 rounded w-64 mb-8"></div>
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="space-y-6">
            <div className="h-10 bg-gray-700 rounded"></div>
            <div className="h-10 bg-gray-700 rounded"></div>
            <div className="h-10 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Game not found</p>
        <Link href="/admin/games" className="text-accent-primary hover:text-accent-primary/80 mt-2 inline-block">
          ← Back to Games
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/admin" className="hover:text-white transition-colors">
          Dashboard
        </Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <Link href="/admin/games" className="hover:text-white transition-colors">
          Games
        </Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-white">{game.name}</span>
      </nav>

      {/* Page Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Edit Game: {game.name}</h1>
          <p className="text-gray-400 mt-1">
            Manage game details and comparison parameters.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/games/${game.slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View on Site
          </Link>
          <button
            onClick={() => setDeleteModal(true)}
            className="inline-flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-800 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('details')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'details'
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Game Details
        </button>
        <button
          onClick={() => setActiveTab('parameters')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'parameters'
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Parameters ({parameters.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'details' && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-4">Game Information</h2>
          <AdminGameForm
            initialData={{
              id: game.id,
              name: game.name,
              slug: game.slug,
              coverImage: game.coverImage,
            }}
            onSubmit={handleUpdateGame}
            isEditing={true}
            onCancel={() => router.push('/admin/games')}
          />
          {saving && (
            <div className="mt-4 text-sm text-gray-400">Saving changes...</div>
          )}
        </div>
      )}

      {activeTab === 'parameters' && (
        <div className="space-y-6">
          {/* Parameters Section */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Parameters</h2>
              <Link
                href={`/games/${game.slug}`}
                target="_blank"
                className="text-sm text-accent-primary hover:text-accent-primary/80 transition-colors"
              >
                Preview on Site →
              </Link>
            </div>
            
            {parameters.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <p>No parameters yet</p>
                <p className="text-sm mt-1">Add parameters using the manager below</p>
              </div>
            ) : (
              <div className="space-y-3">
                {parameters.map((param) => (
                  <div
                    key={param.id}
                    className="flex items-center justify-between p-4 bg-gray-750 rounded-lg border border-gray-700"
                  >
                    <div>
                      <h3 className="font-medium">{param.name}</h3>
                      <p className="text-sm text-gray-500">{param.qualityLevels?.length ?? 0} quality levels</p>
                    </div>
                    <Link
                      href={`/games/${game.slug}?param=${param.slug}`}
                      target="_blank"
                      className="text-sm text-accent-primary hover:text-accent-primary/80 transition-colors"
                    >
                      View →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Parameter Manager */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h2 className="text-lg font-semibold mb-4">Manage Parameters</h2>
            <ParameterManager
              gameId={game.id}
              parameters={parameters}
              onRefresh={fetchGameData}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDeleteGame}
        title="Delete Game"
        message={`Are you sure you want to delete "${game.name}"? This will also delete all ${parameters.length} parameter(s) and their quality levels.`}
        confirmText="Delete Game"
        loading={deleting}
      />
    </div>
  );
}
