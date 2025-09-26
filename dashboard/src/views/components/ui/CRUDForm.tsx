import React from 'react';
import type { UseFormRegister, FieldError, FieldValues, Path } from 'react-hook-form';

export interface FormFieldConfig<T extends FieldValues = FieldValues> {
    name: Path<T>;
    label: string;
    type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'date';
    placeholder?: string;
    required?: boolean;
    options?: { value: string; label: string }[];
    rows?: number; // for textarea
    min?: number; // for number inputs
    max?: number; // for number inputs
    disabled?: boolean;
    description?: string;
}

interface FormFieldProps<T extends FieldValues = FieldValues> {
    field: FormFieldConfig<T>;
    register: UseFormRegister<T>;
    error?: FieldError;
    className?: string;
}

export function FormField<T extends FieldValues = FieldValues>({
    field,
    register,
    error,
    className = ''
}: FormFieldProps<T>) {
    const baseInputClasses = `w-full px-3 py-2 bg-[#283039] border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1173d4] focus:border-transparent transition-colors ${error ? 'border-red-500' : 'border-gray-600'
        }`;

    const renderField = () => {
        switch (field.type) {
            case 'textarea':
                return (
                    <textarea
                        {...register(field.name, { required: field.required })}
                        placeholder={field.placeholder}
                        rows={field.rows || 3}
                        disabled={field.disabled}
                        className={baseInputClasses}
                    />
                );

            case 'select':
                return (
                    <select
                        {...register(field.name, { required: field.required })}
                        disabled={field.disabled}
                        className={baseInputClasses}
                    >
                        <option value="">Select {field.label}</option>
                        {field.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );

            case 'checkbox':
                return (
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            {...register(field.name)}
                            disabled={field.disabled}
                            className="w-4 h-4 text-[#1173d4] bg-[#283039] border-gray-600 rounded focus:ring-[#1173d4] focus:ring-2"
                        />
                        <label className="ml-2 text-sm text-gray-300">
                            {field.label}
                        </label>
                    </div>
                );

            case 'number':
                return (
                    <input
                        type="number"
                        {...register(field.name, {
                            required: field.required,
                            min: field.min,
                            max: field.max,
                            valueAsNumber: true
                        })}
                        placeholder={field.placeholder}
                        min={field.min}
                        max={field.max}
                        disabled={field.disabled}
                        className={baseInputClasses}
                    />
                );

            default:
                return (
                    <input
                        type={field.type}
                        {...register(field.name, { required: field.required })}
                        placeholder={field.placeholder}
                        disabled={field.disabled}
                        className={baseInputClasses}
                    />
                );
        }
    };

    if (field.type === 'checkbox') {
        return (
            <div className={`space-y-1 ${className}`}>
                {renderField()}
                {field.description && (
                    <p className="text-sm text-gray-400">{field.description}</p>
                )}
                {error && (
                    <p className="text-sm text-red-400">{error.message}</p>
                )}
            </div>
        );
    }

    return (
        <div className={`space-y-2 ${className}`}>
            <label className="block text-sm font-medium text-gray-300">
                {field.label}
                {field.required && <span className="text-red-400 ml-1">*</span>}
            </label>

            {renderField()}

            {field.description && (
                <p className="text-sm text-gray-400">{field.description}</p>
            )}

            {error && (
                <p className="text-sm text-red-400">{error.message}</p>
            )}
        </div>
    );
}

interface CRUDFormProps<T extends FieldValues = FieldValues> {
    fields: FormFieldConfig<T>[];
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
    register: UseFormRegister<T>;
    errors: Partial<Record<Path<T>, FieldError>>;
    loading?: boolean;
    submitLabel?: string;
    cancelLabel?: string;
    onCancel?: () => void;
    className?: string;
}

export function CRUDForm<T extends FieldValues = FieldValues>({
    fields,
    onSubmit,
    register,
    errors,
    loading = false,
    submitLabel = 'Save',
    cancelLabel = 'Cancel',
    onCancel,
    className = ''
}: CRUDFormProps<T>) {
    return (
        <form onSubmit={onSubmit} className={`space-y-6 ${className}`}>
            {/* Form Fields */}
            <div className="space-y-4">
                {fields.map((field) => (
                    <FormField
                        key={field.name}
                        field={field}
                        register={register}
                        error={errors[field.name]}
                    />
                ))}
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-700">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="px-4 py-2 text-gray-300 bg-[#283039] border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                    >
                        {cancelLabel}
                    </button>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 text-white bg-[#1173d4] rounded-lg hover:bg-[#0f5db8] transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Saving...</span>
                        </>
                    ) : (
                        <span>{submitLabel}</span>
                    )}
                </button>
            </div>
        </form>
    );
}