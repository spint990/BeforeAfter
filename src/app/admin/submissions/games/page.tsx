'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface GameSubmission {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  coverImageUrl: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedBy: string | null;
  createdAt: string;
  game: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

type StatusFilter = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';

export default function GameSubmissionsListPage() {
  const searchParams = useSearchParams();
  const initialStatus = (searchParams.get('status') as StatusFilter) || 'ALL';
  
  const [submissions, setSubmissions] = useState<GameSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(initialStatus);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchSubmissions();
  }, [statusFilter]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const url = statusFilter === 'ALL' 
        ? '/api/submissions/games?take=100'
        : `/api/submissions/games?status=${statusFilter}&take=100`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      setSubmissions(data.submissions || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error fetching game submissions:', error);
    } finally {
      setLoading(false);
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

  const getStatusCount = (status: StatusFilter) => {
    if (status === 'ALL') return total;
    return submissions.filter(s => s.status === status).length;
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
        <span className="text-white">Game Submissions</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Game Submissions</h1>
          <p className="text-gray-400 mt-1">Review and manage game submissions from users</p>
        </div>
        <Link
          href="/admin/submissions"
          className="text-sm text-accent-primary hover:text-accent-primary/80 transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-1 bg-gray-800 p-1 rounded-lg w-fit">
        {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as StatusFilter[]).map((status) => (
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
            {status === 'PENDING' && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-yellow-500/30 text-yellow-400 rounded-full">
                {getStatusCount('PENDING')}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Submissions Table */}
      {loading ? (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="p-4">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-12 h-16 bg-gray-700 rounded"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-700 rounded w-48 mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-32"></div>
                  </div>
                  <div className="h-6 bg-gray-700 rounded w-20"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : submissions.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
          <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-300 mb-2">No game submissions</h3>
          <p className="text-gray-500">
            {statusFilter === 'ALL' 
              ? 'No game submissions have been made yet'
              : `No ${statusFilter.toLowerCase()} game submissions`}
          </p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-800/50">
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Game</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Slug</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Submitted By</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Date</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-400">Status</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission.id} className="border-b border-gray-700 last:border-0 hover:bg-gray-750 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {submission.coverImageUrl ? (
                        <img
                          src={submission.coverImageUrl}
                          alt={submission.name}
                          className="w-12 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-16 bg-gray-700 rounded flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                          </svg>
                        </div>
                      )}
                      <span className="font-medium">{submission.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <code className="text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded">
                      {submission.slug}
                    </code>
                  </td>
                  <td className="px-4 py-4 text-gray-400">
                    {submission.submittedBy || 'Anonymous'}
                  </td>
                  <td className="px-4 py-4 text-gray-400 text-sm">
                    {new Date(submission.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {getStatusBadge(submission.status)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {submission.status === 'PENDING' && (
                        <Link
                          href={`/admin/submissions/games/${submission.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-accent-primary hover:bg-accent-primary/90 text-white rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Review
                        </Link>
                      )}
                      {submission.status === 'APPROVED' && submission.game && (
                        <Link
                          href={`/admin/games/${submission.game.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          View Game
                        </Link>
                      )}
                      {submission.status !== 'PENDING' && (
                        <Link
                          href={`/admin/submissions/games/${submission.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Details
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary */}
      {submissions.length > 0 && (
        <div className="text-sm text-gray-500">
          Showing {submissions.length} of {total} submission{total !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
