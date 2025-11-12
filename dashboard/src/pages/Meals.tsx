import React, { useState, useEffect, useCallback } from 'react';
import { PageWrapper } from '../views/layout/PageWrapper';
import { Loading, EmptyState, ErrorMessage } from '../views/components/ui';
import { EnhancedDataTable } from '../components/ui/EnhancedDataTable';
import { DeleteConfirm } from '../views/components/ui/DeleteConfirm';
import type { Column, TableAction } from '../components/ui/EnhancedDataTable';
import type { FilterConfig } from '../hooks/useAdvancedSearch';
import {
    Utensils,
    Plus,
    RefreshCw,
    Edit,
    Trash2,
    Target,
    Calendar,
    Flame,
    Zap,
    TrendingUp
} from 'lucide-react';
import { api } from '../services/api';
import { apiWithNotifications } from '../services/apiWithNotifications';
import { MealFormModal } from '../components/forms/MealFormModal';
import type { MealFormData } from '../schemas';

// MealPlan data type based on updated Prisma schema
interface MealPlan extends Record<string, unknown> {
    id: number;
    userId: number;
    title: string;
    description?: string;
    category: string;
    imageUrl?: string;
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    createdAt: string;
    updatedAt: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
    meals?: {
        id: number;
        name: string;
        description?: string;
        type: string;
        ingredients: string[];
        calories: number;
        protein: number;
        imageUrl?: string;
    }[];
}

// Reusable StatCard component with improved accessibility and styling
interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    iconBgColor: string;
    iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, iconBgColor, iconColor }) => (
    <div className="bg-dark-card rounded-lg p-6 border border-gray-700/30">
        <div className="flex items-center">
            <div className={`p-3 ${iconBgColor} rounded-lg`}>
                <div className={`h-6 w-6 ${iconColor}`}>
                    {icon}
                </div>
            </div>
            <div className="ml-4">
                <p className="text-sm text-white/80 font-medium">{title}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
        </div>
    </div>
);

// Reusable NutritionBadge component
interface NutritionBadgeProps {
    type: 'calories' | 'protein' | 'fat' | 'carbs';
    value: number;
    unit?: string;
}

const NutritionBadge: React.FC<NutritionBadgeProps> = ({ type, value, unit = 'g' }) => {
    const getBadgeStyles = (badgeType: 'calories' | 'protein' | 'fat' | 'carbs') => {
        const baseClasses = 'inline-flex items-center justify-center px-3 py-1.5 rounded-md text-sm font-semibold whitespace-nowrap border transition-colors';
        switch (badgeType) {
            case 'calories':
                return `${baseClasses} bg-orange-800/40 text-orange-100 border-orange-600/60 hover:bg-orange-800/50`;
            case 'protein':
                return `${baseClasses} bg-blue-800/40 text-blue-100 border-blue-600/60 hover:bg-blue-800/50`;
            case 'fat':
                return `${baseClasses} bg-yellow-800/40 text-yellow-100 border-yellow-600/60 hover:bg-yellow-800/50`;
            case 'carbs':
                return `${baseClasses} bg-green-800/40 text-green-100 border-green-600/60 hover:bg-green-800/50`;
            default:
                return `${baseClasses} bg-gray-800/40 text-gray-100 border-gray-600/60 hover:bg-gray-800/50`;
        }
    };

    const displayValue = type === 'calories' ? `${value} kcal` : `${value}${unit}`;

    return (
        <span
            className={getBadgeStyles(type)}
            title={`${type.charAt(0).toUpperCase() + type.slice(1)}: ${displayValue}`}
        >
            {displayValue}
        </span>
    );
};

// Helper function for improved date comparison
const isToday = (dateString: string): boolean => {
    const today = new Date();
    const date = new Date(dateString);
    return date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate();
};

// Helper functions for calculating averages
const calculateAverageCalories = (mealPlans: MealPlan[]): number => {
    if (mealPlans.length === 0) return 0;
    return Math.round(mealPlans.reduce((sum, m) => sum + (m.calories as number), 0) / mealPlans.length);
};

const calculateAverageProtein = (mealPlans: MealPlan[]): number => {
    if (mealPlans.length === 0) return 0;
    return Math.round(mealPlans.reduce((sum, m) => sum + (m.protein as number), 0) / mealPlans.length);
};

const calculateAverageCarbs = (mealPlans: MealPlan[]): number => {
    if (mealPlans.length === 0) return 0;
    return Math.round(mealPlans.reduce((sum, m) => sum + (m.carbs as number), 0) / mealPlans.length);
};

const calculateAverageFat = (mealPlans: MealPlan[]): number => {
    if (mealPlans.length === 0) return 0;
    return Math.round(mealPlans.reduce((sum, m) => sum + (m.fat as number), 0) / mealPlans.length);
};

// Format date with better handling
const formatDate = (dateString: string): string => {
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch {
        return 'Invalid date';
    }
};

const MealsPage: React.FC = () => {
    const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedMeal, setSelectedMeal] = useState<MealPlan | null>(null);
    const [modalLoading, setModalLoading] = useState(false);

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
        {
            key: 'title',
            label: 'Meal Plan Name',
            sortable: true,
            render: (value) => (
                <span className="text-white font-medium truncate max-w-xs" title={String(value)}>
                    {String(value)}
                </span>
            )
        },
        {
            key: 'description',
            label: 'Description',
            sortable: false,
            render: (value) => value ? (
                <div className="max-w-xs">
                    <span
                        className="text-white/80 truncate block"
                        title={String(value)}
                    >
                        {String(value).length > 50 ? `${String(value).substring(0, 50)}...` : String(value)}
                    </span>
                </div>
            ) : (
                <span className="text-white/50 italic">No description</span>
            )
        },
        {
            key: 'calories',
            label: 'Calories',
            sortable: true,
            render: (value) => (
                <NutritionBadge type="calories" value={Number(value)} />
            )
        },
        {
            key: 'protein',
            label: 'Protein',
            sortable: true,
            render: (value) => (
                <NutritionBadge type="protein" value={Number(value)} />
            )
        },
        {
            key: 'fat',
            label: 'Fat',
            sortable: true,
            render: (value) => (
                <NutritionBadge type="fat" value={Number(value)} />
            )
        },
        {
            key: 'carbs',
            label: 'Carbs',
            sortable: true,
            render: (value) => (
                <NutritionBadge type="carbs" value={Number(value)} />
            )
        },
        {
            key: 'createdAt',
            label: 'Created',
            sortable: true,
            render: (value) => {
                const dateStr = formatDate(value as string);
                return isToday(value as string) ? (
                    <span className="text-green-300 font-medium" title="Created today">
                        {dateStr} (Today)
                    </span>
                ) : (
                    <span className="text-white/80">{dateStr}</span>
                );
            }
        }
    ];

    // CRUD handlers
    const handleCreateMeal = useCallback(async (data: MealFormData) => {
        try {
            setModalLoading(true);
            await apiWithNotifications.meals.create(data);
            handleRefresh();
        } catch (error) {
            console.error('Failed to create meal:', error);
            throw error;
        } finally {
            setModalLoading(false);
        }
    }, []);

    const handleEditMeal = useCallback(async (data: MealFormData) => {
        if (!selectedMeal) return;

        try {
            setModalLoading(true);
            await apiWithNotifications.meals.update(selectedMeal.id, data);
            handleRefresh();
        } catch (error) {
            console.error('Failed to update meal:', error);
            throw error;
        } finally {
            setModalLoading(false);
        }
    }, [selectedMeal]);

    const handleDeleteMeal = useCallback(async () => {
        if (!selectedMeal) return;

        try {
            setModalLoading(true);
            await apiWithNotifications.meals.delete(selectedMeal.id);
            handleRefresh();
            setIsDeleteModalOpen(false);
            setSelectedMeal(null);
        } catch (error) {
            console.error('Failed to delete meal:', error);
        } finally {
            setModalLoading(false);
        }
    }, [selectedMeal]);

    // UI event handlers
    const openCreateModal = () => setIsCreateModalOpen(true);
    const openEditModal = (meal: MealPlan) => {
        setSelectedMeal(meal);
        setIsEditModalOpen(true);
    };
    const openDeleteModal = (meal: MealPlan) => {
        setSelectedMeal(meal);
        setIsDeleteModalOpen(true);
    };

    // Filter configuration for meal plans
    const filterConfigs: FilterConfig[] = [
        {
            key: 'calories',
            label: 'Calories Range',
            type: 'select',
            options: [
                { value: '0-500', label: 'Low (0-500)' },
                { value: '501-1000', label: 'Medium (501-1000)' },
                { value: '1001-1500', label: 'High (1001-1500)' },
                { value: '1501+', label: 'Very High (1501+)' }
            ]
        },
        {
            key: 'protein',
            label: 'Protein Content',
            type: 'select',
            options: [
                { value: '0-20', label: 'Low (0-20g)' },
                { value: '21-40', label: 'Medium (21-40g)' },
                { value: '41-60', label: 'High (41-60g)' },
                { value: '61+', label: 'Very High (61g+)' }
            ]
        },
        {
            key: 'carbohydrates',
            label: 'Carbohydrates',
            type: 'select',
            options: [
                { value: '0-30', label: 'Low Carb (0-30g)' },
                { value: '31-60', label: 'Medium (31-60g)' },
                { value: '61-100', label: 'High (61-100g)' },
                { value: '101+', label: 'Very High (101g+)' }
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

    // Searchable fields for meal plans
    const searchableFields = ['name', 'description', 'ingredients', 'user.name', 'user.email'];

    const actions: TableAction[] = [
        {
            label: 'Edit',
            icon: Edit,
            onClick: (row) => openEditModal(row as MealPlan),
            className: 'text-yellow-200 hover:text-yellow-100 focus:text-yellow-100 hover:bg-yellow-800/40 focus:bg-yellow-800/40 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all duration-200 rounded-lg',
            ariaLabel: 'Edit meal plan'
        },
        {
            label: 'Delete',
            icon: Trash2,
            onClick: (row) => openDeleteModal(row as MealPlan),
            className: 'text-red-200 hover:text-red-100 focus:text-red-100 hover:bg-red-800/40 focus:bg-red-800/40 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all duration-200 rounded-lg',
            ariaLabel: 'Delete meal plan'
        }
    ];

    // Loading state
    if (loading) {
        return (
            <PageWrapper>
                <Loading text="Loading meal plans..." />
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
            subtitle="Manage nutrition plans and dietary programs"
            actions={
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className="bg-dark-card hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium border border-gray-600/50 hover:border-gray-500/50"
                        aria-label="Refresh meal plans list"
                        title="Refresh meal plans"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        {loading ? 'Loading...' : 'Refresh'}
                    </button>
                </div>
            }
        >
            <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
                    <StatCard
                        icon={<Utensils className="h-6 w-6" />}
                        title="Total Meal Plans"
                        value={mealPlans.length}
                        iconBgColor="bg-blue-800/40"
                        iconColor="text-blue-200"
                    />
                    <StatCard
                        icon={<Flame className="h-6 w-6" />}
                        title="Avg Calories"
                        value={`${calculateAverageCalories(mealPlans)} kcal`}
                        iconBgColor="bg-orange-800/40"
                        iconColor="text-orange-200"
                    />
                    <StatCard
                        icon={<Zap className="h-6 w-6" />}
                        title="Avg Protein"
                        value={`${calculateAverageProtein(mealPlans)}g`}
                        iconBgColor="bg-blue-800/40"
                        iconColor="text-blue-200"
                    />
                    <StatCard
                        icon={<Target className="h-6 w-6" />}
                        title="Avg Carbs"
                        value={`${calculateAverageCarbs(mealPlans)}g`}
                        iconBgColor="bg-green-800/40"
                        iconColor="text-green-200"
                    />
                    <StatCard
                        icon={<TrendingUp className="h-6 w-6" />}
                        title="Avg Fat"
                        value={`${calculateAverageFat(mealPlans)}g`}
                        iconBgColor="bg-yellow-800/40"
                        iconColor="text-yellow-200"
                    />
                    <StatCard
                        icon={<Calendar className="h-6 w-6" />}
                        title="Today's Plans"
                        value={mealPlans.filter(m => isToday(m.createdAt)).length}
                        iconBgColor="bg-purple-800/40"
                        iconColor="text-purple-200"
                    />
                </div>

                {/* Meal Plans Table */}
                {mealPlans.length === 0 ? (
                    <EmptyState
                        icon={<Utensils className="w-12 h-12 text-white/60" />}
                        message="No meal plans found"
                        description="Get started by creating your first nutrition plan for users."
                        action={
                            <button
                                onClick={openCreateModal}
                                className="bg-primary-blue hover:bg-blue-600 focus:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium shadow-lg hover:shadow-xl"
                                aria-label="Create your first meal plan"
                                title="Create your first meal plan"
                            >
                                <Plus className="w-4 h-4" />
                                Create First Meal Plan
                            </button>
                        }
                    />
                ) : (
                    <EnhancedDataTable
                        data={mealPlans}
                        columns={columns}
                        actions={actions}
                        loading={loading}
                        onCreateNew={openCreateModal}
                        createButtonLabel="Create New Meal Plan"
                        title="All Meal Plans"
                        filterConfigs={filterConfigs}
                        searchableFields={searchableFields}
                    />
                )}

                {/* Modals */}
                <MealFormModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSubmit={handleCreateMeal}
                    isLoading={modalLoading}
                />

                <MealFormModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedMeal(null);
                    }}
                    onSubmit={handleEditMeal}
                    meal={selectedMeal}
                    isLoading={modalLoading}
                />

                <DeleteConfirm
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                        setSelectedMeal(null);
                    }}
                    onConfirm={handleDeleteMeal}
                    loading={modalLoading}
                    title="Delete Meal Plan"
                    message={`Are you sure you want to delete "${selectedMeal?.name}"? This action cannot be undone.`}
                />
            </div>
        </PageWrapper>
    );
};

export default MealsPage;