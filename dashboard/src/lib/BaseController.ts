import type { BaseEntity, CRUDState, FetchParams } from "./types";
import { BaseCRUDService } from "./BaseCRUDService";

export abstract class BaseController<T extends BaseEntity> {
  protected service: BaseCRUDService<T>;
  protected setState: (state: Partial<CRUDState<T>>) => void;
  protected getState: () => CRUDState<T>;

  constructor(
    service: BaseCRUDService<T>,
    setState: (state: Partial<CRUDState<T>>) => void,
    getState: () => CRUDState<T>
  ) {
    this.service = service;
    this.setState = setState;
    this.getState = getState;
  }

  // Core CRUD operations with business logic
  async loadItems(params?: FetchParams): Promise<void> {
    try {
      this.setState({ loading: true, error: null });

      // Pre-processing hook
      const processedParams = await this.preprocessFetchParams(params);

      const response = await this.service.fetchAll(processedParams);

      // Post-processing hook
      const processedData = await this.postprocessFetchData(response.data);

      this.setState({
        items: processedData,
        pagination: response.pagination || this.getState().pagination,
        loading: false,
      });
    } catch (error) {
      this.handleError("Failed to load items", error);
    }
  }

  async createItem(
    data: Omit<T, "id" | "createdAt" | "updatedAt">
  ): Promise<boolean> {
    try {
      this.setState({ loading: true, error: null });

      // Validation hook
      const validationResult = await this.validateCreate(data);
      if (!validationResult.isValid) {
        this.setState({
          error: validationResult.errors.map((e) => e.message).join(", "),
          loading: false,
        });
        return false;
      }

      // Pre-processing hook
      const processedData = await this.preprocessCreateData(data);

      const response = await this.service.create(processedData);

      // Post-processing hook
      const processedItem = await this.postprocessCreateData(response.data);

      const currentItems = this.getState().items;
      this.setState({
        items: [processedItem, ...currentItems],
        loading: false,
      });

      // Success hook
      await this.onCreateSuccess(processedItem);

      return true;
    } catch (error) {
      this.handleError("Failed to create item", error);
      return false;
    }
  }

  async updateItem(id: string, data: Partial<T>): Promise<boolean> {
    try {
      this.setState({ loading: true, error: null });

      // Validation hook
      const validationResult = await this.validateUpdate(id, data);
      if (!validationResult.isValid) {
        this.setState({
          error: validationResult.errors.map((e) => e.message).join(", "),
          loading: false,
        });
        return false;
      }

      // Pre-processing hook
      const processedData = await this.preprocessUpdateData(id, data);

      const response = await this.service.update(id, processedData);

      // Post-processing hook
      const processedItem = await this.postprocessUpdateData(response.data);

      const currentItems = this.getState().items;
      const currentSelected = this.getState().selectedItem;

      this.setState({
        items: currentItems.map((item) =>
          item.id === id ? processedItem : item
        ),
        selectedItem:
          currentSelected?.id === id ? processedItem : currentSelected,
        loading: false,
      });

      // Success hook
      await this.onUpdateSuccess(processedItem);

      return true;
    } catch (error) {
      this.handleError("Failed to update item", error);
      return false;
    }
  }

  async deleteItem(id: string): Promise<boolean> {
    try {
      this.setState({ loading: true, error: null });

      // Validation hook
      const canDelete = await this.validateDelete(id);
      if (!canDelete.isValid) {
        this.setState({
          error: canDelete.errors.map((e) => e.message).join(", "),
          loading: false,
        });
        return false;
      }

      // Pre-processing hook
      await this.preprocessDelete(id);

      await this.service.delete(id);

      const currentItems = this.getState().items;
      const currentSelected = this.getState().selectedItem;

      this.setState({
        items: currentItems.filter((item) => item.id !== id),
        selectedItem: currentSelected?.id === id ? null : currentSelected,
        loading: false,
      });

      // Success hook
      await this.onDeleteSuccess(id);

      return true;
    } catch (error) {
      this.handleError("Failed to delete item", error);
      return false;
    }
  }

  // Utility methods
  protected handleError(message: string, error: unknown): void {
    console.error(message, error);
    this.setState({
      error: error instanceof Error ? error.message : message,
      loading: false,
    });
  }

  // Hooks for customization - can be overridden by child classes
  protected async preprocessFetchParams(
    params?: FetchParams
  ): Promise<FetchParams | undefined> {
    return params;
  }

  protected async postprocessFetchData(data: T[]): Promise<T[]> {
    return data;
  }

  protected async validateCreate(
    _data: Omit<T, "id" | "createdAt" | "updatedAt">
  ): Promise<ValidationResult> {
    return { isValid: true, errors: [] };
  }

  protected async preprocessCreateData(
    data: Omit<T, "id" | "createdAt" | "updatedAt">
  ): Promise<Omit<T, "id" | "createdAt" | "updatedAt">> {
    return data;
  }

  protected async postprocessCreateData(data: T): Promise<T> {
    return data;
  }

  protected async onCreateSuccess(_item: T): Promise<void> {
    // Override in child classes for custom success handling
  }

  protected async validateUpdate(
    _id: string,
    _data: Partial<T>
  ): Promise<ValidationResult> {
    return { isValid: true, errors: [] };
  }

  protected async preprocessUpdateData(
    _id: string,
    data: Partial<T>
  ): Promise<Partial<T>> {
    return data;
  }

  protected async postprocessUpdateData(data: T): Promise<T> {
    return data;
  }

  protected async onUpdateSuccess(_item: T): Promise<void> {
    // Override in child classes for custom success handling
  }

  protected async validateDelete(_id: string): Promise<ValidationResult> {
    return { isValid: true, errors: [] };
  }

  protected async preprocessDelete(_id: string): Promise<void> {
    // Override in child classes for custom pre-delete logic
  }

  protected async onDeleteSuccess(_id: string): Promise<void> {
    // Override in child classes for custom success handling
  }
}

interface ValidationResult {
  isValid: boolean;
  errors: Array<{ field: string; message: string }>;
}
