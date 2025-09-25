import React, { useState, useEffect } from 'react';
import { PageWrapper } from '../views/layout/PageWrapper';
import { DataTable, Loading, EmptyState, ErrorMessage } from '../views/components/ui';
import type { Column } from '../views/components/ui';
import { Users, UserPlus, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

// User data type based on Prisma schema
interface User extends Record<string, unknown> {
    id: number;
    name: string;
    email: string;
    role: 'CLIENT' | 'TRAINER' | 'ADMIN';
    createdAt: string;
    updatedAt: string;
}

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    // Helper function for role badge styling
    const getRoleBadgeClasses = (role: string): string => {
        switch (role) {
            case 'ADMIN':
                return 'bg-red-700 text-white';
            case 'TRAINER':
                return 'bg-blue-700 text-white';
            case 'CLIENT':
                return 'bg-green-700 text-white';
            default:
                return 'bg-gray-700 text-white';
        }
    };

    // Fetch users from API
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get<User[]>('/users');
            setUsers(Array.isArray(response) ? response : []);
        } catch (err) {
            console.error('Failed to fetch users:', err);
            setError(err instanceof Error ? err.message : 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [refreshKey]);

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    const columns: Column<User>[] = [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        {
            key: 'role',
            label: 'Role',
            sortable: true,
            render: (value) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeClasses(String(value))}`}>
                    {String(value)}
                </span>
            )
        },
        {
            key: 'createdAt',
            label: 'Created',
            sortable: true,
            render: (value) => new Date(value as string).toLocaleDateString()
        }
    ];

    const handleCreateUser = () => {
        console.log('Create user clicked');
        // TODO: Implement user creation
    };

    const handleEditUser = (user: User) => {
        console.log('Edit user:', user);
        // TODO: Implement user editing
    };

    const handleDeleteUser = (user: User) => {
        console.log('Delete user:', user);
        // TODO: Implement user deletion
    };

    const actions = [
        {
            label: 'Edit',
            onClick: handleEditUser,
            className: 'text-yellow-300 hover:text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-dark-bg',
            ariaLabel: 'Edit user'
        },
        {
            label: 'Delete',
            onClick: handleDeleteUser,
            className: 'text-red-300 hover:text-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-dark-bg',
            ariaLabel: 'Delete user'
        }
    ];

    // Loading state
    if (loading) {
        return (
            <PageWrapper>
                <Loading text="Loading users..." />
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
            subtitle="Manage system users, trainers, and administrators"
            actions={
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className="bg-dark-card hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Refresh users list"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        {loading ? 'Loading...' : 'Refresh'}
                    </button>
                    <button
                        onClick={handleCreateUser}
                        className="bg-primary-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Add new user to the system"
                    >
                        <UserPlus className="w-4 h-4" />
                        Add User
                    </button>
                </div>
            }
        >
            <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-dark-card rounded-lg p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-600 rounded-lg">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-200">Total Users</p>
                                <p className="text-2xl font-bold text-white">{users.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-dark-card rounded-lg p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-600 rounded-lg">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-200">Active Clients</p>
                                <p className="text-2xl font-bold text-white">
                                    {users.filter(u => u.role === 'CLIENT').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-dark-card rounded-lg p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-600 rounded-lg">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-200">Trainers</p>
                                <p className="text-2xl font-bold text-white">
                                    {users.filter(u => u.role === 'TRAINER').length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                {users.length === 0 ? (
                    <EmptyState
                        icon={<Users className="w-12 h-12 text-white/80" />}
                        message="No users found"
                        description="Get started by adding your first user to the system."
                        action={
                            <button
                                onClick={handleCreateUser}
                                className="bg-primary-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-label="Add your first user to get started"
                            >
                                <UserPlus className="w-4 h-4" />
                                Add First User
                            </button>
                        }
                    />
                ) : (
                    <DataTable
                        data={users}
                        columns={columns}
                        actions={actions}
                        loading={loading}
                        onCreateNew={handleCreateUser}
                        createButtonLabel="Add New User"
                        title="All Users"
                        searchable={true}
                        pageable={true}
                    />
                )}
            </div>
        </PageWrapper>
    );
};

export default UsersPage;