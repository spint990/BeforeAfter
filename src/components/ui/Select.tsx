'use client';

import React from 'react';

interface SelectProps {
  label?: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
  required?: boolean;
}

export default function Select({
  label,
  options,
  value,
  onChange,
  error,
  className = '',
  placeholder,
  disabled = false,
  name,
  id,
  required = false,
}: SelectProps) {
  const selectId = id || name || label?.toLowerCase().replace(/\s+/g, '-');
  
  const baseSelectStyles = 'w-full px-4 py-2 bg-gray-800 border rounded-lg text-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 appearance-none cursor-pointer';
  
  const normalBorderStyles = 'border-gray-600 hover:border-gray-500 focus:border-accent-primary focus:ring-accent-primary/50';
  
  const errorBorderStyles = 'border-accent-danger focus:border-accent-danger focus:ring-accent-danger/50';
  
  const disabledStyles = 'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-700';

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label 
          htmlFor={selectId} 
          className="text-sm font-medium text-gray-200"
        >
          {label}
          {required && <span className="text-accent-danger ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`
            ${baseSelectStyles}
            ${error ? errorBorderStyles : normalBorderStyles}
            ${disabledStyles}
            ${!value ? 'text-gray-400' : ''}
          `.trim().replace(/\s+/g, ' ')}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg 
            className="h-5 w-5 text-gray-400" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
      </div>
      {error && (
        <p className="text-sm text-accent-danger mt-1">{error}</p>
      )}
    </div>
  );
}
