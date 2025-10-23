import { sendNotificationToUser } from "../services/fcmService.js";
import prisma from "../database/prisma.js";

// Send appointment reminder notification
export const sendAppointmentReminder = async (
  userId: number,
  appointmentDetails: {
    trainerName: string;
    appointmentTime: Date;
  }
) => {
  const message = `Reminder: You have an appointment with ${
    appointmentDetails.trainerName
  } at ${appointmentDetails.appointmentTime.toLocaleString()}`;

  await prisma.notification.create({
    data: {
      userId,
      message,
      notificationType: "APPOINTMENT_REMINDER",
      status: "UNREAD",
    },
  });

  await sendNotificationToUser(userId, {
    title: "Appointment Reminder",
    body: message,
    data: {
      type: "APPOINTMENT_REMINDER",
      appointmentTime: appointmentDetails.appointmentTime.toISOString(),
    },
  });
};

// Send progress update notification
export const sendProgressUpdate = async (
  userId: number,
  progressDetails: {
    weightChange: number;
    bmiChange: number;
  }
) => {
  const message = `Great progress! Weight: ${
    progressDetails.weightChange > 0 ? "+" : ""
  }${progressDetails.weightChange}kg, BMI: ${
    progressDetails.bmiChange > 0 ? "+" : ""
  }${progressDetails.bmiChange}`;

  await prisma.notification.create({
    data: {
      userId,
      message,
      notificationType: "PROGRESS_UPDATE",
      status: "UNREAD",
    },
  });

  await sendNotificationToUser(userId, {
    title: "Progress Update",
    body: message,
    data: {
      type: "PROGRESS_UPDATE",
    },
  });
};

// Send workout reminder notification
export const sendWorkoutReminder = async (
  userId: number,
  workoutName: string
) => {
  const message = `Don't forget your workout: ${workoutName}`;

  await prisma.notification.create({
    data: {
      userId,
      message,
      notificationType: "WORKOUT_REMINDER",
      status: "UNREAD",
    },
  });

  await sendNotificationToUser(userId, {
    title: "Workout Reminder",
    body: message,
    data: {
      type: "WORKOUT_REMINDER",
    },
  });
};

// Send meal plan update notification
export const sendMealPlanUpdate = async (
  userId: number,
  mealPlanName: string
) => {
  const message = `New meal plan available: ${mealPlanName}`;

  await prisma.notification.create({
    data: {
      userId,
      message,
      notificationType: "MEAL_PLAN_UPDATE",
      status: "UNREAD",
    },
  });

  await sendNotificationToUser(userId, {
    title: "New Meal Plan",
    body: message,
    data: {
      type: "MEAL_PLAN_UPDATE",
    },
  });
};

// Send consultation scheduled notification
export const sendConsultationScheduled = async (
  userId: number,
  consultationDetails: {
    trainerName: string;
    scheduledDate: Date;
  }
) => {
  const message = `Your consultation with ${
    consultationDetails.trainerName
  } is scheduled for ${consultationDetails.scheduledDate.toLocaleString()}`;

  await prisma.notification.create({
    data: {
      userId,
      message,
      notificationType: "CONSULTATION_SCHEDULED",
      status: "UNREAD",
    },
  });

  await sendNotificationToUser(userId, {
    title: "Consultation Scheduled",
    body: message,
    data: {
      type: "CONSULTATION_SCHEDULED",
      scheduledDate: consultationDetails.scheduledDate.toISOString(),
    },
  });
};

// Send feedback received notification
export const sendFeedbackReceived = async (
  userId: number,
  feedbackDetails: {
    clientName: string;
    rating: number;
  }
) => {
  const message = `${feedbackDetails.clientName} left you a ${feedbackDetails.rating}-star review!`;

  await prisma.notification.create({
    data: {
      userId,
      message,
      notificationType: "FEEDBACK_RECEIVED",
      status: "UNREAD",
    },
  });

  await sendNotificationToUser(userId, {
    title: "New Feedback",
    body: message,
    data: {
      type: "FEEDBACK_RECEIVED",
      rating: feedbackDetails.rating.toString(),
    },
  });
};
