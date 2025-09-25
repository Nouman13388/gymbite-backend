import React, { useState, useEffect } from 'react';
import { PageWrapper } from '../views/layout/PageWrapper';
import { DataTable, Loading, EmptyState, ErrorMessage } from '../views/components/ui';
import type { Column } from '../views/components/ui';
import { Utensils, Plus, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

// MealPlan data type based on Prisma schema
interface MealPlan extends Record<string, unknown> {
    id: number;
    userId: number;
    name: string;
    description?: string;
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    createdAt: string;
    updatedAt: string;
    user?: {
        name: string;
        email: string;
    };
}

const MealsPage: React.FC = () => {
    const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    // Fetch meal plans from API
    const fetchMealPlans = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get<MealPlan[]>('/meal-plans');
            setMealPlans(Array.isArray(response) ? response : []);
        } catch (err) {
            console.error('Failed to fetch meal plans:', err);
            setError(err instanceof Error ? err.message : 'Failed to load meal plans');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMealPlans();
    }, [refreshKey]);

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    const columns: Column<MealPlan>[] = [
        { key: 'name', label: 'Meal Plan Name', sortable: true },
        {
            key: 'description',
            label: 'Description',
            sortable: false,
            render: (value) => value ? (
                <span className="text-gray-300 truncate max-w-xs" title={String(value)}>
                    {String(value).length > 50 ? `${String(value).substring(0, 50)}...` : String(value)}
                </span>
            ) : (
                <span className="text-gray-500 italic">No description</span>
            )
        },
        {
            key: 'calories',
            label: 'Calories',
            sortable: true,
            render: (value) => (
                <span className="px-2 py-1 bg-orange-900/20 text-orange-400 rounded text-xs font-mono">
                    {String(value)} kcal
                </span>
            )
        },
        {
            key: 'protein',
            label: 'Protein',
            sortable: true,
            render: (value) => (
                <span className="px-2 py-1 bg-blue-900/20 text-blue-400 rounded text-xs font-mono">
                    {String(value)}g
                </span>
            )
        },
        {
            key: 'fat',
            label: 'Fat',
            sortable: true,
            render: (value) => (
                <span className="px-2 py-1 bg-yellow-900/20 text-yellow-400 rounded text-xs font-mono">
                    {String(value)}g
                </span>
            )
        },
        {
            key: 'carbs',
            label: 'Carbs',
            sortable: true,
            render: (value) => (
                <span className="px-2 py-1 bg-green-900/20 text-green-400 rounded text-xs font-mono">
                    {String(value)}g
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

    const handleCreateMeal = () => {
        console.log('Create meal clicked');
        // TODO: Implement meal creation
    };

    const handleEditMeal = (meal: MealPlan) => {
        console.log('Edit meal:', meal);
        // TODO: Implement meal editing
    };

    const handleDeleteMeal = (meal: MealPlan) => {
        console.log('Delete meal:', meal);
        // TODO: Implement meal deletion
    };

    const actions = [
        {
            label: 'Edit',
            onClick: handleEditMeal,
            className: 'text-yellow-400 hover:text-yellow-300'
        },
        {
            label: 'Delete',
            onClick: handleDeleteMeal,
            className: 'text-red-400 hover:text-red-300'
        }
    ];

    // Loading state
    if (loading) {
        return (
            <PageWrapper title="Meal Plans">
                <Loading text="Loading meal plans..." />
            </PageWrapper>
        );
    }

    // Error state
    if (error) {
        return (
            <PageWrapper title="Meal Plans">
                <ErrorMessage
                    message={error}
                    onRetry={handleRefresh}
                />
            </PageWrapper>
        );
    }

    return (
        <PageWrapper
            title="Meal Plans"
            subtitle="Manage nutrition plans and dietary programs"
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
                        onClick={handleCreateMeal}
                        className="bg-primary-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Create Meal Plan
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
                                <Utensils className="h-6 w-6 text-blue-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-400">Total Meal Plans</p>
                                <p className="text-2xl font-bold text-white">{mealPlans.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-dark-card rounded-lg p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-900/20 rounded-lg">
                                <Utensils className="h-6 w-6 text-green-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-400">Avg Calories</p>
                                <p className="text-2xl font-bold text-white">
                                    {mealPlans.length > 0
                                        ? Math.round(mealPlans.reduce((sum, m) => sum + (m.calories as number), 0) / mealPlans.length)
                                        : 0
                                    } kcal
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-dark-card rounded-lg p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-900/20 rounded-lg">
                                <Utensils className="h-6 w-6 text-purple-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-400">Total Protein</p>
                                <p className="text-2xl font-bold text-white">
                                    {mealPlans.reduce((sum, m) => sum + (m.protein as number), 0)}g
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Meal Plans Table */}
                {mealPlans.length === 0 ? (
                    <EmptyState
                        icon={<Utensils className="w-12 h-12" />}
                        message="No meal plans found"
                        description="Get started by creating your first nutrition plan for users."
                        action={
                            <button
                                onClick={handleCreateMeal}
                                className="bg-primary-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Create First Meal Plan
                            </button>
                        }
                    />
                ) : (
                    <DataTable
                        data={mealPlans}
                        columns={columns}
                        actions={actions}
                        loading={loading}
                        onCreateNew={handleCreateMeal}
                        createButtonLabel="Create New Meal Plan"
                        title="All Meal Plans"
                        searchable={true}
                        pageable={true}
                    />
                )}
            </div>
        </PageWrapper>
    );
};

export default MealsPage;