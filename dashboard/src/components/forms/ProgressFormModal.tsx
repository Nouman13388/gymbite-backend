import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, TrendingUp, User, Weight, Activity, Ruler } from 'lucide-react';
import { progressSchema, type ProgressFormData } from '../../schemas';
import { crudApi } from '../../services/api';

interface ProgressFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ProgressFormData) => Promise<void>;
    progress?: {
        id: number;
        clientId: number;
        weight: number;
        bodyFat?: number;
        muscleMass?: number;
        notes?: string;
    } | null;
    isLoading?: boolean;
}

interface Client {
    id: number;
    userId: number;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

export const ProgressFormModal: React.FC<ProgressFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    progress,
    isLoading = false,
}) => {
    const [clients, setClients] = useState<Client[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ProgressFormData>({
        resolver: zodResolver(progressSchema),
        defaultValues: progress || {
            weight: 0,
            bodyFat: 0,
            muscleMass: 0,
        },
    });

    useEffect(() => {
        if (isOpen) {
            fetchClients();
            if (progress) {
                reset({
                    clientId: progress.clientId,
                    weight: progress.weight,
                    bodyFat: progress.bodyFat || 0,
                    muscleMass: progress.muscleMass || 0,
                    notes: progress.notes || '',
                });
            } else {
                reset({
                    weight: 0,
                    bodyFat: 0,
                    muscleMass: 0,
                    notes: '',
                });
            }
        }
    }, [isOpen, progress, reset]);

    const fetchClients = async () => {
        try {
            setLoadingData(true);
            const clientsData = await crudApi.clients.getAll();
            setClients(clientsData as Client[]);
        } catch (error) {
            console.error('Failed to fetch clients:', error);
        } finally {
            setLoadingData(false);
        }
    };

    const handleFormSubmit = async (data: ProgressFormData) => {
        // Convert 0 values to undefined for optional fields
        const cleanedData = {
            ...data,
            bodyFat: data.bodyFat === 0 ? undefined : data.bodyFat,
            muscleMass: data.muscleMass === 0 ? undefined : data.muscleMass,
            notes: data.notes?.trim() || undefined,
        };
        await onSubmit(cleanedData);
        reset();
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-dark-card rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-blue rounded-lg">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">
                            {progress ? 'Edit Progress Record' : 'Add Progress Record'}
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
                    {loadingData ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                            <p className="text-gray-400 mt-2">Loading...</p>
                        </div>
                    ) : (
                        <>
                            {/* Client Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-2">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Client *
                                    </div>
                                </label>
                                <select
                                    {...register('clientId', { valueAsNumber: true })}
                                    disabled={!!progress}
                                    className="w-full bg-dark-bg border border-gray-600 rounded-lg px-4 py-2.5 text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select a client</option>
                                    {clients.map((client) => (
                                        <option key={client.id} value={client.userId}>
                                            {client.user.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.clientId && (
                                    <p className="text-red-400 text-sm mt-1">{errors.clientId.message}</p>
                                )}
                            </div>

                            {/* Metrics Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Weight */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-2">
                                        <div className="flex items-center gap-2">
                                            <Weight className="w-4 h-4" />
                                            Weight (kg) *
                                        </div>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        {...register('weight', { valueAsNumber: true })}
                                        placeholder="75.5"
                                        className="w-full bg-dark-bg border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.weight && (
                                        <p className="text-red-400 text-sm mt-1">{errors.weight.message}</p>
                                    )}
                                </div>

                                {/* Body Fat */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-2">
                                        <div className="flex items-center gap-2">
                                            <Activity className="w-4 h-4" />
                                            Body Fat (%)
                                        </div>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        {...register('bodyFat', { valueAsNumber: true })}
                                        placeholder="18.5"
                                        className="w-full bg-dark-bg border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.bodyFat && (
                                        <p className="text-red-400 text-sm mt-1">{errors.bodyFat.message}</p>
                                    )}
                                </div>

                                {/* Muscle Mass */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-2">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4" />
                                            Muscle Mass (kg)
                                        </div>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        {...register('muscleMass', { valueAsNumber: true })}
                                        placeholder="55.2"
                                        className="w-full bg-dark-bg border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.muscleMass && (
                                        <p className="text-red-400 text-sm mt-1">{errors.muscleMass.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-2">
                                    <div className="flex items-center gap-2">
                                        <Ruler className="w-4 h-4" />
                                        Progress Notes
                                    </div>
                                </label>
                                <textarea
                                    {...register('notes')}
                                    rows={4}
                                    placeholder="E.g., Feeling stronger, energy levels up, completed all workouts..."
                                    className="w-full bg-dark-bg border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                                {errors.notes && (
                                    <p className="text-red-400 text-sm mt-1">{errors.notes.message}</p>
                                )}
                                <p className="text-xs text-gray-400 mt-1">
                                    Add any observations, achievements, or notes about this progress
                                </p>
                            </div>

                            {/* Info Message - Removed */}

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4 border-t border-gray-700">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2.5 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2.5 bg-primary-blue hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            {progress ? 'Updating...' : 'Saving...'}
                                        </div>
                                    ) : progress ? (
                                        'Update Progress'
                                    ) : (
                                        'Save Progress'
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};
