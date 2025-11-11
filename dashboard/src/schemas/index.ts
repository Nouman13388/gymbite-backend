import { z } from "zod";

// Enhanced User Form Schema with comprehensive validation
export const userFormSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(255, "Name must be less than 255 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
    .trim(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(5, "Email must be at least 5 characters")
    .max(320, "Email must be less than 320 characters")
    .toLowerCase()
    .trim(),
  role: z.enum(["CLIENT", "TRAINER", "ADMIN"]),
  firebaseUid: z.string().optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must be less than 128 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .optional(),
});

// Enhanced Create User Schema with required password
export const createUserFormSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(255, "Name must be less than 255 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
    .trim(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(5, "Email must be at least 5 characters")
    .max(320, "Email must be less than 320 characters")
    .toLowerCase()
    .trim(),
  role: z.enum(["CLIENT", "TRAINER", "ADMIN"]),
  firebaseUid: z.string().optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must be less than 128 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
});

// Enhanced Workout Form Schema with comprehensive validation
export const workoutFormSchema = z.object({
  name: z
    .string()
    .min(3, "Workout name must be at least 3 characters")
    .max(100, "Workout name must be less than 100 characters")
    .trim(),
  exercises: z
    .string()
    .min(10, "Exercise description must be at least 10 characters")
    .max(1000, "Exercise description must be less than 1000 characters")
    .trim(),
  sets: z
    .number()
    .int("Sets must be a whole number")
    .min(1, "At least 1 set required")
    .max(10, "Maximum 10 sets allowed"),
  reps: z
    .number()
    .int("Reps must be a whole number")
    .min(1, "At least 1 rep required")
    .max(100, "Maximum 100 reps allowed"),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  userId: z
    .number()
    .int("Invalid user selection")
    .positive("Please select a user"),
});

// Enhanced Meal Form Schema with comprehensive validation
export const mealFormSchema = z.object({
  title: z
    .string()
    .min(3, "Meal plan title must be at least 3 characters")
    .max(255, "Meal plan title must be less than 255 characters")
    .trim(),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .trim()
    .optional(),
  category: z
    .string()
    .min(3, "Category must be at least 3 characters")
    .max(100, "Category must be less than 100 characters")
    .trim(),
  imageUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  calories: z
    .number()
    .int("Calories must be a whole number")
    .min(0, "Calories cannot be negative")
    .max(10000, "Maximum 10000 calories allowed"),
  protein: z
    .number()
    .min(0, "Protein cannot be negative")
    .max(1000, "Maximum 1000g protein allowed")
    .multipleOf(0.1, "Protein must be in increments of 0.1g"),
  fat: z
    .number()
    .min(0, "Fat cannot be negative")
    .max(1000, "Maximum 1000g fat allowed")
    .multipleOf(0.1, "Fat must be in increments of 0.1g"),
  carbs: z
    .number()
    .min(0, "Carbs cannot be negative")
    .max(2000, "Maximum 2000g carbs allowed")
    .multipleOf(0.1, "Carbs must be in increments of 0.1g"),
  userId: z
    .number()
    .int("Invalid user selection")
    .positive("Please select a user"),
  meals: z.array(
    z.object({
      name: z.string().min(1, "Meal name is required").max(255),
      description: z.string().max(500).optional(),
      type: z.string().min(1, "Meal type is required").max(50),
      ingredients: z.array(z.string()),
      calories: z.number().int().min(0).max(5000),
      protein: z.number().min(0).max(200),
      imageUrl: z.string().url().optional().or(z.literal("")),
    })
  ),
});

// Export types
export type UserFormData = z.infer<typeof userFormSchema>;
export type WorkoutFormData = z.infer<typeof workoutFormSchema>;
export type MealFormData = z.infer<typeof mealFormSchema>;

// Export appointment schema and types
export * from "./appointment.schema";

// Export progress schema and types
export * from "./progress.schema";

// Export trainer schema and types
export * from "./trainer.schema";

// Export client schema and types
export * from "./client.schema";
