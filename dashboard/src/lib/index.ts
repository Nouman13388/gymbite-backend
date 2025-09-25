// Base CRUD system exports
export * from './types';
export { BaseCRUDService } from './BaseCRUDService';
export { useBaseCRUD } from './useBaseCRUD';
export { BaseModel } from './BaseModel';
export { BaseController } from './BaseController';

// Re-export validation types
export type { ValidationResult, ValidationError } from './BaseModel';