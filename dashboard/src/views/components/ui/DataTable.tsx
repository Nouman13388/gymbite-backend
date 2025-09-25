import React, { useState, useMemo } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Search,
    Filter,
    Plus
} from 'lucide-react';

export interface Column<T = Record<string, unknown>> {
    key: keyof T | string;
    label: string;
    sortable?: boolean;
    render?: (value: unknown, row: T) => React.ReactNode;
    width?: string;
}

export interface TableAction<T = Record<string, unknown>> {
    label: string;
    icon?: React.ComponentType<{ size?: number; className?: string }>;
    onClick: (row: T) => void;
    className?: string;
    show?: (row: T) => boolean;
}

interface DataTableProps<T = Record<string, unknown>> {
    data: T[];
    columns: Column<T>[];
    actions?: TableAction<T>[];
    loading?: boolean;
    searchable?: boolean;
    filterable?: boolean;
    pageable?: boolean;
    pageSize?: number;
    onCreateNew?: () => void;
    createButtonLabel?: string;
    emptyMessage?: string;
    title?: string;
}

export function DataTable<T extends Record<string, unknown>>({
    data,
    columns,
    actions = [],
    loading = false,
    searchable = true,
    filterable = false,
    pageable = true,
    pageSize = 10,
    onCreateNew,
    createButtonLabel = 'Create New',
    emptyMessage = 'No data available',
    title
}: DataTableProps<T>) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{
        key: keyof T | string;
        direction: 'asc' | 'desc';
    } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Filter and search data
    const filteredData = useMemo(() => {
        if (!searchTerm) return data;

        return data.filter(item =>
            Object.values(item).some(value =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [data, searchTerm]);

    // Sort data
    const sortedData = useMemo(() => {
        if (!sortConfig) return filteredData;

        return [...filteredData].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [filteredData, sortConfig]);

    // Paginate data
    const paginatedData = useMemo(() => {
        if (!pageable) return sortedData;

        const startIndex = (currentPage - 1) * pageSize;
        return sortedData.slice(startIndex, startIndex + pageSize);
    }, [sortedData, currentPage, pageSize, pageable]);

    const totalPages = Math.ceil(sortedData.length / pageSize);

    const handleSort = (key: keyof T | string) => {
        const column = columns.find(col => col.key === key);
        if (!column?.sortable) return;

        setSortConfig(current => ({
            key,
            direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const renderCellValue = (column: Column<T>, row: T) => {
        const value = row[column.key as keyof T];

        if (column.render) {
            return column.render(value, row);
        }

        return String(value || '');
    };

    if (loading) {
        return (
            <div className="bg-[#181c22] rounded-lg border border-gray-700 p-8">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1173d4]"></div>
                    <span className="ml-3 text-gray-400">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#181c22] rounded-lg border border-gray-700">
            {/* Table Header */}
            <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    {title && (
                        <h2 className="text-xl font-semibold text-white">{title}</h2>
                    )}
                    {onCreateNew && (
                        <button
                            onClick={onCreateNew}
                            className="bg-[#1173d4] hover:bg-[#0f5db8] text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                        >
                            <Plus size={16} />
                            <span>{createButtonLabel}</span>
                        </button>
                    )}
                </div>

                {/* Search and Filter Bar */}
                {(searchable || filterable) && (
                    <div className="flex items-center space-x-4">
                        {searchable && (
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-[#283039] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1173d4] focus:border-transparent"
                                />
                            </div>
                        )}

                        {filterable && (
                            <button className="flex items-center space-x-2 px-4 py-2 bg-[#283039] border border-gray-600 rounded-lg text-gray-300 hover:text-white transition-colors">
                                <Filter size={16} />
                                <span>Filter</span>
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-700">
                            {columns.map((column) => (
                                <th
                                    key={String(column.key)}
                                    className={`px-6 py-4 text-left text-sm font-medium text-gray-300 ${column.sortable ? 'cursor-pointer hover:text-white' : ''
                                        }`}
                                    style={{ width: column.width }}
                                    onClick={() => handleSort(column.key)}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>{column.label}</span>
                                        {column.sortable && sortConfig?.key === column.key && (
                                            <span className="text-[#1173d4]">
                                                {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                            {actions.length > 0 && (
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 w-32">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                                    className="px-6 py-12 text-center text-gray-400"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((row, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-gray-700 hover:bg-[#1a1f26] transition-colors"
                                >
                                    {columns.map((column) => (
                                        <td
                                            key={String(column.key)}
                                            className="px-6 py-4 text-sm text-gray-300"
                                        >
                                            {renderCellValue(column, row)}
                                        </td>
                                    ))}
                                    {actions.length > 0 && (
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                {actions.map((action, actionIndex) => {
                                                    if (action.show && !action.show(row)) return null;

                                                    const Icon = action.icon;
                                                    return (
                                                        <button
                                                            key={actionIndex}
                                                            onClick={() => action.onClick(row)}
                                                            className={`p-2 rounded-lg transition-colors ${action.className || 'text-gray-400 hover:text-white hover:bg-[#283039]'
                                                                }`}
                                                            title={action.label}
                                                        >
                                                            {Icon && <Icon size={16} />}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pageable && totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                        Showing {(currentPage - 1) * pageSize + 1} to{' '}
                        {Math.min(currentPage * pageSize, sortedData.length)} of{' '}
                        {sortedData.length} results
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-gray-600 text-gray-400 hover:text-white hover:bg-[#283039] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        <span className="text-sm text-gray-400">
                            Page {currentPage} of {totalPages}
                        </span>

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border border-gray-600 text-gray-400 hover:text-white hover:bg-[#283039] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}