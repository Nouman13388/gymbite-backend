import React, { useState, useEffect } from 'react';
import { PageWrapper } from '../views/layout/PageWrapper';
import { Loading, EmptyState, ErrorMessage, DeleteConfirm } from '../views/components/ui';
import { EnhancedDataTable } from '../components/ui/EnhancedDataTable';
import type { Column, TableAction } from '../components/ui/EnhancedDataTable';
import type { FilterConfig } from '../hooks/useAdvancedSearch';
import { Calendar, CalendarPlus, RefreshCw, Edit, Trash2, Video, Phone, MessageSquare, User, CheckCircle, Clock } from 'lucide-react';
import { crudApi } from '../services/api';
import { apiWithNotifications } from '../services/apiWithNotifications';
import { AppointmentFormModal } from '../components/forms/AppointmentFormModal';
import type { AppointmentFormData } from '../schemas';

// Appointment data type based on Prisma schema
interface Appointment extends Record<string, unknown> {
    id: number;
    trainerId: number;
    clientId: number;
    appointmentTime: string;
    type: 'IN_PERSON' | 'VIDEO_CALL' | 'PHONE_CALL' | 'CHAT';
    status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
    meetingLink?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    trainer?: {
        user: {
            name: string;
        };
    };
    client?: {
        user: {
            name: string;
        };
    };
}

const AppointmentsPage: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    // Modal states
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Helper function for type icon
    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'IN_PERSON':
                return User;
            case 'VIDEO_CALL':
                return Video;
            case 'PHONE_CALL':
                return Phone;
            case 'CHAT':
                return MessageSquare;
            default:
                return Calendar;
        }
    };

    // Helper function for status badge styling
    const getStatusBadgeClasses = (status: string): string => {
        switch (status) {
            case 'SCHEDULED':
                return 'bg-blue-700 text-white';
            case 'COMPLETED':
                return 'bg-green-700 text-white';
            case 'CANCELLED':
                return 'bg-red-700 text-white';
            case 'NO_SHOW':
                return 'bg-yellow-700 text-white';
            default:
                return 'bg-gray-700 text-white';
        }
    };

    // Helper function for type badge styling
    const getTypeBadgeClasses = (type: string): string => {
        switch (type) {
            case 'VIDEO_CALL':
                return 'bg-purple-600 text-white';
            case 'PHONE_CALL':
                return 'bg-blue-600 text-white';
            case 'CHAT':
                return 'bg-green-600 text-white';
            case 'IN_PERSON':
                return 'bg-orange-600 text-white';
            default:
                return 'bg-gray-600 text-white';
        }
    };

    // Fetch appointments from API
    const fetchAppointments = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await crudApi.appointments.getAll();
            setAppointments(Array.isArray(response) ? response : []);
        } catch (err) {
            console.error('Failed to fetch appointments:', err);
            setError(err instanceof Error ? err.message : 'Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [refreshKey]);

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    // CRUD Operations
    const handleCreateAppointment = () => {
        setSelectedAppointment(null);
        setIsFormModalOpen(true);
    };

    const handleEditAppointment = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setIsFormModalOpen(true);
    };

    const handleDeleteAppointment = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setIsDeleteModalOpen(true);
    };

    const handleFormSubmit = async (data: AppointmentFormData) => {
        try {
            setIsSubmitting(true);

            if (selectedAppointment) {
                // Update existing appointment
                await apiWithNotifications.appointments.update(selectedAppointment.id, data);
            } else {
                // Create new appointment
                await apiWithNotifications.appointments.create(data);
            }

            handleRefresh();
            setIsFormModalOpen(false);
            setSelectedAppointment(null);
        } catch (err) {
            console.error('Failed to save appointment:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedAppointment) return;

        try {
            setIsSubmitting(true);
            await apiWithNotifications.appointments.delete(selectedAppointment.id);
            handleRefresh();
            setIsDeleteModalOpen(false);
            setSelectedAppointment(null);
        } catch (err) {
            console.error('Failed to delete appointment:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns: Column<Appointment>[] = [
        {
            key: 'appointmentTime',
            label: 'Date & Time',
            sortable: true,
            render: (value) => {
                const date = new Date(value as string);
                return (
                    <div>
                        <div className="text-white font-medium">{date.toLocaleDateString()}</div>
                        <div className="text-xs text-gray-400">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                );
            }
        },
        {
            key: 'trainer',
            label: 'Trainer',
            sortable: false,
            render: (value) => {
                const trainer = value as Appointment['trainer'];
                return trainer?.user?.name || 'N/A';
            }
        },
        {
            key: 'client',
            label: 'Client',
            sortable: false,
            render: (value) => {
                const client = value as Appointment['client'];
                return client?.user?.name || 'N/A';
            }
        },
        {
            key: 'type',
            label: 'Type',
            sortable: true,
            render: (value) => {
                const TypeIcon = getTypeIcon(String(value));
                return (
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeClasses(String(value))}`}>
                        <TypeIcon className="w-3 h-3" />
                        {String(value).replace('_', ' ')}
                    </span>
                );
            }
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (value) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClasses(String(value))}`}>
                    {String(value).replace('_', ' ')}
                </span>
            )
        }
    ];

    const actions: TableAction<Appointment>[] = [
        {
            label: 'Edit',
            icon: Edit,
            onClick: handleEditAppointment,
            className: 'text-yellow-300 hover:text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-dark-bg',
            ariaLabel: 'Edit appointment'
        },
        {
            label: 'Delete',
            icon: Trash2,
            onClick: handleDeleteAppointment,
            className: 'text-red-300 hover:text-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-dark-bg',
            ariaLabel: 'Delete appointment'
        }
    ];

    // Filter configurations for advanced filtering
    const filterConfigs: FilterConfig[] = [
        {
            key: 'type',
            label: 'Type',
            type: 'select',
            options: [
                { value: 'IN_PERSON', label: 'In Person' },
                { value: 'VIDEO_CALL', label: 'Video Call' },
                { value: 'PHONE_CALL', label: 'Phone Call' },
                { value: 'CHAT', label: 'Chat' }
            ]
        },
        {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: [
                { value: 'SCHEDULED', label: 'Scheduled' },
                { value: 'COMPLETED', label: 'Completed' },
                { value: 'CANCELLED', label: 'Cancelled' },
                { value: 'NO_SHOW', label: 'No Show' }
            ]
        },
        {
            key: 'appointmentTime',
            label: 'Date',
            type: 'dateRange'
        }
    ];

    // Searchable fields for quick search
    const searchableFields: (keyof Appointment)[] = ['type', 'status'];

    // Calculate stats
    const scheduledCount = appointments.filter(a => a.status === 'SCHEDULED').length;
    const completedCount = appointments.filter(a => a.status === 'COMPLETED').length;
    const todayCount = appointments.filter(a => {
        const today = new Date().toDateString();
        const appointmentDate = new Date(a.appointmentTime).toDateString();
        return today === appointmentDate;
    }).length;

    // Loading state
    if (loading) {
        return (
            <PageWrapper>
                <Loading text="Loading appointments..." />
            </PageWrapper>
        );
    }

    // Error state
    if (error) {
        return (
            <PageWrapper>
                <ErrorMessage
                    message={error}
                    onRetry={handleRefresh}
                />
            </PageWrapper>
        );
    }

    return (
        <PageWrapper
            subtitle="Manage trainer and client appointments"
            actions={
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className="bg-dark-card hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Refresh appointments list"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        {loading ? 'Loading...' : 'Refresh'}
                    </button>
                </div>
            }
        >
            <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-dark-card rounded-lg p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-600 rounded-lg">
                                <Clock className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-200">Scheduled</p>
                                <p className="text-2xl font-bold text-white">{scheduledCount}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-dark-card rounded-lg p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-600 rounded-lg">
                                <CheckCircle className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-200">Completed</p>
                                <p className="text-2xl font-bold text-white">{completedCount}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-dark-card rounded-lg p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-600 rounded-lg">
                                <Calendar className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-200">Today's Appointments</p>
                                <p className="text-2xl font-bold text-white">{todayCount}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Appointments Table */}
                {appointments.length === 0 ? (
                    <EmptyState
                        icon={<Calendar className="w-12 h-12 text-white/80" />}
                        message="No appointments found"
                        description="Get started by scheduling your first appointment."
                        action={
                            <button
                                onClick={handleCreateAppointment}
                                className="bg-primary-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-label="Schedule your first appointment"
                            >
                                <CalendarPlus className="w-4 h-4" />
                                Schedule First Appointment
                            </button>
                        }
                    />
                ) : (
                    <EnhancedDataTable
                        data={appointments}
                        columns={columns}
                        actions={actions}
                        loading={loading}
                        onCreateNew={handleCreateAppointment}
                        createButtonLabel="Schedule Appointment"
                        title="All Appointments"
                        filterConfigs={filterConfigs}
                        searchableFields={searchableFields}
                        defaultPageSize={10}
                    />
                )}
            </div>

            {/* Appointment Form Modal */}
            <AppointmentFormModal
                isOpen={isFormModalOpen}
                onClose={() => {
                    setIsFormModalOpen(false);
                    setSelectedAppointment(null);
                }}
                onSubmit={handleFormSubmit}
                appointment={selectedAppointment}
                isLoading={isSubmitting}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirm
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedAppointment(null);
                }}
                onConfirm={handleConfirmDelete}
                title="Delete Appointment"
                message={`Are you sure you want to delete this appointment? This action cannot be undone.`}
                loading={isSubmitting}
            />
        </PageWrapper>
    );
};

export default AppointmentsPage;
