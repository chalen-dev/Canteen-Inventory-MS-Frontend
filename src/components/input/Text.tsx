import React from 'react';

type TextProps = {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    id?: string;
    label?: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function Text({
                         name,
                         value,
                         onChange,
                         id,
                         label = 'Input Label',
                         type = 'text',
                         placeholder,
                         disabled,
                         required,
                         className = '',
                         ...rest
                     }: TextProps) {
    const inputId = id || name;

    return (
        <div className={className}>
            {label && <label htmlFor={inputId}>{label}</label>}
            <input
                type={type}
                id={inputId}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                {...rest}
            />
        </div>
    );
}