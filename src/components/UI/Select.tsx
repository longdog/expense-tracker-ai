'use client';

import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  error,
  fullWidth = false,
  helperText,
  className = '',
  disabled,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={`
          block ${fullWidth ? 'w-full' : ''} px-3 py-2 text-base
          border rounded-md shadow-sm
          focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
          ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
          bg-white dark:bg-gray-700 text-gray-900 dark:text-white
          disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
          dark:disabled:bg-gray-800 dark:disabled:text-gray-400
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
};

export default Select;