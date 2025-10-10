import React from 'react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

// Enhanced Loading Component with different variants
interface LoadingProps {
    text?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
    className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
    text = 'Loading...',
    size = 'md',
    variant = 'spinner',
    className = ''
}) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-12 h-12'
    };

    const containerSizeClasses = {
        sm: 'gap-2 text-sm',
        md: 'gap-3 text-base',
        lg: 'gap-4 text-lg',
        xl: 'gap-6 text-xl'
    };

    if (variant === 'spinner') {
        return (
            <div className={`flex items-center justify-center ${containerSizeClasses[size]} ${className}`}>
                <Loader2 className={`${sizeClasses[size]} animate-spin text-primary-blue`} />
                {text && <span className="text-gray-300">{text}</span>}
            </div>
        );
    }

    if (variant === 'dots') {
        return (
            <div className={`flex items-center justify-center ${containerSizeClasses[size]} ${className}`}>
                <div className="flex space-x-1">
                    <div className={`${sizeClasses[size].split(' ')[0]} ${sizeClasses[size].split(' ')[1]} bg-primary-blue rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
                    <div className={`${sizeClasses[size].split(' ')[0]} ${sizeClasses[size].split(' ')[1]} bg-primary-blue rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
                    <div className={`${sizeClasses[size].split(' ')[0]} ${sizeClasses[size].split(' ')[1]} bg-primary-blue rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
                </div>
                {text && <span className="text-gray-300">{text}</span>}
            </div>
        );
    }

    if (variant === 'pulse') {
        return (
            <div className={`flex items-center justify-center ${containerSizeClasses[size]} ${className}`}>
                <div className={`${sizeClasses[size]} bg-primary-blue rounded-full animate-pulse`}></div>
                {text && <span className="text-gray-300 animate-pulse">{text}</span>}
            </div>
        );
    }

    if (variant === 'skeleton') {
        return (
            <div className={`animate-pulse ${className}`}>
                <div className="space-y-3">
                    <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-600 rounded w-5/6"></div>
                </div>
            </div>
        );
    }

    return null;
};

// Enhanced Error State Component
interface ErrorStateProps {
    message?: string;
    title?: string;
    onRetry?: () => void;
    retryText?: string;
    showRetry?: boolean;
    className?: string;
    variant?: 'default' | 'compact' | 'minimal';
}

export const ErrorState: React.FC<ErrorStateProps> = ({
    title = 'Something went wrong',
    message = 'An unexpected error occurred. Please try again.',
    onRetry,
    retryText = 'Try Again',
    showRetry = true,
    className = '',
    variant = 'default'
}) => {
    if (variant === 'compact') {
        return (
            <div className={`flex items-center gap-3 p-4 bg-red-900/20 border border-red-700 rounded-lg ${className}`}>
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <div className="flex-1">
                    <p className="text-red-300 text-sm">{message}</p>
                </div>
                {showRetry && onRetry && (
                    <button
                        onClick={onRetry}
                        className="flex items-center gap-1 px-3 py-1 bg-red-800 hover:bg-red-700 text-red-200 text-sm rounded transition-colors"
                    >
                        <RefreshCw className="w-3 h-3" />
                        {retryText}
                    </button>
                )}
            </div>
        );
    }

    if (variant === 'minimal') {
        return (
            <div className={`text-center text-red-400 ${className}`}>
                <AlertCircle className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm">{message}</p>
            </div>
        );
    }

    return (
        <div className={`text-center p-8 ${className}`}>
            <div className="flex justify-center mb-4">
                <div className="bg-red-900/20 p-3 rounded-full">
                    <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-gray-300 mb-6 max-w-md mx-auto">{message}</p>
            {showRetry && onRetry && (
                <button
                    onClick={onRetry}
                    className="bg-red-800 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    {retryText}
                </button>
            )}
        </div>
    );
};

// Loading Overlay Component
interface LoadingOverlayProps {
    isVisible: boolean;
    text?: string;
    className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
    isVisible,
    text = 'Processing...',
    className = ''
}) => {
    if (!isVisible) return null;

    return (
        <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 ${className}`}>
            <div className="bg-dark-card rounded-lg p-8 max-w-sm mx-4">
                <Loading text={text} size="lg" className="text-center" />
            </div>
        </div>
    );
};

// Button Loading State Component
interface ButtonLoadingProps {
    isLoading: boolean;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'danger';
}

export const ButtonLoading: React.FC<ButtonLoadingProps> = ({
    isLoading,
    children,
    className = '',
    disabled = false,
    onClick,
    type = 'button',
    variant = 'primary'
}) => {
    const baseClasses = 'px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
        primary: 'bg-primary-blue hover:bg-blue-600 text-white',
        secondary: 'bg-gray-700 hover:bg-gray-600 text-white',
        danger: 'bg-red-700 hover:bg-red-600 text-white'
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span className={isLoading ? 'opacity-75' : ''}>{children}</span>
        </button>
    );
};

// Progress Bar Component
interface ProgressBarProps {
    progress: number; // 0-100
    label?: string;
    showPercentage?: boolean;
    className?: string;
    variant?: 'default' | 'success' | 'warning' | 'danger';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    progress,
    label,
    showPercentage = true,
    className = '',
    variant = 'default'
}) => {
    const variantClasses = {
        default: 'bg-primary-blue',
        success: 'bg-green-500',
        warning: 'bg-yellow-500',
        danger: 'bg-red-500'
    };

    const clampedProgress = Math.max(0, Math.min(100, progress));

    return (
        <div className={`w-full ${className}`}>
            {(label || showPercentage) && (
                <div className="flex justify-between items-center mb-2">
                    {label && <span className="text-sm text-gray-300">{label}</span>}
                    {showPercentage && <span className="text-sm text-gray-400">{Math.round(clampedProgress)}%</span>}
                </div>
            )}
            <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                    className={`h-2 rounded-full transition-all duration-300 ${variantClasses[variant]}`}
                    style={{ width: `${clampedProgress}%` }}
                />
            </div>
        </div>
    );
};