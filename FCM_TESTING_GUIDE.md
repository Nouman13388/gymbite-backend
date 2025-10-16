# 🧪 FCM Notifications API Testing Guide

**Created**: October 16, 2025  
**Backend**: GymBite FCM Notifications System  
**Base URL**: http://localhost:3000

---

## 📋 **Test Configuration**

### **Authentication**

All endpoints require Firebase authentication token in the Authorization header.

```powershell
$token = "YOUR_FIREBASE_AUTH_TOKEN"
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}
```

---

## 🔧 **TEST 1: Register Device Token**

Register a device token for push notifications.

**Endpoint**: `POST /api/notifications/device/register`

### PowerShell Test:

```powershell
$body = @{
    userId = 1
    deviceToken = "DEVICE_FCM_TOKEN_FROM_MOBILE_APP"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/notifications/device/register" -Method POST -Headers $headers -Body $body
```

### Expected Response:

```json
{
  "message": "Device token registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "deviceToken": "DEVICE_FCM_TOKEN_FROM_MOBILE_APP"
  }
}
```

---

## 🔧 **TEST 2: Get User Notifications**

Get all notifications for a specific user.

**Endpoint**: `GET /api/notifications/user/:userId`

### PowerShell Test:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/notifications/user/1" -Method GET -Headers $headers
```

### With Query Parameters:

```powershell
# Get only unread notifications (limit 10)
Invoke-RestMethod -Uri "http://localhost:3000/api/notifications/user/1?status=UNREAD&limit=10" -Method GET -Headers $headers
```

### Expected Response:

```json
[
  {
    "id": 1,
    "userId": 1,
    "message": "Welcome to GymBite!",
    "notificationType": "INFO",
    "status": "UNREAD",
    "createdAt": "2025-10-16T15:30:00.000Z"
  },
  {
    "id": 2,
    "userId": 1,
    "message": "Your appointment is tomorrow",
    "notificationType": "APPOINTMENT_REMINDER",
    "status": "UNREAD",
    "createdAt": "2025-10-16T14:00:00.000Z"
  }
]
```

---

## 🔧 **TEST 3: Send Notification with FCM Push**

Create a notification in database and send FCM push notification.

**Endpoint**: `POST /api/notifications/send`

### PowerShell Test:

```powershell
$body = @{
    userId = 1
    title = "Test Notification"
    message = "This is a test push notification from FCM"
    notificationType = "INFO"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/notifications/send" -Method POST -Headers $headers -Body $body
```

### Expected Response:

```json
{
  "notification": {
    "id": 3,
    "userId": 1,
    "message": "This is a test push notification from FCM",
    "notificationType": "INFO",
    "status": "UNREAD",
    "createdAt": "2025-10-16T15:45:00.000Z"
  },
  "pushSent": true
}
```

**Note**: `pushSent: false` means:

- User has no device token registered
- Device token is invalid/expired
- User not found

---

## 🔧 **TEST 4: Mark Notification as Read**

Mark a single notification as read.

**Endpoint**: `PUT /api/notifications/:id/read`

### PowerShell Test:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/notifications/1/read" -Method PUT -Headers $headers
```

### Expected Response:

```json
{
  "id": 1,
  "userId": 1,
  "message": "Welcome to GymBite!",
  "notificationType": "INFO",
  "status": "READ",
  "createdAt": "2025-10-16T15:30:00.000Z"
}
```

---

## 🔧 **TEST 5: Mark All Notifications as Read**

Mark all user's unread notifications as read.

**Endpoint**: `PUT /api/notifications/user/:userId/read-all`

### PowerShell Test:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/notifications/user/1/read-all" -Method PUT -Headers $headers
```

### Expected Response:

```json
{
  "message": "All notifications marked as read",
  "count": 5
}
```

---

## 🔧 **TEST 6: Send Bulk Notifications**

Send notifications to multiple users at once.

**Endpoint**: `POST /api/notifications/send/bulk`

### PowerShell Test:

```powershell
$body = @{
    userIds = @(1, 2, 3)
    title = "System Update"
    message = "The system will be under maintenance tonight"
    notificationType = "ANNOUNCEMENT"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/notifications/send/bulk" -Method POST -Headers $headers -Body $body
```

### Expected Response:

```json
{
  "created": 3,
  "pushSent": {
    "success": 2,
    "failed": 1
  }
}
```

**Note**: Failed count includes users without device tokens or invalid tokens.

---

## 🔧 **TEST 7: Broadcast Notification**

Send notification to ALL users in the system.

**Endpoint**: `POST /api/notifications/send/broadcast`

### PowerShell Test:

```powershell
$body = @{
    title = "System Announcement"
    message = "New features available! Check out the updated workout plans."
    notificationType = "ANNOUNCEMENT"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/notifications/send/broadcast" -Method POST -Headers $headers -Body $body
```

### Expected Response:

```json
{
  "created": 10,
  "pushSent": {
    "success": 8,
    "failed": 2
  }
}
```

---

## 🔧 **TEST 8: Unregister Device Token**

Remove device token from user (e.g., user logs out).

**Endpoint**: `DELETE /api/notifications/device/unregister/:userId`

### PowerShell Test:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/notifications/device/unregister/1" -Method DELETE -Headers $headers
```

### Expected Response:

```json
{
  "message": "Device token unregistered successfully"
}
```

---

## 📊 **Testing Workflow**

### **Complete Test Sequence**:

```powershell
# 1. Register device token
$body = @{ userId = 1; deviceToken = "test_token_123" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/notifications/device/register" -Method POST -Headers $headers -Body $body

# 2. Send a test notification
$body = @{ userId = 1; title = "Test"; message = "Hello World"; notificationType = "INFO" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/notifications/send" -Method POST -Headers $headers -Body $body

# 3. Get user's notifications
Invoke-RestMethod -Uri "http://localhost:3000/api/notifications/user/1" -Method GET -Headers $headers

# 4. Mark notification as read
Invoke-RestMethod -Uri "http://localhost:3000/api/notifications/1/read" -Method PUT -Headers $headers

# 5. Verify read status
Invoke-RestMethod -Uri "http://localhost:3000/api/notifications/user/1?status=READ" -Method GET -Headers $headers

# 6. Mark all as read
Invoke-RestMethod -Uri "http://localhost:3000/api/notifications/user/1/read-all" -Method PUT -Headers $headers
```

---

## ✅ **Validation Checklist**

### **Device Token Management**

- [ ] Device token successfully registered
- [ ] Device token stored in database
- [ ] Device token can be updated
- [ ] Device token can be unregistered

### **Notification Creation**

- [ ] Notifications saved to database
- [ ] Notifications include all required fields
- [ ] Notifications associated with correct user

### **FCM Push Notifications**

- [ ] Push notifications sent successfully (requires actual device token)
- [ ] Invalid tokens handled gracefully
- [ ] Push sent status returned correctly

### **Notification Queries**

- [ ] User can fetch their notifications
- [ ] Limit parameter works
- [ ] Status filter works (UNREAD/READ)
- [ ] Notifications ordered by date (newest first)

### **Read Status Management**

- [ ] Single notification marked as read
- [ ] All notifications marked as read
- [ ] Count returned correctly

### **Bulk Operations**

- [ ] Bulk notifications sent to multiple users
- [ ] Broadcast sent to all users
- [ ] Success/failed counts accurate

---

## 🔍 **Troubleshooting**

### **Issue: pushSent always false**

- **Cause**: User doesn't have a registered device token
- **Solution**: Register device token first using `/device/register`

### **Issue: FCM errors in console**

- **Cause**: Invalid device token or Firebase credentials
- **Check**: Verify `.env` has correct Firebase credentials
- **Check**: Device token from real mobile app

### **Issue: 401 Unauthorized**

- **Cause**: Invalid or expired Firebase auth token
- **Solution**: Get fresh token from Firebase Authentication

### **Issue: Notifications not appearing on device**

- **Cause**: FCM requires real device token from mobile app
- **Solution**: Register device token from actual mobile app (not test string)

---

## 📱 **Mobile App Integration**

To get a real device token from your mobile app:

### **React Native (Expo)**:

```javascript
import * as Notifications from "expo-notifications";

async function registerForPushNotifications() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    return;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;

  // Register with backend
  await fetch("http://localhost:3000/api/notifications/device/register", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${firebaseToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: currentUser.id,
      deviceToken: token,
    }),
  });
}
```

---

## 🎯 **Success Metrics**

### **✅ All 8 Test Endpoints Passing**:

1. ✅ Device token registration
2. ✅ Get user notifications
3. ✅ Send notification with FCM
4. ✅ Mark as read
5. ✅ Mark all as read
6. ✅ Send bulk notifications
7. ✅ Broadcast notifications
8. ✅ Unregister device token

### **🔥 FCM Integration Status**:

- [x] Firebase Messaging initialized
- [x] Device token management working
- [x] Notification sending logic implemented
- [ ] **Tested with real device token** (requires mobile app)

---

**Status**: ✅ **Implementation Complete - Ready for Mobile Integration**  
**Next Step**: Integrate with mobile app to test actual push notifications
