import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

// Form Field Error Display
interface FieldErrorProps {
    error?: string;
    className?: string;
}

export const FieldError: React.FC<FieldErrorProps> = ({ error, className = '' }) => {
    if (!error) return null;

    return (
        <div className={`flex items-center gap-2 mt-1 text-red-400 text-sm ${className}`}>
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
        </div>
    );
};

// Form Field Success Display
interface FieldSuccessProps {
    message?: string;
    className?: string;
}

export const FieldSuccess: React.FC<FieldSuccessProps> = ({
    message = 'Valid',
    className = ''
}) => {
    return (
        <div className={`flex items-center gap-2 mt-1 text-green-400 text-sm ${className}`}>
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{message}</span>
        </div>
    );
};

// Form Field Warning Display
interface FieldWarningProps {
    message: string;
    className?: string;
}

export const FieldWarning: React.FC<FieldWarningProps> = ({ message, className = '' }) => {
    return (
        <div className={`flex items-center gap-2 mt-1 text-yellow-400 text-sm ${className}`}>
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{message}</span>
        </div>
    );
};

// Form Field Info Display
interface FieldInfoProps {
    message: string;
    className?: string;
}

export const FieldInfo: React.FC<FieldInfoProps> = ({ message, className = '' }) => {
    return (
        <div className={`flex items-center gap-2 mt-1 text-blue-400 text-sm ${className}`}>
            <Info className="w-4 h-4 flex-shrink-0" />
            <span>{message}</span>
        </div>
    );
};

// Comprehensive Form Feedback Component
interface FormFeedbackProps {
    type: 'error' | 'success' | 'warning' | 'info';
    message: string;
    className?: string;
    onDismiss?: () => void;
    showIcon?: boolean;
}

export const FormFeedback: React.FC<FormFeedbackProps> = ({
    type,
    message,
    className = '',
    onDismiss,
    showIcon = true
}) => {
    const getIcon = () => {
        switch (type) {
            case 'error':
                return <AlertCircle className="w-5 h-5" />;
            case 'success':
                return <CheckCircle className="w-5 h-5" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5" />;
            case 'info':
                return <Info className="w-5 h-5" />;
        }
    };

    const getStyles = () => {
        switch (type) {
            case 'error':
                return 'bg-red-900/20 border-red-700 text-red-300';
            case 'success':
                return 'bg-green-900/20 border-green-700 text-green-300';
            case 'warning':
                return 'bg-yellow-900/20 border-yellow-700 text-yellow-300';
            case 'info':
                return 'bg-blue-900/20 border-blue-700 text-blue-300';
        }
    };

    return (
        <div className={`flex items-start gap-3 p-4 border rounded-lg ${getStyles()} ${className}`}>
            {showIcon && (
                <div className="flex-shrink-0 mt-0.5">
                    {getIcon()}
                </div>
            )}
            <div className="flex-1">
                <p className="text-sm">{message}</p>
            </div>
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    className="flex-shrink-0 p-1 hover:bg-white/10 rounded transition-colors"
                    aria-label="Dismiss message"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};

// Form Validation Summary
interface ValidationSummaryProps {
    errors: Record<string, string>;
    className?: string;
    title?: string;
}

export const ValidationSummary: React.FC<ValidationSummaryProps> = ({
    errors,
    className = '',
    title = 'Please fix the following errors:'
}) => {
    const errorEntries = Object.entries(errors).filter(([, error]) => error);

    if (errorEntries.length === 0) return null;

    return (
        <div className={`bg-red-900/20 border border-red-700 rounded-lg p-4 ${className}`}>
            <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <h4 className="text-red-300 font-medium mb-2">{title}</h4>
                    <ul className="space-y-1">
                        {errorEntries.map(([field, error]) => (
                            <li key={field} className="text-red-300 text-sm">
                                • {error}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

// Success Message Component
interface SuccessMessageProps {
    title?: string;
    message: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
    onDismiss?: () => void;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
    title = 'Success!',
    message,
    action,
    className = '',
    onDismiss
}) => {
    return (
        <div className={`bg-green-900/20 border border-green-700 rounded-lg p-4 ${className}`}>
            <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <h4 className="text-green-300 font-medium mb-1">{title}</h4>
                    <p className="text-green-300 text-sm mb-3">{message}</p>
                    {action && (
                        <button
                            onClick={action.onClick}
                            className="bg-green-800 hover:bg-green-700 text-green-200 px-4 py-2 rounded text-sm transition-colors"
                        >
                            {action.label}
                        </button>
                    )}
                </div>
                {onDismiss && (
                    <button
                        onClick={onDismiss}
                        className="flex-shrink-0 p-1 hover:bg-white/10 rounded transition-colors"
                        aria-label="Dismiss message"
                    >
                        <X className="w-4 h-4 text-green-400" />
                    </button>
                )}
            </div>
        </div>
    );
};

// Form Field Wrapper with Enhanced Feedback
interface FormFieldProps {
    label: string;
    error?: string;
    success?: string;
    warning?: string;
    info?: string;
    required?: boolean;
    children: React.ReactNode;
    className?: string;
    helpText?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
    label,
    error,
    success,
    warning,
    info,
    required = false,
    children,
    className = '',
    helpText
}) => {
    return (
        <div className={`space-y-2 ${className}`}>
            <label className="block text-sm font-medium text-gray-200">
                {label}
                {required && <span className="text-red-400 ml-1">*</span>}
            </label>

            {children}

            {helpText && !error && !success && !warning && !info && (
                <p className="text-gray-400 text-xs">{helpText}</p>
            )}

            {error && <FieldError error={error} />}
            {success && !error && <FieldSuccess message={success} />}
            {warning && !error && !success && <FieldWarning message={warning} />}
            {info && !error && !success && !warning && <FieldInfo message={info} />}
        </div>
    );
};

// Enhanced Input Component with Built-in Validation Feedback
interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    success?: string;
    warning?: string;
    info?: string;
    helpText?: string;
    containerClassName?: string;
}

export const ValidatedInput: React.FC<ValidatedInputProps> = ({
    label,
    error,
    success,
    warning,
    info,
    helpText,
    required,
    containerClassName = '',
    className = '',
    ...inputProps
}) => {
    const getInputBorderColor = () => {
        if (error) return 'border-red-500 focus:border-red-400';
        if (success) return 'border-green-500 focus:border-green-400';
        if (warning) return 'border-yellow-500 focus:border-yellow-400';
        return 'border-gray-600 focus:border-blue-500';
    };

    return (
        <FormField
            label={label}
            error={error}
            success={success}
            warning={warning}
            info={info}
            required={required}
            helpText={helpText}
            className={containerClassName}
        >
            <input
                {...inputProps}
                className={`
                    w-full px-3 py-2 bg-dark-card border rounded-lg
                    text-white placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50
                    transition-colors duration-200
                    ${getInputBorderColor()}
                    ${className}
                `}
            />
        </FormField>
    );
};