import React, { useState, useEffect } from 'react';
import { PageWrapper } from '../views/layout/PageWrapper';
import { Loading, EmptyState, ErrorMessage, DeleteConfirm } from '../views/components/ui';
import { EnhancedDataTable } from '../components/ui/EnhancedDataTable';
import type { Column, TableAction } from '../components/ui/EnhancedDataTable';
import type { FilterConfig } from '../hooks/useAdvancedSearch';
import { Users, UserPlus, RefreshCw, Edit, Trash2 } from 'lucide-react';
import { crudApi } from '../services/api';
import { apiWithNotifications } from '../services/apiWithNotifications';
import { UserFormModal } from '../components/forms/UserFormModal';
import type { UserFormData } from '../schemas';

// User data type based on Prisma schema
interface User extends Record<string, unknown> {
    id: number;
    name: string;
    email: string;
    role: 'CLIENT' | 'TRAINER' | 'ADMIN';
    firebaseUid?: string;
    createdAt: string;
    updatedAt: string;
}

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    // Modal states
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            const response = await crudApi.users.getAll();
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

    // CRUD Operations
    const handleCreateUser = () => {
        setSelectedUser(null);
        setIsFormModalOpen(true);
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setIsFormModalOpen(true);
    };

    const handleDeleteUser = (user: User) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const handleFormSubmit = async (data: UserFormData) => {
        try {
            setIsSubmitting(true);

            if (selectedUser) {
                // Update existing user
                await apiWithNotifications.users.update(selectedUser.id, data);
            } else {
                // Create new user
                await apiWithNotifications.users.create(data);
            }

            handleRefresh();
            setIsFormModalOpen(false);
            setSelectedUser(null);
        } catch (err) {
            console.error('Failed to save user:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedUser) return;

        try {
            setIsSubmitting(true);
            await apiWithNotifications.users.delete(selectedUser.id);
            handleRefresh();
            setIsDeleteModalOpen(false);
            setSelectedUser(null);
        } catch (err) {
            console.error('Failed to delete user:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns: Column<User>[] = [
        { key: 'name', label: 'Name', sortable: true, searchable: true },
        { key: 'email', label: 'Email', sortable: true, searchable: true },
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

    const actions: TableAction<User>[] = [
        {
            label: 'Edit',
            icon: Edit,
            onClick: handleEditUser,
            className: 'text-yellow-300 hover:text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-dark-bg',
            ariaLabel: 'Edit user'
        },
        {
            label: 'Delete',
            icon: Trash2,
            onClick: handleDeleteUser,
            className: 'text-red-300 hover:text-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-dark-bg',
            ariaLabel: 'Delete user'
        }
    ];

    // Filter configurations for advanced filtering
    const filterConfigs: FilterConfig[] = [
        {
            key: 'role',
            label: 'Role',
            type: 'select',
            options: [
                { value: 'CLIENT', label: 'Client' },
                { value: 'TRAINER', label: 'Trainer' },
                { value: 'ADMIN', label: 'Admin' }
            ]
        },
        {
            key: 'createdAt',
            label: 'Created Date',
            type: 'dateRange'
        },
        {
            key: 'name',
            label: 'Name',
            type: 'text',
            placeholder: 'Search by name...'
        },
        {
            key: 'email',
            label: 'Email',
            type: 'text',
            placeholder: 'Search by email...'
        }
    ];

    // Searchable fields for quick search
    const searchableFields: (keyof User)[] = ['name', 'email', 'role'];

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
                    <EnhancedDataTable
                        data={users}
                        columns={columns}
                        actions={actions}
                        loading={loading}
                        onCreateNew={handleCreateUser}
                        createButtonLabel="Add New User"
                        title="All Users"
                        filterConfigs={filterConfigs}
                        searchableFields={searchableFields}
                        defaultPageSize={10}
                    />
                )}
            </div>

            {/* User Form Modal */}
            <UserFormModal
                isOpen={isFormModalOpen}
                onClose={() => {
                    setIsFormModalOpen(false);
                    setSelectedUser(null);
                }}
                onSubmit={handleFormSubmit}
                user={selectedUser}
                isLoading={isSubmitting}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirm
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedUser(null);
                }}
                onConfirm={handleConfirmDelete}
                title="Delete User"
                message={`Are you sure you want to delete "${selectedUser?.name}"? This action cannot be undone.`}
                loading={isSubmitting}
            />
        </PageWrapper>
    );
};

export default UsersPage;