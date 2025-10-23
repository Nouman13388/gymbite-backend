import React from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Search,
    Plus,
    ChevronUp,
    ChevronDown,
    ChevronsLeft,
    ChevronsRight
} from 'lucide-react';
import { useAdvancedSearch, type FilterConfig } from '../../hooks/useAdvancedSearch';
import { AdvancedFilters } from './AdvancedFilters';

export interface Column<T = Record<string, unknown>> {
    key: keyof T | string;
    label: string;
    sortable?: boolean;
    render?: (value: unknown, row: T) => React.ReactNode;
    width?: string;
    searchable?: boolean;
}

export interface TableAction<T = Record<string, unknown>> {
    label: string;
    icon?: React.ComponentType<{ size?: number; className?: string }>;
    onClick: (row: T) => void;
    className?: string;
    ariaLabel?: string;
    show?: (row: T) => boolean;
}

interface EnhancedDataTableProps<T = Record<string, unknown>> {
    data: T[];
    columns: Column<T>[];
    actions?: TableAction<T>[];
    loading?: boolean;
    onCreateNew?: () => void;
    createButtonLabel?: string;
    emptyMessage?: string;
    title?: string;
    filterConfigs?: FilterConfig[];
    searchableFields?: (keyof T)[];
    defaultPageSize?: number;
}

export function EnhancedDataTable<T extends Record<string, unknown>>({
    data,
    columns,
    actions = [],
    loading = false,
    onCreateNew,
    createButtonLabel = 'Create New',
    emptyMessage = 'No data available',
    title,
    filterConfigs = [],
    searchableFields = [],
    defaultPageSize = 10
}: EnhancedDataTableProps<T>) {
    const {
        data: paginatedData,
        totalItems,
        searchTerm,
        setSearchTerm,
        filters,
        updateFilter,
        clearFilters,
        activeFiltersCount,
        sortConfig,
        updateSort,
        currentPage,
        pageSize,
        setPageSize,
        totalPages,
        startItem,
        endItem,
        goToFirstPage,
        goToLastPage,
        goToPreviousPage,
        goToNextPage,
        goToPage,
        hasData,
        isFiltered,
        isEmpty
    } = useAdvancedSearch({
        data,
        searchableFields,
        filterConfigs,
        initialFilters: {},
        initialSort: undefined
    });

    // Set initial page size
    React.useEffect(() => {
        setPageSize(defaultPageSize);
    }, [defaultPageSize, setPageSize]);

    const renderCellValue = (column: Column<T>, row: T) => {
        const value = row[column.key as keyof T];

        if (column.render) {
            return column.render(value, row);
        }

        return String(value || '');
    };

    const getSortIcon = (columnKey: keyof T | string) => {
        if (sortConfig?.key === columnKey) {
            return sortConfig.direction === 'asc' ?
                <ChevronUp size={16} className="text-blue-400" /> :
                <ChevronDown size={16} className="text-blue-400" />;
        }
        return null;
    };

    if (loading) {
        return (
            <div className="bg-[#181c22] rounded-lg border border-gray-700 p-8">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1173d4]"></div>
                    <span className="ml-3 text-white/80">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-[#181c22] rounded-lg border border-gray-700 p-6">
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

                {/* Search Bar */}
                <div className="flex items-center space-x-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={16} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-[#283039] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1173d4] focus:border-transparent"
                        />
                    </div>

                    {/* Results Info */}
                    <div className="text-sm text-gray-400">
                        {isFiltered ? (
                            <span>
                                Showing {startItem}-{endItem} of {totalItems} filtered results
                                {isEmpty && ' (no data to filter)'}
                            </span>
                        ) : (
                            <span>
                                Showing {startItem}-{endItem} of {totalItems} results
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Advanced Filters */}
            {filterConfigs.length > 0 && (
                <AdvancedFilters
                    filterConfigs={filterConfigs}
                    filters={filters}
                    onFilterChange={updateFilter}
                    onClearFilters={clearFilters}
                    activeFiltersCount={activeFiltersCount}
                />
            )}

            {/* Table */}
            <div className="bg-[#181c22] rounded-lg border border-gray-700">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-700">
                                {columns.map((column) => (
                                    <th
                                        key={String(column.key)}
                                        className={`px-6 py-4 text-left text-sm font-medium text-white/90 ${column.sortable ? 'cursor-pointer hover:text-white' : ''
                                            }`}
                                        style={{ width: column.width }}
                                        onClick={() => column.sortable && updateSort(String(column.key))}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>{column.label}</span>
                                            {column.sortable && getSortIcon(column.key)}
                                        </div>
                                    </th>
                                ))}
                                {actions.length > 0 && (
                                    <th className="px-6 py-4 text-left text-sm font-medium text-white/90 w-32">
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {!hasData ? (
                                <tr>
                                    <td
                                        colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                                        className="px-6 py-12 text-center text-white/70"
                                    >
                                        {isFiltered ? 'No results found for current filters' : emptyMessage}
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
                                                className="px-6 py-4 text-sm text-white/90"
                                            >
                                                {renderCellValue(column, row)}
                                            </td>
                                        ))}
                                        {actions.length > 0 && (
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
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
                                                                aria-label={action.ariaLabel || action.label}
                                                            >
                                                                {Icon && <Icon size={18} />}
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
                {hasData && totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-700">
                        <div className="flex items-center justify-between">
                            {/* Page Size Selector */}
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-white/70">Show:</span>
                                <select
                                    value={pageSize}
                                    onChange={(e) => setPageSize(Number(e.target.value))}
                                    className="bg-[#283039] border border-gray-600 rounded text-white text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#1173d4]"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                                <span className="text-sm text-white/70">per page</span>
                            </div>

                            {/* Pagination Controls */}
                            <div className="flex items-center space-x-2">
                                {/* First Page */}
                                <button
                                    onClick={goToFirstPage}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded text-white/70 hover:text-white hover:bg-[#283039] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title="First page"
                                >
                                    <ChevronsLeft size={16} />
                                </button>

                                {/* Previous Page */}
                                <button
                                    onClick={goToPreviousPage}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded text-white/70 hover:text-white hover:bg-[#283039] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title="Previous page"
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                {/* Page Numbers */}
                                <div className="flex items-center space-x-1">
                                    {/* Show page numbers with ellipsis for large page counts */}
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => goToPage(pageNum)}
                                                className={`px-3 py-1 rounded text-sm transition-colors ${currentPage === pageNum
                                                        ? 'bg-[#1173d4] text-white'
                                                        : 'text-white/70 hover:text-white hover:bg-[#283039]'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Next Page */}
                                <button
                                    onClick={goToNextPage}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded text-white/70 hover:text-white hover:bg-[#283039] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title="Next page"
                                >
                                    <ChevronRight size={16} />
                                </button>

                                {/* Last Page */}
                                <button
                                    onClick={goToLastPage}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded text-white/70 hover:text-white hover:bg-[#283039] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title="Last page"
                                >
                                    <ChevronsRight size={16} />
                                </button>
                            </div>

                            {/* Page Info */}
                            <div className="text-sm text-white/70">
                                Page {currentPage} of {totalPages}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}