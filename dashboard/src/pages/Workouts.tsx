import React, { useState, useEffect } from 'react';
import { PageWrapper } from '../views/layout/PageWrapper';
import { DataTable, Loading, EmptyState, ErrorMessage } from '../views/components/ui';
import type { Column } from '../views/components/ui';
import { Dumbbell, Plus, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

// WorkoutPlan data type based on Prisma schema
interface WorkoutPlan extends Record<string, unknown> {
    id: number;
    userId: number;
    name: string;
    exercises: string;
    sets: number;
    reps: number;
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
                <span className="text-gray-300 truncate max-w-xs" title={String(value)}>
                    {String(value).length > 50 ? `${String(value).substring(0, 50)}...` : String(value)}
                </span>
            )
        },
        {
            key: 'sets',
            label: 'Sets',
            sortable: true,
            render: (value) => (
                <span className="px-2 py-1 bg-blue-900/20 text-blue-400 rounded text-xs">
                    {String(value)} sets
                </span>
            )
        },
        {
            key: 'reps',
            label: 'Reps',
            sortable: true,
            render: (value) => (
                <span className="px-2 py-1 bg-green-900/20 text-green-400 rounded text-xs">
                    {String(value)} reps
                </span>
            )
        },
        {
            key: 'createdAt',
            label: 'Created',
            sortable: true,
            render: (value) => new Date(value as string).toLocaleDateString()
        }
    ];

    const handleCreateWorkout = () => {
        console.log('Create workout clicked');
        // TODO: Implement workout creation
    };

    const handleEditWorkout = (workout: WorkoutPlan) => {
        console.log('Edit workout:', workout);
        // TODO: Implement workout editing
    };

    const handleDeleteWorkout = (workout: WorkoutPlan) => {
        console.log('Delete workout:', workout);
        // TODO: Implement workout deletion
    };

    const actions = [
        {
            label: 'Edit',
            onClick: handleEditWorkout,
            className: 'text-yellow-400 hover:text-yellow-300'
        },
        {
            label: 'Delete',
            onClick: handleDeleteWorkout,
            className: 'text-red-400 hover:text-red-300'
        }
    ];

    // Loading state
    if (loading) {
        return (
            <PageWrapper title="Workout Plans">
                <Loading text="Loading workout plans..." />
            </PageWrapper>
        );
    }

    // Error state
    if (error) {
        return (
            <PageWrapper title="Workout Plans">
                <ErrorMessage
                    message={error}
                    onRetry={handleRefresh}
                />
            </PageWrapper>
        );
    }

    return (
        <PageWrapper
            title="Workout Plans"
            subtitle="Manage workout routines and exercise programs"
            actions={
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleRefresh}
                        className="bg-dark-card hover:bg-gray-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                    <button
                        onClick={handleCreateWorkout}
                        className="bg-primary-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Create Workout
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
                                <p className="text-sm text-gray-400">Total Workouts</p>
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
                                <p className="text-sm text-gray-400">Today's Workouts</p>
                                <p className="text-2xl font-bold text-white">
                                    {workoutPlans.filter(w => new Date(w.createdAt).toDateString() === new Date().toDateString()).length}
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
                                <p className="text-sm text-gray-400">Total Sets</p>
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
                        icon={<Dumbbell className="w-12 h-12" />}
                        message="No workout plans found"
                        description="Get started by creating your first workout plan for users."
                        action={
                            <button
                                onClick={handleCreateWorkout}
                                className="bg-primary-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Create First Workout
                            </button>
                        }
                    />
                ) : (
                    <DataTable
                        data={workoutPlans}
                        columns={columns}
                        actions={actions}
                        loading={loading}
                        onCreateNew={handleCreateWorkout}
                        createButtonLabel="Create New Workout"
                        title="All Workout Plans"
                        searchable={true}
                        pageable={true}
                    />
                )}
            </div>
        </PageWrapper>
    );
};

export default WorkoutsPage;