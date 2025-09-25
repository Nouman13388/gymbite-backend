import React, { useState, useEffect } from 'react';
import { PageWrapper } from '../views/layout/PageWrapper';
import { DataTable, Loading, EmptyState, ErrorMessage } from '../views/components/ui';
import type { Column } from '../views/components/ui';
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
            key: 'name',
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
            icon: Edit,
            onClick: handleEditMeal,
            className: 'text-yellow-200 hover:text-yellow-100 focus:text-yellow-100 hover:bg-yellow-800/40 focus:bg-yellow-800/40 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all duration-200 rounded-lg',
            ariaLabel: 'Edit meal plan'
        },
        {
            label: 'Delete',
            icon: Trash2,
            onClick: handleDeleteMeal,
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
                    <button
                        onClick={handleCreateMeal}
                        className="bg-primary-blue hover:bg-blue-600 focus:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium shadow-lg hover:shadow-xl"
                        aria-label="Create new meal plan"
                        title="Create new meal plan"
                    >
                        <Plus className="w-4 h-4" />
                        Create Meal Plan
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
                                onClick={handleCreateMeal}
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
                    <DataTable
                        data={mealPlans}
                        columns={columns}
                        actions={actions}
                        loading={loading}
                        searchable={true}
                        pageable={true}
                    />
                )}
            </div>
        </PageWrapper>
    );
};

export default MealsPage;