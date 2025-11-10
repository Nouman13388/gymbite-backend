import { z } from "zod";

/**
 * Appointment Type Enum
 */
export const AppointmentTypeEnum = z.enum([
  "IN_PERSON",
  "VIDEO_CALL",
  "PHONE_CALL",
  "CHAT",
]);

/**
 * Appointment Status Enum
 */
export const AppointmentStatusEnum = z.enum([
  "SCHEDULED",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
]);

/**
 * Appointment Schema for form validation
 */
export const appointmentSchema = z
  .object({
    trainerId: z
      .number({
        message: "Trainer must be a valid ID",
      })
      .positive("Trainer ID must be positive"),

    clientId: z
      .number({
        message: "Client must be a valid ID",
      })
      .positive("Client ID must be positive"),

    appointmentTime: z
      .string({
        message: "Appointment date and time is required",
      })
      .refine(
        (val) => {
          const date = new Date(val);
          return !isNaN(date.getTime()) && date > new Date();
        },
        {
          message: "Appointment must be scheduled in the future",
        }
      ),

    type: AppointmentTypeEnum,

    status: AppointmentStatusEnum.default("SCHEDULED"),

    meetingLink: z
      .string()
      .url("Invalid URL format")
      .optional()
      .or(z.literal("")),

    notes: z
      .string()
      .max(500, "Notes must be less than 500 characters")
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) => {
      // If appointment type is VIDEO_CALL, meetingLink is required
      if (data.type === "VIDEO_CALL") {
        return !!data.meetingLink && data.meetingLink.trim() !== "";
      }
      return true;
    },
    {
      message: "Meeting link is required for video call appointments",
      path: ["meetingLink"],
    }
  );

/**
 * Type inference from schema
 */
export type Appointment = z.infer<typeof appointmentSchema>;

/**
 * Form data type (without status, as it's set to default)
 */
export type AppointmentFormData = Omit<
  z.infer<typeof appointmentSchema>,
  "status"
> & {
  status?: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
};

/**
 * Appointment Type
 */
export type AppointmentType = z.infer<typeof AppointmentTypeEnum>;

/**
 * Appointment Status
 */
export type AppointmentStatus = z.infer<typeof AppointmentStatusEnum>;
