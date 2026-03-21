'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ImageUploader from './ImageUploader';

interface QualityLevel {
  id: string;
  level: string;
  imageUrl: string;
}

interface Parameter {
  id: string;
  name: string;
  slug: string;
  qualityLevels: QualityLevel[];
}

interface ParameterManagerProps {
  gameId: string;
  parameters: Parameter[];
  onRefresh: () => void;
}

const DEFAULT_LEVELS = ['Low', 'Medium', 'High', 'Ultra'];

export default function ParameterManager({
  gameId,
  parameters,
  onRefresh,
}: ParameterManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedParameter, setExpandedParameter] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNewNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewName(value);
    setNewSlug(generateSlug(value));
    if (errors.newName) setErrors((prev) => ({ ...prev, newName: '' }));
  };

  const handleEditNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditName(value);
    setEditSlug(generateSlug(value));
    if (errors.editName) setErrors((prev) => ({ ...prev, editName: '' }));
  };

  // Add new parameter
  const handleAddParameter = async () => {
    if (!newName.trim()) {
      setErrors((prev) => ({ ...prev, newName: 'Name is required' }));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/parameters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId,
          name: newName.trim(),
          slug: newSlug.trim() || generateSlug(newName),
        }),
      });

      if (!response.ok) throw new Error('Failed to create parameter');

      setNewName('');
      setNewSlug('');
      setIsAdding(false);
      onRefresh();
    } catch (error) {
      console.error('Error adding parameter:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update parameter
  const handleUpdateParameter = async (id: string) => {
    if (!editName.trim()) {
      setErrors((prev) => ({ ...prev, editName: 'Name is required' }));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/parameters/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName.trim(),
          slug: editSlug.trim() || generateSlug(editName),
        }),
      });

      if (!response.ok) throw new Error('Failed to update parameter');

      setEditingId(null);
      onRefresh();
    } catch (error) {
      console.error('Error updating parameter:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete parameter
  const handleDeleteParameter = async (id: string) => {
    if (!confirm('Are you sure you want to delete this parameter and all its quality levels?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/parameters/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete parameter');

      onRefresh();
    } catch (error) {
      console.error('Error deleting parameter:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle quality level image upload
  const handleQualityLevelImageUpload = async (parameterId: string, level: string, imageUrl: string) => {
    try {
      // Check if quality level exists
      const existingLevel = parameters
        .find((p) => p.id === parameterId)
        ?.qualityLevels.find((ql) => ql.level === level);

      if (existingLevel) {
        // Update existing
        const response = await fetch(`/api/quality-levels/${existingLevel.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl }),
        });
        if (!response.ok) throw new Error('Failed to update quality level');
      } else {
        // Create new
        const response = await fetch('/api/quality-levels', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            parameterId,
            level,
            imageUrl,
          }),
        });
        if (!response.ok) throw new Error('Failed to create quality level');
      }

      onRefresh();
    } catch (error) {
      console.error('Error updating quality level:', error);
    }
  };

  const startEditing = (parameter: Parameter) => {
    setEditingId(parameter.id);
    setEditName(parameter.name);
    setEditSlug(parameter.slug);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
    setEditSlug('');
    setErrors((prev) => ({ ...prev, editName: '' }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-100">Parameters</h3>
        <Button
          onClick={() => setIsAdding(true)}
          size="sm"
          disabled={isAdding}
        >
          Add Parameter
        </Button>
      </div>

      {/* Add New Parameter Form */}
      {isAdding && (
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Name"
              value={newName}
              onChange={handleNewNameChange}
              error={errors.newName}
              placeholder="e.g., Shadows"
              disabled={loading}
            />
            <Input
              label="Slug"
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
              placeholder="e.g., shadows"
              disabled={loading}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddParameter} loading={loading} size="sm">
              Create
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setIsAdding(false);
                setNewName('');
                setNewSlug('');
                setErrors({});
              }}
              size="sm"
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Parameters List */}
      {parameters.length === 0 && !isAdding ? (
        <p className="text-gray-400 text-center py-8">No parameters yet. Add your first parameter above.</p>
      ) : (
        <div className="space-y-3">
          {parameters.map((parameter) => (
            <div
              key={parameter.id}
              className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
            >
              {/* Parameter Header */}
              <div className="p-4 flex items-center justify-between">
                {editingId === parameter.id ? (
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 mr-4">
                    <Input
                      value={editName}
                      onChange={handleEditNameChange}
                      error={errors.editName}
                      disabled={loading}
                    />
                    <Input
                      value={editSlug}
                      onChange={(e) => setEditSlug(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                ) : (
                  <div>
                    <h4 className="font-medium text-gray-100">{parameter.name}</h4>
                    <p className="text-sm text-gray-400">{parameter.slug}</p>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {editingId === parameter.id ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleUpdateParameter(parameter.id)}
                        loading={loading}
                      >
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={cancelEditing}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedParameter(
                          expandedParameter === parameter.id ? null : parameter.id
                        )}
                      >
                        {expandedParameter === parameter.id ? 'Hide' : 'Levels'}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => startEditing(parameter)}
                        disabled={editingId !== null}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteParameter(parameter.id)}
                        disabled={loading}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Quality Levels Section */}
              {expandedParameter === parameter.id && (
                <div className="border-t border-gray-700 p-4">
                  <h5 className="text-sm font-medium text-gray-300 mb-4">Quality Levels</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {DEFAULT_LEVELS.map((level) => {
                      const qualityLevel = parameter.qualityLevels.find((ql) => ql.level === level);
                      return (
                        <div key={level} className="space-y-2">
                          <p className="text-xs font-medium text-gray-400">{level}</p>
                          <ImageUploader
                            onUpload={(url) => handleQualityLevelImageUpload(parameter.id, level, url)}
                            currentImage={qualityLevel?.imageUrl}
                            folder="comparisons"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
