import React, { ReactNode } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'text';
    size?: 'small' | 'medium' | 'large';
    children: ReactNode;
    className?: string;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'medium',
    className = '',
    ...props
}) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors';
    const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
        text: 'text-blue-600 hover:text-blue-700',
    };
    const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
        small: 'px-3 py-1.5 text-sm',
        medium: 'px-4 py-2 text-base',
        large: 'px-6 py-3 text-lg',
    };

    const classes = [
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className,
    ].filter(Boolean).join(' ');

    return (
        <button
            className={classes}
            data-testid="ui-button"
            {...props}
        >
            {children}
        </button>
    );
}; 