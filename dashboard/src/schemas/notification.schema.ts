import { z } from "zod";

export const notificationSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(60, "Title must be 60 characters or less"),
  message: z
    .string()
    .min(1, "Message is required")
    .max(240, "Message must be 240 characters or less"),
  notificationType: z.enum([
    "WORKOUT",
    "MEAL",
    "APPOINTMENT",
    "PROGRESS",
    "MESSAGE",
    "ANNOUNCEMENT",
    "INFO",
    "WARNING",
    "REMINDER",
  ]),
  targetType: z.enum(["SINGLE", "ROLE", "BROADCAST"]),
  userId: z.number().positive().optional(), // For SINGLE target
  role: z.enum(["CLIENT", "TRAINER", "ADMIN"]).optional(), // For ROLE target
});

export type NotificationFormData = z.infer<typeof notificationSchema>;

// Notification templates for quick sending
export interface NotificationTemplate {
  id: string;
  name: string;
  icon: string;
  type:
    | "WORKOUT"
    | "MEAL"
    | "APPOINTMENT"
    | "PROGRESS"
    | "MESSAGE"
    | "ANNOUNCEMENT";
  title: string;
  message: string;
  color: string;
}

export const notificationTemplates: NotificationTemplate[] = [
  {
    id: "workout-reminder",
    name: "Workout Reminder",
    icon: "💪",
    type: "WORKOUT",
    title: "Time for your workout!",
    message:
      "Don't forget to complete your scheduled workout today. Stay consistent!",
    color: "bg-blue-500",
  },
  {
    id: "meal-plan",
    name: "Meal Plan Update",
    icon: "🍽️",
    type: "MEAL",
    title: "New Meal Plan Available",
    message: "Your personalized meal plan has been updated. Check it out now!",
    color: "bg-green-500",
  },
  {
    id: "appointment-reminder",
    name: "Appointment Reminder",
    icon: "📅",
    type: "APPOINTMENT",
    title: "Upcoming Appointment",
    message: "You have an appointment scheduled tomorrow. Don't forget!",
    color: "bg-purple-500",
  },
  {
    id: "progress-check",
    name: "Progress Check-In",
    icon: "📊",
    type: "PROGRESS",
    title: "Time for Progress Update",
    message: "Please update your progress metrics. Let's track your journey!",
    color: "bg-orange-500",
  },
  {
    id: "motivational",
    name: "Motivational Message",
    icon: "⭐",
    type: "MESSAGE",
    title: "Keep Going!",
    message: "You're doing great! Every day is a step closer to your goals.",
    color: "bg-yellow-500",
  },
  {
    id: "announcement",
    name: "General Announcement",
    icon: "📢",
    type: "ANNOUNCEMENT",
    title: "Important Announcement",
    message: "We have some exciting updates to share with you!",
    color: "bg-red-500",
  },
];
