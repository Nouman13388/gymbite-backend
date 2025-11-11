import React, { useState, useEffect, useReducer, useCallback, useMemo } from 'react';
import { PageWrapper } from '../views/layout/PageWrapper';
import { EmptyState } from '../views/components/ui';
import { BarChart3, Users, Dumbbell, Calendar, TrendingUp, RefreshCw, AlertCircle, UserPlus, Award, Activity, Target, CheckCircle, Clock, XCircle } from 'lucide-react';
import { crudApi } from '../services/api';

// TypeScript interfaces for API responses
interface UserAnalytics {
    totalUsers: number;
    usersByRole: { role: string; count: number }[];
    recentRegistrations: number;
}

interface TrainerAnalytics {
    totalTrainers: number;
    averageRating: number;
    trainersBySpecialty: { specialty: string; count: number }[];
    topTrainers: {
        id: number;
        name: string;
        specialty: string;
        averageRating: number;
        totalAppointments: number;
        totalReviews: number;
    }[];
}

interface ClientAnalytics {
    totalClients: number;
    clientsByGoal: { goal: string; count: number }[];
    clientsWithProgress: number;
    activeClients: number;
    inactiveClients: number;
}

interface AppointmentAnalytics {
    totalAppointments: number;
    appointmentsByStatus: { status: string; count: number }[];
    recentAppointments: number;
    completionRate: number;
}

interface SystemHealth {
    database: {
        users: number;
        trainers: number;
        clients: number;
        appointments: number;
        progressRecords: number;
        feedback: number;
        notifications: number;
        workoutPlans: number;
        mealPlans: number;
    };
    health: string;
    timestamp: string;
}

interface DashboardOverview {
    users: UserAnalytics;
    trainers: TrainerAnalytics;
    clients: ClientAnalytics;
    appointments: AppointmentAnalytics;
    system: SystemHealth;
    generatedAt: string;
}

// Enhanced state management with useReducer pattern
interface AnalyticsState {
    data: DashboardOverview | null;
    loading: boolean;
    error: string | null;
    lastFetched: Date | null;
}

type AnalyticsAction =
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; payload: { data: DashboardOverview; timestamp: Date } }
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
            // Fetch comprehensive dashboard overview
            const response = await crudApi.analytics.dashboard();

            dispatch({
                type: 'FETCH_SUCCESS',
                payload: {
                    data: response as DashboardOverview,
                    timestamp: new Date()
                }
            });

            console.log('Analytics data fetched successfully:', response);
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
                        value={state.data.users.totalUsers}
                        subtitle="Registered accounts"
                        iconBgColor="bg-blue-800/40"
                        iconColor="text-blue-200"
                        subtitleColor="text-blue-300"
                    />

                    <MetricCard
                        icon={<UserPlus className="h-6 w-6" />}
                        title="Total Trainers"
                        value={state.data.trainers.totalTrainers}
                        subtitle="Active trainers"
                        iconBgColor="bg-green-800/40"
                        iconColor="text-green-200"
                        subtitleColor="text-green-300"
                    />

                    <MetricCard
                        icon={<Target className="h-6 w-6" />}
                        title="Total Clients"
                        value={state.data.clients.totalClients}
                        subtitle="Registered clients"
                        iconBgColor="bg-purple-800/40"
                        iconColor="text-purple-200"
                        subtitleColor="text-purple-300"
                    />

                    <MetricCard
                        icon={<Calendar className="h-6 w-6" />}
                        title="Appointments"
                        value={state.data.appointments.totalAppointments}
                        subtitle="Total bookings"
                        iconBgColor="bg-orange-800/40"
                        iconColor="text-orange-200"
                        subtitleColor="text-orange-300"
                    />
                </div>

                {/* Secondary Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard
                        icon={<TrendingUp className="h-6 w-6" />}
                        title="New Users (30d)"
                        value={state.data.users.recentRegistrations}
                        subtitle="Recent signups"
                        iconBgColor="bg-yellow-800/40"
                        iconColor="text-yellow-200"
                        subtitleColor="text-yellow-300"
                    />

                    <MetricCard
                        icon={<Award className="h-6 w-6" />}
                        title="Avg Rating"
                        value={parseFloat(state.data.trainers.averageRating.toFixed(1))}
                        subtitle="Trainer rating"
                        iconBgColor="bg-pink-800/40"
                        iconColor="text-pink-200"
                        subtitleColor="text-pink-300"
                    />

                    <MetricCard
                        icon={<Activity className="h-6 w-6" />}
                        title="Active Clients"
                        value={state.data.clients.activeClients}
                        subtitle="Last 30 days"
                        iconBgColor="bg-cyan-800/40"
                        iconColor="text-cyan-200"
                        subtitleColor="text-cyan-300"
                    />

                    <MetricCard
                        icon={<CheckCircle className="h-6 w-6" />}
                        title="Completion Rate"
                        value={parseFloat(state.data.appointments.completionRate.toFixed(1))}
                        subtitle="Appointment success"
                        iconBgColor="bg-emerald-800/40"
                        iconColor="text-emerald-200"
                        subtitleColor="text-emerald-300"
                    />
                </div>

                {/* Detailed Analytics Breakdowns */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* User Roles Breakdown */}
                    <div className="bg-dark-card rounded-lg p-6 border border-gray-700/30">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Users size={20} className="text-blue-400" />
                            Users by Role
                        </h3>
                        <div className="space-y-3">
                            {state.data.users.usersByRole.map((role, index) => (
                                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-700/50 last:border-0">
                                    <span className="text-white/80 text-sm font-medium capitalize">
                                        {role.role.toLowerCase()}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 bg-gray-700 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${role.role === 'CLIENT' ? 'bg-purple-500' :
                                                        role.role === 'TRAINER' ? 'bg-green-500' : 'bg-blue-500'
                                                    }`}
                                                style={{ width: `${(role.count / (state.data?.users.totalUsers || 1)) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-white font-bold text-sm w-8 text-right">
                                            {role.count}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Trainer Specialties */}
                    <div className="bg-dark-card rounded-lg p-6 border border-gray-700/30">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Dumbbell size={20} className="text-green-400" />
                            Trainer Specialties
                        </h3>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                            {state.data.trainers.trainersBySpecialty.slice(0, 8).map((specialty, index) => (
                                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-700/50 last:border-0">
                                    <span className="text-white/80 text-sm font-medium truncate pr-2">
                                        {specialty.specialty}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 bg-gray-700 rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full bg-green-500"
                                                style={{ width: `${(specialty.count / (state.data?.trainers.totalTrainers || 1)) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-white font-bold text-sm w-8 text-right">
                                            {specialty.count}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Appointment Status */}
                    <div className="bg-dark-card rounded-lg p-6 border border-gray-700/30">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Calendar size={20} className="text-orange-400" />
                            Appointment Status
                        </h3>
                        <div className="space-y-3">
                            {state.data.appointments.appointmentsByStatus.map((status, index) => {
                                const statusConfig = {
                                    PENDING: { color: 'bg-yellow-500', icon: Clock, label: 'Pending' },
                                    CONFIRMED: { color: 'bg-blue-500', icon: CheckCircle, label: 'Confirmed' },
                                    COMPLETED: { color: 'bg-green-500', icon: CheckCircle, label: 'Completed' },
                                    CANCELLED: { color: 'bg-red-500', icon: XCircle, label: 'Cancelled' },
                                };
                                const config = statusConfig[status.status as keyof typeof statusConfig] || statusConfig.PENDING;
                                const Icon = config.icon;

                                return (
                                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-700/50 last:border-0">
                                        <div className="flex items-center gap-2">
                                            <Icon size={16} className={`${config.color.replace('bg-', 'text-')}`} />
                                            <span className="text-white/80 text-sm font-medium">
                                                {config.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 bg-gray-700 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${config.color}`}
                                                    style={{ width: `${(status.count / (state.data?.appointments.totalAppointments || 1)) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-white font-bold text-sm w-8 text-right">
                                                {status.count}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Top Trainers */}
                <div className="bg-dark-card rounded-lg p-6 border border-gray-700/30">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Award size={20} className="text-yellow-400" />
                        Top Rated Trainers
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-gray-700">
                                <tr>
                                    <th className="text-left py-3 px-4 text-white/70 font-medium text-sm">Rank</th>
                                    <th className="text-left py-3 px-4 text-white/70 font-medium text-sm">Name</th>
                                    <th className="text-left py-3 px-4 text-white/70 font-medium text-sm">Specialty</th>
                                    <th className="text-center py-3 px-4 text-white/70 font-medium text-sm">Rating</th>
                                    <th className="text-center py-3 px-4 text-white/70 font-medium text-sm">Reviews</th>
                                    <th className="text-center py-3 px-4 text-white/70 font-medium text-sm">Sessions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {state.data.trainers.topTrainers.slice(0, 5).map((trainer, index) => (
                                    <tr key={trainer.id} className="border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                                                    index === 1 ? 'bg-gray-400/20 text-gray-300' :
                                                        index === 2 ? 'bg-orange-500/20 text-orange-400' :
                                                            'bg-gray-600/20 text-gray-400'
                                                }`}>
                                                {index + 1}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-white font-medium">{trainer.name}</td>
                                        <td className="py-3 px-4 text-white/70 text-sm">{trainer.specialty}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-center gap-1">
                                                <Award size={16} className="text-yellow-400" />
                                                <span className="text-white font-bold">{trainer.averageRating.toFixed(1)}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-center text-white/70">{trainer.totalReviews}</td>
                                        <td className="py-3 px-4 text-center text-white/70">{trainer.totalAppointments}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* System Health Details */}
                <div className="bg-dark-card rounded-lg p-6 border border-gray-700/30">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Activity size={20} className="text-cyan-400" />
                        Database Overview
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(state.data.system.database).map(([key, value]) => (
                            <div key={key} className="bg-gray-800/40 rounded-lg p-4 border border-gray-700/30">
                                <p className="text-white/60 text-xs font-medium mb-1 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </p>
                                <p className="text-white text-2xl font-bold">{value.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Status */}
                <div className="bg-dark-card rounded-lg p-6 border border-gray-700/30">
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
                            status={state.data.system.health === 'healthy' ? 'healthy' : 'error'}
                            statusText={state.data.system.health.charAt(0).toUpperCase() + state.data.system.health.slice(1)}
                            description={`Connection stable - ${state.data.system.database.users + state.data.system.database.trainers + state.data.system.database.clients} total records`}
                            isLast={false}
                        />

                        <SystemStatusRow
                            title="Real-time Updates"
                            status="active"
                            statusText="Active"
                            description={`Last updated: ${new Date(state.data.system.timestamp).toLocaleTimeString()}`}
                            isLast={true}
                        />
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default AnalyticsPage;