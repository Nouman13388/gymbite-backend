import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, AlertCircle, Users } from 'lucide-react';
import { CRUDModal } from '../../views/components/ui/CRUDModal';
import { workoutFormSchema, type WorkoutFormData } from '../../schemas';
import { crudApi } from '../../services/api';

interface WorkoutPlan {
    id: number;
    name: string;
    exercises: string;
    sets: number;
    reps: number;
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    userId: number;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface WorkoutFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: WorkoutFormData) => Promise<void>;
    workout?: WorkoutPlan | null;
    isLoading?: boolean;
}

export const WorkoutFormModal: React.FC<WorkoutFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    workout,
    isLoading = false
}) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, touchedFields },
        reset,
        watch
    } = useForm<WorkoutFormData>({
        resolver: zodResolver(workoutFormSchema),
        mode: 'onChange', // Enable real-time validation
        defaultValues: workout ? {
            name: workout.name,
            exercises: workout.exercises,
            sets: workout.sets,
            reps: workout.reps,
            difficulty: workout.difficulty,
            userId: workout.userId
        } : {
            name: '',
            exercises: '',
            sets: 1,
            reps: 1,
            difficulty: 'BEGINNER',
            userId: 0
        }
    });

    // Watch all fields for validation feedback
    const watchedFields = watch();

    // Helper function to get field validation status
    const getFieldStatus = (fieldName: keyof WorkoutFormData) => {
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
    const getInputClasses = (fieldName: keyof WorkoutFormData) => {
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

    // Fetch users for dropdown
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoadingUsers(true);
                const response = await crudApi.users.getAll();
                setUsers(Array.isArray(response) ? response : []);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            } finally {
                setLoadingUsers(false);
            }
        };

        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen]);

    const handleFormSubmit = async (data: WorkoutFormData) => {
        try {
            await onSubmit(data);
            reset();
            onClose();
        } catch (error) {
            console.error('Form submission error:', error);
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
            title={workout ? 'Edit Workout Plan' : 'Create Workout Plan'}
            size="lg"
        >
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                {/* Name Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                        Workout Name *
                    </label>
                    <div className="relative">
                        <input
                            {...register('name')}
                            type="text"
                            className={getInputClasses('name')}
                            placeholder="Enter workout name (3-100 characters)"
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
                            Valid workout name
                        </p>
                    )}
                </div>

                {/* Exercises Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                        Exercises *
                    </label>
                    <div className="relative">
                        <textarea
                            {...register('exercises')}
                            rows={4}
                            className={getInputClasses('exercises')}
                            placeholder="Describe exercises, equipment needed, and instructions (min 10 characters)..."
                        />
                        {/* Validation Icon */}
                        <div className="absolute top-2 right-0 pr-3 flex items-center pointer-events-none">
                            {(() => {
                                const status = getFieldStatus('exercises');
                                if (status.hasError) {
                                    return <AlertCircle className="h-5 w-5 text-red-500" />;
                                } else if (status.isValid) {
                                    return <CheckCircle className="h-5 w-5 text-green-500" />;
                                }
                                return null;
                            })()}
                        </div>
                    </div>
                    {errors.exercises && (
                        <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.exercises.message}
                        </p>
                    )}
                    {getFieldStatus('exercises').isValid && (
                        <p className="text-green-400 text-sm mt-1 flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            Detailed exercise description
                        </p>
                    )}
                    {/* Character count */}
                    <p className="text-gray-400 text-xs mt-1">
                        {watchedFields.exercises ? watchedFields.exercises.length : 0} characters
                    </p>
                </div>

                {/* Sets and Reps Row */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">
                            Sets *
                        </label>
                        <div className="relative">
                            <input
                                {...register('sets', { valueAsNumber: true })}
                                type="number"
                                min="1"
                                max="10"
                                className={getInputClasses('sets')}
                                placeholder="Number of sets (1-10)"
                            />
                            {/* Validation Icon */}
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                {(() => {
                                    const status = getFieldStatus('sets');
                                    if (status.hasError) {
                                        return <AlertCircle className="h-5 w-5 text-red-500" />;
                                    } else if (status.isValid) {
                                        return <CheckCircle className="h-5 w-5 text-green-500" />;
                                    }
                                    return null;
                                })()}
                            </div>
                        </div>
                        {errors.sets && (
                            <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                {errors.sets.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">
                            Reps *
                        </label>
                        <div className="relative">
                            <input
                                {...register('reps', { valueAsNumber: true })}
                                type="number"
                                min="1"
                                max="100"
                                className={getInputClasses('reps')}
                                placeholder="Number of reps (1-100)"
                            />
                            {/* Validation Icon */}
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                {(() => {
                                    const status = getFieldStatus('reps');
                                    if (status.hasError) {
                                        return <AlertCircle className="h-5 w-5 text-red-500" />;
                                    } else if (status.isValid) {
                                        return <CheckCircle className="h-5 w-5 text-green-500" />;
                                    }
                                    return null;
                                })()}
                            </div>
                        </div>
                        {errors.reps && (
                            <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                {errors.reps.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Difficulty Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                        Difficulty Level *
                    </label>
                    <div className="relative">
                        <select
                            {...register('difficulty')}
                            className={getInputClasses('difficulty')}
                        >
                            <option value="BEGINNER">🟢 Beginner</option>
                            <option value="INTERMEDIATE">🟡 Intermediate</option>
                            <option value="ADVANCED">🔴 Advanced</option>
                        </select>
                        {/* Validation Icon */}
                        <div className="absolute inset-y-0 right-8 pr-3 flex items-center pointer-events-none">
                            {(() => {
                                const status = getFieldStatus('difficulty');
                                if (status.hasError) {
                                    return <AlertCircle className="h-5 w-5 text-red-500" />;
                                } else if (status.isValid) {
                                    return <CheckCircle className="h-5 w-5 text-green-500" />;
                                }
                                return null;
                            })()}
                        </div>
                    </div>
                    {errors.difficulty && (
                        <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.difficulty.message}
                        </p>
                    )}
                </div>

                {/* User Assignment Field */}
                <div>
                    <label className="text-sm font-medium text-gray-200 mb-1 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Assign to User *
                    </label>
                    {loadingUsers ? (
                        <div className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-400 flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                            Loading users...
                        </div>
                    ) : (
                        <div className="relative">
                            <select
                                {...register('userId', { valueAsNumber: true })}
                                className={getInputClasses('userId')}
                            >
                                <option value={0}>Select a user</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.email}) - {user.role}
                                    </option>
                                ))}
                            </select>
                            {/* Validation Icon */}
                            <div className="absolute inset-y-0 right-8 pr-3 flex items-center pointer-events-none">
                                {(() => {
                                    const status = getFieldStatus('userId');
                                    if (status.hasError) {
                                        return <AlertCircle className="h-5 w-5 text-red-500" />;
                                    } else if (status.isValid) {
                                        return <CheckCircle className="h-5 w-5 text-green-500" />;
                                    }
                                    return null;
                                })()}
                            </div>
                        </div>
                    )}
                    {errors.userId && (
                        <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.userId.message}
                        </p>
                    )}
                    {getFieldStatus('userId').isValid && watchedFields.userId > 0 && (
                        <p className="text-green-400 text-sm mt-1 flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            User assigned successfully
                        </p>
                    )}
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting || isLoading}
                        className="px-4 py-2 text-gray-300 bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting || isLoading || Object.keys(errors).length > 0}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md transition-colors flex items-center gap-2"
                    >
                        {isSubmitting || isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                {workout ? 'Updating...' : 'Creating...'}
                            </>
                        ) : (
                            <>
                                {Object.keys(errors).length > 0 && <AlertCircle className="h-4 w-4" />}
                                {workout ? 'Update Workout' : 'Create Workout'}
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