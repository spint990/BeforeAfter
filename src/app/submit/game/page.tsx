'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ImageUploader from '@/components/admin/ImageUploader';

export default function GameSubmissionForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [releaseYear, setReleaseYear] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<{ name?: string; releaseYear?: string }>({});

  const currentYear = new Date().getFullYear();

  const validate = (): boolean => {
    const newErrors: { name?: string; releaseYear?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Game name is required';
    }

    if (releaseYear) {
      const year = parseInt(releaseYear);
      if (isNaN(year) || year < 1970 || year > currentYear + 5) {
        newErrors.releaseYear = `Year must be between 1970 and ${currentYear + 5}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setLoading(true);

    try {
      const response = await fetch('/api/submissions/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          releaseYear: releaseYear ? parseInt(releaseYear) : undefined,
          coverImageUrl: coverImageUrl || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit game');
      }

      setSuccess(true);
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit game');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (url: string) => {
    setCoverImageUrl(url);
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Submission Received!</h2>
          <p className="text-gray-400 mb-6">
            Thank you for submitting <span className="text-white font-medium">{name}</span>. 
            Our team will review your submission and approve it if it meets our guidelines.
          </p>
          <div className="bg-accent-primary/10 border border-accent-primary/30 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-400">
              <span className="text-accent-primary font-medium">What happens next?</span>
              <br />
              Our admin team will review your submission. If approved, the game will appear 
              in our database. If you provided an email, you'll be notified of the decision.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => router.push('/submit')}>
              Back to Submit Hub
            </Button>
            <Button variant="secondary" onClick={() => {
              setSuccess(false);
              setName('');
              setReleaseYear('');
              setCoverImageUrl('');
            }}>
              Submit Another Game
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/submit"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Submit
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">Submit a Game</h1>
        <p className="text-gray-400">
          Add a new game to our database. All submissions are reviewed before being published.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Game Name */}
        <Input
          label="Game Name"
          name="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
          }}
          error={errors.name}
          placeholder="e.g., Cyberpunk 2077"
          required
          disabled={loading}
        />

        {/* Release Year */}
        <Input
          label="Release Year"
          name="releaseYear"
          type="text"
          value={releaseYear}
          onChange={(e) => {
            setReleaseYear(e.target.value.replace(/[^0-9]/g, '').slice(0, 4));
            if (errors.releaseYear) setErrors((prev) => ({ ...prev, releaseYear: undefined }));
          }}
          error={errors.releaseYear}
          placeholder={`e.g., ${currentYear}`}
          disabled={loading}
        />

        {/* Cover Image Upload */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-200">
            Cover Image
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Upload a high-quality cover image (min 500x700px recommended)
          </p>
          <ImageUploader
            onUpload={handleImageUpload}
            currentImage={coverImageUrl}
            folder="covers"
          />
        </div>

        {/* Error Message */}
        {submitError && (
          <div className="bg-accent-danger/10 border border-accent-danger/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-accent-danger flex-shrink-0 mt-0.5"
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
              <p className="text-sm text-accent-danger">{submitError}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            className="flex-1 sm:flex-none"
          >
            Submit for Review
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/submit')}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>

        {/* Notice */}
        <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 text-sm text-gray-400">
          <p>
            <span className="text-accent-primary font-medium">Note:</span> Your submission will be 
            reviewed by our team before being published to the database. This typically takes 1-2 business days.
          </p>
        </div>
      </form>
    </div>
  );
}
