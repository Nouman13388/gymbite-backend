import React from 'react';

interface PageWrapperProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    actions?: React.ReactNode;
    className?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
    children,
    title,
    subtitle,
    actions,
    className = ''
}) => {
    return (
        <div className={`p-6 ${className}`}>
            {/* Page Header */}
            {(title || actions) && (
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            {title && (
                                <h1 className="text-2xl font-bold text-white mb-1">{title}</h1>
                            )}
                            {subtitle && (
                                <p className="text-gray-400">{subtitle}</p>
                            )}
                        </div>
                        {actions && (
                            <div className="flex items-center space-x-3">
                                {actions}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Page Content */}
            <div>{children}</div>
        </div>
    );
};