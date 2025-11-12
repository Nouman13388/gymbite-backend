import React, { useState, useEffect, useRef } from 'react';
import { Bell, Search, LogOut, User as UserIcon, Settings, Users, Dumbbell, UtensilsCrossed } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { crudApi } from '../../services/api';

interface SearchResult {
    id: number;
    type: 'user' | 'trainer' | 'client' | 'workout' | 'meal';
    title: string;
    subtitle: string;
    path: string;
}

interface HeaderProps {
    title?: string;
}

export const Header: React.FC<HeaderProps> = ({
    title = 'Dashboard'
}) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Fetch unread notifications count
    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const notifications = await crudApi.notifications.getAll() as Array<{ status: string }>;
                const unread = notifications.filter(n => n.status === 'UNREAD').length;
                setUnreadCount(unread);
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
            }
        };

        if (user) {
            fetchUnreadCount();
            // Refresh count every 30 seconds
            const interval = setInterval(fetchUnreadCount, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    // Search functionality with debounce
    useEffect(() => {
        const searchTimeout = setTimeout(async () => {
            if (searchQuery.trim().length < 2) {
                setSearchResults([]);
                setShowSearchResults(false);
                return;
            }

            setIsSearching(true);
            try {
                const results: SearchResult[] = [];
                const query = searchQuery.toLowerCase();

                // Search users
                try {
                    const users = await crudApi.users.getAll() as Array<{
                        id: number;
                        email: string;
                        firstName: string;
                        lastName: string;
                        role: string;
                    }>;

                    const matchedUsers = users.filter(u =>
                        u.firstName?.toLowerCase().includes(query) ||
                        u.lastName?.toLowerCase().includes(query) ||
                        u.email?.toLowerCase().includes(query)
                    ).slice(0, 3);

                    matchedUsers.forEach(u => {
                        results.push({
                            id: u.id,
                            type: 'user',
                            title: `${u.firstName} ${u.lastName}`,
                            subtitle: `${u.email} • ${u.role}`,
                            path: '/users'
                        });
                    });
                } catch (error) {
                    console.error('Failed to search users:', error);
                }

                // Search trainers
                try {
                    const trainers = await crudApi.trainers.getAll() as Array<{
                        id: number;
                        name: string;
                        email: string;
                        specialization?: string;
                    }>;

                    const matchedTrainers = trainers.filter(t =>
                        t.name?.toLowerCase().includes(query) ||
                        t.email?.toLowerCase().includes(query) ||
                        t.specialization?.toLowerCase().includes(query)
                    ).slice(0, 3);

                    matchedTrainers.forEach(t => {
                        results.push({
                            id: t.id,
                            type: 'trainer',
                            title: t.name,
                            subtitle: t.specialization || t.email,
                            path: '/trainers'
                        });
                    });
                } catch (error) {
                    console.error('Failed to search trainers:', error);
                }

                // Search clients
                try {
                    const clients = await crudApi.clients.getAll() as Array<{
                        id: number;
                        name: string;
                        email: string;
                        goal?: string;
                    }>;

                    const matchedClients = clients.filter(c =>
                        c.name?.toLowerCase().includes(query) ||
                        c.email?.toLowerCase().includes(query) ||
                        c.goal?.toLowerCase().includes(query)
                    ).slice(0, 3);

                    matchedClients.forEach(c => {
                        results.push({
                            id: c.id,
                            type: 'client',
                            title: c.name,
                            subtitle: c.goal || c.email,
                            path: '/clients'
                        });
                    });
                } catch (error) {
                    console.error('Failed to search clients:', error);
                }

                setSearchResults(results);
                setShowSearchResults(results.length > 0);
            } catch (error) {
                console.error('Search failed:', error);
            } finally {
                setIsSearching(false);
            }
        }, 300); // Debounce 300ms

        return () => clearTimeout(searchTimeout);
    }, [searchQuery]);

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSearchResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchResults.length > 0) {
            // Navigate to first result
            handleResultClick(searchResults[0]);
        }
    };

    const handleResultClick = (result: SearchResult) => {
        navigate(result.path);
        setSearchQuery('');
        setShowSearchResults(false);
    };

    const getResultIcon = (type: SearchResult['type']) => {
        switch (type) {
            case 'user':
                return <Users size={16} className="text-blue-400" />;
            case 'trainer':
                return <UserIcon size={16} className="text-green-400" />;
            case 'client':
                return <UserIcon size={16} className="text-purple-400" />;
            case 'workout':
                return <Dumbbell size={16} className="text-orange-400" />;
            case 'meal':
                return <UtensilsCrossed size={16} className="text-red-400" />;
            default:
                return <Search size={16} className="text-gray-400" />;
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <header className="bg-[#181c22] border-b border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Left Section */}
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

                {/* Right Section */}
                <div className="flex items-center space-x-4">
                    {/* Search Bar with Results Dropdown */}
                    <div ref={searchRef} className="relative hidden md:block">
                        <form onSubmit={handleSearch} className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search users, trainers, clients..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                                className="w-64 pl-10 pr-4 py-2 bg-[#283039] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1173d4] focus:border-transparent"
                            />
                        </form>

                        {/* Search Results Dropdown */}
                        {showSearchResults && searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-[#283039] border border-gray-600 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
                                {isSearching && (
                                    <div className="px-4 py-3 text-gray-400 text-sm">
                                        Searching...
                                    </div>
                                )}
                                {searchResults.map((result) => (
                                    <button
                                        key={`${result.type}-${result.id}`}
                                        onClick={() => handleResultClick(result)}
                                        className="w-full px-4 py-3 text-left hover:bg-gray-700/50 transition-colors border-b border-gray-700/30 last:border-b-0 flex items-start gap-3"
                                    >
                                        <div className="mt-0.5">
                                            {getResultIcon(result.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-white text-sm font-medium truncate">
                                                {result.title}
                                            </div>
                                            <div className="text-gray-400 text-xs truncate">
                                                {result.subtitle}
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500 capitalize mt-0.5">
                                            {result.type}
                                        </div>
                                    </button>
                                ))}
                                {searchResults.length === 0 && !isSearching && searchQuery.length >= 2 && (
                                    <div className="px-4 py-3 text-gray-400 text-sm text-center">
                                        No results found for "{searchQuery}"
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Notifications */}
                    <button
                        onClick={() => navigate('/notifications')}
                        className="relative text-gray-400 hover:text-white transition-colors"
                        title="View notifications"
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-xs text-white font-medium">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            </span>
                        )}
                    </button>

                    {/* Profile */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                        >
                            <div className="w-8 h-8 bg-[#1173d4] rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                    {user ? getInitials(user.displayName) : 'A'}
                                </span>
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-white text-sm font-medium">
                                    {user?.displayName || 'Admin User'}
                                </p>
                                <p className="text-gray-400 text-xs capitalize">
                                    {user?.role?.toLowerCase() || 'Administrator'}
                                </p>
                            </div>
                        </button>

                        {/* User Menu Dropdown */}
                        {showUserMenu && (
                            <>
                                {/* Backdrop to close menu */}
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowUserMenu(false)}
                                />

                                <div className="absolute right-0 mt-2 w-48 bg-[#283039] border border-gray-600 rounded-lg shadow-lg py-1 z-20">
                                    <button
                                        onClick={() => {
                                            setShowUserMenu(false);
                                            navigate('/profile');
                                        }}
                                        className="w-full px-4 py-2 text-left text-white hover:bg-gray-700/50 transition-colors flex items-center gap-2"
                                    >
                                        <UserIcon size={16} />
                                        Profile
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowUserMenu(false);
                                            navigate('/settings');
                                        }}
                                        className="w-full px-4 py-2 text-left text-white hover:bg-gray-700/50 transition-colors flex items-center gap-2"
                                    >
                                        <Settings size={16} />
                                        Settings
                                    </button>
                                    <hr className="border-gray-600 my-1" />
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700/50 transition-colors flex items-center gap-2"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};