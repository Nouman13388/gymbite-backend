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
                <span className={`px-2 py-1 rounded-full text-xs ${value === 'ADMIN' ? 'bg-red-900/20 text-red-400' :
                    value === 'TRAINER' ? 'bg-blue-900/20 text-blue-400' :
                        'bg-green-900/20 text-green-400'
                    }`}>
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
            className: 'text-yellow-400 hover:text-yellow-300'
        },
        {
            label: 'Delete',
            onClick: handleDeleteUser,
            className: 'text-red-400 hover:text-red-300'
        }
    ];

    // Loading state
    if (loading) {
        return (
            <PageWrapper title="User Management">
                <Loading text="Loading users..." />
            </PageWrapper>
        );
    }

    // Error state
    if (error) {
        return (
            <PageWrapper title="User Management">
                <ErrorMessage
                    message={error}
                    onRetry={handleRefresh}
                />
            </PageWrapper>
        );
    }

    return (
        <PageWrapper
            title="User Management"
            subtitle="Manage system users, trainers, and administrators"
            actions={
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleRefresh}
                        className="bg-dark-card hover:bg-gray-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                    <button
                        onClick={handleCreateUser}
                        className="bg-primary-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
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
                            <div className="p-2 bg-blue-900/20 rounded-lg">
                                <Users className="h-6 w-6 text-blue-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-400">Total Users</p>
                                <p className="text-2xl font-bold text-white">{users.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-dark-card rounded-lg p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-900/20 rounded-lg">
                                <Users className="h-6 w-6 text-green-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-400">Active Clients</p>
                                <p className="text-2xl font-bold text-white">
                                    {users.filter(u => u.role === 'CLIENT').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-dark-card rounded-lg p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-900/20 rounded-lg">
                                <Users className="h-6 w-6 text-purple-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-400">Trainers</p>
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
                        icon={<Users className="w-12 h-12" />}
                        message="No users found"
                        description="Get started by adding your first user to the system."
                        action={
                            <button
                                onClick={handleCreateUser}
                                className="bg-primary-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
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