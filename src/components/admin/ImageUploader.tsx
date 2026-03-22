'use client';

import React, { useState, useRef } from 'react';
import { upload } from '@vercel/blob/client';

interface ImageUploaderProps {
  onUpload: (url: string) => void;
  currentImage?: string;
  label?: string;
  accept?: string;
  folder?: 'covers' | 'comparisons';
}

export default function ImageUploader({
  onUpload,
  currentImage,
  label,
  accept = 'image/jpeg,image/png,image/webp',
  folder = 'comparisons',
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Use Vercel Blob client-side upload to bypass server body size limits
      const uploadType = folder === 'covers' ? 'covers' : 'comparisons';
      const fileExtension = file.name.split('.').pop() || 'jpg';
      const filename = `${uploadType}/${crypto.randomUUID()}.${fileExtension}`;

      // Simulate progress for better UX since onUploadProgress isn't available in this version
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 100);

      const blob = await upload(filename, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      onUpload(blob.url);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 500);
    }
  };

  const handleFileSelect = (file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please use JPG, PNG, or WebP.');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File too large. Maximum size is 10MB.');
      return;
    }

    setError(null);
    uploadFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-200">{label}</label>
      )}
      
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          relative w-full aspect-video rounded-xl border-2 border-dashed cursor-pointer
          transition-all duration-200 overflow-hidden
          ${isDragging 
            ? 'border-purple-500 bg-purple-500/10' 
            : 'border-gray-700/50 hover:border-gray-600/50 bg-gray-800/30'
          }
          ${isUploading ? 'pointer-events-none' : ''}
        `}
      >
        {/* Current Image Preview */}
        {currentImage && !isUploading ? (
          <img
            src={currentImage}
            alt="Uploaded image"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : null}

        {/* Upload Overlay */}
        <div className={`
          absolute inset-0 flex flex-col items-center justify-center
          ${currentImage ? 'bg-black/50 opacity-0 hover:opacity-100' : ''}
          transition-opacity duration-200
        `}>
          {isUploading ? (
            <div className="text-center">
              <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-300">{uploadProgress}%</p>
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
                {currentImage ? 'Click to change' : 'Drop image or click to upload'}
              </p>
            </>
          )}
        </div>

        {/* Progress Bar */}
        {isUploading && uploadProgress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        disabled={isUploading}
      />

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
