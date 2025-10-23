import type { 
  BaseEntity, 
  FetchParams, 
  ApiResponse, 
  CreateResponse, 
  UpdateResponse, 
  DeleteResponse 
} from './types';

export class BaseCRUDService<T extends BaseEntity> {
  protected baseUrl: string;
  protected endpoint: string;

  constructor(endpoint: string) {
    this.baseUrl = '/api';
    this.endpoint = endpoint;
  }

  private async request<R>(
    url: string, 
    options?: RequestInit
  ): Promise<R> {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${this.baseUrl}${url}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`API request failed for ${url}:`, error);
      throw error;
    }
  }

  async fetchAll(params?: FetchParams): Promise<ApiResponse<T>> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);
    
    // Handle filters
    if (params?.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const url = `${this.endpoint}${queryString ? `?${queryString}` : ''}`;
    
    return this.request<ApiResponse<T>>(url);
  }

  async fetchById(id: string): Promise<T> {
    return this.request<T>(`${this.endpoint}/${id}`);
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<CreateResponse<T>> {
    return this.request<CreateResponse<T>>(this.endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async update(id: string, data: Partial<T>): Promise<UpdateResponse<T>> {
    return this.request<UpdateResponse<T>>(`${this.endpoint}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(id: string): Promise<DeleteResponse> {
    return this.request<DeleteResponse>(`${this.endpoint}/${id}`, {
      method: 'DELETE',
    });
  }

  // Bulk operations
  async deleteMany(ids: string[]): Promise<DeleteResponse> {
    return this.request<DeleteResponse>(`${this.endpoint}/bulk-delete`, {
      method: 'POST',
      body: JSON.stringify({ ids }),
    });
  }

  async updateMany(
    ids: string[], 
    data: Partial<T>
  ): Promise<UpdateResponse<T[]>> {
    return this.request<UpdateResponse<T[]>>(`${this.endpoint}/bulk-update`, {
      method: 'POST',
      body: JSON.stringify({ ids, data }),
    });
  }
}