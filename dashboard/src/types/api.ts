// API Types for form data and entities

export interface UserFormData {
  name: string;
  email: string;
  role: "CLIENT" | "TRAINER" | "ADMIN";
  firebaseUid?: string;
  phone?: string;
  bio?: string;
}

export interface WorkoutFormData {
  name: string;
  exercises: string;
  sets: number;
  reps: number;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  userId: number;
  description?: string;
}

export interface MealFormData {
  title: string;
  description?: string;
  category: string; // e.g., "Weight Loss", "Muscle Gain", "Maintenance"
  imageUrl?: string;
  calories?: number;
  protein?: number;
  fat?: number;
  carbs?: number;
  userId: number;
  meals?: MealData[];
}

export interface MealData {
  name: string;
  description?: string;
  type: string; // e.g., "Breakfast", "Lunch", "Dinner", "Snack"
  ingredients: string[];
  calories: number;
  protein: number;
  imageUrl?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "CLIENT" | "TRAINER" | "ADMIN";
  firebaseUid?: string;
  phone?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutPlan {
  id: number;
  userId: number;
  name: string;
  exercises: string;
  sets: number;
  reps: number;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  description?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface MealPlan {
  id: number;
  userId: number;
  title: string; // Title/name of the meal plan
  description?: string;
  category: string; // Category like "Weight Loss", "Muscle Gain", etc.
  imageUrl?: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  meals?: Meal[]; // Array of individual meals
}

export interface Meal {
  id: number;
  mealPlanId: number;
  name: string;
  description?: string;
  type: string; // "Breakfast", "Lunch", "Dinner", "Snack", etc.
  ingredients: string[];
  calories: number;
  protein: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}
