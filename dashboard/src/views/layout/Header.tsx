import React from 'react';
import { Bell, Search, Menu, X } from 'lucide-react';

interface HeaderProps {
    sidebarCollapsed: boolean;
    onToggleSidebar: () => void;
    title?: string;
}

export const Header: React.FC<HeaderProps> = ({
    sidebarCollapsed,
    onToggleSidebar,
    title = 'Dashboard'
}) => {
    return (
        <header className="bg-[#181c22] border-b border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Left Section */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={onToggleSidebar}
                        className="text-gray-400 hover:text-white transition-colors"
                        aria-label="Toggle sidebar"
                    >
                        {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
                    </button>

                    <div>
                        <h1 className="text-white text-xl font-semibold">{title}</h1>
                        <p className="text-gray-400 text-sm">
                            {new Date().toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center space-x-4">
                    {/* Search Bar */}
                    <div className="relative hidden md:block">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-64 pl-10 pr-4 py-2 bg-[#283039] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1173d4] focus:border-transparent"
                        />
                    </div>

                    {/* Notifications */}
                    <button className="relative text-gray-400 hover:text-white transition-colors">
                        <Bell size={20} />
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-xs text-white font-medium">3</span>
                        </span>
                    </button>

                    {/* Profile */}
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-[#1173d4] rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">A</span>
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-white text-sm font-medium">Admin User</p>
                            <p className="text-gray-400 text-xs">Administrator</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};