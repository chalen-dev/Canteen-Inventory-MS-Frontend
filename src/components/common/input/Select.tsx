import React from 'react';

interface Option {
    value: string | number;
    label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    name: string;
    value?: string | number;
    options: Option[];
    error?: string;
    className?: string;
}

export const Select: React.FC<SelectProps> = ({
                                                  label,
                                                  name,
                                                  value,
                                                  options,
                                                  error,
                                                  className = '',
                                                  ...rest
                                              }) => {
    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <select
                id={name}
                name={name}
                value={value}
                className={`block w-full rounded-md shadow-sm sm:text-sm ${
                    error
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
                {...rest}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};