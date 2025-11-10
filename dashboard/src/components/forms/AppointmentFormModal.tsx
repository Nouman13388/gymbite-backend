import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Calendar, Users, Video, Phone, MessageSquare, User } from 'lucide-react';
import { appointmentSchema, type AppointmentFormData } from '../../schemas';
import { crudApi } from '../../services/api';

interface AppointmentFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: AppointmentFormData) => Promise<void>;
    appointment?: {
        id: number;
        trainerId: number;
        clientId: number;
        appointmentTime: string;
        type: 'IN_PERSON' | 'VIDEO_CALL' | 'PHONE_CALL' | 'CHAT';
        status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
        meetingLink?: string;
        notes?: string;
    } | null;
    isLoading?: boolean;
}

interface Trainer {
    id: number;
    userId: number;
    specialty: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
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

export const AppointmentFormModal: React.FC<AppointmentFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    appointment,
    isLoading = false,
}) => {
    const [trainers, setTrainers] = useState<Trainer[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<AppointmentFormData>({
        resolver: zodResolver(appointmentSchema),
        defaultValues: appointment || {
            type: 'IN_PERSON',
            status: 'SCHEDULED',
        },
    });

    const appointmentType = watch('type');

    useEffect(() => {
        if (isOpen) {
            fetchTrainersAndClients();
            if (appointment) {
                reset({
                    trainerId: appointment.trainerId,
                    clientId: appointment.clientId,
                    appointmentTime: new Date(appointment.appointmentTime).toISOString().slice(0, 16),
                    type: appointment.type,
                    status: appointment.status,
                    meetingLink: appointment.meetingLink || '',
                    notes: appointment.notes || '',
                });
            } else {
                reset({
                    type: 'IN_PERSON',
                    status: 'SCHEDULED',
                    meetingLink: '',
                    notes: '',
                });
            }
        }
    }, [isOpen, appointment, reset]);

    const fetchTrainersAndClients = async () => {
        try {
            setLoadingData(true);
            const [trainersData, clientsData] = await Promise.all([
                crudApi.trainers.getAll(),
                crudApi.clients.getAll(),
            ]);
            setTrainers(trainersData as Trainer[]);
            setClients(clientsData as Client[]);
        } catch (error) {
            console.error('Failed to fetch trainers and clients:', error);
        } finally {
            setLoadingData(false);
        }
    };

    const handleFormSubmit = async (data: AppointmentFormData) => {
        await onSubmit(data);
        reset();
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-dark-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-blue rounded-lg">
                            <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">
                            {appointment ? 'Edit Appointment' : 'Schedule New Appointment'}
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
                            {/* Trainer Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-2">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Trainer *
                                    </div>
                                </label>
                                <select
                                    {...register('trainerId', { valueAsNumber: true })}
                                    className="w-full bg-dark-bg border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select a trainer</option>
                                    {trainers.map((trainer) => (
                                        <option key={trainer.id} value={trainer.userId}>
                                            {trainer.user.name} - {trainer.specialty}
                                        </option>
                                    ))}
                                </select>
                                {errors.trainerId && (
                                    <p className="text-red-400 text-sm mt-1">{errors.trainerId.message}</p>
                                )}
                            </div>

                            {/* Client Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-2">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        Client *
                                    </div>
                                </label>
                                <select
                                    {...register('clientId', { valueAsNumber: true })}
                                    className="w-full bg-dark-bg border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                            {/* Appointment Date & Time */}
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-2">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Appointment Date & Time *
                                    </div>
                                </label>
                                <input
                                    type="datetime-local"
                                    {...register('appointmentTime')}
                                    className="w-full bg-dark-bg border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.appointmentTime && (
                                    <p className="text-red-400 text-sm mt-1">{errors.appointmentTime.message}</p>
                                )}
                            </div>

                            {/* Appointment Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-3">
                                    Appointment Type *
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <label className="relative">
                                        <input
                                            type="radio"
                                            {...register('type')}
                                            value="IN_PERSON"
                                            className="peer sr-only"
                                        />
                                        <div className="bg-dark-bg border-2 border-gray-600 rounded-lg p-4 cursor-pointer transition-all peer-checked:border-blue-500 peer-checked:bg-blue-500/10 hover:border-gray-500">
                                            <User className="w-6 h-6 text-white mx-auto mb-2" />
                                            <p className="text-sm text-white text-center">In Person</p>
                                        </div>
                                    </label>

                                    <label className="relative">
                                        <input
                                            type="radio"
                                            {...register('type')}
                                            value="VIDEO_CALL"
                                            className="peer sr-only"
                                        />
                                        <div className="bg-dark-bg border-2 border-gray-600 rounded-lg p-4 cursor-pointer transition-all peer-checked:border-blue-500 peer-checked:bg-blue-500/10 hover:border-gray-500">
                                            <Video className="w-6 h-6 text-white mx-auto mb-2" />
                                            <p className="text-sm text-white text-center">Video Call</p>
                                        </div>
                                    </label>

                                    <label className="relative">
                                        <input
                                            type="radio"
                                            {...register('type')}
                                            value="PHONE_CALL"
                                            className="peer sr-only"
                                        />
                                        <div className="bg-dark-bg border-2 border-gray-600 rounded-lg p-4 cursor-pointer transition-all peer-checked:border-blue-500 peer-checked:bg-blue-500/10 hover:border-gray-500">
                                            <Phone className="w-6 h-6 text-white mx-auto mb-2" />
                                            <p className="text-sm text-white text-center">Phone Call</p>
                                        </div>
                                    </label>

                                    <label className="relative">
                                        <input
                                            type="radio"
                                            {...register('type')}
                                            value="CHAT"
                                            className="peer sr-only"
                                        />
                                        <div className="bg-dark-bg border-2 border-gray-600 rounded-lg p-4 cursor-pointer transition-all peer-checked:border-blue-500 peer-checked:bg-blue-500/10 hover:border-gray-500">
                                            <MessageSquare className="w-6 h-6 text-white mx-auto mb-2" />
                                            <p className="text-sm text-white text-center">Chat</p>
                                        </div>
                                    </label>
                                </div>
                                {errors.type && (
                                    <p className="text-red-400 text-sm mt-1">{errors.type.message}</p>
                                )}
                            </div>

                            {/* Meeting Link (conditional for VIDEO_CALL) */}
                            {appointmentType === 'VIDEO_CALL' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-2">
                                        <div className="flex items-center gap-2">
                                            <Video className="w-4 h-4" />
                                            Meeting Link *
                                        </div>
                                    </label>
                                    <input
                                        type="url"
                                        {...register('meetingLink')}
                                        placeholder="https://meet.google.com/abc-defg-hij"
                                        className="w-full bg-dark-bg border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.meetingLink && (
                                        <p className="text-red-400 text-sm mt-1">{errors.meetingLink.message}</p>
                                    )}
                                </div>
                            )}

                            {/* Status (only for editing) */}
                            {appointment && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-2">
                                        Status
                                    </label>
                                    <select
                                        {...register('status')}
                                        className="w-full bg-dark-bg border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="SCHEDULED">Scheduled</option>
                                        <option value="COMPLETED">Completed</option>
                                        <option value="CANCELLED">Cancelled</option>
                                        <option value="NO_SHOW">No Show</option>
                                    </select>
                                    {errors.status && (
                                        <p className="text-red-400 text-sm mt-1">{errors.status.message}</p>
                                    )}
                                </div>
                            )}

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-2">
                                    Notes
                                </label>
                                <textarea
                                    {...register('notes')}
                                    rows={3}
                                    placeholder="Add any additional notes or special instructions..."
                                    className="w-full bg-dark-bg border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                                {errors.notes && (
                                    <p className="text-red-400 text-sm mt-1">{errors.notes.message}</p>
                                )}
                            </div>

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
                                            {appointment ? 'Updating...' : 'Scheduling...'}
                                        </div>
                                    ) : appointment ? (
                                        'Update Appointment'
                                    ) : (
                                        'Schedule Appointment'
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
