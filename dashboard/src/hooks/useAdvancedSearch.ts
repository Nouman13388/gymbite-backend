import { useState, useMemo, useCallback } from "react";

export interface FilterConfig {
  key: string;
  label: string;
  type: "select" | "date" | "dateRange" | "number" | "text";
  options?: Array<{ value: string | number; label: string }>;
  placeholder?: string;
}

export interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

export interface SearchFilters {
  [key: string]: string | number | Date | [Date, Date] | null | undefined;
}

export interface UseAdvancedSearchProps<T> {
  data: T[];
  searchableFields?: (keyof T)[];
  filterConfigs?: FilterConfig[];
  initialFilters?: SearchFilters;
  initialSort?: SortConfig;
}

export function useAdvancedSearch<T extends Record<string, unknown>>({
  data,
  searchableFields = [],
  filterConfigs = [],
  initialFilters = {},
  initialSort,
}: UseAdvancedSearchProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(
    initialSort || null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Debounced search function
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // Update debounced search term
  useMemo(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter data based on search term
  const searchedData = useMemo(() => {
    if (!debouncedSearchTerm) return data;

    return data.filter((item) => {
      // If specific searchable fields are defined, search only those
      if (searchableFields.length > 0) {
        return searchableFields.some((field) => {
          const value = item[field];
          return String(value || "")
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase());
        });
      }

      // Otherwise, search all string fields
      return Object.values(item).some((value) => {
        if (typeof value === "string" || typeof value === "number") {
          return String(value)
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase());
        }
        return false;
      });
    });
  }, [data, debouncedSearchTerm, searchableFields]);

  // Apply filters
  const filteredData = useMemo(() => {
    return searchedData.filter((item) => {
      return filterConfigs.every((config) => {
        const filterValue = filters[config.key];
        const itemValue = item[config.key];

        if (!filterValue) return true;

        switch (config.type) {
          case "select":
            return itemValue === filterValue;

          case "text":
            return String(itemValue || "")
              .toLowerCase()
              .includes(String(filterValue).toLowerCase());

          case "number":
            return Number(itemValue) === Number(filterValue);

          case "date": {
            if (!itemValue || !filterValue) return true;
            const itemDate = new Date(
              itemValue as string | number | Date
            ).toDateString();
            const filterDate = new Date(
              filterValue as string | number | Date
            ).toDateString();
            return itemDate === filterDate;
          }

          case "dateRange": {
            if (
              !itemValue ||
              !Array.isArray(filterValue) ||
              filterValue.length !== 2
            )
              return true;
            const itemDateValue = new Date(itemValue as string | number | Date);
            const [startDate, endDate] = filterValue as [Date, Date];
            return itemDateValue >= startDate && itemDateValue <= endDate;
          }

          default:
            return true;
        }
      });
    });
  }, [searchedData, filters, filterConfigs]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Handle dates
      if (aValue instanceof Date && bValue instanceof Date) {
        const comparison = aValue.getTime() - bValue.getTime();
        return sortConfig.direction === "asc" ? comparison : -comparison;
      }

      // Handle numbers
      if (typeof aValue === "number" && typeof bValue === "number") {
        const comparison = aValue - bValue;
        return sortConfig.direction === "asc" ? comparison : -comparison;
      }

      // Handle strings
      const aString = String(aValue).toLowerCase();
      const bString = String(bValue).toLowerCase();
      const comparison = aString.localeCompare(bString);
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // Calculate pagination info
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Update filter
  const updateFilter = useCallback(
    (
      key: string,
      value: string | number | Date | [Date, Date] | null | undefined
    ) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
      setCurrentPage(1); // Reset to first page when filtering
    },
    []
  );

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchTerm("");
    setCurrentPage(1);
  }, []);

  // Update sort
  const updateSort = useCallback((key: string) => {
    setSortConfig((current) => ({
      key,
      direction:
        current?.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  // Clear sort
  const clearSort = useCallback(() => {
    setSortConfig(null);
  }, []);

  // Pagination controls
  const goToPage = useCallback(
    (page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    },
    [totalPages]
  );

  const goToFirstPage = useCallback(() => goToPage(1), [goToPage]);
  const goToLastPage = useCallback(
    () => goToPage(totalPages),
    [goToPage, totalPages]
  );
  const goToPreviousPage = useCallback(
    () => goToPage(currentPage - 1),
    [currentPage, goToPage]
  );
  const goToNextPage = useCallback(
    () => goToPage(currentPage + 1),
    [currentPage, goToPage]
  );

  // Get active filters count
  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter(
      (value) => value !== null && value !== undefined && value !== ""
    ).length;
  }, [filters]);

  return {
    // Data
    data: paginatedData,
    totalItems,

    // Search
    searchTerm,
    setSearchTerm,

    // Filters
    filters,
    updateFilter,
    clearFilters,
    activeFiltersCount,

    // Sorting
    sortConfig,
    updateSort,
    clearSort,

    // Pagination
    currentPage,
    pageSize,
    setPageSize,
    totalPages,
    startItem,
    endItem,
    goToPage,
    goToFirstPage,
    goToLastPage,
    goToPreviousPage,
    goToNextPage,

    // State flags
    hasData: totalItems > 0,
    isFiltered: activeFiltersCount > 0 || searchTerm.length > 0,
    isEmpty: data.length === 0,
    isLoading: false, // Can be enhanced later for async operations
  };
}
