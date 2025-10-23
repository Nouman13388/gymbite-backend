# 📮 Postman Collection - Quick Start Guide

## 📦 Import the Collection

### Option 1: Direct Import (Easiest)

1. **Open Postman** (Desktop or Web)
2. **Click "Import"** button (top-left corner)
3. **Drag and drop** `GymBite-Complete-API.postman_collection.json`
4. **Done!** Collection appears in your workspace

### Option 2: Import from File

1. Open Postman
2. Click **"Import"** → **"Upload Files"**
3. Select `GymBite-Complete-API.postman_collection.json`
4. Click **"Import"**

---

## ⚙️ Configure Variables

After importing, update these collection variables:

### Required Variables

| Variable         | Default Value                            | Your Value             |
| ---------------- | ---------------------------------------- | ---------------------- |
| `firebase_token` | `YOUR_FIREBASE_TOKEN_HERE`               | Get from Firebase Auth |
| `base_url`       | `http://localhost:3000/api`              | Your local server      |
| `prod_url`       | `https://gymbite-backend.vercel.app/api` | Production server      |

### Optional Variables (Auto-populated during testing)

| Variable          | Purpose                           |
| ----------------- | --------------------------------- |
| `user_id`         | Store user ID for testing         |
| `client_id`       | Store client ID for testing       |
| `trainer_id`      | Store trainer ID for testing      |
| `meal_plan_id`    | Store meal plan ID for testing    |
| `workout_plan_id` | Store workout plan ID for testing |
| `appointment_id`  | Store appointment ID for testing  |

### How to Update Variables

1. Click on collection name: **"GymBite Backend API v3.0.0"**
2. Click **"Variables"** tab
3. Update **"Current value"** column
4. Click **"Save"**

---

## 🔑 Get Your Firebase Token

### Method 1: Use the utility script

```bash
node get-firebase-token.js
```

Then copy the token and paste it into `firebase_token` variable.

### Method 2: From your app

If you have the Flutter app running:

1. Login to the app
2. The app will log the token
3. Copy and use it

### Method 3: Firebase Console

1. Go to Firebase Console
2. Authentication → Users
3. Click on a user
4. Copy their UID
5. Use Firebase Admin SDK to generate custom token

---

## 🚀 Start Testing

### 1. Test Health Check (No Auth Required)

1. Expand **"🏥 Health Check"** folder
2. Click **"Health Check"**
3. Click **"Send"**
4. Should return: `{ "status": "ok", "timestamp": "..." }`

### 2. Test Authentication

1. Expand **"👤 Users"** folder
2. Click **"Get Current User"**
3. Make sure `firebase_token` is set
4. Click **"Send"**
5. Should return your user profile

### 3. Test Create Operations

All create requests have example bodies pre-filled. Just:

1. Select the endpoint (e.g., "Create Meal Plan")
2. Review the request body
3. Modify if needed
4. Click **"Send"**

### 4. Switch Between Local & Production

**For Local Testing:**

- Use `{{base_url}}` in URLs
- Set `base_url` to `http://localhost:3000/api`

**For Production Testing:**

- Use `{{prod_url}}` in URLs
- Set `prod_url` to `https://gymbite-backend.vercel.app/api`

Or manually change the variable in each request.

---

## 📊 Collection Structure

```
GymBite Backend API v3.0.0
├── 🏥 Health Check (3 endpoints)
│   ├── Health Check
│   ├── Readiness Check
│   └── Liveness Check
│
├── 👤 Users (8 endpoints)
│   ├── Create User
│   ├── Get All Users
│   ├── Get Current User
│   ├── Get User by ID
│   ├── Get User by Firebase UID
│   ├── Get User by Email
│   ├── Update User
│   └── Delete User
│
├── 🏋️ Trainers (10 endpoints)
│   ├── Get All Trainers
│   ├── Get Trainer by ID
│   ├── Get Trainer by User ID
│   ├── Create Trainer
│   ├── Update Trainer
│   ├── Delete Trainer
│   ├── Get Trainer Complete Profile
│   ├── Get Trainer Clients
│   ├── Get Trainer Schedule
│   └── Get Trainer Metrics
│
├── 👥 Clients (11 endpoints)
│   ├── Get All Clients
│   ├── Get Client by ID
│   ├── Get Client by User ID
│   ├── Create Client
│   ├── Update Client
│   ├── Delete Client
│   ├── Get Client Complete Profile
│   ├── Get Client Plans
│   ├── Get Client Progress
│   ├── Get Client Appointments
│   └── Get Client Activities
│
├── 🍽️ Meal Plans (5 endpoints)
│   ├── Get All Meal Plans
│   ├── Get Meal Plan by ID
│   ├── Create Meal Plan
│   ├── Update Meal Plan
│   └── Delete Meal Plan
│
├── 🥗 Meals (5 endpoints)
│   ├── Get Meals by Meal Plan ID
│   ├── Get Meal by ID
│   ├── Create Meal
│   ├── Update Meal
│   └── Delete Meal
│
├── 💪 Workout Plans (5 endpoints) - v3.0.0 Enhanced
│   ├── Get All Workout Plans
│   ├── Get Workout Plan by ID
│   ├── Create Workout Plan (with new fields)
│   ├── Update Workout Plan
│   └── Delete Workout Plan
│
├── 📅 Appointments (5 endpoints) - v3.0.0 with Enums
│   ├── Get All Appointments (filter by type)
│   ├── Get Appointment by ID
│   ├── Create Appointment (with enum types)
│   ├── Update Appointment
│   └── Delete Appointment
│
├── 📈 Progress Tracking (7 endpoints)
│   ├── Get All Progress
│   ├── Get Progress by ID
│   ├── Get Progress by Client ID
│   ├── Get Progress Summary
│   ├── Create Progress
│   ├── Update Progress
│   └── Delete Progress
│
├── 🔔 Notifications (13 endpoints)
│   ├── Register Device Token
│   ├── Unregister Device Token
│   ├── Get User Notifications
│   ├── Mark Notification as Read
│   ├── Mark All Notifications as Read
│   ├── Send Single Notification
│   ├── Send Bulk Notifications
│   ├── Broadcast Notification
│   ├── Get All Notifications (Admin)
│   ├── Get Notification by ID
│   ├── Create Notification
│   ├── Update Notification
│   └── Delete Notification
│
├── 💬 Feedback (5 endpoints)
│   ├── Get All Feedback
│   ├── Get Feedback by ID
│   ├── Create Feedback
│   ├── Update Feedback
│   └── Delete Feedback
│
└── 📊 Analytics (8 endpoints)
    ├── Get Dashboard Stats
    ├── Get User Stats
    ├── Get User Growth
    ├── Get Trainer Stats
    ├── Get Client Stats
    ├── Get Appointment Stats
    ├── Get Appointment Trends
    └── Get System Health
```

---

## 🎯 Testing Workflows

### Workflow 1: Create New User & Client

1. **Create User** → Save `user_id`
2. **Get User by ID** → Verify creation
3. **Create Client** → Link to user
4. **Get Client Complete Profile** → View full profile

### Workflow 2: Create Workout Plan (v3.0.0)

1. **Create Workout Plan** with:
   ```json
   {
     "userId": 1,
     "title": "Beginner Program",
     "description": "Full body workout",
     "category": "Strength Training",
     "duration": 60,
     "difficulty": "Beginner",
     "imageUrl": "https://example.com/workout.jpg",
     "exercises": [...]
   }
   ```
2. **Get Workout Plan by ID** → Verify enhanced fields
3. **Update Workout Plan** → Modify details

### Workflow 3: Create Appointment (v3.0.0)

1. **Create Appointment** with:
   ```json
   {
     "clientId": 1,
     "trainerId": 1,
     "appointmentTime": "2025-10-25T10:00:00Z",
     "type": "VIDEO_CALL",
     "status": "scheduled",
     "duration": 60,
     "meetingLink": "https://meet.google.com/abc"
   }
   ```
2. **Get All Appointments** with filter: `?type=VIDEO_CALL`
3. **Update Appointment** → Change status to "completed"

### Workflow 4: Push Notifications

1. **Register Device Token** → Register user's device
2. **Send Single Notification** → Test notification
3. **Get User Notifications** → View received notifications
4. **Mark as Read** → Update notification status

---

## 🐛 Troubleshooting

### Error: "Unauthorized" (401)

**Solution:** Update your `firebase_token` variable

- Token may have expired
- Get a fresh token using `node get-firebase-token.js`

### Error: "Not Found" (404)

**Solution:** Check the URL

- Ensure `base_url` or `prod_url` is correct
- Verify the endpoint path

### Error: "Validation Error" (400)

**Solution:** Check request body

- Review required fields
- Check data types
- Verify enum values (e.g., AppointmentType: IN_PERSON, VIDEO_CALL, etc.)

### Error: "Internal Server Error" (500)

**Solution:** Check server logs

- Verify database connection
- Check server is running
- Review error message in response

---

## 📝 Notes

### v3.0.0 Changes

**WorkoutPlan API:**

- New fields: `title`, `description`, `category`, `duration`, `difficulty`, `imageUrl`
- `exercises` is now JSON array (not comma-separated string)
- Backward compatible: `name` field still works (mapped to `title`)

**Appointment API:**

- New `type` field with enum values: `IN_PERSON`, `VIDEO_CALL`, `PHONE_CALL`, `CHAT`
- New `duration` field (in minutes)
- New `meetingLink` field (renamed from `meetingUrl`)
- New `updatedAt` timestamp

### Environment Variables

The collection uses Postman variables:

- `{{base_url}}` → Local development
- `{{prod_url}}` → Production
- `{{firebase_token}}` → Authentication
- `{{user_id}}`, `{{client_id}}`, etc. → Test data IDs

You can switch between local and production by changing the variable values.

---

## 🎉 You're Ready!

Import the collection, configure your Firebase token, and start testing all 48+ endpoints!

**Need help?**

- Check README.md for API documentation
- Review endpoint descriptions in Postman
- Check the example request bodies

Happy Testing! 🚀
