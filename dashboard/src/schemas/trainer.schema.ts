import { z } from "zod";

// Trainer with relations
export interface TrainerWithRelations {
  id: number;
  userId: number;
  specialty?: string;
  experience?: number;
  bio?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  clients?: ClientBasic[];
  appointments?: AppointmentBasic[];
  _count?: {
    clients: number;
    appointments: number;
  };
  averageRating?: number;
}

// Basic client info for trainer view
export interface ClientBasic {
  id: number;
  userId: number;
  trainerId: number;
  goals?: string;
  activityLevel?: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

// Basic appointment info
export interface AppointmentBasic {
  id: number;
  appointmentTime: string;
  type: string;
  status: string;
  client?: {
    user: {
      name: string;
    };
  };
}

// Trainer stats
export interface TrainerStats {
  total: number;
  active: number;
  totalClients: number;
  averageRating: number;
}

// Trainer filters
export interface TrainerFilters {
  search: string;
  specialty: string;
  experienceMin: number;
  experienceMax: number;
  rating: number;
  status: "all" | "active" | "inactive";
  clientsMin: number;
  clientsMax: number;
  sortBy: "name" | "clients" | "rating" | "experience" | "recent";
}

// Trainer metrics (from API)
export interface TrainerMetrics {
  totalClients: number;
  activeClients: number;
  totalAppointments: number;
  completedAppointments: number;
  completionRate: number;
  averageRating: number;
  totalFeedback: number;
  recentFeedback: FeedbackBasic[];
}

// Basic feedback info
export interface FeedbackBasic {
  id: number;
  rating: number;
  comments?: string;
  createdAt: string;
  client: {
    user: {
      name: string;
    };
  };
}

// Zod validation schema for trainer form
export const trainerSchema = z.object({
  userId: z.number().min(1, "User is required"),
  specialty: z
    .string()
    .min(2, "Specialty must be at least 2 characters")
    .max(100, "Specialty is too long")
    .optional()
    .or(z.literal("")),
  experience: z
    .number()
    .min(0, "Experience cannot be negative")
    .max(50, "Experience cannot exceed 50 years")
    .optional(),
  bio: z
    .string()
    .max(500, "Bio must be less than 500 characters")
    .optional()
    .or(z.literal("")),
});

export type TrainerFormData = z.infer<typeof trainerSchema>;

// Assign client form
export const assignClientSchema = z.object({
  clientId: z.number().min(1, "Client is required"),
  trainerId: z.number().min(1, "Trainer is required"),
  startDate: z.string().optional(),
  notes: z
    .string()
    .max(500, "Notes must be less than 500 characters")
    .optional()
    .or(z.literal("")),
});

export type AssignClientFormData = z.infer<typeof assignClientSchema>;

// Common specialties for suggestions
export const TRAINER_SPECIALTIES = [
  "Strength Training",
  "Cardio & Endurance",
  "Yoga & Flexibility",
  "CrossFit",
  "Bodybuilding",
  "Weight Loss",
  "Rehabilitation",
  "Sports Performance",
  "Functional Training",
  "HIIT (High Intensity)",
  "Powerlifting",
  "Olympic Lifting",
  "Pilates",
  "Boxing & Martial Arts",
  "Senior Fitness",
  "Youth Fitness",
  "Pre/Post Natal",
  "Nutrition Coaching",
  "General Fitness",
];

// Status badge colors
export const STATUS_COLORS = {
  active: { bg: "bg-green-100", text: "text-green-800" },
  inactive: { bg: "bg-gray-100", text: "text-gray-800" },
};
