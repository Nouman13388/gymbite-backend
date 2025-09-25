import { useState, useCallback, useEffect } from 'react';
import type { 
  BaseEntity, 
  CRUDState, 
  CRUDActions, 
  FetchParams 
} from './types';
import { BaseCRUDService } from './BaseCRUDService';

export function useBaseCRUD<T extends BaseEntity>(
  service: BaseCRUDService<T>,
  initialParams?: FetchParams
): CRUDState<T> & CRUDActions<T> {
  const [state, setState] = useState<CRUDState<T>>({
    items: [],
    loading: false,
    error: null,
    selectedItem: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
    },
    filters: {},
    searchQuery: '',
  });

  const fetchItems = useCallback(async (params?: FetchParams) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const fetchParams = {
        ...initialParams,
        ...params,
        page: params?.page || state.pagination.page,
        limit: params?.limit || state.pagination.limit,
        search: params?.search || state.searchQuery,
        filters: { ...state.filters, ...params?.filters },
      };

      const response = await service.fetchAll(fetchParams);
      
      setState(prev => ({
        ...prev,
        items: response.data,
        pagination: response.pagination || prev.pagination,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An error occurred',
        loading: false,
      }));
    }
  }, [service, initialParams, state.pagination.page, state.pagination.limit, state.searchQuery, state.filters]);

  const createItem = useCallback(async (
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await service.create(data);
      
      setState(prev => ({
        ...prev,
        items: [response.data, ...prev.items],
        loading: false,
      }));
      
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to create item',
        loading: false,
      }));
      return false;
    }
  }, [service]);

  const updateItem = useCallback(async (
    id: string, 
    data: Partial<T>
  ): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await service.update(id, data);
      
      setState(prev => ({
        ...prev,
        items: prev.items.map(item => 
          item.id === id ? response.data : item
        ),
        selectedItem: prev.selectedItem?.id === id ? response.data : prev.selectedItem,
        loading: false,
      }));
      
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to update item',
        loading: false,
      }));
      return false;
    }
  }, [service]);

  const deleteItem = useCallback(async (id: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      await service.delete(id);
      
      setState(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== id),
        selectedItem: prev.selectedItem?.id === id ? null : prev.selectedItem,
        loading: false,
      }));
      
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to delete item',
        loading: false,
      }));
      return false;
    }
  }, [service]);

  const setSelectedItem = useCallback((item: T | null) => {
    setState(prev => ({ ...prev, selectedItem: item }));
  }, []);

  const setFilters = useCallback((filters: Record<string, unknown>) => {
    setState(prev => ({ ...prev, filters, pagination: { ...prev.pagination, page: 1 } }));
  }, []);

  const setSearchQuery = useCallback((searchQuery: string) => {
    setState(prev => ({ ...prev, searchQuery, pagination: { ...prev.pagination, page: 1 } }));
  }, []);

  const setPage = useCallback((page: number) => {
    setState(prev => ({ ...prev, pagination: { ...prev.pagination, page } }));
  }, []);

  const refresh = useCallback(() => {
    fetchItems();
  }, [fetchItems]);

  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    ...state,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    setSelectedItem,
    setFilters,
    setSearchQuery,
    setPage,
    refresh,
  };
}