import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Home,
    Users,
    Dumbbell,
    Utensils,
    BarChart3,
    Settings,
    LogOut
} from 'lucide-react';

interface SidebarProps {
    isCollapsed?: boolean;
    onToggle?: () => void;
}

interface NavItem {
    path: string;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    quickAction?: boolean;
}

const navigationItems: NavItem[] = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/users', label: 'Users', icon: Users, quickAction: true },
    { path: '/workouts', label: 'Workouts', icon: Dumbbell, quickAction: true },
    { path: '/meals', label: 'Meals', icon: Utensils, quickAction: true },
    { path: '/analytics', label: 'Analytics', icon: BarChart3, quickAction: true },
    { path: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false }) => {
    const location = useLocation();

    const isActiveRoute = (path: string) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className={`bg-[#181c22] border-r border-gray-700 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'
            } flex flex-col h-full`}>
            {/* Logo Section */}
            <div className="p-4 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[#1173d4] rounded-lg flex items-center justify-center">
                        <Dumbbell size={20} className="text-white" />
                    </div>
                    {!isCollapsed && (
                        <div>
                            <h1 className="text-white font-bold text-lg">GymBite</h1>
                            <p className="text-gray-400 text-xs">Admin Dashboard</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
                <div className="space-y-2">
                    {navigationItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = isActiveRoute(item.path);

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${isActive
                                        ? 'bg-[#1173d4] text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <Icon size={20} />
                                {!isCollapsed && (
                                    <span className="flex-1">{item.label}</span>
                                )}
                                {!isCollapsed && item.quickAction && (
                                    <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                                        QA
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Quick Actions Section */}
                {!isCollapsed && (
                    <div className="mt-8">
                        <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-3">
                            Quick Actions
                        </h3>
                        <div className="space-y-2">
                            {navigationItems
                                .filter(item => item.quickAction)
                                .map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={`qa-${item.path}`}
                                            to={`${item.path}/create`}
                                            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                        >
                                            <Icon size={16} />
                                            <span className="text-sm">New {item.label.slice(0, -1)}</span>
                                        </Link>
                                    );
                                })}
                        </div>
                    </div>
                )}
            </nav>

            {/* User Profile Section */}
            <div className="p-4 border-t border-gray-700">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">A</span>
                    </div>
                    {!isCollapsed && (
                        <div className="flex-1">
                            <p className="text-white text-sm font-medium">Admin User</p>
                            <p className="text-gray-400 text-xs">admin@gymbite.com</p>
                        </div>
                    )}
                    <button
                        className="text-gray-400 hover:text-white transition-colors"
                        title="Logout"
                    >
                        <LogOut size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};