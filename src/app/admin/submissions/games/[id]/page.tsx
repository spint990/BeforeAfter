'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import Button from '@/components/ui/Button';

interface GameSubmission {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  developer: string | null;
  publisher: string | null;
  releaseYear: number | null;
  coverImageUrl: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedBy: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  game: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export default function GameSubmissionReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [submission, setSubmission] = useState<GameSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchSubmission();
  }, [resolvedParams.id]);

  const fetchSubmission = async () => {
    try {
      const response = await fetch(`/api/submissions/games/${resolvedParams.id}`);
      if (!response.ok) {
        router.push('/admin/submissions/games');
        return;
      }
      const data = await response.json();
      setSubmission(data);
    } catch (error) {
      console.error('Error fetching submission:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/submissions/games/${resolvedParams.id}/approve`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to approve submission');
      }

      router.push('/admin/submissions/games');
    } catch (error) {
      console.error('Error approving submission:', error);
      alert('Failed to approve submission');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(`/api/submissions/games/${resolvedParams.id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: rejectionReason }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to reject submission');
      }

      setRejectModal(false);
      router.push('/admin/submissions/games');
    } catch (error) {
      console.error('Error rejecting submission:', error);
      alert('Failed to reject submission');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-400">
            Pending Review
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400">
            Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-500/20 text-red-400">
            Rejected
          </span>
        );
      default:
        return null;
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

  if (!submission) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Submission not found</p>
        <Link href="/admin/submissions/games" className="text-accent-primary hover:text-accent-primary/80 mt-2 inline-block">
          ← Back to Game Submissions
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
        <Link href="/admin/submissions" className="hover:text-white transition-colors">
          Submissions
        </Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <Link href="/admin/submissions/games" className="hover:text-white transition-colors">
          Game Submissions
        </Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-white">{submission.name}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Review Game Submission</h1>
          <p className="text-gray-400 mt-1">
            Submitted by {submission.submittedBy || 'Anonymous'} on {new Date(submission.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge(submission.status)}
        </div>
      </div>

      {/* Submission Details */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Game Information</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            {/* Cover Image */}
            {submission.coverImageUrl && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">Cover Image</label>
                <img
                  src={submission.coverImageUrl}
                  alt={submission.name}
                  className="w-48 h-64 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
              <p className="text-white">{submission.name}</p>
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Slug</label>
              <code className="text-sm text-gray-300 bg-gray-700 px-2 py-1 rounded">
                {submission.slug}
              </code>
            </div>

            {/* Developer */}
            {submission.developer && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Developer</label>
                <p className="text-white">{submission.developer}</p>
              </div>
            )}

            {/* Publisher */}
            {submission.publisher && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Publisher</label>
                <p className="text-white">{submission.publisher}</p>
              </div>
            )}

            {/* Release Year */}
            {submission.releaseYear && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Release Year</label>
                <p className="text-white">{submission.releaseYear}</p>
              </div>
            )}

            {/* Description */}
            {submission.description && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <p className="text-white whitespace-pre-wrap">{submission.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Approval/Rejection History */}
      {submission.status !== 'PENDING' && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Review History</h2>
            
            {submission.status === 'APPROVED' && submission.game && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium text-green-400">Approved</span>
                </div>
                <p className="text-sm text-gray-400 mb-3">
                  This submission was approved and a game was created.
                </p>
                <Link
                  href={`/admin/games/${submission.game.id}`}
                  className="inline-flex items-center gap-2 text-sm text-accent-primary hover:text-accent-primary/80 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View Created Game: {submission.game.name}
                </Link>
              </div>
            )}

            {submission.status === 'REJECTED' && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium text-red-400">Rejected</span>
                </div>
                {submission.rejectionReason && (
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Rejection Reason</label>
                    <p className="text-white">{submission.rejectionReason}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {submission.status === 'PENDING' && (
        <div className="flex items-center gap-4">
          <Button
            onClick={handleApprove}
            disabled={actionLoading}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {actionLoading ? 'Approving...' : 'Approve'}
          </Button>
          <Button
            onClick={() => setRejectModal(true)}
            disabled={actionLoading}
            variant="danger"
            className="inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Reject
          </Button>
          <Link
            href="/admin/submissions/games"
            className="text-gray-400 hover:text-white transition-colors ml-auto"
          >
            Cancel
          </Link>
        </div>
      )}

      {/* Back button for processed submissions */}
      {submission.status !== 'PENDING' && (
        <Link
          href="/admin/submissions/games"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Game Submissions
        </Link>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Reject Submission</h3>
            </div>

            {/* Message */}
            <p className="text-gray-300 mb-4">
              Please provide a reason for rejecting this game submission. This will be visible to the submitter.
            </p>

            {/* Rejection Reason Input */}
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent resize-none"
              rows={4}
            />

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setRejectModal(false);
                  setRejectionReason('');
                }}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={handleReject}
                loading={actionLoading}
                disabled={actionLoading || !rejectionReason.trim()}
              >
                Reject Submission
              </Button>
            </div>
          </div>

          <style jsx>{`
            @keyframes fade-in {
              from {
                opacity: 0;
                transform: scale(0.95);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
            .animate-fade-in {
              animation: fade-in 0.2s ease-out;
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
