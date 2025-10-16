import { adminMessaging } from "../config/firebaseAdmin.js";
import prisma from "../database/prisma.js";

// Notification payload interface
interface NotificationPayload {
  title: string;
  body: string;
  data?: { [key: string]: string };
}

// Send notification to a single device
export const sendNotificationToDevice = async (
  deviceToken: string,
  notification: NotificationPayload
): Promise<string | null> => {
  try {
    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: notification.data || {},
      token: deviceToken,
    };

    const response = await adminMessaging.send(message);
    console.log("Successfully sent message:", response);
    return response;
  } catch (error: any) {
    console.error("Error sending message:", error);

    // Handle invalid token
    if (
      error.code === "messaging/invalid-registration-token" ||
      error.code === "messaging/registration-token-not-registered"
    ) {
      console.log("Invalid token, should be removed from database");
      // Token should be removed from user
      return null;
    }

    throw error;
  }
};

// Send notification to a user by userId
export const sendNotificationToUser = async (
  userId: number,
  notification: NotificationPayload
): Promise<boolean> => {
  try {
    // Get user's device token
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { deviceToken: true },
    });

    if (!user || !user.deviceToken) {
      console.log(`No device token found for user ${userId}`);
      return false;
    }

    // Send notification
    const result = await sendNotificationToDevice(
      user.deviceToken,
      notification
    );

    // If token is invalid, clear it from database
    if (result === null) {
      await prisma.user.update({
        where: { id: userId },
        data: { deviceToken: null },
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending notification to user:", error);
    return false;
  }
};

// Send notification to multiple users
export const sendNotificationToMultipleUsers = async (
  userIds: number[],
  notification: NotificationPayload
): Promise<{ success: number; failed: number }> => {
  let success = 0;
  let failed = 0;

  for (const userId of userIds) {
    const sent = await sendNotificationToUser(userId, notification);
    if (sent) {
      success++;
    } else {
      failed++;
    }
  }

  return { success, failed };
};

// Send notification to all users with a specific role
export const sendNotificationByRole = async (
  role: string,
  notification: NotificationPayload
): Promise<{ success: number; failed: number }> => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: role as any,
        deviceToken: { not: null },
      },
      select: { id: true },
    });

    const userIds = users.map((u) => u.id);
    return await sendNotificationToMultipleUsers(userIds, notification);
  } catch (error) {
    console.error("Error sending notifications by role:", error);
    return { success: 0, failed: 0 };
  }
};

// Broadcast notification to all users
export const broadcastNotification = async (
  notification: NotificationPayload
): Promise<{ success: number; failed: number }> => {
  try {
    const users = await prisma.user.findMany({
      where: { deviceToken: { not: null } },
      select: { id: true },
    });

    const userIds = users.map((u) => u.id);
    return await sendNotificationToMultipleUsers(userIds, notification);
  } catch (error) {
    console.error("Error broadcasting notification:", error);
    return { success: 0, failed: 0 };
  }
};
