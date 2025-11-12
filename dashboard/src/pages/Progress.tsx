import React, { useState, useEffect } from 'react';
import { PageWrapper } from '../views/layout/PageWrapper';
import { Loading, EmptyState, ErrorMessage, DeleteConfirm } from '../views/components/ui';
import { EnhancedDataTable } from '../components/ui/EnhancedDataTable';
import type { Column, TableAction } from '../components/ui/EnhancedDataTable';
import type { FilterConfig } from '../hooks/useAdvancedSearch';
import { TrendingUp, Plus, RefreshCw, Edit, Trash2, Eye, Weight, Activity, Users } from 'lucide-react';
import { crudApi } from '../services/api';
import { apiWithNotifications } from '../services/apiWithNotifications';
import { ProgressFormModal } from '../components/forms/ProgressFormModal';
import { ProgressDetailModal } from '../components/modals/ProgressDetailModal';
import type { ProgressFormData } from '../schemas';

// Progress data type based on Prisma schema
interface Progress extends Record<string, unknown> {
    id: number;
    clientId: number;
    progressDate: string;
    weight: number;
    BMI: number;
    workoutPerformance?: string;
    mealPlanCompliance?: string;
    createdAt: string;
    client?: {
        user: {
            name: string;
            email: string;
        };
    };
}

const ProgressPage: React.FC = () => {
    const [progressRecords, setProgressRecords] = useState<Progress[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    // Modal states
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProgress, setSelectedProgress] = useState<Progress | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch progress records from API
    const fetchProgressRecords = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await crudApi.progress.getAll();
            setProgressRecords(Array.isArray(response) ? response : []);
        } catch (err) {
            console.error('Failed to fetch progress records:', err);
            setError(err instanceof Error ? err.message : 'Failed to load progress records');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProgressRecords();
    }, [refreshKey]);

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    // CRUD Operations
    const handleCreateProgress = () => {
        setSelectedProgress(null);
        setIsFormModalOpen(true);
    };

    const handleViewProgress = (progress: Progress) => {
        setSelectedProgress(progress);
        setIsDetailModalOpen(true);
    };

    const handleEditProgress = (progress: Progress) => {
        setSelectedProgress(progress);
        setIsFormModalOpen(true);
    };

    const handleDeleteProgress = (progress: Progress) => {
        setSelectedProgress(progress);
        setIsDeleteModalOpen(true);
    };

    const handleFormSubmit = async (data: ProgressFormData) => {
        try {
            setIsSubmitting(true);

            if (selectedProgress) {
                // Update existing progress record
                await apiWithNotifications.progress.update(selectedProgress.id, data);
            } else {
                // Create new progress record
                await apiWithNotifications.progress.create(data);
            }

            handleRefresh();
            setIsFormModalOpen(false);
            setSelectedProgress(null);
        } catch (err) {
            console.error('Failed to save progress record:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedProgress) return;

        try {
            setIsSubmitting(true);
            await apiWithNotifications.progress.delete(selectedProgress.id);
            handleRefresh();
            setIsDeleteModalOpen(false);
            setSelectedProgress(null);
        } catch (err) {
            console.error('Failed to delete progress record:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns: Column<Progress>[] = [
        {
            key: 'progressDate',
            label: 'Date',
            sortable: true,
            render: (value) => {
                const date = new Date(value as string);
                return (
                    <div>
                        <div className="text-white font-medium">{date.toLocaleDateString()}</div>
                        <div className="text-xs text-gray-400">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                    </div>
                );
            }
        },
        {
            key: 'client',
            label: 'Client',
            sortable: false,
            render: (value) => {
                const client = value as Progress['client'];
                return (
                    <div>
                        <div className="text-white">{client?.user?.name || 'N/A'}</div>
                        <div className="text-xs text-gray-400">{client?.user?.email || ''}</div>
                    </div>
                );
            }
        },
        {
            key: 'weight',
            label: 'Weight (kg)',
            sortable: true,
            render: (value) => value ? (
                <span className="text-white font-medium">{String(value)}</span>
            ) : (
                <span className="text-gray-500">-</span>
            )
        },
        {
            key: 'BMI',
            label: 'BMI',
            sortable: true,
            render: (value) => value ? (
                <span className="text-white font-medium">{String(value)}</span>
            ) : (
                <span className="text-gray-500">-</span>
            )
        }
    ];

    const actions: TableAction<Progress>[] = [
        {
            label: 'View',
            icon: Eye,
            onClick: handleViewProgress,
            className: 'text-blue-300 hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-dark-bg',
            ariaLabel: 'View progress details'
        },
        {
            label: 'Edit',
            icon: Edit,
            onClick: handleEditProgress,
            className: 'text-yellow-300 hover:text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-dark-bg',
            ariaLabel: 'Edit progress record'
        },
        {
            label: 'Delete',
            icon: Trash2,
            onClick: handleDeleteProgress,
            className: 'text-red-300 hover:text-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-dark-bg',
            ariaLabel: 'Delete progress record'
        }
    ];

    // Filter configurations for advanced filtering
    const filterConfigs: FilterConfig[] = [
        {
            key: 'progressDate',
            label: 'Date',
            type: 'dateRange'
        }
    ];

    // Searchable fields for quick search
    const searchableFields: (keyof Progress)[] = ['progressDate'];

    // Calculate stats
    const totalRecords = progressRecords.length;
    const uniqueClients = new Set(progressRecords.map(p => p.clientId)).size;
    const avgWeight = progressRecords.length > 0
        ? (progressRecords.reduce((sum, p) => sum + Number(p.weight), 0) / progressRecords.length).toFixed(1)
        : '0';
    const recentRecords = progressRecords.filter(p => {
        const recordDate = new Date(p.progressDate as string);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return recordDate >= weekAgo;
    }).length;

    // Loading state
    if (loading) {
        return (
            <PageWrapper>
                <Loading text="Loading progress records..." />
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
            subtitle="Track client fitness progress and body metrics"
            actions={
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className="bg-dark-card hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Refresh progress records"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        {loading ? 'Loading...' : 'Refresh'}
                    </button>
                </div>
            }
        >
            <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-dark-card rounded-lg p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-600 rounded-lg">
                                <TrendingUp className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-200">Total Records</p>
                                <p className="text-2xl font-bold text-white">{totalRecords}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-dark-card rounded-lg p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-600 rounded-lg">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-200">Tracked Clients</p>
                                <p className="text-2xl font-bold text-white">{uniqueClients}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-dark-card rounded-lg p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-600 rounded-lg">
                                <Weight className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-200">Avg Weight</p>
                                <p className="text-2xl font-bold text-white">{avgWeight} kg</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-dark-card rounded-lg p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-orange-600 rounded-lg">
                                <Activity className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-200">This Week</p>
                                <p className="text-2xl font-bold text-white">{recentRecords}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Table */}
                {progressRecords.length === 0 ? (
                    <EmptyState
                        icon={<TrendingUp className="w-12 h-12 text-white/80" />}
                        message="No progress records found"
                        description="Start tracking client progress by adding the first record."
                        action={
                            <button
                                onClick={handleCreateProgress}
                                className="bg-primary-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-label="Add your first progress record"
                            >
                                <Plus className="w-4 h-4" />
                                Add First Record
                            </button>
                        }
                    />
                ) : (
                    <EnhancedDataTable
                        data={progressRecords}
                        columns={columns}
                        actions={actions}
                        loading={loading}
                        onCreateNew={handleCreateProgress}
                        createButtonLabel="Add Progress"
                        title="All Progress Records"
                        filterConfigs={filterConfigs}
                        searchableFields={searchableFields}
                        defaultPageSize={10}
                    />
                )}
            </div>

            {/* Progress Form Modal */}
            <ProgressFormModal
                isOpen={isFormModalOpen}
                onClose={() => {
                    setIsFormModalOpen(false);
                    setSelectedProgress(null);
                }}
                onSubmit={handleFormSubmit}
                progress={selectedProgress}
                isLoading={isSubmitting}
            />

            {/* Progress Detail Modal */}
            <ProgressDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false);
                    setSelectedProgress(null);
                }}
                progress={selectedProgress}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirm
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedProgress(null);
                }}
                onConfirm={handleConfirmDelete}
                title="Delete Progress Record"
                message={`Are you sure you want to delete this progress record? This action cannot be undone.`}
                loading={isSubmitting}
            />
        </PageWrapper>
    );
};

export default ProgressPage;
