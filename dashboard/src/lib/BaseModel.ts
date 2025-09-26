import type { BaseEntity } from './types';

export abstract class BaseModel<T extends BaseEntity> {
  protected data: T;

  constructor(data: T) {
    this.data = data;
  }

  // Getter methods
  get id(): string {
    return this.data.id;
  }

  get createdAt(): string {
    return this.data.createdAt;
  }

  get updatedAt(): string {
    return this.data.updatedAt;
  }

  getData(): T {
    return { ...this.data };
  }

  // Abstract validation method - must be implemented by child classes
  abstract validate(): ValidationResult;

  // Common validation utilities
  protected validateRequired(
    field: string, 
    value: unknown, 
    fieldName?: string
  ): ValidationError | null {
    if (value === null || value === undefined || value === '') {
      return {
        field,
        message: `${fieldName || field} is required`,
      };
    }
    return null;
  }

  protected validateEmail(
    field: string, 
    email: string, 
    fieldName?: string
  ): ValidationError | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        field,
        message: `${fieldName || field} must be a valid email address`,
      };
    }
    return null;
  }

  protected validateMinLength(
    field: string, 
    value: string, 
    minLength: number, 
    fieldName?: string
  ): ValidationError | null {
    if (value.length < minLength) {
      return {
        field,
        message: `${fieldName || field} must be at least ${minLength} characters long`,
      };
    }
    return null;
  }

  protected validateMaxLength(
    field: string, 
    value: string, 
    maxLength: number, 
    fieldName?: string
  ): ValidationError | null {
    if (value.length > maxLength) {
      return {
        field,
        message: `${fieldName || field} must be no more than ${maxLength} characters long`,
      };
    }
    return null;
  }

  protected validatePattern(
    field: string, 
    value: string, 
    pattern: RegExp, 
    message: string
  ): ValidationError | null {
    if (!pattern.test(value)) {
      return {
        field,
        message,
      };
    }
    return null;
  }

  protected validateIn<V>(
    field: string, 
    value: V, 
    allowedValues: V[], 
    fieldName?: string
  ): ValidationError | null {
    if (!allowedValues.includes(value)) {
      return {
        field,
        message: `${fieldName || field} must be one of: ${allowedValues.join(', ')}`,
      };
    }
    return null;
  }

  protected validateNumber(
    field: string, 
    value: unknown, 
    fieldName?: string
  ): ValidationError | null {
    if (typeof value !== 'number' || isNaN(value)) {
      return {
        field,
        message: `${fieldName || field} must be a valid number`,
      };
    }
    return null;
  }

  protected validateRange(
    field: string, 
    value: number, 
    min: number, 
    max: number, 
    fieldName?: string
  ): ValidationError | null {
    if (value < min || value > max) {
      return {
        field,
        message: `${fieldName || field} must be between ${min} and ${max}`,
      };
    }
    return null;
  }

  // Utility method to collect validation errors
  protected collectErrors(validations: (ValidationError | null)[]): ValidationError[] {
    return validations.filter((error): error is ValidationError => error !== null);
  }

  // Static factory method
  static create<M extends BaseModel<BaseEntity>>(
    this: new (data: BaseEntity) => M,
    data: BaseEntity
  ): M {
    return new this(data);
  }
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}