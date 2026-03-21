'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface ImageUploadState {
  url: string | null;
  isUploading: boolean;
  progress: number;
  error: string | null;
}

// Define UploadBox OUTSIDE the main component to prevent re-renders causing focus loss
const UploadBox = React.memo(function UploadBox({
  state,
  inputRef,
  onFileSelect,
  label,
  onLabelChange,
  labelPlaceholder,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  setImageState,
}: {
  state: ImageUploadState;
  inputRef: React.RefObject<HTMLInputElement>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  onLabelChange: (value: string) => void;
  labelPlaceholder: string;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, setImageState: React.Dispatch<React.SetStateAction<ImageUploadState>>) => void;
  setImageState: React.Dispatch<React.SetStateAction<ImageUploadState>>;
}) {
  return (
    <div className="space-y-3">
      <div
        onClick={() => inputRef.current?.click()}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, setImageState)}
        className={`
          relative w-full aspect-video rounded-lg border-2 border-dashed cursor-pointer
          transition-all duration-200 overflow-hidden
          ${state.isUploading 
            ? 'border-accent-primary bg-accent-primary/10' 
            : state.url 
              ? 'border-green-500 bg-green-500/10' 
              : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
          }
        `}
      >
        {/* Current Image Preview */}
        {state.url && !state.isUploading ? (
          <img
            src={state.url}
            alt="Uploaded image"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : null}

        {/* Upload Overlay */}
        <div className={`
          absolute inset-0 flex flex-col items-center justify-center
          ${state.url ? 'bg-black/50 opacity-0 hover:opacity-100' : ''}
          transition-opacity duration-200
        `}>
          {state.isUploading ? (
            <div className="text-center">
              <div className="w-10 h-10 border-2 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-300">{state.progress}%</p>
            </div>
          ) : (
            <>
              <svg
                className="w-8 h-8 text-gray-400 mb-2"
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
              <p className="text-sm text-gray-400">
                {state.url ? 'Click to change' : 'Drop image or click to upload'}
              </p>
            </>
          )}
        </div>

        {/* Progress Bar */}
        {state.isUploading && state.progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
            <div
              className="h-full bg-accent-primary transition-all duration-200"
              style={{ width: `${state.progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={onFileSelect}
        className="hidden"
        disabled={state.isUploading}
      />

      {/* Label Input */}
      <div>
        <input
          type="text"
          value={label}
          onChange={(e) => onLabelChange(e.target.value)}
          placeholder={labelPlaceholder}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
        />
      </div>

      {/* Error Message */}
      {state.error && (
        <p className="text-sm text-accent-danger">{state.error}</p>
      )}
    </div>
  );
});

export default function QuickComparePage() {
  const router = useRouter();
  
  const [beforeImage, setBeforeImage] = useState<ImageUploadState>({
    url: null,
    isUploading: false,
    progress: 0,
    error: null,
  });
  
  const [afterImage, setAfterImage] = useState<ImageUploadState>({
    url: null,
    isUploading: false,
    progress: 0,
    error: null,
  });
  
  const [beforeLabel, setBeforeLabel] = useState('Avant');
  const [afterLabel, setAfterLabel] = useState('Après');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (
    file: File,
    setImageState: React.Dispatch<React.SetStateAction<ImageUploadState>>
  ) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setImageState(prev => ({
        ...prev,
        error: 'Invalid file type. Please use JPG, PNG, or WebP.',
      }));
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setImageState(prev => ({
        ...prev,
        error: 'File too large. Maximum size is 10MB.',
      }));
      return;
    }

    setImageState(prev => ({ ...prev, isUploading: true, progress: 0, error: null }));

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'comparison');

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setImageState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90),
        }));
      }, 100);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await response.json();

      if (data.success && data.url) {
        setImageState({
          url: data.url,
          isUploading: false,
          progress: 100,
          error: null,
        });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      setImageState(prev => ({
        ...prev,
        isUploading: false,
        progress: 0,
        error: err instanceof Error ? err.message : 'Upload failed',
      }));
    }
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImageState: React.Dispatch<React.SetStateAction<ImageUploadState>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file, setImageState);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (
    e: React.DragEvent,
    setImageState: React.Dispatch<React.SetStateAction<ImageUploadState>>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadFile(file, setImageState);
    }
  };

  const handleSubmit = async () => {
    if (!beforeImage.url || !afterImage.url) {
      setSubmitError('Please upload both images before creating a comparison');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/quick-compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          beforeUrl: beforeImage.url,
          afterUrl: afterImage.url,
          beforeLabel: beforeLabel || 'Avant',
          afterLabel: afterLabel || 'Après',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create comparison');
      }

      const data = await response.json();

      if (data.success && data.comparison?.id) {
        router.push(`/compare/quick/${data.comparison.id}`);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to create comparison');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Quick Comparison</h1>
          <p className="text-gray-400">
            Upload two images to create an instant before/after comparison. 
            Links expire after 24 hours.
          </p>
        </div>

        {/* Upload Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Before Image */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              Before Image
            </h2>
            <UploadBox
              state={beforeImage}
              inputRef={beforeInputRef}
              onFileSelect={(e) => handleFileSelect(e, setBeforeImage)}
              label={beforeLabel}
              onLabelChange={setBeforeLabel}
              labelPlaceholder="Avant"
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              setImageState={setBeforeImage}
            />
          </div>

          {/* After Image */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              After Image
            </h2>
            <UploadBox
              state={afterImage}
              inputRef={afterInputRef}
              onFileSelect={(e) => handleFileSelect(e, setAfterImage)}
              label={afterLabel}
              onLabelChange={setAfterLabel}
              labelPlaceholder="Après"
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              setImageState={setAfterImage}
            />
          </div>
        </div>

        {/* Submit Error */}
        {submitError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-accent-danger text-center">{submitError}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !beforeImage.url || !afterImage.url}
            className={`
              px-8 py-3 rounded-lg font-semibold text-white
              transition-all duration-200
              ${isSubmitting || !beforeImage.url || !afterImage.url
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-accent-primary hover:bg-accent-primary/80 hover:scale-105'
              }
            `}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating...
              </span>
            ) : (
              'Create Comparison'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
