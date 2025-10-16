import express from "express";
import {
  getNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  registerDeviceToken,
  unregisterDeviceToken,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  createAndSendNotification,
  sendBulkNotification,
  broadcastNotificationToAll,
} from "../controllers/notificationController.js";
import { verifyFirebaseToken } from "../middleware/auth.js";

const router = express.Router();

router.use(verifyFirebaseToken);

// Device token management
router.post("/device/register", registerDeviceToken);
router.delete("/device/unregister/:userId", unregisterDeviceToken);

// User-specific notifications
router.get("/user/:userId", getUserNotifications);
router.put("/:id/read", markAsRead);
router.put("/user/:userId/read-all", markAllAsRead);

// Notification sending
router.post("/send", createAndSendNotification);
router.post("/send/bulk", sendBulkNotification);
router.post("/send/broadcast", broadcastNotificationToAll);

// Basic CRUD (existing)
router.get("/", getNotifications);
router.get("/:id", getNotificationById);
router.post("/", createNotification);
router.put("/:id", updateNotification);
router.delete("/:id", deleteNotification);

export default router;
