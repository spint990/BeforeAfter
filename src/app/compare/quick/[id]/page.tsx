'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ImageComparisonSlider from '@/components/comparison/ImageComparisonSlider';

interface QuickComparison {
  id: string;
  beforeUrl: string;
  afterUrl: string;
  beforeLabel: string;
  afterLabel: string;
  expiresAt: string;
  createdAt: string;
}

export default function QuickCompareViewPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [comparison, setComparison] = useState<QuickComparison | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchComparison = async () => {
      try {
        const response = await fetch(`/api/quick-compare/${id}`);
        
        if (response.status === 410) {
          setExpired(true);
          setError('This comparison has expired');
          setLoading(false);
          return;
        }
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to load comparison');
        }
        
        const data = await response.json();
        setComparison(data.comparison);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load comparison');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchComparison();
    }
  }, [id]);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading comparison...</p>
        </div>
      </div>
    );
  }

  if (expired) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center py-8 px-4 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -z-10" />
        
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Comparison Expired</h1>
          <p className="text-gray-400 mb-6">
            This comparison link has expired. Quick comparisons are only available for 24 hours.
          </p>
          <Link
            href="/compare/quick"
            className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-purple-400 transition-all hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
          >
            Create New Comparison
          </Link>
        </div>
      </div>
    );
  }

  if (error || !comparison) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center py-8 px-4 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -z-10" />
        
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Comparison Not Found</h1>
          <p className="text-gray-400 mb-6">
            {error || 'The requested comparison could not be found.'}
          </p>
          <Link
            href="/compare/quick"
            className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-purple-400 transition-all hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
          >
            Create New Comparison
          </Link>
        </div>
      </div>
    );
  }

  // Calculate time remaining
  const expiresAt = new Date(comparison.expiresAt);
  const now = new Date();
  const hoursRemaining = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60)));

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10" />
      
      <div className="max-w-5xl mx-auto relative">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-1">
              Quick Comparison
            </h1>
            <p className="text-sm text-gray-400 flex items-center gap-2 justify-center sm:justify-start">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
              Expires in {hoursRemaining} hour{hoursRemaining !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Share Button */}
            <button
              onClick={handleCopyUrl}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 text-gray-300 rounded-xl transition-all hover:border-cyan-500/30"
            >
              {copied ? (
                <>
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  Share
                </>
              )}
            </button>
            
            {/* New Comparison Link */}
            <Link
              href="/compare/quick"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white rounded-xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New
            </Link>
          </div>
        </div>

        {/* Comparison Slider */}
        <div className="rounded-2xl overflow-hidden bg-gray-800/50 border border-gray-700/50 shadow-2xl shadow-cyan-500/5">
          <ImageComparisonSlider
            leftImage={comparison.beforeUrl}
            rightImage={comparison.afterUrl}
            leftLabel={comparison.beforeLabel}
            rightLabel={comparison.afterLabel}
            className="w-full aspect-video"
          />
        </div>

        {/* Info Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Created with{' '}
            <Link href="/" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              GFXLab
            </Link>
            {' '}• Quick comparisons expire after 24 hours
          </p>
        </div>
      </div>
    </div>
  );
}
