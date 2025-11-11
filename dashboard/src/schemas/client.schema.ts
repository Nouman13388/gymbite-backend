import { z } from "zod";

// Client with all relations
export interface ClientWithRelations {
  id: number;
  userId: number;
  trainerId: number | null;
  goals: string | null;
  activityLevel: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    email: string;
    firebaseUid: string;
    role: string;
    createdAt: string;
  };
  trainer: {
    id: number;
    user: {
      id: number;
      name: string;
      email: string;
    };
    specialty: string | null;
  } | null;
  _count?: {
    progressRecords: number;
    mealPlans: number;
    workoutPlans: number;
  };
  latestProgress?: {
    weight: number | null;
    height: number | null;
    bmi: number | null;
    bodyFat: number | null;
    date: string;
  } | null;
}

// Stats for clients overview
export interface ClientStats {
  total: number;
  active: number; // with trainer
  unassigned: number; // without trainer
  progressEntries: number; // this month
}

// Filters for client list
export interface ClientFilters {
  search: string;
  trainerId: number | null;
  activityLevel: string | null;
  status: "all" | "active" | "unassigned";
  hasMealPlan: boolean | null;
  hasWorkoutPlan: boolean | null;
  sortBy: "name" | "trainer" | "activity" | "bmi" | "recent";
}

// Client metrics from API
export interface ClientMetrics {
  totalProgressRecords: number;
  totalMealPlans: number;
  totalWorkoutPlans: number;
  currentWeight: number | null;
  currentBMI: number | null;
  weightChange: number | null; // vs first record
  progressTrend: "improving" | "stable" | "declining" | null;
}

// Progress record for display
export interface ProgressRecordBasic {
  id: number;
  weight: number | null;
  height: number | null;
  bmi: number | null;
  bodyFat: number | null;
  date: string;
  notes: string | null;
}

// Meal plan basic info
export interface MealPlanBasic {
  id: number;
  name: string;
  targetCalories: number | null;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
}

// Workout plan basic info
export interface WorkoutPlanBasic {
  id: number;
  name: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
}

// Zod schema for client form validation
export const clientSchema = z.object({
  userId: z.number().positive("User ID is required"),
  trainerId: z.number().positive("Trainer ID is required").nullable(),
  goals: z
    .string()
    .max(1000, "Goals must be less than 1000 characters")
    .nullable(),
  activityLevel: z.string().nullable(),
});

// Zod schema for assign trainer form
export const assignTrainerSchema = z.object({
  clientId: z.number().positive("Client ID is required"),
  trainerId: z.number().positive("Trainer is required"),
  startDate: z.string().optional(),
  notes: z
    .string()
    .max(500, "Notes must be less than 500 characters")
    .optional(),
});

// Form data types
export type ClientFormData = z.infer<typeof clientSchema>;
export type AssignTrainerFormData = z.infer<typeof assignTrainerSchema>;

// Activity levels
export const ACTIVITY_LEVELS = [
  "Sedentary",
  "Lightly Active",
  "Moderately Active",
  "Very Active",
  "Extremely Active",
] as const;

// Status colors for badges
export const CLIENT_STATUS_COLORS = {
  active: "bg-green-100 text-green-800 border-green-200",
  unassigned: "bg-yellow-100 text-yellow-800 border-yellow-200",
} as const;

// BMI categories
export const BMI_CATEGORIES = {
  underweight: {
    min: 0,
    max: 18.5,
    label: "Underweight",
    color: "text-blue-600",
  },
  normal: { min: 18.5, max: 24.9, label: "Normal", color: "text-green-600" },
  overweight: {
    min: 25,
    max: 29.9,
    label: "Overweight",
    color: "text-yellow-600",
  },
  obese: { min: 30, max: 100, label: "Obese", color: "text-red-600" },
} as const;

// Helper function to get BMI category
export const getBMICategory = (bmi: number | null) => {
  if (!bmi) return null;

  for (const [key, category] of Object.entries(BMI_CATEGORIES)) {
    if (bmi >= category.min && bmi < category.max) {
      return { key, ...category };
    }
  }

  return null;
};
