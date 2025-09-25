import React from 'react';

interface LoadingProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
    className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
    size = 'md',
    text = 'Loading...',
    className = ''
}) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12'
    };

    const textSizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg'
    };

    return (
        <div className={`flex items-center justify-center space-x-3 ${className}`}>
            <div className={`animate-spin rounded-full ${sizeClasses[size]} border-b-2 border-[#1173d4]`}></div>
            {text && (
                <span className={`text-gray-400 ${textSizeClasses[size]}`}>{text}</span>
            )}
        </div>
    );
};

interface EmptyStateProps {
    message?: string;
    description?: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
    className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    message = 'No data available',
    description,
    icon,
    action,
    className = ''
}) => {
    return (
        <div className={`text-center py-12 ${className}`}>
            {icon && (
                <div className="flex justify-center mb-4 text-gray-500">
                    {icon}
                </div>
            )}

            <h3 className="text-lg font-medium text-gray-300 mb-2">
                {message}
            </h3>

            {description && (
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    {description}
                </p>
            )}

            {action && (
                <div className="flex justify-center">
                    {action}
                </div>
            )}
        </div>
    );
};

interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
    className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
    message,
    onRetry,
    className = ''
}) => {
    return (
        <div className={`bg-red-900/20 border border-red-700 rounded-lg p-4 ${className}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="text-red-400">⚠️</div>
                    <span className="text-red-300">{message}</span>
                </div>

                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                    >
                        Retry
                    </button>
                )}
            </div>
        </div>
    );
};