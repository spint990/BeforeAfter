'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import ImageUploader from '@/components/admin/ImageUploader';

interface Game {
  id: string;
  name: string;
  slug: string;
}

interface Parameter {
  id: string;
  name: string;
  slug: string;
  gameId: string;
}

interface QualityLevel {
  id: string;
  level: number;
  label: string;
  parameterId: string;
}

// Track image for each custom option
interface OptionImage {
  option: string;
  imageUrl: string;
}

export default function PhotoSubmissionForm() {
  const router = useRouter();
  
  // Step tracking
  const [currentStep, setCurrentStep] = useState(1);
  
  // Loading states
  const [loadingGames, setLoadingGames] = useState(true);
  const [loadingParameters, setLoadingParameters] = useState(false);
  const [loadingQualityLevels, setLoadingQualityLevels] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Data
  const [games, setGames] = useState<Game[]>([]);
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [qualityLevels, setQualityLevels] = useState<QualityLevel[]>([]);

  // Form fields
  const [selectedGameId, setSelectedGameId] = useState('');
  const [selectedParameterId, setSelectedParameterId] = useState('');
  const [selectedQualityLevelId, setSelectedQualityLevelId] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Custom parameter creation
  const [useCustomParameter, setUseCustomParameter] = useState(false);
  const [customParameterName, setCustomParameterName] = useState('');
  const [customParameterOptions, setCustomParameterOptions] = useState<string[]>(['']);
  const [selectedCustomOption, setSelectedCustomOption] = useState('');
  
  // Track images for each custom option - maps option name to image URL
  const [optionImages, setOptionImages] = useState<Record<string, string>>({});

  // Validation errors
  const [errors, setErrors] = useState<{
    game?: string;
    parameter?: string;
    qualityLevel?: string;
    image?: string;
    optionImages?: string;
  }>({});

  // Fetch games on mount
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('/api/games?take=100');
        const data = await response.json();
        setGames(data.games || []);
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setLoadingGames(false);
      }
    };
    fetchGames();
  }, []);

  // Fetch parameters when game is selected
  useEffect(() => {
    if (!selectedGameId) {
      setParameters([]);
      setQualityLevels([]);
      setSelectedParameterId('');
      setSelectedQualityLevelId('');
      return;
    }

    const fetchParameters = async () => {
      setLoadingParameters(true);
      try {
        const response = await fetch(`/api/games/${selectedGameId}`);
        const data = await response.json();
        setParameters(data.parameters || []);
      } catch (error) {
        console.error('Error fetching parameters:', error);
        setParameters([]);
      } finally {
        setLoadingParameters(false);
      }
    };
    fetchParameters();
  }, [selectedGameId]);

  // Fetch quality levels when parameter is selected
  useEffect(() => {
    if (!selectedParameterId) {
      setQualityLevels([]);
      setSelectedQualityLevelId('');
      return;
    }

    const fetchQualityLevels = async () => {
      setLoadingQualityLevels(true);
      try {
        const response = await fetch(`/api/parameters/${selectedParameterId}`);
        const data = await response.json();
        setQualityLevels(data.qualityLevels || []);
      } catch (error) {
        console.error('Error fetching quality levels:', error);
        setQualityLevels([]);
      } finally {
        setLoadingQualityLevels(false);
      }
    };
    fetchQualityLevels();
  }, [selectedParameterId]);

  // Reset dependent fields when parent changes
  useEffect(() => {
    setSelectedParameterId('');
    setQualityLevels([]);
    setSelectedQualityLevelId('');
  }, [selectedGameId]);

  useEffect(() => {
    setSelectedQualityLevelId('');
  }, [selectedParameterId]);

  // Custom parameter helpers
  const addCustomOption = () => {
    setCustomParameterOptions([...customParameterOptions, '']);
  };

  const updateCustomOption = (index: number, value: string) => {
    const updated = [...customParameterOptions];
    updated[index] = value;
    setCustomParameterOptions(updated);
    // Also update optionImages - remove the old key and add new one
    setOptionImages(prev => {
      const newImages = { ...prev };
      const oldValue = prev[customParameterOptions[index]];
      delete newImages[customParameterOptions[index]];
      if (oldValue && value.trim()) {
        newImages[value] = oldValue;
      }
      return newImages;
    });
  };

  const removeCustomOption = (index: number) => {
    if (customParameterOptions.length > 1) {
      const optionToRemove = customParameterOptions[index];
      const updated = customParameterOptions.filter((_, i) => i !== index);
      setCustomParameterOptions(updated);
      // Also remove from optionImages
      setOptionImages(prev => {
        const newImages = { ...prev };
        delete newImages[optionToRemove];
        return newImages;
      });
    }
  };

  // Handle image upload for a specific option
  const handleOptionImageUpload = (option: string, url: string) => {
    setOptionImages(prev => ({
      ...prev,
      [option]: url,
    }));
  };

  // Check if all options have images
  const allOptionsHaveImages = () => {
    const validOptions = customParameterOptions.filter(opt => opt.trim() !== '');
    return validOptions.every(opt => optionImages[opt] && optionImages[opt].trim() !== '');
  };

  const validateStep = (step: number): boolean => {
    const newErrors: typeof errors = {};

    if (step === 1) {
      if (!selectedGameId) {
        newErrors.game = 'Please select a game';
      }
    } else if (step === 2) {
      if (useCustomParameter) {
        if (!customParameterName.trim()) {
          newErrors.parameter = 'Please enter a parameter name';
        }
        const validOptions = customParameterOptions.filter(opt => opt.trim() !== '');
        if (validOptions.length === 0) {
          newErrors.qualityLevel = 'Please add at least one option';
        }
      } else {
        if (!selectedParameterId) {
          newErrors.parameter = 'Please select a parameter';
        }
        if (!selectedQualityLevelId) {
          newErrors.qualityLevel = 'Please select a quality level';
        }
      }
    } else if (step === 3) {
      if (useCustomParameter) {
        // For custom parameters, check that all options have images
        const validOptions = customParameterOptions.filter(opt => opt.trim() !== '');
        const missingImages = validOptions.filter(opt => !optionImages[opt] || optionImages[opt].trim() === '');
        if (missingImages.length > 0) {
          newErrors.optionImages = `Please upload images for all options. Missing: ${missingImages.join(', ')}`;
        }
      } else {
        if (!imageUrl) {
          newErrors.image = 'Please upload an image';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateStep(3)) return;

    setSubmitting(true);

    try {
      if (useCustomParameter) {
        // Submit multiple photos - one for each option
        const validOptions = customParameterOptions.filter(opt => opt.trim() !== '');
        const submissions = validOptions.map(opt => ({
          gameId: selectedGameId,
          imageUrl: optionImages[opt],
          customParameter: {
            name: customParameterName.trim(),
            options: validOptions,
            selectedOption: opt,
          },
        }));

        // Submit all photos
        const results = await Promise.all(
          submissions.map(sub => 
            fetch('/api/submissions/photos', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(sub),
            })
          )
        );

        // Check for errors
        const errors = await Promise.all(results.map(r => r.ok ? null : r.json()));
        const failedSubmissions = errors.filter(e => e !== null);
        
        if (failedSubmissions.length > 0) {
          throw new Error(`${failedSubmissions.length} submission(s) failed: ${failedSubmissions.map(e => e?.error).join(', ')}`);
        }

        setSuccess(true);
      } else {
        // Single photo submission for existing parameter
        const requestBody: Record<string, unknown> = {
          gameId: selectedGameId,
          imageUrl,
          parameterId: selectedParameterId,
          qualityLevelId: selectedQualityLevelId,
        };

        const response = await fetch('/api/submissions/photos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to submit photo');
        }

        setSuccess(true);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit photo');
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = (url: string) => {
    setImageUrl(url);
    if (errors.image) setErrors((prev) => ({ ...prev, image: undefined }));
  };

  const selectedGame = games.find((g) => g.id === selectedGameId);
  const selectedParameter = parameters.find((p) => p.id === selectedParameterId);
  const selectedQualityLevel = qualityLevels.find((q) => q.id === selectedQualityLevelId);

  const gameOptions = games.map((g) => ({ value: g.id, label: g.name }));
  const parameterOptions = parameters.map((p) => ({ value: p.id, label: p.name }));
  const qualityLevelOptions = qualityLevels.map((q) => ({ value: q.id, label: q.label || `Level ${q.level}` }));

  // Get valid options for custom parameter
  const validCustomOptions = customParameterOptions.filter(opt => opt.trim() !== '');

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
          <h2 className="text-2xl font-bold text-white mb-3">
            {useCustomParameter ? 'Photos Submitted!' : 'Photo Submitted!'}
          </h2>
          <p className="text-gray-400 mb-6">
            Thank you for contributing to our database. {useCustomParameter 
              ? `Your ${validCustomOptions.length} photo submissions for `
              : 'Your photo submission for '}
            <span className="text-white font-medium">{selectedGame?.name}</span> has been received.
          </p>
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-gray-400">
              <span className="text-purple-400 font-medium">Submission Details:</span>
              <br />
              <span className="text-gray-300">Game:</span> {selectedGame?.name}
              <br />
              <span className="text-gray-300">Parameter:</span> {useCustomParameter ? customParameterName : selectedParameter?.name}
              <br />
              {useCustomParameter ? (
                <>
                  <span className="text-gray-300">Options submitted:</span>
                  <ul className="list-disc list-inside ml-2 mt-1">
                    {validCustomOptions.map(opt => (
                      <li key={opt}>{opt}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <span className="text-gray-300">Quality Level:</span> {selectedQualityLevel?.label || `Level ${selectedQualityLevel?.level}`}
                </>
              )}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => router.push('/submit')}>
              Back to Submit Hub
            </Button>
            <Button variant="secondary" onClick={() => {
              setSuccess(false);
              setCurrentStep(1);
              setSelectedGameId('');
              setSelectedParameterId('');
              setSelectedQualityLevelId('');
              setImageUrl('');
              setUseCustomParameter(false);
              setCustomParameterName('');
              setCustomParameterOptions(['']);
              setSelectedCustomOption('');
              setOptionImages({});
            }}>
              Submit Another Photo
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
        <h1 className="text-3xl font-bold text-white mb-2">Submit Photos</h1>
        <p className="text-gray-400">
          Contribute comparison photos to existing games in our database.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[
            { step: 1, label: 'Select Game' },
            { step: 2, label: 'Choose Settings' },
            { step: 3, label: 'Upload Photo' },
          ].map((s, index) => (
            <React.Fragment key={s.step}>
              <div className="flex items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                    ${currentStep >= s.step
                      ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                      : 'bg-gray-700 text-gray-400'
                    }
                  `}
                >
                  {currentStep > s.step ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    s.step
                  )}
                </div>
                <span className={`ml-3 text-sm font-medium hidden sm:inline ${
                  currentStep >= s.step ? 'text-white' : 'text-gray-500'
                }`}>
                  {s.label}
                </span>
              </div>
              {index < 2 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  currentStep > s.step ? 'bg-gradient-to-r from-purple-500 to-cyan-500' : 'bg-gray-700'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Select Game */}
        {currentStep === 1 && (
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Select a Game</h2>
            {loadingGames ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : games.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">No games available in the database yet.</p>
                <Link href="/submit/game">
                  <Button>Submit a Game First</Button>
                </Link>
              </div>
            ) : (
              <>
                <Select
                  label="Game"
                  options={gameOptions}
                  value={selectedGameId}
                  onChange={(e) => {
                    setSelectedGameId(e.target.value);
                    if (errors.game) setErrors((prev) => ({ ...prev, game: undefined }));
                  }}
                  error={errors.game}
                  placeholder="Choose a game..."
                  disabled={loadingGames}
                  required
                />
                {selectedGame && (
                  <div className="mt-4 p-4 bg-gray-700/30 rounded-lg">
                    <p className="text-sm text-gray-400">
                      Selected: <span className="text-white font-medium">{selectedGame.name}</span>
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Step 2: Select Parameter and Quality Level */}
        {currentStep === 2 && (
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Select Parameter & Quality Level</h2>
            
            {/* Toggle between existing and custom parameter */}
            <div className="flex gap-2 mb-6">
              <button
                type="button"
                onClick={() => setUseCustomParameter(false)}
                className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                  !useCustomParameter
                    ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 border border-gray-600/50'
                }`}
              >
                Existing Parameter
              </button>
              <button
                type="button"
                onClick={() => setUseCustomParameter(true)}
                className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                  useCustomParameter
                    ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 border border-gray-600/50'
                }`}
              >
                Create Custom
              </button>
            </div>

            {!useCustomParameter ? (
              <>
                {loadingParameters ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : parameters.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-2">This game has no parameters defined yet.</p>
                    <p className="text-sm text-gray-500 mb-4">
                      Switch to "Create Custom" to define your own parameter.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Select
                      label="Parameter"
                      options={parameterOptions}
                      value={selectedParameterId}
                      onChange={(e) => {
                        setSelectedParameterId(e.target.value);
                        if (errors.parameter) setErrors((prev) => ({ ...prev, parameter: undefined }));
                      }}
                      error={errors.parameter}
                      placeholder="Choose a parameter..."
                      disabled={loadingParameters}
                      required
                    />

                    {selectedParameterId && (
                      loadingQualityLevels ? (
                        <div className="flex items-center justify-center py-4">
                          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : qualityLevels.length === 0 ? (
                        <div className="text-center py-4">
                          <p className="text-sm text-gray-500">
                            This parameter has no quality levels defined yet.
                          </p>
                        </div>
                      ) : (
                        <Select
                          label="Quality Level"
                          options={qualityLevelOptions}
                          value={selectedQualityLevelId}
                          onChange={(e) => {
                            setSelectedQualityLevelId(e.target.value);
                            if (errors.qualityLevel) setErrors((prev) => ({ ...prev, qualityLevel: undefined }));
                          }}
                          error={errors.qualityLevel}
                          placeholder="Choose a quality level..."
                          disabled={loadingQualityLevels}
                          required
                        />
                      )
                    )}

                    {selectedQualityLevel && (
                      <div className="mt-4 p-4 bg-gray-700/30 rounded-lg">
                        <p className="text-sm text-gray-400">
                          You're submitting a photo for:
                          <br />
                          <span className="text-white font-medium">{selectedGame?.name}</span>
                          {' '}→{' '}
                          <span className="text-white font-medium">{selectedParameter?.name}</span>
                          {' '}→{' '}
                          <span className="text-white font-medium">{selectedQualityLevel.label || `Level ${selectedQualityLevel.level}`}</span>
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4">
                {/* Custom parameter name */}
                <Input
                  label="Parameter Name"
                  name="customParameterName"
                  value={customParameterName}
                  onChange={(e) => {
                    setCustomParameterName(e.target.value);
                    if (errors.parameter) setErrors((prev) => ({ ...prev, parameter: undefined }));
                  }}
                  error={errors.parameter}
                  placeholder="e.g., Ray Tracing, Resolution, Shadows..."
                  required
                />

                {/* Custom parameter options */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-200">
                    Parameter Options <span className="text-red-400">*</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Add the different settings/values for this parameter (e.g., Low, Medium, High). 
                    You will need to upload a photo for each option in the next step.
                  </p>
                   
                  {customParameterOptions.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateCustomOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-100 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 hover:border-gray-600/50"
                      />
                      {customParameterOptions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCustomOption(index)}
                          className="px-3 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addCustomOption}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-xl hover:bg-gray-600/50 border border-gray-600/50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Option
                  </button>

                  {errors.qualityLevel && (
                    <p className="text-sm text-red-400 mt-1">{errors.qualityLevel}</p>
                  )}
                </div>

                {/* Summary */}
                {customParameterName && validCustomOptions.length > 0 && (
                  <div className="mt-4 p-4 bg-gray-700/30 rounded-xl">
                    <p className="text-sm text-gray-400">
                      You're creating a parameter with {validCustomOptions.length} options:
                      <br />
                      <span className="text-white font-medium">{selectedGame?.name}</span>
                      {' '}→{' '}
                      <span className="text-white font-medium">{customParameterName}</span>
                      <br />
                      <span className="text-gray-500">Options: {validCustomOptions.join(', ')}</span>
                      <br />
                      <span className="text-purple-400">You'll upload {validCustomOptions.length} photos in the next step.</span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Upload Photo(s) */}
        {currentStep === 3 && (
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              {useCustomParameter ? `Upload ${validCustomOptions.length} Photos` : 'Upload Your Photo'}
            </h2>
            
            <div className="space-y-6">
              {/* Custom Parameter - Multiple Image Uploads */}
              {useCustomParameter ? (
                <div className="space-y-6">
                  <p className="text-sm text-gray-400">
                    Upload a photo for each option of your custom parameter. Each photo will be submitted separately for review.
                  </p>
                  
                  {validCustomOptions.map((option, index) => (
                    <div key={option} className="space-y-2 p-4 bg-gray-700/20 rounded-xl border border-gray-600/50">
                      <label className="block text-sm font-medium text-white">
                        Photo for "{option}" <span className="text-red-400">*</span>
                      </label>
                      <p className="text-xs text-gray-500">
                        Upload a screenshot showing the "{option}" setting
                      </p>
                      <ImageUploader
                        onUpload={(url) => handleOptionImageUpload(option, url)}
                        currentImage={optionImages[option] || ''}
                        folder="comparisons"
                      />
                      {errors.image && !optionImages[option] && (
                        <p className="text-sm text-red-400 mt-1">
                          Please upload a photo for "{option}"
                        </p>
                      )}
                    </div>
                  ))}

                  {/* Progress indicator */}
                  <div className="p-3 bg-gray-700/30 rounded-xl">
                    <p className="text-sm text-gray-400">
                      Progress: {Object.keys(optionImages).filter(key => validCustomOptions.includes(key) && optionImages[key]).length} of {validCustomOptions.length} photos uploaded
                    </p>
                    <div className="mt-2 h-2 bg-gray-600 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-300"
                        style={{ 
                          width: `${(Object.keys(optionImages).filter(key => validCustomOptions.includes(key) && optionImages[key]).length / validCustomOptions.length) * 100}%` 
                        }}
                      />
                    </div>
                  </div>

                  {/* Submission Summary */}
                  <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-600/50">
                    <h3 className="text-sm font-medium text-white mb-2">Submission Summary</h3>
                    <div className="space-y-1 text-sm text-gray-400">
                      <p><span className="text-gray-500">Game:</span> {selectedGame?.name}</p>
                      <p><span className="text-gray-500">Custom Parameter:</span> {customParameterName}</p>
                      <p><span className="text-gray-500">Options:</span> {validCustomOptions.join(', ')}</p>
                      <p><span className="text-gray-500">Total Submissions:</span> {validCustomOptions.length} photos</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Existing Parameter - Single Image Upload */
                <div className="space-y-6">
                  {/* Image Upload */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-200">
                      Photo Upload <span className="text-red-400">*</span>
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      Upload a high-quality comparison screenshot
                    </p>
                    <ImageUploader
                      onUpload={handleImageUpload}
                      currentImage={imageUrl}
                      folder="comparisons"
                    />
                    {errors.image && (
                      <p className="text-sm text-red-400 mt-1">{errors.image}</p>
                    )}
                  </div>

                  {/* Submission Summary */}
                  <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-600/50">
                    <h3 className="text-sm font-medium text-white mb-2">Submission Summary</h3>
                    <div className="space-y-1 text-sm text-gray-400">
                      <p><span className="text-gray-500">Game:</span> {selectedGame?.name}</p>
                      <p><span className="text-gray-500">Parameter:</span> {selectedParameter?.name}</p>
                      <p><span className="text-gray-500">Quality Level:</span> {selectedQualityLevel?.label || `Level ${selectedQualityLevel?.level}`}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {submitError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"
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
              <p className="text-sm text-red-400">{submitError}</p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="secondary"
              onClick={handlePrevStep}
              disabled={submitting}
            >
              Previous
            </Button>
          ) : (
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/submit')}
              disabled={submitting}
            >
              Cancel
            </Button>
          )}

          {currentStep < 3 ? (
            <Button
              type="button"
              onClick={handleNextStep}
              disabled={
                (currentStep === 1 && !selectedGameId) ||
                (currentStep === 2 && (
                  useCustomParameter
                    ? !customParameterName || validCustomOptions.length === 0
                    : !selectedParameterId || !selectedQualityLevelId
                ))
              }
            >
              Continue
            </Button>
          ) : (
            <Button
              type="submit"
              loading={submitting}
              disabled={submitting || (useCustomParameter ? !allOptionsHaveImages() : !imageUrl)}
            >
              {useCustomParameter 
                ? `Submit ${validCustomOptions.length} Photos` 
                : 'Submit Photo'}
            </Button>
          )}
        </div>

        {/* Notice */}
        <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 text-sm text-gray-400">
          <p>
            <span className="text-purple-400 font-medium">Note:</span> Your submission{useCustomParameter ? 's will be' : ' will be'} 
            reviewed by our team before being published. Please ensure your screenshot{useCustomParameter ? 's accurately' : ' accurately'} 
            represents the selected settings.
          </p>
        </div>
      </form>
    </div>
  );
}
