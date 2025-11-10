import { Request, Response, NextFunction } from "express";
import prisma from "../database/prisma.js";
import {
  sendNotificationToUser,
  sendNotificationToMultipleUsers,
  broadcastNotification,
} from "../services/fcmService.js";
import { adminFirestore } from "../config/firebaseAdmin.js";
import { adminMessaging } from "../config/firebaseAdmin.js";

// Get all notifications
export const getNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const notifications = await prisma.notification.findMany({
      include: { user: true },
    });
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

// Get a single notification by ID
export const getNotificationById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const notification = await prisma.notification.findUnique({
      where: { id: parseInt(id) },
      include: { user: true },
    });
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.json(notification);
  } catch (error) {
    next(error);
  }
};

// Create a new notification
export const createNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, message, notificationType, status } = req.body;
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        message,
        notificationType,
        status,
      },
    });
    res.status(201).json(notification);
  } catch (error) {
    next(error);
  }
};

// Update a notification
export const updateNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { message, notificationType, status } = req.body;
  try {
    const notification = await prisma.notification.update({
      where: { id: parseInt(id) },
      data: {
        message,
        notificationType,
        status,
      },
    });
    res.json(notification);
  } catch (error) {
    next(error);
  }
};

// Delete a notification
export const deleteNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    await prisma.notification.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// ============================================
// FCM ENHANCED FUNCTIONS
// ============================================

// Register/Update device token
export const registerDeviceToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, deviceToken } = req.body;

  try {
    if (!deviceToken || !userId) {
      return res
        .status(400)
        .json({ error: "userId and deviceToken are required" });
    }

    const user = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { deviceToken },
      select: { id: true, name: true, email: true, deviceToken: true },
    });

    res.json({
      message: "Device token registered successfully",
      user,
    });
  } catch (error) {
    console.error("Error registering device token:", error);
    next(error);
  }
};

// Unregister device token
export const unregisterDeviceToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;

  try {
    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { deviceToken: null },
    });

    res.json({ message: "Device token unregistered successfully" });
  } catch (error) {
    console.error("Error unregistering device token:", error);
    next(error);
  }
};

// Get user's notifications
export const getUserNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;
  const { limit = 50, status } = req.query;

  try {
    const whereClause: any = { userId: parseInt(userId) };
    if (status) {
      whereClause.status = status;
    }

    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: parseInt(limit as string),
    });

    res.json(notifications);
  } catch (error) {
    console.error("Error fetching user notifications:", error);
    next(error);
  }
};

// Mark notification as read
export const markAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const notification = await prisma.notification.update({
      where: { id: parseInt(id) },
      data: { status: "READ" },
    });

    res.json(notification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    next(error);
  }
};

// Mark all user notifications as read
export const markAllAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;

  try {
    const result = await prisma.notification.updateMany({
      where: {
        userId: parseInt(userId),
        status: "UNREAD",
      },
      data: { status: "READ" },
    });

    res.json({
      message: "All notifications marked as read",
      count: result.count,
    });
  } catch (error) {
    console.error("Error marking all as read:", error);
    next(error);
  }
};

// Send notification to a single user
export const sendNotificationToSingleUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;
  const { message, title, notificationType } = req.body;

  try {
    // Create notification in database
    const notification = await prisma.notification.create({
      data: {
        userId: parseInt(userId),
        message,
        notificationType: notificationType || "INFO",
        status: "UNREAD",
      },
    });

    // Send push notification
    const sent = await sendNotificationToUser(parseInt(userId), {
      title: title || "New Notification",
      body: message,
      data: {
        notificationId: notification.id.toString(),
        type: notificationType || "INFO",
      },
    });

    res.status(201).json({
      notification,
      pushSent: sent,
    });
  } catch (error) {
    console.error("Error sending notification to user:", error);
    next(error);
  }
};

// Send notification to users by role
export const sendNotificationByRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { role } = req.params;
  const { message, title, notificationType } = req.body;

  try {
    // Get all users with the specified role
    const users = await prisma.user.findMany({
      where: { role: role.toUpperCase() as "CLIENT" | "TRAINER" | "ADMIN" },
      select: { id: true },
    });

    if (users.length === 0) {
      return res
        .status(404)
        .json({ error: `No users found with role: ${role}` });
    }

    // Create notifications in database
    const notifications = await prisma.notification.createMany({
      data: users.map((user) => ({
        userId: user.id,
        message,
        notificationType: notificationType || "INFO",
        status: "UNREAD",
      })),
    });

    // Send push notifications
    const result = await sendNotificationToMultipleUsers(
      users.map((u) => u.id),
      {
        title: title || "New Notification",
        body: message,
        data: {
          type: notificationType || "INFO",
        },
      }
    );

    res.status(201).json({
      created: notifications.count,
      pushSent: result,
      role,
    });
  } catch (error) {
    console.error("Error sending notification by role:", error);
    next(error);
  }
};

// Create notification and send push
export const createAndSendNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, message, notificationType, title } = req.body;

  try {
    // Create notification in database
    const notification = await prisma.notification.create({
      data: {
        userId: parseInt(userId),
        message,
        notificationType: notificationType || "INFO",
        status: "UNREAD",
      },
    });

    // Send push notification
    const sent = await sendNotificationToUser(parseInt(userId), {
      title: title || "New Notification",
      body: message,
      data: {
        notificationId: notification.id.toString(),
        type: notificationType || "INFO",
      },
    });

    res.status(201).json({
      notification,
      pushSent: sent,
    });
  } catch (error) {
    console.error("Error creating and sending notification:", error);
    next(error);
  }
};

// Send bulk notifications
export const sendBulkNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userIds, message, title, notificationType } = req.body;

  try {
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: "userIds array is required" });
    }

    // Create notifications in database
    const notifications = await prisma.notification.createMany({
      data: userIds.map((userId) => ({
        userId: parseInt(userId),
        message,
        notificationType: notificationType || "INFO",
        status: "UNREAD",
      })),
    });

    // Send push notifications
    const result = await sendNotificationToMultipleUsers(
      userIds.map((id) => parseInt(id)),
      {
        title: title || "New Notification",
        body: message,
        data: {
          type: notificationType || "INFO",
        },
      }
    );

    res.status(201).json({
      created: notifications.count,
      pushSent: result,
    });
  } catch (error) {
    console.error("Error sending bulk notification:", error);
    next(error);
  }
};

// Broadcast notification to all users
export const broadcastNotificationToAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message, title, notificationType } = req.body;

  try {
    // Get all users
    const users = await prisma.user.findMany({
      select: { id: true },
    });

    // Create notifications in database
    const notifications = await prisma.notification.createMany({
      data: users.map((user) => ({
        userId: user.id,
        message,
        notificationType: notificationType || "ANNOUNCEMENT",
        status: "UNREAD",
      })),
    });

    // Send push notifications
    const result = await broadcastNotification({
      title: title || "System Announcement",
      body: message,
      data: {
        type: notificationType || "ANNOUNCEMENT",
      },
    });

    res.status(201).json({
      created: notifications.count,
      pushSent: result,
    });
  } catch (error) {
    console.error("Error broadcasting notification:", error);
    next(error);
  }
};

// Send chat notification
export const sendChatNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { roomId, senderId, messageText } = req.body;

  try {
    // Validate required fields
    if (!roomId || !senderId || !messageText) {
      return res.status(400).json({
        error: "Missing required fields: roomId, senderId, messageText",
      });
    }

    // Fetch chat room document from Firestore
    const chatRoomDoc = await adminFirestore
      .collection("chat_rooms")
      .doc(roomId)
      .get();

    if (!chatRoomDoc.exists) {
      return res.status(404).json({ error: "Chat room not found" });
    }

    const chatRoomData = chatRoomDoc.data();
    const participants = chatRoomData?.participants || [];
    const participantNames = chatRoomData?.participantNames || {};

    // Identify the receiver (the participant who is not the sender)
    const receiverUid = participants.find((uid: string) => uid !== senderId);

    if (!receiverUid) {
      return res.status(400).json({ error: "Receiver not found in chat room" });
    }

    // Query PostgreSQL User table to get receiver's deviceToken
    const receiver = await prisma.user.findFirst({
      where: { firebaseUid: receiverUid },
      select: { id: true, name: true, deviceToken: true, firebaseUid: true },
    });

    if (!receiver) {
      return res
        .status(404)
        .json({ error: "Receiver user not found in database" });
    }

    // Get sender name from participantNames
    const senderName = participantNames[senderId] || "Someone";

    // If deviceToken exists, send push notification
    if (receiver.deviceToken) {
      try {
        await adminMessaging.send({
          token: receiver.deviceToken,
          notification: {
            title: senderName,
            body: messageText,
          },
          data: {
            type: "CHAT_MESSAGE",
            roomId: roomId,
            senderId: senderId,
            senderName: senderName,
            messageText: messageText,
          },
          android: {
            priority: "high",
            notification: {
              channelId: "chat_messages",
              sound: "default",
            },
          },
          apns: {
            payload: {
              aps: {
                sound: "default",
                badge: 1,
              },
            },
          },
        });

        console.log(
          `Chat notification sent to ${receiver.name} (${receiver.firebaseUid})`
        );

        res.status(200).json({
          success: true,
          message: "Chat notification sent successfully",
          receiver: {
            id: receiver.id,
            name: receiver.name,
            firebaseUid: receiver.firebaseUid,
          },
        });
      } catch (fcmError: any) {
        console.error("Error sending FCM notification:", fcmError);
        return res.status(500).json({
          error: "Failed to send push notification",
          details: fcmError.message,
        });
      }
    } else {
      // No device token - notification cannot be sent
      res.status(200).json({
        success: false,
        message: "Receiver has no device token registered",
        receiver: {
          id: receiver.id,
          name: receiver.name,
          firebaseUid: receiver.firebaseUid,
        },
      });
    }
  } catch (error) {
    console.error("Error sending chat notification:", error);
    next(error);
  }
};
