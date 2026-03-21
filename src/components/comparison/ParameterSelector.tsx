'use client';

import React from 'react';
import Select from '@/components/ui/Select';

interface ParameterSelectorProps {
  parameters: { id: string; name: string; slug: string }[];
  selectedParameterId: string;
  onParameterChange: (id: string) => void;
  leftLevel: string;
  rightLevel: string;
  availableLevels: string[];
  onLeftLevelChange: (level: string) => void;
  onRightLevelChange: (level: string) => void;
}

export default function ParameterSelector({
  parameters,
  selectedParameterId,
  onParameterChange,
  leftLevel,
  rightLevel,
  availableLevels,
  onLeftLevelChange,
  onRightLevelChange,
}: ParameterSelectorProps) {
  // Convert parameters to select options
  const parameterOptions = parameters.map((param) => ({
    value: param.id,
    label: param.name,
  }));

  // Convert levels to select options
  const levelOptions = availableLevels.map((level) => ({
    value: level,
    label: level,
  }));

  return (
    <div className="w-full bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Parameter Selector */}
        <Select
          label="Parameter"
          options={parameterOptions}
          value={selectedParameterId}
          onChange={(e) => onParameterChange(e.target.value)}
          placeholder="Select a parameter"
        />

        {/* Left (Before) Level Selector */}
        <Select
          label="Before (Left)"
          options={levelOptions}
          value={leftLevel}
          onChange={(e) => onLeftLevelChange(e.target.value)}
          placeholder="Select level"
        />

        {/* Right (After) Level Selector */}
        <Select
          label="After (Right)"
          options={levelOptions}
          value={rightLevel}
          onChange={(e) => onRightLevelChange(e.target.value)}
          placeholder="Select level"
        />
      </div>

      {/* Visual indicator showing the comparison */}
      {leftLevel && rightLevel && (
        <div className="mt-4 flex items-center justify-center gap-3 text-sm text-gray-400">
          <span className="px-3 py-1 bg-gray-700 rounded-full">
            {leftLevel}
          </span>
          <svg 
            className="w-5 h-5 text-accent-primary" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M13 7l5 5m0 0l-5 5m5-5H6" 
            />
          </svg>
          <span className="px-3 py-1 bg-accent-primary/20 text-accent-primary rounded-full">
            {rightLevel}
          </span>
        </div>
      )}
    </div>
  );
}
