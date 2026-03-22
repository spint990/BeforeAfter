'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ImageComparisonSlider from './ImageComparisonSlider';
import ParameterSelector from './ParameterSelector';
import { ComparisonViewProps } from '@/types';

export default function ComparisonView({
  game,
  defaultParameterId,
  defaultBeforeLevel,
  defaultAfterLevel,
}: ComparisonViewProps) {
  // Initialize with first parameter if available
  const firstParameter = game.parameters[0];
  const firstParameterLevels = firstParameter?.qualityLevels || [];
  
  const [selectedParameterId, setSelectedParameterId] = useState(
    defaultParameterId || firstParameter?.id || ''
  );
  const [leftLevel, setLeftLevel] = useState(
    defaultBeforeLevel || firstParameterLevels[0]?.level || ''
  );
  const [rightLevel, setRightLevel] = useState(
    defaultAfterLevel || firstParameterLevels[firstParameterLevels.length - 1]?.level || ''
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Get current parameter
  const parameter = useMemo(
    () => game.parameters.find((p) => p.id === selectedParameterId),
    [game.parameters, selectedParameterId]
  );

  // Get available levels for this parameter
  const availableLevels = useMemo(
    () => parameter?.qualityLevels.map((ql) => ql.level) || [],
    [parameter]
  );

  // Get image URLs for selected levels
  const leftImage = useMemo(
    () => parameter?.qualityLevels.find((ql) => ql.level === leftLevel)?.imageUrl || '',
    [parameter, leftLevel]
  );
  
  const rightImage = useMemo(
    () => parameter?.qualityLevels.find((ql) => ql.level === rightLevel)?.imageUrl || '',
    [parameter, rightLevel]
  );

  // Handle parameter change with transition effect
  const handleParameterChange = (id: string) => {
    if (id === selectedParameterId) return;
    
    setIsTransitioning(true);
    setSelectedParameterId(id);
    
    // Reset levels for new parameter
    const newParam = game.parameters.find((p) => p.id === id);
    if (newParam && newParam.qualityLevels.length > 0) {
      setLeftLevel(newParam.qualityLevels[0].level);
      setRightLevel(newParam.qualityLevels[newParam.qualityLevels.length - 1].level);
    }
    
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Ensure levels are valid when parameter changes
  useEffect(() => {
    if (availableLevels.length > 0) {
      if (!availableLevels.includes(leftLevel)) {
        setLeftLevel(availableLevels[0]);
      }
      if (!availableLevels.includes(rightLevel)) {
        setRightLevel(availableLevels[availableLevels.length - 1]);
      }
    }
  }, [availableLevels, leftLevel, rightLevel]);

  return (
    <div className="flex flex-col gap-6">
      {/* Game Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
        {/* Game Cover Image */}
        <div className="relative w-24 h-32 sm:w-28 sm:h-36 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0 border border-gray-700/50 shadow-lg shadow-purple-500/5">
          {game.coverImage ? (
            <Image
              src={game.coverImage}
              alt={game.name}
              fill
              className="object-cover"
              sizes="112px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              <svg
                className="w-10 h-10"
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
            </div>
          )}
        </div>

        {/* Game Info */}
        <div className="flex-1">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <Link
              href="/games"
              className="hover:text-purple-400 transition-colors"
            >
              Games
            </Link>
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-white">{game.name}</span>
          </div>

          {/* Game Name */}
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            {game.name}
          </h1>
        </div>

        {/* Back Link */}
        <Link
          href="/games"
          className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-purple-500/30 rounded-xl transition-all text-sm self-start"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Games
        </Link>
      </div>

      {/* Parameter Selector */}
      {game.parameters.length > 0 && availableLevels.length > 0 && (
        <ParameterSelector
          parameters={game.parameters}
          selectedParameterId={selectedParameterId}
          onParameterChange={handleParameterChange}
          leftLevel={leftLevel}
          rightLevel={rightLevel}
          availableLevels={availableLevels}
          onLeftLevelChange={setLeftLevel}
          onRightLevelChange={setRightLevel}
        />
      )}

      {/* Image Comparison */}
      <div
        className={`transition-opacity duration-300 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {game.parameters.length === 0 ? (
          <div className="w-full aspect-video rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 flex flex-col items-center justify-center gap-4 p-8">
            <svg
              className="w-16 h-16 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-300 mb-1">
                No Parameters Available
              </h3>
              <p className="text-sm text-gray-500">
                Add parameters to this game to enable comparisons
              </p>
            </div>
            <Link
              href="/admin"
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 rounded-xl transition-all text-sm hover:scale-105"
            >
              Go to Admin
            </Link>
          </div>
        ) : availableLevels.length < 2 ? (
          <div className="w-full aspect-video rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 flex flex-col items-center justify-center gap-4 p-8">
            <svg
              className="w-16 h-16 text-gray-500"
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
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-300 mb-1">
                Insufficient Quality Levels
              </h3>
              <p className="text-sm text-gray-500">
                Need at least 2 quality levels to compare. Current:{' '}
                {availableLevels.length}
              </p>
            </div>
            <Link
              href="/admin"
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 rounded-xl transition-all text-sm hover:scale-105"
            >
              Go to Admin
            </Link>
          </div>
        ) : (
          <ImageComparisonSlider
            leftImage={leftImage}
            rightImage={rightImage}
            leftLabel={leftLevel}
            rightLabel={rightLevel}
            className="w-full rounded-2xl border border-gray-700/50 shadow-2xl shadow-purple-500/5"
          />
        )}
      </div>
    </div>
  );
}
