import { z } from "zod";

// Feedback display types
export interface FeedbackWithRelations {
  id: number;
  userId: number;
  trainerId: number;
  rating: number;
  comments: string | null;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: "CLIENT" | "TRAINER" | "ADMIN";
  };
  trainer: {
    id: number;
    name: string;
    email: string;
    specialization?: string;
  };
}

// Stats types
export interface FeedbackStats {
  total: number;
  averageRating: number;
  recentCount: number; // Last 7 days
  topRatedTrainer: {
    name: string;
    rating: number;
  } | null;
}

// Filter types
export interface FeedbackFilters {
  trainerId?: number;
  ratings?: number[]; // e.g., [4, 5]
  startDate?: Date;
  endDate?: Date;
  sortBy?: "recent" | "highest" | "lowest";
}

// Zod schema for validation (if needed)
export const feedbackSchema = z.object({
  userId: z.number().positive(),
  trainerId: z.number().positive(),
  rating: z.number().min(1).max(5),
  comments: z.string().optional(),
});

export type FeedbackFormData = z.infer<typeof feedbackSchema>;
