import React, { useCallback, useMemo } from 'react';
import { Link, useLocation, matchPath } from 'react-router-dom';
import {
    Home,
    Users,
    UserCog,
    UserCheck,
    Dumbbell,
    Utensils,
    Calendar,
    TrendingUp,
    BarChart3,
    Bell,
    MessageSquare,
    Settings,
    User
} from 'lucide-react';

interface SidebarProps {
    className?: string;
}

interface NavItem {
    path: string;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    iconSize?: number;
    ariaLabel?: string;
    matchExact?: boolean;
}

// Enhanced navigation items configuration with improved accessibility and customization
const navigationItems: NavItem[] = [
    {
        path: '/',
        label: 'Dashboard',
        icon: Home,
        iconSize: 20,
        ariaLabel: 'Navigate to Dashboard - Overview of platform metrics',
        matchExact: true
    },
    {
        path: '/users',
        label: 'Users',
        icon: Users,
        iconSize: 20,
        ariaLabel: 'Navigate to User Management - Manage platform users and roles',
    },
    {
        path: '/trainers',
        label: 'Trainers',
        icon: UserCog,
        iconSize: 20,
        ariaLabel: 'Navigate to Trainer Management - Manage trainers and client assignments',
    },
    {
        path: '/clients',
        label: 'Clients',
        icon: UserCheck,
        iconSize: 20,
        ariaLabel: 'Navigate to Client Management - Manage clients and trainer assignments',
    },
    {
        path: '/workouts',
        label: 'Workouts',
        icon: Dumbbell,
        iconSize: 20,
        ariaLabel: 'Navigate to Workout Plans - Create and manage workout routines',
    },
    {
        path: '/meals',
        label: 'Meals',
        icon: Utensils,
        iconSize: 20,
        ariaLabel: 'Navigate to Meal Plans - Design and oversee nutrition plans',
    },
    {
        path: '/appointments',
        label: 'Appointments',
        icon: Calendar,
        iconSize: 20,
        ariaLabel: 'Navigate to Appointments - Manage trainer and client appointments',
    },
    {
        path: '/progress',
        label: 'Progress',
        icon: TrendingUp,
        iconSize: 20,
        ariaLabel: 'Navigate to Progress - Track client fitness progress and metrics',
    },
    {
        path: '/notifications',
        label: 'Notifications',
        icon: Bell,
        iconSize: 20,
        ariaLabel: 'Navigate to Notifications - Send and manage push notifications',
    },
    {
        path: '/feedback',
        label: 'Feedback',
        icon: MessageSquare,
        iconSize: 20,
        ariaLabel: 'Navigate to Feedback - View and manage trainer reviews and ratings',
    },
    {
        path: '/analytics',
        label: 'Analytics',
        icon: BarChart3,
        iconSize: 20,
        ariaLabel: 'Navigate to Analytics - Platform usage statistics and insights',
    },
    {
        path: '/settings',
        label: 'Settings',
        icon: Settings,
        iconSize: 20,
        ariaLabel: 'Navigate to Settings - Configure application preferences'
    },
    {
        path: '/profile',
        label: 'Profile',
        icon: User,
        iconSize: 20,
        ariaLabel: 'Navigate to Profile - Manage your account'
    },
];

export const Sidebar: React.FC<SidebarProps> = ({
    className = ''
}) => {
    const location = useLocation();

    /**
     * Enhanced active route detection with precise path matching
     * Handles query parameters and nested routes correctly
     */
    const isActiveRoute = useCallback((navItem: NavItem): boolean => {
        const currentPath = location.pathname;
        const { path, matchExact = false } = navItem;

        if (matchExact) {
            return currentPath === path;
        }

        // Use react-router's matchPath for more accurate matching
        const match = matchPath(
            { path, caseSensitive: false },
            currentPath
        );

        return !!match;
    }, [location.pathname]);

    /**
     * Memoized navigation items for performance optimization
     */
    const navigationElements = useMemo(() => {
        return navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item);
            const iconSize = item.iconSize || 20;

            return (
                <Link
                    key={item.path}
                    to={item.path}
                    className={`
                        group flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-800
                        relative overflow-hidden justify-start
                        ${isActive
                            ? 'bg-gradient-to-r from-[#1173d4] to-[#0f5fb3] text-white shadow-lg border border-blue-400/20'
                            : 'text-gray-300 hover:bg-gray-700/80 hover:text-white hover:shadow-md border border-transparent hover:border-gray-600/50'
                        }
                    `}
                    aria-label={item.ariaLabel || `Navigate to ${item.label}`}
                    aria-current={isActive ? 'page' : undefined}
                >
                    {/* Active indicator bar */}
                    {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
                    )}

                    {/* Icon container */}
                    <div className="flex items-center justify-center w-5 h-5 relative">
                        <Icon
                            size={iconSize}
                            className={`flex-shrink-0 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'
                                }`}
                        />
                    </div>

                    <span className={`flex-1 font-medium transition-colors duration-200 ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                        }`}>
                        {item.label}
                    </span>

                    {/* Subtle glow effect for active state */}
                    {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl pointer-events-none" />
                    )}
                </Link>
            );
        });
    }, [isActiveRoute]);



    return (
        <aside
            className={`
                bg-[#181c22] border-r border-gray-700 transition-all duration-300 ease-in-out
                flex flex-col h-full relative w-64
                ${className}
            `}
            role="navigation"
            aria-label="Main navigation"
        >
            {/* Enhanced Logo Section with better spacing */}
            <header className="p-6 border-b border-gray-700 bg-[#1a1f26]">
                <div className="flex items-center space-x-3">
                    <div className="bg-[#1173d4] rounded-lg flex items-center justify-center transition-all duration-200 w-12 h-12">
                        <Dumbbell size={24} className="text-white" />
                    </div>
                    <div className="text-left">
                        <h1 className="text-white font-bold text-xl tracking-tight">GymBite</h1>
                        <p className="text-gray-400 text-sm font-medium">Admin Dashboard</p>
                    </div>
                </div>
            </header>

            {/* Enhanced Navigation with better accessibility */}
            <nav className="flex-1 py-6 px-4 overflow-y-auto" role="navigation" aria-label="Primary navigation">
                <div className="space-y-1">
                    {navigationElements}
                </div>
            </nav>

            {/* Enhanced User Profile Section with better accessibility */}
            <footer className="p-4 border-t border-gray-700/50 bg-gradient-to-r from-[#1a1f26] to-[#1d2329]" role="contentinfo">
                <div className="flex items-center space-x-3 bg-gray-800/30 rounded-xl p-3 border border-gray-700/30">
                    <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-gray-700/50 ring-offset-2 ring-offset-gray-800">
                            <span className="text-white text-sm font-bold">A</span>
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold truncate">Admin User</p>
                        <p className="text-gray-400 text-xs truncate flex items-center">
                            admin@gymbite.com
                        </p>
                    </div>
                </div>
            </footer>
        </aside>
    );
};