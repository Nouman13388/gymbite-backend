import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { CheckCircle, AlertCircle, EyeOff, Eye } from 'lucide-react';
import { CRUDModal } from '../../views/components/ui/CRUDModal';
import { userFormSchema, createUserFormSchema, type UserFormData } from '../../schemas';
import { auth } from '../../utils/firebase';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'CLIENT' | 'TRAINER' | 'ADMIN';
    firebaseUid?: string;
}

interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: UserFormData) => Promise<void>;
    user?: User | null;
    isLoading?: boolean;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    user,
    isLoading = false
}) => {
    const [firebaseLoading, setFirebaseLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, touchedFields },
        reset,
        setError,
        watch
    } = useForm<UserFormData>({
        resolver: zodResolver(user ? userFormSchema : createUserFormSchema),
        mode: 'onChange', // Enable real-time validation
        defaultValues: user ? {
            name: user.name,
            email: user.email,
            role: user.role,
            firebaseUid: user.firebaseUid || '',
            password: '' // Don't pre-fill password for edits
        } : {
            name: '',
            email: '',
            role: 'CLIENT',
            firebaseUid: '',
            password: ''
        }
    });

    // Watch all fields for validation feedback
    const watchedFields = watch();

    // Helper function to get field validation status
    const getFieldStatus = (fieldName: keyof UserFormData) => {
        const hasError = !!errors[fieldName];
        const hasValue = watchedFields[fieldName] && String(watchedFields[fieldName]).trim() !== '';
        const isTouched = touchedFields[fieldName];

        return {
            hasError,
            hasValue,
            isTouched,
            isValid: !hasError && hasValue && isTouched
        };
    };

    // Helper function to get input classes with validation states
    const getInputClasses = (fieldName: keyof UserFormData) => {
        const status = getFieldStatus(fieldName);
        const baseClasses = "w-full px-3 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-colors";

        if (status.hasError) {
            return `${baseClasses} border-red-500 focus:ring-red-500`;
        } else if (status.isValid) {
            return `${baseClasses} border-green-500 focus:ring-green-500`;
        } else {
            return `${baseClasses} border-gray-600 focus:ring-blue-500`;
        }
    };

    const handleFormSubmit = async (data: UserFormData) => {
        try {
            setFirebaseLoading(true);

            // If creating a new user, create Firebase account first
            if (!user && data.password) {
                try {
                    const userCredential = await createUserWithEmailAndPassword(
                        auth,
                        data.email,
                        data.password
                    );

                    // Add the Firebase UID to the data
                    data.firebaseUid = userCredential.user.uid;

                    // Remove password from data sent to backend (we don't store it there)
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { password: _, ...userDataWithoutPassword } = data;

                    await onSubmit(userDataWithoutPassword);
                } catch (firebaseError: unknown) {
                    console.error('Firebase Auth error:', firebaseError);

                    // Handle specific Firebase errors
                    const error = firebaseError as { code?: string };
                    if (error.code === 'auth/email-already-in-use') {
                        setError('email', {
                            type: 'manual',
                            message: 'This email is already registered'
                        });
                    } else if (error.code === 'auth/weak-password') {
                        setError('password', {
                            type: 'manual',
                            message: 'Password is too weak'
                        });
                    } else {
                        setError('email', {
                            type: 'manual',
                            message: 'Failed to create account. Please try again.'
                        });
                    }
                    return; // Don't proceed if Firebase signup failed
                }
            } else {
                // For edits, just submit the data (no password needed)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { password, ...userDataWithoutPassword } = data;
                await onSubmit(userDataWithoutPassword);
            }

            reset();
            onClose();
        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            setFirebaseLoading(false);
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <CRUDModal
            isOpen={isOpen}
            onClose={handleClose}
            title={user ? 'Edit User' : 'Create User'}
            size="md"
        >
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                {/* Name Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                        Name *
                    </label>
                    <div className="relative">
                        <input
                            {...register('name')}
                            type="text"
                            className={getInputClasses('name')}
                            placeholder="Enter user name (2-50 characters)"
                        />
                        {/* Validation Icon */}
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            {(() => {
                                const status = getFieldStatus('name');
                                if (status.hasError) {
                                    return <AlertCircle className="h-5 w-5 text-red-500" />;
                                } else if (status.isValid) {
                                    return <CheckCircle className="h-5 w-5 text-green-500" />;
                                }
                                return null;
                            })()}
                        </div>
                    </div>
                    {errors.name && (
                        <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.name.message}
                        </p>
                    )}
                    {getFieldStatus('name').isValid && (
                        <p className="text-green-400 text-sm mt-1 flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            Valid name format
                        </p>
                    )}
                </div>

                {/* Email Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                        Email *
                    </label>
                    <div className="relative">
                        <input
                            {...register('email')}
                            type="email"
                            className={getInputClasses('email')}
                            placeholder="Enter valid email address"
                        />
                        {/* Validation Icon */}
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            {(() => {
                                const status = getFieldStatus('email');
                                if (status.hasError) {
                                    return <AlertCircle className="h-5 w-5 text-red-500" />;
                                } else if (status.isValid) {
                                    return <CheckCircle className="h-5 w-5 text-green-500" />;
                                }
                                return null;
                            })()}
                        </div>
                    </div>
                    {errors.email && (
                        <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.email.message}
                        </p>
                    )}
                    {getFieldStatus('email').isValid && (
                        <p className="text-green-400 text-sm mt-1 flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            Valid email format
                        </p>
                    )}
                </div>

                {/* Password Field (only for new users) */}
                {!user && (
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">
                            Password *
                        </label>
                        <div className="relative">
                            <input
                                {...register('password')}
                                type={showPassword ? 'text' : 'password'}
                                className={`${getInputClasses('password')} pr-20`}
                                placeholder="Min 6 chars, 1 letter, 1 number"
                            />
                            {/* Show/Hide Password Button */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-10 pr-3 flex items-center text-gray-400 hover:text-gray-200 transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                            {/* Validation Icon */}
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                {(() => {
                                    const status = getFieldStatus('password');
                                    if (status.hasError) {
                                        return <AlertCircle className="h-5 w-5 text-red-500" />;
                                    } else if (status.isValid) {
                                        return <CheckCircle className="h-5 w-5 text-green-500" />;
                                    }
                                    return null;
                                })()}
                            </div>
                        </div>
                        {errors.password && (
                            <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                {errors.password.message}
                            </p>
                        )}
                        {getFieldStatus('password').isValid && (
                            <p className="text-green-400 text-sm mt-1 flex items-center gap-1">
                                <CheckCircle className="h-4 w-4" />
                                Strong password ✓
                            </p>
                        )}
                        {/* Password Requirements */}
                        <div className="mt-2 text-xs text-gray-400 space-y-1">
                            <p>Password requirements:</p>
                            <ul className="ml-2 space-y-0.5">
                                <li className={watchedFields.password && watchedFields.password.length >= 6 ? 'text-green-400' : 'text-gray-500'}>
                                    • At least 6 characters
                                </li>
                                <li className={watchedFields.password && /[a-zA-Z]/.test(watchedFields.password) ? 'text-green-400' : 'text-gray-500'}>
                                    • At least 1 letter
                                </li>
                                <li className={watchedFields.password && /\d/.test(watchedFields.password) ? 'text-green-400' : 'text-gray-500'}>
                                    • At least 1 number
                                </li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* Role Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                        Role *
                    </label>
                    <div className="relative">
                        <select
                            {...register('role')}
                            className={getInputClasses('role')}
                        >
                            <option value="CLIENT">Client</option>
                            <option value="TRAINER">Trainer</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                        {/* Validation Icon */}
                        <div className="absolute inset-y-0 right-8 pr-3 flex items-center pointer-events-none">
                            {(() => {
                                const status = getFieldStatus('role');
                                if (status.hasError) {
                                    return <AlertCircle className="h-5 w-5 text-red-500" />;
                                } else if (status.isValid) {
                                    return <CheckCircle className="h-5 w-5 text-green-500" />;
                                }
                                return null;
                            })()}
                        </div>
                    </div>
                    {errors.role && (
                        <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.role.message}
                        </p>
                    )}
                </div>

                {/* Firebase UID Field (Optional) */}
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                        Firebase UID (Optional)
                    </label>
                    <div className="relative">
                        <input
                            {...register('firebaseUid')}
                            type="text"
                            className={getInputClasses('firebaseUid')}
                            placeholder="Firebase UID (auto-generated if empty)"
                        />
                        {/* Validation Icon */}
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            {(() => {
                                const status = getFieldStatus('firebaseUid');
                                if (status.hasError) {
                                    return <AlertCircle className="h-5 w-5 text-red-500" />;
                                } else if (status.isValid) {
                                    return <CheckCircle className="h-5 w-5 text-green-500" />;
                                }
                                return null;
                            })()}
                        </div>
                    </div>
                    {errors.firebaseUid && (
                        <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.firebaseUid.message}
                        </p>
                    )}
                    <p className="text-gray-400 text-xs mt-1">
                        Leave empty to auto-generate during account creation
                    </p>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting || isLoading || firebaseLoading}
                        className="px-4 py-2 text-gray-300 bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting || isLoading || firebaseLoading || Object.keys(errors).length > 0}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md transition-colors flex items-center gap-2"
                    >
                        {isSubmitting || isLoading || firebaseLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                {firebaseLoading ? 'Creating Account...' : user ? 'Updating...' : 'Saving...'}
                            </>
                        ) : (
                            <>
                                {Object.keys(errors).length > 0 && <AlertCircle className="h-4 w-4" />}
                                {user ? 'Update User' : 'Create User'}
                            </>
                        )}
                    </button>
                </div>

                {/* Form Summary */}
                {Object.keys(errors).length > 0 && (
                    <div className="mt-4 p-3 bg-red-900/20 border border-red-500/20 rounded-md">
                        <p className="text-red-400 text-sm font-medium flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Please fix {Object.keys(errors).length} error{Object.keys(errors).length > 1 ? 's' : ''} above
                        </p>
                    </div>
                )}
            </form>
        </CRUDModal>
    );
};
