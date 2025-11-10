import { z } from "zod";

/**
 * Progress Schema for form validation
 * Matches backend API expectations
 */
export const progressSchema = z.object({
  clientId: z
    .number({
      message: "Client must be a valid ID",
    })
    .positive("Client ID must be positive"),

  weight: z
    .number({
      message: "Weight must be a valid number",
    })
    .positive("Weight must be positive"),

  bodyFat: z
    .number({
      message: "Body fat must be a valid number",
    })
    .min(0, "Body fat cannot be negative")
    .max(100, "Body fat cannot exceed 100%")
    .optional(),

  muscleMass: z
    .number({
      message: "Muscle mass must be a valid number",
    })
    .positive("Muscle mass must be positive")
    .optional(),

  notes: z
    .string()
    .max(1000, "Notes must be less than 1000 characters")
    .optional()
    .or(z.literal("")),
});

/**
 * Type inference from schema
 */
export type Progress = z.infer<typeof progressSchema>;

/**
 * Form data type
 */
export type ProgressFormData = z.infer<typeof progressSchema>;
