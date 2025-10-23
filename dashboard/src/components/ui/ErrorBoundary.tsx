import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({
            error,
            errorInfo
        });

        // Call optional error handler
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }

        // Log error to console in development
        if (import.meta.env.DEV) {
            console.error('ErrorBoundary caught an error:', error);
            console.error('Component stack:', errorInfo.componentStack);
        }

        // In production, you might want to send this to an error reporting service
        // Example: Sentry.captureException(error, { extra: errorInfo });
    }

    handleRetry = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    handleGoHome = () => {
        window.location.href = '/dashboard';
    };

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
                    <div className="max-w-lg w-full bg-dark-card rounded-lg shadow-xl p-8 text-center">
                        <div className="flex justify-center mb-6">
                            <div className="bg-red-900/20 p-4 rounded-full">
                                <AlertTriangle className="w-12 h-12 text-red-400" />
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold text-white mb-4">
                            Oops! Something went wrong
                        </h1>

                        <p className="text-gray-300 mb-6">
                            We encountered an unexpected error. This has been logged and we're working to fix it.
                        </p>

                        {import.meta.env.DEV && this.state.error && (
                            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6 text-left">
                                <h3 className="text-red-400 font-semibold mb-2">Error Details (Development Only):</h3>
                                <p className="text-red-300 text-sm font-mono break-all">
                                    {this.state.error.message}
                                </p>
                                {this.state.errorInfo && (
                                    <details className="mt-2">
                                        <summary className="text-red-400 text-sm cursor-pointer">
                                            Component Stack
                                        </summary>
                                        <pre className="text-red-300 text-xs mt-2 overflow-auto max-h-40">
                                            {this.state.errorInfo.componentStack}
                                        </pre>
                                    </details>
                                )}
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={this.handleRetry}
                                className="bg-primary-blue hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Try Again
                            </button>

                            <button
                                onClick={this.handleGoHome}
                                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                            >
                                <Home className="w-4 h-4" />
                                Go to Dashboard
                            </button>
                        </div>

                        <div className="mt-6 text-sm text-gray-400">
                            <p>If this problem persists, please contact support.</p>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Higher-order component for easier usage
export const withErrorBoundary = <P extends object>(
    Component: React.ComponentType<P>,
    errorBoundaryProps?: Omit<Props, 'children'>
) => {
    const WrappedComponent = (props: P) => (
        <ErrorBoundary {...errorBoundaryProps}>
            <Component {...props} />
        </ErrorBoundary>
    );

    WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

    return WrappedComponent;
};

// Hook for error reporting
export const useErrorHandler = () => {
    const handleError = React.useCallback((error: Error, errorInfo?: ErrorInfo) => {
        if (import.meta.env.DEV) {
            console.error('Manual error report:', error);
            if (errorInfo) {
                console.error('Error info:', errorInfo);
            }
        }

        // In production, send to error reporting service
        // Example: Sentry.captureException(error, { extra: errorInfo });
    }, []);

    return { handleError };
};