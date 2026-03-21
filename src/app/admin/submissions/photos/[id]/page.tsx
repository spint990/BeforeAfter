'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageComparisonSlider from '@/components/comparison/ImageComparisonSlider';
import Button from '@/components/ui/Button';

interface PhotoSubmission {
  id: string;
  imageUrl: string;
  description: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedBy: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
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
  existingImageUrl?: string | null;
  customParameter?: {
    name: string;
    options: string[];
    selectedOption: string;
  };
}

export default function PhotoSubmissionReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [submission, setSubmission] = useState<PhotoSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showFullscreen, setShowFullscreen] = useState(false);

  useEffect(() => {
    fetchSubmission();
  }, [resolvedParams.id]);

  const fetchSubmission = async () => {
    try {
      const response = await fetch(`/api/submissions/photos/${resolvedParams.id}`);
      if (!response.ok) {
        router.push('/admin/submissions/photos');
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
      const response = await fetch(`/api/submissions/photos/${resolvedParams.id}/approve`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to approve submission');
      }

      router.push('/admin/submissions/photos');
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
      const response = await fetch(`/api/submissions/photos/${resolvedParams.id}/reject`, {
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
      router.push('/admin/submissions/photos');
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
      <div className="max-w-5xl animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-48 mb-6"></div>
        <div className="h-10 bg-gray-700 rounded w-64 mb-8"></div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 h-96"></div>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-6 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Submission not found</p>
        <Link href="/admin/submissions/photos" className="text-accent-primary hover:text-accent-primary/80 mt-2 inline-block">
          ← Back to Photo Submissions
        </Link>
      </div>
    );
  }

  const hasExistingImage = submission.existingImageUrl || submission.photo?.imageUrl;

  return (
    <div className="max-w-5xl">
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
        <Link href="/admin/submissions/photos" className="hover:text-white transition-colors">
          Photo Submissions
        </Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-white truncate max-w-[200px]">
          {submission.game.name} - {submission.customParameter 
            ? `${submission.customParameter.name} (${submission.customParameter.selectedOption})` 
            : submission.qualityLevel?.level || 'Unknown'}
        </span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Review Photo Submission</h1>
          <p className="text-gray-400 mt-1">
            Submitted by {submission.submittedBy || 'Anonymous'} on {new Date(submission.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge(submission.status)}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Image Preview */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold">Image Preview</h2>
          </div>
          <div className="p-4">
            {hasExistingImage ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-400">
                  Compare the submitted image (left) with the existing image (right):
                </p>
                <ImageComparisonSlider
                  leftImage={submission.imageUrl}
                  rightImage={submission.existingImageUrl || submission.photo?.imageUrl || ''}
                  leftLabel="Submitted"
                  rightLabel="Current"
                  className="rounded-lg overflow-hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-400">
                  New submission (no existing image to compare):
                </p>
                <div className="relative group">
                  <img
                    src={submission.imageUrl}
                    alt="Submitted"
                    className="w-full h-auto rounded-lg cursor-pointer"
                    onClick={() => setShowFullscreen(true)}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 text-white text-sm bg-black/50 px-3 py-1 rounded">
                      Click to view full size
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submission Details */}
        <div className="space-y-6">
          {/* Game Info */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold">Submission Details</h2>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Game</label>
                <Link
                  href={`/games/${submission.game.slug}`}
                  target="_blank"
                  className="text-white hover:text-accent-primary transition-colors"
                >
                  {submission.game.name}
                </Link>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Parameter</label>
                {submission.customParameter ? (
                  <div className="flex items-center gap-2">
                    <p className="text-white">{submission.customParameter.name}</p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-500/20 text-purple-400">
                      Custom
                    </span>
                  </div>
                ) : submission.parameter ? (
                  <p className="text-white">{submission.parameter.name}</p>
                ) : (
                  <p className="text-gray-500">-</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  {submission.customParameter ? 'Selected Option' : 'Quality Level'}
                </label>
                {submission.customParameter ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-purple-500/20 text-purple-400">
                    {submission.customParameter.selectedOption}
                  </span>
                ) : submission.qualityLevel ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400">
                    {submission.qualityLevel.level}
                  </span>
                ) : (
                  <span className="text-gray-500">-</span>
                )}
              </div>

              {submission.customParameter && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Available Options</label>
                  <div className="flex flex-wrap gap-2">
                    {submission.customParameter.options.map((option, index) => (
                      <span 
                        key={index}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          option === submission.customParameter?.selectedOption
                            ? 'bg-purple-500/20 text-purple-400 ring-1 ring-purple-500/50'
                            : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {option}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {submission.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                  <p className="text-white whitespace-pre-wrap">{submission.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Approval/Rejection History */}
          {submission.status !== 'PENDING' && (
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold">Review History</h2>
              </div>
              <div className="p-4">
                {submission.status === 'APPROVED' && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium text-green-400">Approved</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">
                      This submission was approved and the quality level has been updated.
                    </p>
                    {submission.parameter && (
                      <Link
                        href={`/games/${submission.game.slug}?param=${submission.parameter.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-2 text-sm text-accent-primary hover:text-accent-primary/80 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View on Comparison Page
                      </Link>
                    )}
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
        </div>
      </div>

      {/* Action Buttons */}
      {submission.status === 'PENDING' && (
        <div className="mt-6 flex items-center gap-4">
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
            href="/admin/submissions/photos"
            className="text-gray-400 hover:text-white transition-colors ml-auto"
          >
            Cancel
          </Link>
        </div>
      )}

      {/* Back button for processed submissions */}
      {submission.status !== 'PENDING' && (
        <div className="mt-6">
          <Link
            href="/admin/submissions/photos"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Photo Submissions
          </Link>
        </div>
      )}

      {/* Fullscreen Image Modal */}
      {showFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={() => setShowFullscreen(false)}
        >
          <button
            onClick={() => setShowFullscreen(false)}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={submission.imageUrl}
            alt="Submitted"
            className="max-w-full max-h-full object-contain"
          />
        </div>
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
              Please provide a reason for rejecting this photo submission. This will be visible to the submitter.
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
