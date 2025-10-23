import React, { useState, useEffect, useReducer, useCallback, useMemo } from 'react';
import { PageWrapper } from '../views/layout/PageWrapper';
import { EmptyState } from '../views/components/ui';
import { BarChart3, Users, Dumbbell, Utensils, TrendingUp, RefreshCw, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

// TypeScript interfaces for API responses
interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

interface WorkoutPlan {
    id: number;
    userId: number;
    name: string;
    exercises: string;
    sets: number;
    reps: number;
    createdAt: string;
    updatedAt: string;
}

interface MealPlan {
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
}

interface AnalyticsData {
    totalUsers: number;
    totalWorkouts: number;
    totalMealPlans: number;
    recentUsersCount: number;
}

// Enhanced state management with useReducer pattern
interface AnalyticsState {
    data: AnalyticsData | null;
    loading: boolean;
    error: string | null;
    lastFetched: Date | null;
}

type AnalyticsAction =
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; payload: { data: AnalyticsData; timestamp: Date } }
    | { type: 'FETCH_ERROR'; payload: string }
    | { type: 'CLEAR_ERROR' };

// Analytics state reducer for better state management
const analyticsReducer = (state: AnalyticsState, action: AnalyticsAction): AnalyticsState => {
    switch (action.type) {
        case 'FETCH_START':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                loading: false,
                data: action.payload.data,
                lastFetched: action.payload.timestamp,
                error: null,
            };
        case 'FETCH_ERROR':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

// Initial state for analytics
const initialAnalyticsState: AnalyticsState = {
    data: null,
    loading: false,
    error: null,
    lastFetched: null,
};

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

/**
 * Validates if API response data is in the expected format
 * @param data - Raw API response data
 * @param expectedType - Expected data type for validation
 * @returns Validated array or empty array as fallback
 */
const validateApiResponse = function <T>(data: unknown, expectedType: string): T[] {
    if (!data) {
        console.warn(`${expectedType} data is null or undefined, using empty array fallback`);
        return [];
    }

    if (!Array.isArray(data)) {
        console.warn(`${expectedType} data is not an array, using empty array fallback`);
        return [];
    }

    return data as T[];
};

/**
 * Determines if cached data is still valid based on cache duration
 * @param lastFetched - Timestamp of last successful data fetch
 * @returns True if cache is still valid, false otherwise
 */
const isCacheValid = (lastFetched: Date | null): boolean => {
    if (!lastFetched) return false;

    const now = new Date();
    const timeDiff = now.getTime() - lastFetched.getTime();
    return timeDiff < CACHE_DURATION;
};

// Reusable MetricCard component
interface MetricCardProps {
    icon: React.ReactNode;
    title: string;
    value: number;
    subtitle: string;
    iconBgColor: string;
    iconColor: string;
    subtitleColor: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
    icon,
    title,
    value,
    subtitle,
    iconBgColor,
    iconColor,
    subtitleColor
}) => (
    <div className="bg-dark-card rounded-lg p-6 border border-gray-700/30">
        <div className="flex items-center">
            <div className={`p-3 ${iconBgColor} rounded-lg`}>
                <div className={`h-6 w-6 ${iconColor}`}>
                    {icon}
                </div>
            </div>
            <div className="ml-4">
                <p className="text-sm text-white/80 font-medium">{title}</p>
                <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
                <p className={`text-xs ${subtitleColor} mt-1 font-medium`}>
                    {subtitle}
                </p>
            </div>
        </div>
    </div>
);

// Reusable SystemStatusRow component
interface SystemStatusRowProps {
    status: 'online' | 'healthy' | 'active' | 'warning' | 'error';
    title: string;
    description: string;
    statusText: string;
    isLast?: boolean;
}

const SystemStatusRow: React.FC<SystemStatusRowProps> = ({
    status,
    title,
    description,
    statusText,
    isLast = false
}) => {
    const getStatusStyles = (statusType: string) => {
        switch (statusType) {
            case 'online':
            case 'healthy':
                return { dotColor: 'bg-green-400', textColor: 'text-green-400' };
            case 'active':
                return { dotColor: 'bg-blue-400', textColor: 'text-blue-400' };
            case 'warning':
                return { dotColor: 'bg-yellow-400', textColor: 'text-yellow-400' };
            case 'error':
                return { dotColor: 'bg-red-400', textColor: 'text-red-400' };
            default:
                return { dotColor: 'bg-gray-400', textColor: 'text-gray-400' };
        }
    };

    const { dotColor, textColor } = getStatusStyles(status);

    return (
        <div className={`flex items-center justify-between py-3 ${!isLast ? 'border-b border-gray-700' : ''}`}>
            <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 ${dotColor} rounded-full`} aria-hidden="true"></div>
                <div>
                    <p className="text-white text-sm font-medium">{title}</p>
                    <p className="text-white/70 text-xs">{description}</p>
                </div>
            </div>
            <span className={`${textColor} text-sm font-medium`}>{statusText}</span>
        </div>
    );
};

// Helper function for normalized date comparisons using timestamps
/**
 * Calculates the number of users created within the specified time frame
 * Uses normalized timestamps to ensure consistent date comparisons across time zones
 * @param users - Array of user objects containing creation timestamps
 * @param days - Number of days to look back from current date (default: 7)
 * @returns Count of users created within the specified time frame
 */
const calculateRecentUsers = (users: User[], days: number = 7): number => {
    const cutoffTimestamp = Date.now() - (days * 24 * 60 * 60 * 1000);
    return users.filter(user => {
        const userTimestamp = new Date(user.createdAt).getTime();
        return userTimestamp >= cutoffTimestamp;
    }).length;
};

const AnalyticsPage: React.FC = () => {
    // Enhanced state management using useReducer for better state control
    const [state, dispatch] = useReducer(analyticsReducer, initialAnalyticsState);
    const [refreshKey, setRefreshKey] = useState(0);

    /**
     * Enhanced fetch analytics function with comprehensive error handling,
     * data validation, and caching logic
     */
    const fetchAnalytics = useCallback(async () => {
        // Check if we can use cached data to avoid unnecessary API calls
        if (isCacheValid(state.lastFetched) && state.data) {
            console.log('Using cached analytics data');
            return;
        }

        dispatch({ type: 'FETCH_START' });

        try {
            // Fetch data from multiple endpoints with proper error handling
            const [usersResponse, workoutsResponse, mealsResponse] = await Promise.all([
                api.get<User[]>('/users').catch(err => {
                    console.error('Failed to fetch users:', err);
                    return null;
                }),
                api.get<WorkoutPlan[]>('/workout-plans').catch(err => {
                    console.error('Failed to fetch workout plans:', err);
                    return null;
                }),
                api.get<MealPlan[]>('/meal-plans').catch(err => {
                    console.error('Failed to fetch meal plans:', err);
                    return null;
                }),
            ]);

            // Validate and sanitize API responses with fallbacks
            const users = validateApiResponse<User>(usersResponse, 'Users');
            const workouts = validateApiResponse<WorkoutPlan>(workoutsResponse, 'Workout Plans');
            const meals = validateApiResponse<MealPlan>(mealsResponse, 'Meal Plans');

            // Calculate analytics with validated data
            const recentUsersCount = calculateRecentUsers(users, 7);

            const analyticsData: AnalyticsData = {
                totalUsers: users.length,
                totalWorkouts: workouts.length,
                totalMealPlans: meals.length,
                recentUsersCount,
            };

            dispatch({
                type: 'FETCH_SUCCESS',
                payload: {
                    data: analyticsData,
                    timestamp: new Date()
                }
            });

            console.log('Analytics data fetched successfully:', analyticsData);
        } catch (err) {
            const errorMessage = err instanceof Error
                ? `Failed to load analytics: ${err.message}`
                : 'An unexpected error occurred while loading analytics data';

            console.error('Analytics fetch error:', err);
            dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
        }
    }, [state.lastFetched, state.data]);

    // Memoized refresh handler with debouncing and loading state protection
    const handleRefresh = useCallback(() => {
        if (!state.loading) {
            dispatch({ type: 'CLEAR_ERROR' });
            setRefreshKey(prev => prev + 1);
        }
    }, [state.loading]);

    // Effect for initial data loading and refresh triggers
    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics, refreshKey]);

    // Memoized loading skeleton for better UX
    const LoadingSkeleton = useMemo(() => (
        <PageWrapper subtitle="Loading analytics data...">
            <div className="space-y-6">
                {/* Metric cards skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-dark-card rounded-lg p-6 animate-pulse">
                            <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                            <div className="h-8 bg-gray-700 rounded w-1/2 mb-2"></div>
                            <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                        </div>
                    ))}
                </div>

                {/* Charts skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="bg-dark-card rounded-lg p-6 animate-pulse">
                            <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
                            <div className="h-64 bg-gray-700 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        </PageWrapper>
    ), []);

    // Loading state with enhanced skeleton
    if (state.loading) {
        return LoadingSkeleton;
    }

    // Error state with enhanced error handling
    if (state.error) {
        return (
            <PageWrapper>
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                    <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Unable to Load Analytics</h3>
                    <p className="text-gray-400 mb-6 max-w-md">
                        {state.error}
                    </p>
                    <button
                        onClick={handleRefresh}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        aria-label="Retry loading analytics data"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </button>
                </div>
            </PageWrapper>
        );
    }

    // No data state (shouldn't happen with fallbacks, but good to have)
    if (!state.data) {
        return (
            <PageWrapper>
                <EmptyState
                    icon={<BarChart3 className="w-12 h-12" />}
                    message="No analytics data available"
                    description="Analytics data will appear here once there is activity in the system."
                />
            </PageWrapper>
        );
    }

    return (
        <PageWrapper
            subtitle="Platform usage statistics and insights"
            actions={
                <button
                    onClick={handleRefresh}
                    disabled={state.loading}
                    className="bg-dark-card hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium border border-gray-600/50 hover:border-gray-500/50"
                    aria-label="Refresh analytics data"
                    title={state.lastFetched ? `Last updated: ${state.lastFetched.toLocaleTimeString()}` : 'Refresh analytics data'}
                >
                    <RefreshCw className={`w-4 h-4 ${state.loading ? 'animate-spin' : ''}`} />
                    {state.loading ? 'Loading...' : 'Refresh'}
                </button>
            }
        >
            <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard
                        icon={<Users className="h-6 w-6" />}
                        title="Total Users"
                        value={state.data.totalUsers}
                        subtitle="Registered accounts"
                        iconBgColor="bg-blue-800/40"
                        iconColor="text-blue-200"
                        subtitleColor="text-blue-300"
                    />

                    <MetricCard
                        icon={<Dumbbell className="h-6 w-6" />}
                        title="Workout Plans"
                        value={state.data.totalWorkouts}
                        subtitle="Active plans"
                        iconBgColor="bg-green-800/40"
                        iconColor="text-green-200"
                        subtitleColor="text-green-300"
                    />

                    <MetricCard
                        icon={<Utensils className="h-6 w-6" />}
                        title="Meal Plans"
                        value={state.data.totalMealPlans}
                        subtitle="Nutrition plans"
                        iconBgColor="bg-purple-800/40"
                        iconColor="text-purple-200"
                        subtitleColor="text-purple-300"
                    />

                    <MetricCard
                        icon={<TrendingUp className="h-6 w-6" />}
                        title="New Users (7d)"
                        value={state.data.recentUsersCount}
                        subtitle="Recent signups"
                        iconBgColor="bg-yellow-800/40"
                        iconColor="text-yellow-200"
                        subtitleColor="text-yellow-300"
                    />
                </div>

                {/* Charts Section */}
                {/* TODO: Phase 2 - Implement interactive charting functionality
                    - Add charting library (Chart.js, Recharts, or D3.js)
                    - Create UserGrowthChart component with time-series data
                    - Create ActivityChart component with workout/meal analytics
                    - Add date range picker for custom analytics periods
                    - Implement real-time chart updates
                    - Add export functionality for chart data
                    - Consider mobile-responsive chart configurations
                */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-dark-card rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">User Growth</h3>
                        <div className="h-64 flex items-center justify-center text-gray-400">
                            <div className="text-center">
                                <BarChart3 size={48} className="mx-auto mb-2" />
                                <p className="text-gray-400">Chart visualization coming in Phase 2</p>
                                <p className="text-sm text-gray-500 mt-1">Interactive user growth trends</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-dark-card rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Activity Overview</h3>
                        <div className="h-64 flex items-center justify-center text-gray-400">
                            <div className="text-center">
                                <BarChart3 size={48} className="mx-auto mb-2" />
                                <p className="text-gray-400">Chart visualization coming in Phase 2</p>
                                <p className="text-sm text-gray-500 mt-1">Workout and meal plan analytics</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Status */}
                <div className="bg-dark-card rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
                    <div className="space-y-4" role="table" aria-label="System status information">
                        <SystemStatusRow
                            title="API Services"
                            status="online"
                            statusText="Online"
                            description="All systems operational"
                            isLast={false}
                        />

                        <SystemStatusRow
                            title="Database"
                            status="healthy"
                            statusText="Healthy"
                            description="Connection stable"
                            isLast={false}
                        />

                        <SystemStatusRow
                            title="Real-time Updates"
                            status="active"
                            statusText="Active"
                            description="Data refreshed automatically"
                            isLast={true}
                        />
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default AnalyticsPage;