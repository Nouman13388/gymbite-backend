import React, { useState } from 'react';
import { Filter, X, Calendar, Search, RotateCcw } from 'lucide-react';
import type { FilterConfig, SearchFilters } from '../../hooks/useAdvancedSearch';

interface AdvancedFiltersProps {
    filterConfigs: FilterConfig[];
    filters: SearchFilters;
    onFilterChange: (key: string, value: string | number | Date | [Date, Date] | null | undefined) => void;
    onClearFilters: () => void;
    activeFiltersCount: number;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
    filterConfigs,
    filters,
    onFilterChange,
    onClearFilters,
    activeFiltersCount
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (filterConfigs.length === 0) return null;

    const renderFilterInput = (config: FilterConfig) => {
        const value = filters[config.key];

        switch (config.type) {
            case 'select':
                return (
                    <select
                        value={String(value || '')}
                        onChange={(e) => onFilterChange(config.key, e.target.value || null)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">All {config.label}</option>
                        {config.options?.map((option: { value: string | number; label: string }) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );

            case 'text':
                return (
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            value={String(value || '')}
                            onChange={(e) => onFilterChange(config.key, e.target.value || null)}
                            placeholder={config.placeholder || `Search ${config.label}...`}
                            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                );

            case 'number':
                return (
                    <input
                        type="number"
                        value={Number(value || '')}
                        onChange={(e) => onFilterChange(config.key, e.target.value ? Number(e.target.value) : null)}
                        placeholder={config.placeholder || `Enter ${config.label}...`}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                );

            case 'date':
                return (
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="date"
                            value={value ? new Date(value as string | number | Date).toISOString().split('T')[0] : ''}
                            onChange={(e) => onFilterChange(config.key, e.target.value ? new Date(e.target.value) : null)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                );

            case 'dateRange': {
                const dateRangeValue = value as [Date, Date] | null;
                return (
                    <div className="grid grid-cols-2 gap-2">
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                            <input
                                type="date"
                                value={dateRangeValue?.[0] ? dateRangeValue[0].toISOString().split('T')[0] : ''}
                                onChange={(e) => {
                                    const newStartDate = e.target.value ? new Date(e.target.value) : null;
                                    const endDate = dateRangeValue?.[1] || null;
                                    onFilterChange(config.key, newStartDate && endDate ? [newStartDate, endDate] : null);
                                }}
                                placeholder="From"
                                className="w-full pl-8 pr-2 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                            <input
                                type="date"
                                value={dateRangeValue?.[1] ? dateRangeValue[1].toISOString().split('T')[0] : ''}
                                onChange={(e) => {
                                    const newEndDate = e.target.value ? new Date(e.target.value) : null;
                                    const startDate = dateRangeValue?.[0] || null;
                                    onFilterChange(config.key, startDate && newEndDate ? [startDate, newEndDate] : null);
                                }}
                                placeholder="To"
                                className="w-full pl-8 pr-2 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                );
            }

            default:
                return null;
        }
    };

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg">
            {/* Filter Toggle Button */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors"
                >
                    <Filter size={16} />
                    <span>Filters</span>
                    {activeFiltersCount > 0 && (
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                            {activeFiltersCount}
                        </span>
                    )}
                </button>

                {activeFiltersCount > 0 && (
                    <button
                        onClick={onClearFilters}
                        className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors text-sm"
                    >
                        <RotateCcw size={14} />
                        <span>Clear all</span>
                    </button>
                )}
            </div>

            {/* Filter Inputs */}
            {isExpanded && (
                <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filterConfigs.map(config => (
                            <div key={config.key} className="space-y-2">
                                <label className="block text-sm font-medium text-gray-200">
                                    {config.label}
                                </label>
                                {renderFilterInput(config)}
                            </div>
                        ))}
                    </div>

                    {/* Active Filters Display */}
                    {activeFiltersCount > 0 && (
                        <div className="pt-4 border-t border-gray-700">
                            <h4 className="text-sm font-medium text-gray-200 mb-2">Active Filters:</h4>
                            <div className="flex flex-wrap gap-2">
                                {filterConfigs.map(config => {
                                    const value = filters[config.key];
                                    if (!value) return null;

                                    let displayValue = '';
                                    if (config.type === 'select') {
                                        const option = config.options?.find((opt: { value: string | number; label: string }) => opt.value === value);
                                        displayValue = option?.label || String(value);
                                    } else if (config.type === 'dateRange' && Array.isArray(value)) {
                                        const [start, end] = value as [Date, Date];
                                        displayValue = `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
                                    } else if (config.type === 'date') {
                                        displayValue = new Date(value as string | number | Date).toLocaleDateString();
                                    } else {
                                        displayValue = String(value);
                                    }

                                    return (
                                        <div
                                            key={config.key}
                                            className="flex items-center space-x-1 bg-blue-600 text-white text-xs px-2 py-1 rounded-full"
                                        >
                                            <span>{config.label}: {displayValue}</span>
                                            <button
                                                onClick={() => onFilterChange(config.key, null)}
                                                className="hover:text-blue-200 transition-colors"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};