import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface FilterOption {
    key: string;
    label: string;
    options: { value: string; label: string }[];
}

interface SearchFilterProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    filters?: FilterOption[];
    activeFilters?: Record<string, string>;
    onFilterChange?: (key: string, value: string) => void;
    onClearFilters?: () => void;
    placeholder?: string;
    className?: string;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
    searchValue,
    onSearchChange,
    filters = [],
    activeFilters = {},
    onFilterChange,
    onClearFilters,
    placeholder = 'Search...',
    className = ''
}) => {
    const [showFilters, setShowFilters] = useState(false);

    const hasActiveFilters = Object.keys(activeFilters).length > 0;

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Search Bar and Filter Toggle */}
            <div className="flex items-center space-x-4">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-[#283039] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1173d4] focus:border-transparent"
                    />
                    {searchValue && (
                        <button
                            onClick={() => onSearchChange('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Filter Toggle */}
                {filters.length > 0 && (
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${showFilters || hasActiveFilters
                                ? 'bg-[#1173d4] border-[#1173d4] text-white'
                                : 'bg-[#283039] border-gray-600 text-gray-300 hover:text-white'
                            }`}
                    >
                        <Filter size={16} />
                        <span>Filter</span>
                        {hasActiveFilters && (
                            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                                {Object.keys(activeFilters).length}
                            </span>
                        )}
                    </button>
                )}

                {/* Clear Filters */}
                {hasActiveFilters && onClearFilters && (
                    <button
                        onClick={onClearFilters}
                        className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                        Clear all
                    </button>
                )}
            </div>

            {/* Filter Options */}
            {showFilters && filters.length > 0 && (
                <div className="bg-[#283039] border border-gray-600 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filters.map((filter) => (
                            <div key={filter.key}>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    {filter.label}
                                </label>
                                <select
                                    value={activeFilters[filter.key] || ''}
                                    onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
                                    className="w-full px-3 py-2 bg-[#181c22] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#1173d4] focus:border-transparent"
                                >
                                    <option value="">All {filter.label}</option>
                                    {filter.options.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                    {Object.entries(activeFilters).map(([key, value]) => {
                        const filter = filters.find(f => f.key === key);
                        const option = filter?.options.find(o => o.value === value);

                        if (!filter || !option) return null;

                        return (
                            <div
                                key={key}
                                className="flex items-center space-x-2 bg-[#1173d4] text-white px-3 py-1 rounded-full text-sm"
                            >
                                <span>{filter.label}: {option.label}</span>
                                <button
                                    onClick={() => onFilterChange?.(key, '')}
                                    className="hover:text-gray-200"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};