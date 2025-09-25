// Generic CRUD types for reusable components

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CRUDConfig<T extends BaseEntity> {
  entity: string;
  entityPlural: string;
  apiEndpoint: string;
  fields: FieldConfig[];
  columns: ColumnConfig[];
  permissions: Permission[];
  searchFields: string[];
  defaultSort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'number' | 'date' | 'boolean';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface ColumnConfig {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, record: any) => React.ReactNode;
}

export type Permission = 'create' | 'read' | 'update' | 'delete';

export interface CRUDState<T extends BaseEntity> {
  items: T[];
  loading: boolean;
  error: string | null;
  selectedItem: T | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  filters: Record<string, any>;
  searchQuery: string;
}

export interface CRUDActions<T extends BaseEntity> {
  fetchItems: (params?: FetchParams) => Promise<void>;
  createItem: (data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateItem: (id: string, data: Partial<T>) => Promise<boolean>;
  deleteItem: (id: string) => Promise<boolean>;
  setSelectedItem: (item: T | null) => void;
  setFilters: (filters: Record<string, any>) => void;
  setSearchQuery: (query: string) => void;
  setPage: (page: number) => void;
  refresh: () => void;
}

export interface FetchParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

export interface ApiResponse<T> {
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateResponse<T> {
  data: T;
  message?: string;
}

export interface UpdateResponse<T> {
  data: T;
  message?: string;
}

export interface DeleteResponse {
  success: boolean;
  message?: string;
}