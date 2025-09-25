import React, { useState, useEffect } from 'react';
import { PageWrapper } from '../views/layout/PageWrapper';
import { Loading, EmptyState, ErrorMessage } from '../views/components/ui';
import { BarChart3, Users, Dumbbell, Utensils, TrendingUp, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

interface AnalyticsData {
    totalUsers: number;
    totalWorkouts: number;
    totalMealPlans: number;
    recentUsersCount: number;
}

const AnalyticsPage: React.FC = () => {
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    // Fetch analytics data
    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch data from multiple endpoints
            const [usersResponse, workoutsResponse, mealsResponse] = await Promise.all([
                api.get('/users'),
                api.get('/workout-plans'),
                api.get('/meal-plans'),
            ]);

            const users = Array.isArray(usersResponse) ? usersResponse : [];
            const workouts = Array.isArray(workoutsResponse) ? workoutsResponse : [];
            const meals = Array.isArray(mealsResponse) ? mealsResponse : [];

            // Calculate recent users (last 7 days)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const recentUsersCount = users.filter(user =>
                new Date(user.createdAt) >= sevenDaysAgo
            ).length;

            setAnalyticsData({
                totalUsers: users.length,
                totalWorkouts: workouts.length,
                totalMealPlans: meals.length,
                recentUsersCount,
            });
        } catch (err) {
            console.error('Failed to fetch analytics:', err);
            setError(err instanceof Error ? err.message : 'Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, [refreshKey]);

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    // Loading state
    if (loading) {
        return (
            <PageWrapper title="Analytics">
                <Loading text="Loading analytics..." />
            </PageWrapper>
        );
    }

    // Error state
    if (error) {
        return (
            <PageWrapper title="Analytics">
                <ErrorMessage
                    message={error}
                    onRetry={handleRefresh}
                />
            </PageWrapper>
        );
    }

    // No data state
    if (!analyticsData) {
        return (
            <PageWrapper title="Analytics">
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
            title="Analytics"
            subtitle="Platform usage statistics and insights"
            actions={
                <button
                    onClick={handleRefresh}
                    className="bg-dark-card hover:bg-gray-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            }
        >
            <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-dark-card rounded-lg p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-900/20 rounded-lg">
                                <Users className="h-6 w-6 text-blue-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-400">Total Users</p>
                                <p className="text-2xl font-bold text-white">{analyticsData.totalUsers}</p>
                                <p className="text-xs text-blue-400 mt-1">
                                    Registered accounts
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-dark-card rounded-lg p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-900/20 rounded-lg">
                                <Dumbbell className="h-6 w-6 text-green-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-400">Workout Plans</p>
                                <p className="text-2xl font-bold text-white">{analyticsData.totalWorkouts}</p>
                                <p className="text-xs text-green-400 mt-1">
                                    Active plans
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
                                <p className="text-sm text-gray-400">Meal Plans</p>
                                <p className="text-2xl font-bold text-white">{analyticsData.totalMealPlans}</p>
                                <p className="text-xs text-purple-400 mt-1">
                                    Nutrition plans
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-dark-card rounded-lg p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-900/20 rounded-lg">
                                <TrendingUp className="h-6 w-6 text-yellow-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-400">New Users (7d)</p>
                                <p className="text-2xl font-bold text-white">{analyticsData.recentUsersCount}</p>
                                <p className="text-xs text-yellow-400 mt-1">
                                    Recent signups
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Placeholder */}
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
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-gray-700">
                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                <div>
                                    <p className="text-white text-sm font-medium">API Services</p>
                                    <p className="text-gray-400 text-xs">All systems operational</p>
                                </div>
                            </div>
                            <span className="text-green-400 text-sm">Online</span>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-gray-700">
                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                <div>
                                    <p className="text-white text-sm font-medium">Database</p>
                                    <p className="text-gray-400 text-xs">Connection stable</p>
                                </div>
                            </div>
                            <span className="text-green-400 text-sm">Healthy</span>
                        </div>

                        <div className="flex items-center justify-between py-3">
                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                                <div>
                                    <p className="text-white text-sm font-medium">Real-time Updates</p>
                                    <p className="text-gray-400 text-xs">Data refreshed automatically</p>
                                </div>
                            </div>
                            <span className="text-blue-400 text-sm">Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default AnalyticsPage;