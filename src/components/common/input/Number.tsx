import React from 'react';

interface NumberProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    name: string;
    value?: string | number;
    min?: number | string;
    max?: number | string;
    step?: number | string;
    error?: string;
    className?: string;
}

export const Number: React.FC<NumberProps> = ({
                                                  label,
                                                  name,
                                                  value,
                                                  min,
                                                  max,
                                                  step,
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
            <input
                type="number"
                id={name}
                name={name}
                value={value}
                min={min}
                max={max}
                step={step}
                className={`block w-full rounded-md shadow-sm sm:text-sm ${
                    error
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
                {...rest}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};