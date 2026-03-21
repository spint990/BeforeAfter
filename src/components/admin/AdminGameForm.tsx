'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface AdminGameFormProps {
  initialData?: {
    id?: string;
    name: string;
    slug: string;
    coverImage?: string | null;
  };
  onSubmit: (data: { name: string; slug: string; coverImage?: string }) => Promise<void>;
  isEditing?: boolean;
  onCancel?: () => void;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-')       // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '');  // Remove leading/trailing hyphens
}

export default function AdminGameForm({
  initialData,
  onSubmit,
  isEditing = false,
  onCancel,
}: AdminGameFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; slug?: string }>({});
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEditing);

  // Auto-generate slug from name if not manually edited
  useEffect(() => {
    if (!slugManuallyEdited && name) {
      setSlug(generateSlug(name));
    }
  }, [name, slugManuallyEdited]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugManuallyEdited(true);
    setSlug(e.target.value);
    if (errors.slug) {
      setErrors((prev) => ({ ...prev, slug: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: { name?: string; slug?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        slug: slug.trim(),
        coverImage: coverImage.trim() || undefined,
      });
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Game Name"
        name="name"
        value={name}
        onChange={handleNameChange}
        error={errors.name}
        placeholder="Enter game name"
        required
        disabled={loading}
      />
      
      <Input
        label="Slug"
        name="slug"
        value={slug}
        onChange={handleSlugChange}
        error={errors.slug}
        placeholder="game-url-slug"
        required
        disabled={loading}
      />
      
      <div className="space-y-1.5">
        <Input
          label="Cover Image URL"
          name="coverImage"
          type="url"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          placeholder="https://example.com/cover.jpg"
          disabled={loading}
        />
        
        {/* Cover Image Preview */}
        {coverImage && (
          <div className="mt-3 relative w-40 h-56 rounded-lg overflow-hidden bg-gray-800 border border-gray-700">
            <img
              src={coverImage}
              alt="Cover preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
      </div>
      
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
        >
          {isEditing ? 'Update Game' : 'Create Game'}
        </Button>
        
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
