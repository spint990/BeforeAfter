'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface PhotoSubmission {
  id: string;
  imageUrl: string;
  description: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedBy: string | null;
  createdAt: string;
  game: {
    id: string;
    name: string;
    slug: string;
  };
  parameter: {
    id: string;
    name: string;
    slug: string;
  } | null;
  qualityLevel: {
    id: string;
    level: string;
  } | null;
  photo: {
    id: string;
    imageUrl: string;
  } | null;
  customParameter?: {
    name: string;
    options: string[];
    selectedOption: string;
  };
}

interface Game {
  id: string;
  name: string;
}

type StatusFilter = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';

export default function PhotoSubmissionsListPage() {
  const searchParams = useSearchParams();
  const initialStatus = (searchParams.get('status') as StatusFilter) || 'PENDING';
  
  const [submissions, setSubmissions] = useState<PhotoSubmission[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(initialStatus);
  const [gameFilter, setGameFilter] = useState<string>('ALL');
  const [total, setTotal] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'approve' | 'delete';
    submission: PhotoSubmission | null;
  }>({ isOpen: false, type: 'approve', submission: null });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [statusFilter, gameFilter]);

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games');
      const data = await response.json();
      setGames(data);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('take', '100');
      
      if (statusFilter !== 'ALL') {
        params.append('status', statusFilter);
      }
      
      if (gameFilter !== 'ALL') {
        params.append('gameId', gameFilter);
      }
      
      const response = await fetch(`/api/submissions/photos?${params.toString()}`);
      const data = await response.json();
      
      setSubmissions(data.submissions || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error fetching photo submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (submissionId: string) => {
    setActionLoading(submissionId);
    try {
      const response = await fetch(`/api/submissions/photos/${submissionId}/approve`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to approve submission');
      }

      // Remove from list or update status
      setSubmissions(prev => prev.filter(s => s.id !== submissionId));
      setTotal(prev => prev - 1);
    } catch (error) {
      console.error('Error approving submission:', error);
      alert('Failed to approve submission');
    } finally {
      setActionLoading(null);
      setConfirmModal({ isOpen: false, type: 'approve', submission: null });
    }
  };

  const handleDelete = async (submissionId: string) => {
    setActionLoading(submissionId);
    try {
      const response = await fetch(`/api/submissions/photos/${submissionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete submission');
      }

      // Remove from list
      setSubmissions(prev => prev.filter(s => s.id !== submissionId));
      setTotal(prev => prev - 1);
    } catch (error) {
      console.error('Error deleting submission:', error);
      alert('Failed to delete submission');
    } finally {
      setActionLoading(null);
      setConfirmModal({ isOpen: false, type: 'delete', submission: null });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
            Pending
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
            Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400">
        <Link href="/admin" className="hover:text-white transition-colors">
          Dashboard
        </Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <Link href="/admin/submissions" className="hover:text-white transition-colors">
          Submissions
        </Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-white">Photo Submissions</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Photo Submissions</h1>
          <p className="text-gray-400 mt-1">Review and manage photo submissions - Approve or Delete</p>
        </div>
        <Link
          href="/admin/submissions"
          className="text-sm text-accent-primary hover:text-accent-primary/80 transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Status Filter Tabs */}
        <div className="flex gap-1 bg-gray-800 p-1 rounded-lg">
          {(['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as StatusFilter[]).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                statusFilter === status
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Game Filter */}
        <select
          value={gameFilter}
          onChange={(e) => setGameFilter(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-primary"
        >
          <option value="ALL">All Games</option>
          {games.map((game) => (
            <option key={game.id} value={game.id}>
              {game.name}
            </option>
          ))}
        </select>
      </div>

      {/* Submissions Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden animate-pulse">
              <div className="aspect-video bg-gray-700"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : submissions.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
          <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-300 mb-2">No photo submissions</h3>
          <p className="text-gray-500">
            {statusFilter === 'ALL' && gameFilter === 'ALL'
              ? 'No photo submissions have been made yet'
              : 'No photo submissions match the current filters'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {submissions.map((submission) => (
            <div key={submission.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              {/* Image */}
              <div 
                className="aspect-video relative cursor-pointer group"
                onClick={() => setPreviewImage(submission.imageUrl)}
              >
                <img
                  src={submission.imageUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 text-white text-sm bg-black/50 px-3 py-1 rounded transition-opacity">
                    Click to preview
                  </span>
                </div>
                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  {getStatusBadge(submission.status)}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <Link
                  href={`/games/${submission.game.slug}`}
                  target="_blank"
                  className="font-medium text-white hover:text-accent-primary transition-colors block mb-1"
                >
                  {submission.game.name}
                </Link>
                <div className="text-sm text-gray-400 space-y-1">
                  <p>
                    {submission.customParameter ? (
                      <span className="flex items-center gap-1">
                        {submission.customParameter.name}
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-500/20 text-purple-400">
                          Custom
                        </span>
                      </span>
                    ) : submission.parameter ? (
                      submission.parameter.name
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </p>
                  <p>
                    {submission.customParameter ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                        {submission.customParameter.selectedOption}
                      </span>
                    ) : submission.qualityLevel ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                        {submission.qualityLevel.level}
                      </span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(submission.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Action Buttons */}
                {submission.status === 'PENDING' && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => setConfirmModal({ isOpen: true, type: 'approve', submission })}
                      disabled={actionLoading === submission.id}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading === submission.id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Approve
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setConfirmModal({ isOpen: true, type: 'delete', submission })}
                      disabled={actionLoading === submission.id}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading === submission.id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                )}

                {submission.status !== 'PENDING' && (
                  <div className="mt-4">
                    <Link
                      href={`/admin/submissions/photos/${submission.id}`}
                      className="block text-center text-sm text-gray-400 hover:text-white transition-colors py-2 border border-gray-700 rounded-lg hover:bg-gray-700"
                    >
                      View Details
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {submissions.length > 0 && (
        <div className="text-sm text-gray-500">
          Showing {submissions.length} of {total} submission{total !== 1 ? 's' : ''}
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Confirm Modal */}
      {confirmModal.isOpen && confirmModal.submission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                confirmModal.type === 'approve' ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                {confirmModal.type === 'approve' ? (
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
              </div>
              <h3 className="text-lg font-semibold text-white">
                {confirmModal.type === 'approve' ? 'Approve Submission' : 'Delete Submission'}
              </h3>
            </div>

            <p className="text-gray-300 mb-4">
              {confirmModal.type === 'approve' 
                ? 'Are you sure you want to approve this photo submission? It will be added to the database.'
                : 'Are you sure you want to delete this photo submission? This action cannot be undone.'}
            </p>

            {/* Preview */}
            <div className="mb-4 bg-gray-700 rounded-lg overflow-hidden">
              <img
                src={confirmModal.submission.imageUrl}
                alt=""
                className="w-full h-32 object-cover"
              />
              <div className="p-3 text-sm">
                <p className="text-white font-medium">{confirmModal.submission.game.name}</p>
                <p className="text-gray-400">
                  {confirmModal.submission.customParameter?.name || confirmModal.submission.parameter?.name || '-'}
                  {' • '}
                  {confirmModal.submission.customParameter?.selectedOption || confirmModal.submission.qualityLevel?.level || '-'}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal({ isOpen: false, type: 'approve', submission: null })}
                className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmModal.type === 'approve') {
                    handleApprove(confirmModal.submission!.id);
                  } else {
                    handleDelete(confirmModal.submission!.id);
                  }
                }}
                disabled={actionLoading === confirmModal.submission.id}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                  confirmModal.type === 'approve'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {actionLoading === confirmModal.submission.id ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                ) : confirmModal.type === 'approve' ? (
                  'Approve'
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
