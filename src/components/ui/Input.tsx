'use client';

import React from 'react';

interface InputProps {
  label?: string;
  error?: string;
  type?: 'text' | 'email' | 'password' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  id?: string;
}

export default function Input({
  label,
  error,
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  required = false,
  disabled = false,
  name,
  id,
}: InputProps) {
  const inputId = id || name || label?.toLowerCase().replace(/\s+/g, '-');
  
  const baseInputStyles = 'w-full px-4 py-2.5 bg-gray-800/50 border rounded-xl text-gray-100 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50';
  
  const normalBorderStyles = 'border-gray-700/50 hover:border-gray-600/50 focus:border-purple-500/50';
  
  const errorBorderStyles = 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50';
  
  const disabledStyles = 'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-800/30';

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="text-sm font-medium text-gray-300"
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`
          ${baseInputStyles}
          ${error ? errorBorderStyles : normalBorderStyles}
          ${disabledStyles}
        `.trim().replace(/\s+/g, ' ')}
      />
      {error && (
        <p className="text-sm text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
}
