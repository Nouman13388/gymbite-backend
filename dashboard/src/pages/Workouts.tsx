import React, { useState, useEffect, useCallback } from 'react';
import { PageWrapper } from '../views/layout/PageWrapper';
import { Loading, EmptyState, ErrorMessage } from '../views/components/ui';
import { EnhancedDataTable } from '../components/ui/EnhancedDataTable';
import type { Column, TableAction } from '../components/ui/EnhancedDataTable';
import type { FilterConfig } from '../hooks/useAdvancedSearch';
import { DeleteConfirm } from '../views/components/ui/DeleteConfirm';
import { Dumbbell, Plus, RefreshCw, Edit, Trash2 } from 'lucide-react';
import { api } from '../services/api';
import { apiWithNotifications } from '../services/apiWithNotifications';
import { WorkoutFormModal } from '../components/forms/WorkoutFormModal';
import type { WorkoutFormData } from '../schemas';

// WorkoutPlan data type based on Prisma schema
interface WorkoutPlan extends Record<string, unknown> {
    id: number;
    userId: number;
    name: string;
    exercises: string;
    sets: number;
    reps: number;
    difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    createdAt: string;
    updatedAt: string;
    user?: {
        name: string;
        email: string;
    };
}

const WorkoutsPage: React.FC = () => {
    const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedWorkout, setSelectedWorkout] = useState<WorkoutPlan | null>(null);
    const [modalLoading, setModalLoading] = useState(false);

    // Helper function for badge styling
    const getBadgeClasses = (type: 'sets' | 'reps'): string => {
        switch (type) {
            case 'sets':
                return 'bg-blue-700 text-white';
            case 'reps':
                return 'bg-green-700 text-white';
            default:
                return 'bg-gray-700 text-white';
        }
    };

    // Helper function for improved date comparison
    const isToday = (dateString: string): boolean => {
        const today = new Date();
        const date = new Date(dateString);
        return date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate();
    };

    // Fetch workout plans from API
    const fetchWorkoutPlans = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get<WorkoutPlan[]>('/workout-plans');
            setWorkoutPlans(Array.isArray(response) ? response : []);
        } catch (err) {
            console.error('Failed to fetch workout plans:', err);
            setError(err instanceof Error ? err.message : 'Failed to load workout plans');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkoutPlans();
    }, [refreshKey]);

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    const columns: Column<WorkoutPlan>[] = [
        { key: 'name', label: 'Workout Name', sortable: true },
        {
            key: 'exercises',
            label: 'Exercises',
            sortable: false,
            render: (value) => (
                <span className="text-white/90 truncate max-w-xs" title={String(value)}>
                    {String(value).length > 50 ? `${String(value).substring(0, 50)}...` : String(value)}
                </span>
            )
        },
        {
            key: 'sets',
            label: 'Sets',
            sortable: true,
            render: (value) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${getBadgeClasses('sets')}`}>
                    {String(value)} sets
                </span>
            )
        },
        {
            key: 'reps',
            label: 'Reps',
            sortable: true,
            render: (value) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${getBadgeClasses('reps')}`}>
                    {String(value)} reps
                </span>
            )
        },
        {
            key: 'createdAt',
            label: 'Created',
            sortable: true,
            render: (value) => {
                const dateStr = new Date(value as string).toLocaleDateString();
                return isToday(value as string) ? (
                    <span className="text-green-400 font-medium" title="Created today">
                        {dateStr} (Today)
                    </span>
                ) : (
                    <span className="text-white/70">{dateStr}</span>
                );
            }
        }
    ];

    // CRUD handlers
    const handleCreateWorkout = useCallback(async (data: WorkoutFormData) => {
        try {
            setModalLoading(true);
            await apiWithNotifications.workouts.create(data);
            handleRefresh();
        } catch (error) {
            console.error('Failed to create workout:', error);
            throw error;
        } finally {
            setModalLoading(false);
        }
    }, []);

    const handleEditWorkout = useCallback(async (data: WorkoutFormData) => {
        if (!selectedWorkout) return;

        try {
            setModalLoading(true);
            await apiWithNotifications.workouts.update(selectedWorkout.id, data);
            handleRefresh();
        } catch (error) {
            console.error('Failed to update workout:', error);
            throw error;
        } finally {
            setModalLoading(false);
        }
    }, [selectedWorkout]);

    const handleDeleteWorkout = useCallback(async () => {
        if (!selectedWorkout) return;

        try {
            setModalLoading(true);
            await apiWithNotifications.workouts.delete(selectedWorkout.id);
            handleRefresh();
            setIsDeleteModalOpen(false);
            setSelectedWorkout(null);
        } catch (error) {
            console.error('Failed to delete workout:', error);
        } finally {
            setModalLoading(false);
        }
    }, [selectedWorkout]);

    // UI event handlers
    const openCreateModal = () => setIsCreateModalOpen(true);
    const openEditModal = (workout: WorkoutPlan) => {
        setSelectedWorkout(workout);
        setIsEditModalOpen(true);
    };
    const openDeleteModal = (workout: WorkoutPlan) => {
        setSelectedWorkout(workout);
        setIsDeleteModalOpen(true);
    };

    // Filter configuration for workout plans
    const filterConfigs: FilterConfig[] = [
        {
            key: 'difficulty',
            label: 'Difficulty Level',
            type: 'select',
            options: [
                { value: 'BEGINNER', label: 'Beginner' },
                { value: 'INTERMEDIATE', label: 'Intermediate' },
                { value: 'ADVANCED', label: 'Advanced' }
            ]
        },
        {
            key: 'sets',
            label: 'Number of Sets',
            type: 'select',
            options: [
                { value: '1-3', label: '1-3 Sets' },
                { value: '4-6', label: '4-6 Sets' },
                { value: '7+', label: '7+ Sets' }
            ]
        },
        {
            key: 'reps',
            label: 'Repetitions',
            type: 'select',
            options: [
                { value: '1-10', label: '1-10 Reps' },
                { value: '11-20', label: '11-20 Reps' },
                { value: '21+', label: '21+ Reps' }
            ]
        },
        {
            key: 'createdAt',
            label: 'Created Date',
            type: 'dateRange'
        },
        {
            key: 'user',
            label: 'Assigned User',
            type: 'text'
        }
    ];

    // Searchable fields for workout plans
    const searchableFields = ['name', 'description', 'exercises', 'user.name', 'user.email'];

    const actions: TableAction[] = [
        {
            label: 'Edit',
            icon: Edit,
            onClick: (row) => openEditModal(row as WorkoutPlan),
            className: 'text-yellow-300 hover:text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-dark-bg',
            ariaLabel: 'Edit workout plan'
        },
        {
            label: 'Delete',
            icon: Trash2,
            onClick: (row) => openDeleteModal(row as WorkoutPlan),
            className: 'text-red-300 hover:text-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-dark-bg',
            ariaLabel: 'Delete workout plan'
        }
    ];

    // Loading state
    if (loading) {
        return (
            <PageWrapper>
                <Loading text="Loading workout plans..." />
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
            subtitle="Manage workout routines and exercise programs"
            actions={
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className="bg-dark-card hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Refresh workout plans list"
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
                            <div className="p-2 bg-blue-900/20 rounded-lg">
                                <Dumbbell className="h-6 w-6 text-blue-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-white/70 font-medium">Total Workouts</p>
                                <p className="text-2xl font-bold text-white">{workoutPlans.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-dark-card rounded-lg p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-900/20 rounded-lg">
                                <Dumbbell className="h-6 w-6 text-green-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-white/70 font-medium">Today's Workouts</p>
                                <p className="text-2xl font-bold text-white">
                                    {workoutPlans.filter(w => isToday(w.createdAt)).length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-dark-card rounded-lg p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-900/20 rounded-lg">
                                <Dumbbell className="h-6 w-6 text-purple-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-white/70 font-medium">Total Sets</p>
                                <p className="text-2xl font-bold text-white">
                                    {workoutPlans.reduce((sum, w) => sum + (w.sets as number), 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Workouts Table */}
                {workoutPlans.length === 0 ? (
                    <EmptyState
                        icon={<Dumbbell className="w-12 h-12 text-white/60" />}
                        message="No workout plans found"
                        description="Get started by creating your first workout plan for users."
                        action={
                            <button
                                onClick={openCreateModal}
                                className="bg-primary-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-label="Create your first workout plan"
                            >
                                <Plus className="w-4 h-4" />
                                Create First Workout
                            </button>
                        }
                    />
                ) : (
                    <EnhancedDataTable
                        data={workoutPlans}
                        columns={columns}
                        actions={actions}
                        loading={loading}
                        onCreateNew={openCreateModal}
                        createButtonLabel="Create New Workout"
                        title="All Workout Plans"
                        filterConfigs={filterConfigs}
                        searchableFields={searchableFields}
                    />
                )}

                {/* Modals */}
                <WorkoutFormModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSubmit={handleCreateWorkout}
                    isLoading={modalLoading}
                />

                <WorkoutFormModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedWorkout(null);
                    }}
                    onSubmit={handleEditWorkout}
                    workout={selectedWorkout ? {
                        ...selectedWorkout,
                        difficulty: selectedWorkout.difficulty || 'BEGINNER'
                    } : null}
                    isLoading={modalLoading}
                />

                <DeleteConfirm
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                        setSelectedWorkout(null);
                    }}
                    onConfirm={handleDeleteWorkout}
                    loading={modalLoading}
                    title="Delete Workout Plan"
                    message={`Are you sure you want to delete "${selectedWorkout?.name}"? This action cannot be undone.`}
                />
            </div>
        </PageWrapper>
    );
};

export default WorkoutsPage;