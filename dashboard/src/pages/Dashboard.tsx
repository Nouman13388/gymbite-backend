import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import { PageWrapper } from '../views/layout/PageWrapper';
import { Loading } from '../views/components/ui';
import { Users, Dumbbell, Utensils, BarChart3, RefreshCw, User } from 'lucide-react';

// Dashboard data interfaces
interface DashboardStats {
  totalUsers: number;
  totalTrainers: number;
  totalClients: number;
  totalWorkoutPlans: number;
  totalMealPlans: number;
  recentActivity: ActivityItem[];
}

interface ActivityItem {
  id: string;
  type: 'user_created' | 'workout_created' | 'meal_plan_created' | 'appointment_scheduled';
  description: string;
  timestamp: string;
  user?: {
    name: string;
    email: string;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('📊 Fetching dashboard data...');

      // Fetch all data in parallel for better performance
      const [usersResponse, trainersResponse, clientsResponse, workoutPlansResponse, mealPlansResponse] = await Promise.all([
        api.get<User[]>('/users'),
        api.get('/trainers'),
        api.get('/clients'),
        api.get('/workout-plans'),
        api.get('/meal-plans'),
      ]);

      // Calculate stats
      const totalUsers = Array.isArray(usersResponse) ? usersResponse.length : 0;
      const totalTrainers = Array.isArray(trainersResponse) ? trainersResponse.length : 0;
      const totalClients = Array.isArray(clientsResponse) ? clientsResponse.length : 0;
      const totalWorkoutPlans = Array.isArray(workoutPlansResponse) ? workoutPlansResponse.length : 0;
      const totalMealPlans = Array.isArray(mealPlansResponse) ? mealPlansResponse.length : 0;

      // Get recent users (last 5)
      const users = Array.isArray(usersResponse) ? usersResponse : [];
      const sortedUsers = users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      const recent = sortedUsers.slice(0, 5);

      // Create activity based on recent user registrations (real data)
      const recentActivity: ActivityItem[] = recent.map((user) => ({
        id: `user-registered-${user.id}`,
        type: 'user_created',
        description: `${user.name} registered as ${user.role.toLowerCase()}`,
        timestamp: user.createdAt,
        user: {
          name: user.name,
          email: user.email,
        },
      }));

      setStats({
        totalUsers,
        totalTrainers,
        totalClients,
        totalWorkoutPlans,
        totalMealPlans,
        recentActivity,
      });

      setRecentUsers(recent);

      console.log('✅ Dashboard data loaded successfully');
    } catch (err) {
      console.error('❌ Failed to fetch dashboard data:', err);
      const message = err instanceof Error ? err.message : 'Failed to load dashboard data';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh data
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    fetchDashboardData();
  };

  // Initial data fetch
  useEffect(() => {
    if (!authLoading && user) {
      fetchDashboardData();
    }
  }, [authLoading, user, refreshKey]);

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid date';
    }
  };

  // Get activity icon based on type
  const getActivityIcon = (type: ActivityItem['type']) => {
    const iconProps = "w-5 h-5 text-white";
    switch (type) {
      case 'user_created':
        return <User className={iconProps} />;
      case 'workout_created':
        return <Dumbbell className={iconProps} />;
      case 'meal_plan_created':
        return <Utensils className={iconProps} />;
      case 'appointment_scheduled':
        return <BarChart3 className={iconProps} />;
      default:
        return <BarChart3 className={iconProps} />;
    }
  };

  // Loading state
  if (authLoading || isLoading) {
    return <Loading text="Loading dashboard..." />;
  }

  // Error state
  if (error) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center h-64">
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-red-400 mb-2">⚠️ Error Loading Dashboard</h2>
            <p className="text-gray-300 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="bg-primary-blue hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Retry loading dashboard"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  // Quick Actions handlers
  const quickActions = [
    {
      icon: Users,
      label: 'Manage Users',
      description: 'Add, edit, and manage user accounts',
      onClick: () => navigate('/users'),
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      icon: Dumbbell,
      label: 'Workout Plans',
      description: 'Create and manage workout routines',
      onClick: () => navigate('/workouts'),
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      icon: Utensils,
      label: 'Meal Plans',
      description: 'Design nutrition and meal plans',
      onClick: () => navigate('/meals'),
      color: 'bg-orange-600 hover:bg-orange-700'
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      description: 'View reports and analytics',
      onClick: () => navigate('/analytics'),
      color: 'bg-purple-600 hover:bg-purple-700'
    }
  ];

  return (
    <PageWrapper
      subtitle={`Welcome back, ${user?.displayName || user?.email}`}
      actions={
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="bg-dark-card hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Refresh dashboard data"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
      }
    >

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-dark-card rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-200 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
              </div>
              <div className="p-2 bg-blue-600 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-dark-card rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-200 text-sm">Trainers</p>
                <p className="text-2xl font-bold text-white">{stats.totalTrainers}</p>
              </div>
              <div className="p-2 bg-green-600 rounded-lg">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-dark-card rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-200 text-sm">Clients</p>
                <p className="text-2xl font-bold text-white">{stats.totalClients}</p>
              </div>
              <div className="p-2 bg-purple-600 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-dark-card rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-200 text-sm">Workout Plans</p>
                <p className="text-2xl font-bold text-white">{stats.totalWorkoutPlans}</p>
              </div>
              <div className="p-2 bg-orange-600 rounded-lg">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-dark-card rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-200 text-sm">Meal Plans</p>
                <p className="text-2xl font-bold text-white">{stats.totalMealPlans}</p>
              </div>
              <div className="p-2 bg-red-600 rounded-lg">
                <Utensils className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-dark-card rounded-lg p-6">
          <div className="mb-6 pb-2 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Recent Activity
            </h2>
          </div>
          {stats?.recentActivity && stats.recentActivity.length > 0 ? (
            <div className="space-y-4">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-dark-input rounded-lg">
                  <div className="p-2 bg-blue-600 rounded-lg flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium">{activity.description}</p>
                    {activity.user && (
                      <p className="text-sm text-white/80 mt-1">
                        {activity.user.name} ({activity.user.email})
                      </p>
                    )}
                    <p className="text-xs text-white/50 mt-1">{formatTimestamp(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-200">No recent activity</p>
          )}
        </div>

        {/* Recent Users */}
        <div className="bg-dark-card rounded-lg p-6">
          <div className="mb-6 pb-2 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5" />
              Recent Users
            </h2>
          </div>
          {recentUsers.length > 0 ? (
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3 p-3 bg-dark-input rounded-lg">
                  <div className="w-10 h-10 bg-primary-blue rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium">{user.name}</p>
                    <p className="text-sm text-white/80 truncate">{user.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${user.role === 'ADMIN' ? 'bg-red-700 text-white' :
                        user.role === 'TRAINER' ? 'bg-blue-700 text-white' :
                          'bg-green-700 text-white'
                        }`}>
                        {user.role}
                      </span>
                      <span className="text-xs text-white/50">
                        {formatTimestamp(user.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-200">No users found</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-12 bg-dark-card rounded-lg p-6">
        <div className="mb-6 pb-2 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Quick Actions
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <button
                key={index}
                onClick={action.onClick}
                className={`${action.color} p-6 rounded-lg transition-all duration-200 text-center hover:scale-105 hover:shadow-lg group focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-dark-bg`}
                role="button"
                aria-label={`${action.label}: ${action.description}`}
              >
                <div className="mb-3">
                  <IconComponent className="w-8 h-8 mx-auto text-white group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-white font-semibold mb-1">{action.label}</div>
                <div className="text-white/80 text-sm">{action.description}</div>
              </button>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
