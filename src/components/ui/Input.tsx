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
  
  const baseInputStyles = 'w-full px-4 py-2 bg-gray-800 border rounded-lg text-gray-100 placeholder-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent-primary/50';
  
  const normalBorderStyles = 'border-gray-600 hover:border-gray-500 focus:border-accent-primary';
  
  const errorBorderStyles = 'border-accent-danger focus:border-accent-danger focus:ring-accent-danger/50';
  
  const disabledStyles = 'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-700';

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="text-sm font-medium text-gray-200"
        >
          {label}
          {required && <span className="text-accent-danger ml-1">*</span>}
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
        <p className="text-sm text-accent-danger mt-1">{error}</p>
      )}
    </div>
  );
}
