import React from 'react'

export interface ButtonProps {
    children: React.ReactNode
    onClick?: () => void
    variant?: 'primary' | 'secondary'
    size?: 'small' | 'medium' | 'large'
    disabled?: boolean
}

export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    variant = 'primary',
    size = 'medium',
    disabled = false,
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`button ${variant} ${size}`}
        >
            {children}
        </button>
    )
} 