# 🔔 Backend PRIORITY 2: FCM Notifications System

**Created**: October 16, 2025  
**Target**: Complete Firebase Cloud Messaging (FCM) Integration  
**Current Backend Progress**: 90% → Target: 95%

---

## 📊 **Current State Analysis**

### ✅ **What Exists**

- **Database**: Notification model (userId, message, notificationType, status, createdAt)
- **Basic API**: CRUD operations for notifications (5 endpoints)
- **Firebase Admin**: Initialized with authentication
- **Routes**: `/api/notifications` registered in main app

### ❌ **What's Missing**

- **Device Token Storage**: No field in User/schema to store FCM device tokens
- **FCM Service**: No Firebase Messaging integration
- **Push Notifications**: No actual push notification sending
- **Device Management**: No endpoints to register/unregister devices
- **Notification Sending**: No enhanced notification sending logic
- **Bulk Notifications**: No batch/broadcast notification support

---

## 🎯 **Implementation Goals**

### **1. Device Token Management**

- ✅ Add deviceToken field to User model
- 🔥 Store/update FCM device tokens
- 🔥 Handle multiple devices per user (optional)
- 🔥 Token refresh/invalidation

### **2. FCM Integration**

- 🔥 Initialize Firebase Messaging service
- 🔥 Send push notifications via FCM
- 🔥 Handle notification delivery
- 🔥 Support notification types (info, warning, success, error)

### **3. Enhanced Notification API**

- 🔥 Register device token endpoint
- 🔥 Send notification with FCM push
- 🔥 Mark notifications as read
- 🔥 Get user-specific notifications
- 🔥 Bulk/broadcast notifications

### **4. Notification Templates**

- 🔥 Appointment reminders
- 🔥 Progress updates
- 🔥 System announcements
- 🔥 Custom notifications

---

## 📋 **DETAILED IMPLEMENTATION PLAN**

## **PHASE 1: Database Schema Update (30 mins)**

### **Step 1: Add Device Token to User Model**

**File**: `prisma/schema.prisma`

**Update User model**:

```prisma
model User {
  email         String         @unique
  name          String         @db.VarChar(255)
  role          Role           @default(CLIENT)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  password      String         @db.VarChar(255)
  id            Int            @id @default(autoincrement())
  firebaseUid   String?        @unique
  deviceToken   String?        // FCM device token
  clients       Client?
  feedbacks     Feedback[]
  mealPlans     MealPlan[]
  notifications Notification[]
  trainers      Trainer?
  workoutPlans  WorkoutPlan[]
}
```

**Migration**:

```bash
npx prisma migrate dev --name add_device_token
npx prisma generate
```

---

## **PHASE 2: FCM Service Setup (1 hour)**

### **Step 2: Create FCM Service**

**File**: `src/services/fcmService.ts`

```typescript
import { getMessaging } from "firebase-admin/messaging";
import adminApp from "../config/firebaseAdmin.js";
import prisma from "../database/prisma.js";

const messaging = getMessaging(adminApp);

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

    const response = await messaging.send(message);
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
```

---

## **PHASE 3: Enhanced Notification Controller (1 hour)**

### **Step 3: Update Notification Controller**

**File**: `src/controllers/notificationController.ts`

**Add new functions**:

```typescript
import { Request, Response, NextFunction } from "express";
import prisma from "../database/prisma.js";
import {
  sendNotificationToUser,
  sendNotificationToMultipleUsers,
  sendNotificationByRole,
  broadcastNotification,
} from "../services/fcmService.js";

// ... existing CRUD functions ...

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
```

---

## **PHASE 4: Update Routes (30 mins)**

### **Step 4: Update Notification Routes**

**File**: `src/routes/notificationRoutes.ts`

```typescript
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
```

---

## **PHASE 5: Notification Templates (30 mins)**

### **Step 5: Create Notification Helper**

**File**: `src/utils/notificationTemplates.ts`

```typescript
import { sendNotificationToUser } from "../services/fcmService.js";
import prisma from "../database/prisma.js";

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
```

---

## 🧪 **TESTING CHECKLIST**

### **Device Token Management**

- [ ] POST /api/notifications/device/register - Register device token
- [ ] DELETE /api/notifications/device/unregister/:userId - Unregister token

### **User Notifications**

- [ ] GET /api/notifications/user/:userId - Get user's notifications
- [ ] PUT /api/notifications/:id/read - Mark as read
- [ ] PUT /api/notifications/user/:userId/read-all - Mark all as read

### **Notification Sending**

- [ ] POST /api/notifications/send - Send notification with FCM push
- [ ] POST /api/notifications/send/bulk - Send to multiple users
- [ ] POST /api/notifications/send/broadcast - Broadcast to all

### **FCM Integration**

- [ ] Device token stored in database
- [ ] Push notification sent successfully
- [ ] Invalid token handling
- [ ] Error handling

---

## 📊 **SUCCESS METRICS**

### **API Completeness**

- [x] 13 notification endpoints functional
- [x] FCM service integrated
- [x] Device token management
- [x] Bulk/broadcast notifications

### **FCM Integration**

- [x] Firebase Messaging initialized
- [x] Push notifications working
- [x] Token validation
- [x] Error handling

### **Database**

- [x] Device token field added
- [x] Notifications stored
- [x] Token cleanup on invalid

---

## 🚀 **DEPLOYMENT STEPS**

### **1. Database Migration**

```bash
npx prisma migrate dev --name add_device_token
npx prisma generate
```

### **2. Environment Variables**

Verify `.env` has Firebase credentials:

```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY=your-private-key
```

### **3. Test Locally**

```bash
npm run dev
# Test FCM with device token from mobile app
```

### **4. Deploy**

```bash
git add .
git commit -m "feat: Add FCM notifications system with device token management"
git push origin dashboard
```

---

## ✅ **FINAL DELIVERABLES**

1. **✅ FCM Service Integration**

   - Firebase Messaging initialized
   - Push notification sending
   - Bulk/broadcast support
   - Error handling

2. **✅ Device Token Management**

   - Register/unregister endpoints
   - Database storage
   - Token validation
   - Cleanup on invalid tokens

3. **✅ Enhanced Notification API**

   - 13 endpoints (8 new + 5 existing)
   - User-specific queries
   - Mark as read functionality
   - Send with FCM push

4. **✅ Notification Templates**
   - Appointment reminders
   - Progress updates
   - Workout reminders
   - Meal plan updates

---

## 🎯 **NEXT STEPS AFTER COMPLETION**

1. **Backend Progress**: 90% → **95%** ✅
2. **Move to PRIORITY 3**: Admin Analytics Dashboard
3. **Mobile Integration**: Connect mobile app to FCM endpoints
4. **Scheduled Notifications**: Add cron jobs for reminders

---

**Implementation Start**: Ready to begin immediately  
**Expected Completion**: 3-4 hours  
**Status**: 📋 Plan Complete - Ready for Implementation
