# GymBite Backend API Documentation

## Table of Contents
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [HTTP Status Codes](#http-status-codes)
- [Quick Reference](#quick-reference)
- [User Endpoints](#user-endpoints)
- [Trainer Endpoints](#trainer-endpoints)
- [Client Endpoints](#client-endpoints)
- [Workout Plan Endpoints](#workout-plan-endpoints)
- [Meal Plan Endpoints](#meal-plan-endpoints)
- [Consultation Endpoints](#consultation-endpoints)
- [Appointment Endpoints](#appointment-endpoints)
- [Progress Endpoints](#progress-endpoints)
- [Feedback Endpoints](#feedback-endpoints)
- [Notification Endpoints](#notification-endpoints)
- [Test Cases](#test-cases)

## Base URL

### Development
```
http://localhost:3000/api
```

### Production (Vercel)
```
https://your-app-name.vercel.app/api
```

## Authentication
The API uses Firebase Authentication. Include the Firebase ID token in the Authorization header:

```http
Authorization: Bearer <firebase-id-token>
```

**Note**: Currently, the API accepts requests without authentication for development purposes, but Firebase UID is required for user identification.

## Error Handling

The API uses standard HTTP status codes and returns errors in the following format:

### Standard Error Response
```json
{
  "error": "Error message description"
}
```

### Validation Error Response
```json
{
  "errors": [
    {
      "msg": "Validation error message",
      "param": "field_name",
      "location": "body"
    }
  ]
}
```

## HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| `200` | OK - Request successful |
| `201` | Created - Resource created successfully |
| `204` | No Content - Request successful, no content returned |
| `400` | Bad Request - Invalid request data |
| `401` | Unauthorized - Authentication required |
| `403` | Forbidden - Access denied |
| `404` | Not Found - Resource not found |
| `409` | Conflict - Resource already exists |
| `422` | Unprocessable Entity - Validation failed |
| `500` | Internal Server Error - Server error |

## Quick Reference

### User Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/users` | Get all users |
| `GET` | `/users/:id` | Get user by ID |
| `GET` | `/users/firebase/:firebaseUid` | Get user by Firebase UID |
| `POST` | `/users` | Create new user |
| `PUT` | `/users/:id` | Update user |
| `DELETE` | `/users/:id` | Delete user |

### Trainer Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/trainers` | Get all trainers |
| `GET` | `/trainers/:id` | Get trainer by ID |
| `GET` | `/trainers/user/:userId` | Get trainer by user ID |
| `GET` | `/trainers/:id/complete` | Get complete trainer profile |
| `GET` | `/trainers/:id/clients` | Get trainer's clients |
| `GET` | `/trainers/:id/schedule` | Get trainer's schedule |
| `GET` | `/trainers/:id/metrics` | Get trainer's metrics |
| `POST` | `/trainers` | Create new trainer |
| `PUT` | `/trainers/:id` | Update trainer |
| `DELETE` | `/trainers/:id` | Delete trainer |

### Client Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/clients` | Get all clients |
| `GET` | `/clients/:id` | Get client by ID |
| `GET` | `/clients/user/:userId` | Get client by user ID |
| `GET` | `/clients/:id/complete` | Get complete client profile |
| `GET` | `/clients/:id/plans` | Get client's workout and meal plans |
| `GET` | `/clients/:id/progress` | Get client's progress |
| `GET` | `/clients/:id/activities` | Get client's activities |
| `POST` | `/clients` | Create new client |
| `PUT` | `/clients/:id` | Update client |
| `DELETE` | `/clients/:id` | Delete client |

### Workout Plan Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/workout-plans` | Get all workout plans |
| `GET` | `/workout-plans/:id` | Get workout plan by ID |
| `GET` | `/workout-plans/user/:userId` | Get workout plans by user ID |
| `POST` | `/workout-plans` | Create new workout plan |
| `PUT` | `/workout-plans/:id` | Update workout plan |
| `DELETE` | `/workout-plans/:id` | Delete workout plan |

### Meal Plan Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/meal-plans` | Get all meal plans |
| `GET` | `/meal-plans/:id` | Get meal plan by ID |
| `GET` | `/meal-plans/user/:userId` | Get meal plans by user ID |
| `POST` | `/meal-plans` | Create new meal plan |
| `PUT` | `/meal-plans/:id` | Update meal plan |
| `DELETE` | `/meal-plans/:id` | Delete meal plan |

### Other Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/consultations` | Get all consultations |
| `POST` | `/consultations` | Create consultation |
| `GET` | `/appointments` | Get all appointments |
| `POST` | `/appointments` | Create appointment |
| `GET` | `/progress` | Get all progress records |
| `POST` | `/progress` | Create progress record |
| `GET` | `/feedbacks` | Get all feedback |
| `POST` | `/feedbacks` | Create feedback |
| `GET` | `/notifications` | Get all notifications |
| `POST` | `/notifications` | Create notification |

## User Endpoints

### 1. Get All Users
```http
GET /users
```
**Response:**
```json
[
  {
    "id": 1,
    "firebaseUid": "trainer-mike-johnson-2025",
    "name": "Mike Johnson",
    "email": "mike.johnson@gymbite.com",
    "role": "TRAINER",
    "createdAt": "2025-06-10T07:26:08.951Z",
    "updatedAt": "2025-06-10T07:26:08.951Z"
  }
]
```

### 2. Get User by Firebase UID
```http
GET /users/firebase/:firebaseUid
```
**Parameters:**
- `firebaseUid` (path): Firebase Authentication UID (string, required)

**Response:**
```json
{
  "id": 1,
  "firebaseUid": "trainer-mike-johnson-2025",
  "name": "Mike Johnson",
  "email": "mike.johnson@gymbite.com",
  "role": "TRAINER",
  "createdAt": "2025-06-10T07:26:08.951Z",
  "updatedAt": "2025-06-10T07:26:08.951Z"
}
```

### 3. Get User by ID
```http
GET /users/:id
```
**Parameters:**
- `id` (path): User ID (integer, required)

**Response:** Same as above

### 4. Create User
```http
POST /users
```
**Request Body:**
```json
{
  "firebaseUid": "firebase-uid-from-firebase",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "TRAINER"
}
```

**Validation Rules:**
- `firebaseUid`: Required string, must be unique
- `name`: Required string, minimum 3 characters
- `email`: Required string, valid email format
- `role`: Required string, one of ["CLIENT", "TRAINER", "ADMIN"]

**Response (201 Created):**
```json
{
  "id": 4,
  "firebaseUid": "firebase-uid-from-firebase",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "TRAINER",
  "createdAt": "2025-06-10T07:26:08.951Z",
  "updatedAt": "2025-06-10T07:26:08.951Z"
}
```

### 5. Update User
```http
PUT /users/:id
```
**Parameters:**
- `id` (path): User ID (integer, required)

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "email": "john.doe.updated@example.com",
  "role": "TRAINER"
}
```

**Validation Rules:**
- `name`: Required string, minimum 3 characters
- `email`: Required string, valid email format
- `role`: Required string, one of ["CLIENT", "TRAINER", "ADMIN"]
- `firebaseUid`: Cannot be updated after creation

**Response:** Updated user object

### 6. Delete User
```http
DELETE /users/:id
```
**Parameters:**
- `id` (path): User ID (integer, required)

**Response:** 204 No Content

## Client Endpoints

### 1. Get All Clients
```http
GET /clients
```
**Response:**
```json
[
  {
    "id": 1,
    "userId": 2,
    "weight": 65.5,
    "height": 168,
    "BMI": 23.2,
    "fitnessGoals": "Weight loss and muscle toning",
    "dietaryPreferences": "Vegetarian, low carb",
    "user": {
      "id": 2,
      "name": "Sarah Williams",
      "email": "sarah.williams@email.com",
      "role": "CLIENT"
    }
  }
]
```

### 2. Get Client by ID
```http
GET /clients/:id
```
**Parameters:**
- `id` (path): Client ID (integer, required)

**Response:** Same as above (single client object)

### 3. Get Client by User ID
```http
GET /clients/user/:userId
```
**Parameters:**
- `userId` (path): User ID (integer, required)

**Response:** Same as above (single client object)

### 4. Create Client
```http
POST /clients
```
**Request Body:**
```json
{
  "userId": 2,
  "weight": 65.5,
  "height": 168.0,
  "BMI": 23.2,
  "fitnessGoals": "Weight loss and muscle toning",
  "dietaryPreferences": "Vegetarian, low carb"
}
```

**Validation Rules:**
- `userId`: Required integer, must reference existing user with CLIENT role
- `weight`: Required decimal, positive number
- `height`: Required decimal, positive number
- `BMI`: Required decimal, positive number
- `fitnessGoals`: Optional string
- `dietaryPreferences`: Optional string

**Response (201 Created):**
```json
{
  "id": 1,
  "userId": 2,
  "weight": 65.5,
  "height": 168,
  "BMI": 23.2,
  "fitnessGoals": "Weight loss and muscle toning",
  "dietaryPreferences": "Vegetarian, low carb"
}
```

### 5. Update Client
```http
PUT /clients/:id
```
**Parameters:**
- `id` (path): Client ID (integer, required)

**Request Body:**
```json
{
  "weight": 64.0,
  "BMI": 22.7,
  "fitnessGoals": "Muscle toning and strength"
}
```

**Validation Rules:** Same as create (all fields optional)

**Response:** Updated client object

### 6. Delete Client
```http
DELETE /clients/:id
```
**Parameters:**
- `id` (path): Client ID (integer, required)

**Response:** 204 No Content

### 7. Get Complete Client Profile
```http
GET /clients/:id/complete
```
**Parameters:**
- `id` (path): Client ID (integer, required)

**Response:**
```json
{
  "id": 1,
  "userId": 2,
  "weight": 65.5,
  "height": 168,
  "BMI": 23.2,
  "fitnessGoals": "Weight loss and muscle toning",
  "dietaryPreferences": "Vegetarian, low carb",
  "user": {
    "id": 2,
    "name": "Sarah Williams",
    "email": "sarah.williams@email.com",
    "role": "CLIENT"
  },
  "consultations": [...],
  "appointments": [...],
  "progress": [...]
}
```

### 8. Get Client Plans
```http
GET /clients/:id/plans
```
**Parameters:**
- `id` (path): Client ID (integer, required)

**Response:**
```json
{
  "workoutPlans": [
    {
      "id": 1,
      "userId": 2,
      "name": "Sarah's Fat Loss & Toning Program",
      "exercises": "Day 1: Squats, Lunges, Push-ups...",
      "sets": 3,
      "reps": 12,
      "createdAt": "2025-06-10T07:27:05.887Z",
      "updatedAt": "2025-06-10T07:27:05.887Z"
    }
  ],
  "mealPlans": [
    {
      "id": 1,
      "userId": 2,
      "name": "Sarah's Vegetarian Weight Loss Plan",
      "description": "Low-carb vegetarian meal plan...",
      "calories": 1800,
      "protein": 120,
      "fat": 60,
      "carbs": 150,
      "createdAt": "2025-06-10T07:27:24.265Z",
      "updatedAt": "2025-06-10T07:27:24.265Z"
    }
  ]
}
```

### 9. Get Client Progress
```http
GET /clients/:id/progress
```
**Parameters:**
- `id` (path): Client ID (integer, required)

**Response:**
```json
[
  {
    "id": 1,
    "clientId": 1,
    "weight": 65.5,
    "BMI": 23.2,
    "progressDate": "2025-06-10T00:00:00.000Z",
    "workoutPerformance": "Completed initial fitness assessment...",
    "mealPlanCompliance": "Following vegetarian meal plan consistently...",
    "createdAt": "2025-06-10T07:28:20.376Z"
  }
]
```

### 10. Get Client Activities
```http
GET /clients/:id/activities
```
**Parameters:**
- `id` (path): Client ID (integer, required)

**Response:**
```json
{
  "consultations": [...],
  "appointments": [...],
  "progress": [...],
  "notifications": [...]
}
```

## Workout Plan Endpoints

### 1. Get All Workout Plans
```http
GET /workout-plans
```
**Response:**
```json
[
  {
    "id": 1,
    "userId": 2,
    "name": "Sarah's Fat Loss & Toning Program",
    "exercises": "Day 1: Squats, Lunges, Push-ups, Plank; Day 2: Deadlifts, Rows...",
    "sets": 3,
    "reps": 12,
    "createdAt": "2025-06-10T07:27:05.887Z",
    "updatedAt": "2025-06-10T07:27:05.887Z"
  }
]
```

### 2. Get Workout Plan by ID
```http
GET /workout-plans/:id
```
**Parameters:**
- `id` (path): Workout Plan ID (integer, required)

**Response:** Same as above (single workout plan object)

### 3. Get Workout Plans by User ID
```http
GET /workout-plans/user/:userId
```
**Parameters:**
- `userId` (path): User ID (integer, required)

**Response:** Array of workout plans for the user

### 4. Create Workout Plan
```http
POST /workout-plans
```
**Request Body:**
```json
{
  "userId": 2,
  "name": "Upper Body Strength",
  "exercises": "Bench Press: 3x8, Rows: 3x10, Pull-ups: 3x5",
  "sets": 3,
  "reps": 8
}
```

**Validation Rules:**
- `userId`: Required integer, must reference existing user
- `name`: Required string, minimum 3 characters
- `exercises`: Required string, minimum 10 characters
- `sets`: Required integer, minimum 1
- `reps`: Required integer, minimum 1

**Response (201 Created):** Created workout plan object

### 5. Update Workout Plan
```http
PUT /workout-plans/:id
```
**Parameters:**
- `id` (path): Workout Plan ID (integer, required)

**Request Body:** Same as create (all fields optional except userId)

**Response:** Updated workout plan object

### 6. Delete Workout Plan
```http
DELETE /workout-plans/:id
```
**Parameters:**
- `id` (path): Workout Plan ID (integer, required)

**Response:** 204 No Content

## Meal Plan Endpoints

### 1. Get All Meal Plans
```http
GET /meal-plans
```
**Response:**
```json
[
  {
    "id": 1,
    "userId": 2,
    "name": "Sarah's Vegetarian Weight Loss Plan",
    "description": "Low-carb vegetarian meal plan focused on lean proteins and healthy fats",
    "calories": 1800,
    "protein": 120,
    "fat": 60,
    "carbs": 150,
    "createdAt": "2025-06-10T07:27:24.265Z",
    "updatedAt": "2025-06-10T07:27:24.265Z"
  }
]
```

### 2. Get Meal Plan by ID
```http
GET /meal-plans/:id
```
**Parameters:**
- `id` (path): Meal Plan ID (integer, required)

**Response:** Same as above (single meal plan object)

### 3. Get Meal Plans by User ID
```http
GET /meal-plans/user/:userId
```
**Parameters:**
- `userId` (path): User ID (integer, required)

**Response:** Array of meal plans for the user

### 4. Create Meal Plan
```http
POST /meal-plans
```
**Request Body:**
```json
{
  "userId": 2,
  "name": "High Protein Diet",
  "description": "Meal plan for muscle gain",
  "calories": 2500,
  "protein": 180.0,
  "fat": 80.0,
  "carbs": 250.0
}
```

**Validation Rules:**
- `userId`: Required integer, must reference existing user
- `name`: Required string, minimum 3 characters
- `description`: Optional string
- `calories`: Required integer, minimum 1000
- `protein`: Required decimal, minimum 50
- `fat`: Required decimal, minimum 20
- `carbs`: Required decimal, minimum 50

**Response (201 Created):** Created meal plan object

### 5. Update Meal Plan
```http
PUT /meal-plans/:id
```
**Parameters:**
- `id` (path): Meal Plan ID (integer, required)

**Request Body:** Same as create (all fields optional except userId)

**Response:** Updated meal plan object

### 6. Delete Meal Plan
```http
DELETE /meal-plans/:id
```
**Parameters:**
- `id` (path): Meal Plan ID (integer, required)

**Response:** 204 No Content

## Consultation Endpoints

### 1. Get All Consultations
```http
GET /consultations
```
**Response:**
```json
[
  {
    "id": 1,
    "clientId": 1,
    "trainerId": 1,
    "scheduledAt": "2025-06-15T10:00:00.000Z",
    "status": "Scheduled",
    "notes": "Initial consultation to assess fitness goals",
    "createdAt": "2025-06-10T07:27:42.464Z",
    "updatedAt": "2025-06-10T07:27:42.464Z"
  }
]
```

### 2. Get Consultation by ID
```http
GET /consultations/:id
```
**Parameters:**
- `id` (path): Consultation ID (integer, required)

**Response:** Same as above (single consultation object)

### 3. Create Consultation
```http
POST /consultations
```
**Request Body:**
```json
{
  "clientId": 1,
  "trainerId": 1,
  "scheduledAt": "2025-06-15T10:00:00.000Z",
  "status": "Scheduled",
  "notes": "Initial consultation"
}
```

**Validation Rules:**
- `clientId`: Required integer, must reference existing client
- `trainerId`: Required integer, must reference existing trainer
- `scheduledAt`: Required datetime (ISO 8601 format)
- `status`: Required string, one of ["Scheduled", "Completed", "Cancelled"]
- `notes`: Optional string

**Response (201 Created):** Created consultation object

### 4. Update Consultation
```http
PUT /consultations/:id
```
**Parameters:**
- `id` (path): Consultation ID (integer, required)

**Request Body:** Same as create (all fields optional)

**Response:** Updated consultation object

### 5. Delete Consultation
```http
DELETE /consultations/:id
```
**Parameters:**
- `id` (path): Consultation ID (integer, required)

**Response:** 204 No Content

## Appointment Endpoints

### 1. Get All Appointments
```http
GET /appointments
```
**Response:**
```json
[
  {
    "id": 1,
    "clientId": 1,
    "trainerId": 1,
    "appointmentTime": "2025-06-17T09:00:00.000Z",
    "status": "Scheduled",
    "notes": "First training session - Upper body strength",
    "createdAt": "2025-06-10T07:27:59.364Z"
  }
]
```

### 2. Get Appointment by ID
```http
GET /appointments/:id
```
**Parameters:**
- `id` (path): Appointment ID (integer, required)

**Response:** Same as above (single appointment object)

### 3. Create Appointment
```http
POST /appointments
```
**Request Body:**
```json
{
  "clientId": 1,
  "trainerId": 1,
  "appointmentTime": "2025-06-17T09:00:00.000Z",
  "status": "Scheduled",
  "notes": "First training session"
}
```

**Validation Rules:**
- `clientId`: Required integer, must reference existing client
- `trainerId`: Required integer, must reference existing trainer
- `appointmentTime`: Required datetime (ISO 8601 format)
- `status`: Required string, one of ["Scheduled", "Completed", "Cancelled"]
- `notes`: Optional string

**Response (201 Created):** Created appointment object

### 4. Update Appointment
```http
PUT /appointments/:id
```
**Parameters:**
- `id` (path): Appointment ID (integer, required)

**Request Body:** Same as create (all fields optional)

**Response:** Updated appointment object

### 5. Delete Appointment
```http
DELETE /appointments/:id
```
**Parameters:**
- `id` (path): Appointment ID (integer, required)

**Response:** 204 No Content

## Progress Endpoints

### 1. Get All Progress Records
```http
GET /progress
```
**Response:**
```json
[
  {
    "id": 1,
    "clientId": 1,
    "weight": 65.5,
    "BMI": 23.2,
    "progressDate": "2025-06-10T00:00:00.000Z",
    "workoutPerformance": "Completed initial fitness assessment...",
    "mealPlanCompliance": "Following vegetarian meal plan consistently...",
    "createdAt": "2025-06-10T07:28:20.376Z"
  }
]
```

### 2. Get Progress by ID
```http
GET /progress/:id
```
**Parameters:**
- `id` (path): Progress ID (integer, required)

**Response:** Same as above (single progress object)

### 3. Create Progress Record
```http
POST /progress
```
**Request Body:**
```json
{
  "clientId": 1,
  "weight": 65.5,
  "BMI": 23.2,
  "progressDate": "2025-06-10T00:00:00.000Z",
  "workoutPerformance": "Excellent form on squats and deadlifts",
  "mealPlanCompliance": "95% adherence to meal plan this week"
}
```

**Validation Rules:**
- `clientId`: Required integer, must reference existing client
- `weight`: Required decimal, positive number
- `BMI`: Required decimal, positive number
- `progressDate`: Required datetime (ISO 8601 format)
- `workoutPerformance`: Optional string
- `mealPlanCompliance`: Optional string

**Response (201 Created):** Created progress object

### 4. Update Progress Record
```http
PUT /progress/:id
```
**Parameters:**
- `id` (path): Progress ID (integer, required)

**Request Body:** Same as create (all fields optional except clientId)

**Response:** Updated progress object

### 5. Delete Progress Record
```http
DELETE /progress/:id
```
**Parameters:**
- `id` (path): Progress ID (integer, required)

**Response:** 204 No Content

## Feedback Endpoints

### 1. Get All Feedback
```http
GET /feedbacks
```
**Response:**
```json
[
  {
    "id": 1,
    "userId": 2,
    "trainerId": 1,
    "rating": 5,
    "comments": "Mike is an excellent trainer! Very knowledgeable...",
    "createdAt": "2025-06-10T07:29:36.948Z",
    "user": {
      "id": 2,
      "name": "Sarah Williams",
      "email": "sarah.williams@email.com",
      "role": "CLIENT"
    },
    "trainer": {
      "id": 1,
      "userId": 1,
      "specialty": "Strength Training & Bodybuilding",
      "experienceYears": 8
    }
  }
]
```

### 2. Get Feedback by ID
```http
GET /feedbacks/:id
```
**Parameters:**
- `id` (path): Feedback ID (integer, required)

**Response:** Same as above (single feedback object)

### 3. Create Feedback
```http
POST /feedbacks
```
**Request Body:**
```json
{
  "userId": 2,
  "trainerId": 1,
  "rating": 5,
  "comments": "Excellent trainer with great knowledge and motivation!"
}
```

**Validation Rules:**
- `userId`: Required integer, must reference existing user
- `trainerId`: Required integer, must reference existing trainer
- `rating`: Required integer, must be between 1 and 5
- `comments`: Optional string

**Response (201 Created):** Created feedback object

### 4. Update Feedback
```http
PUT /feedbacks/:id
```
**Parameters:**
- `id` (path): Feedback ID (integer, required)

**Request Body:** Same as create (all fields optional)

**Response:** Updated feedback object

### 5. Delete Feedback
```http
DELETE /feedbacks/:id
```
**Parameters:**
- `id` (path): Feedback ID (integer, required)

**Response:** 204 No Content

## Notification Endpoints

### 1. Get All Notifications
```http
GET /notifications
```
**Response:**
```json
[
  {
    "id": 1,
    "userId": 2,
    "message": "Welcome to GymBite! Your personalized workout and meal plans are ready.",
    "notificationType": "Welcome",
    "status": "Unread",
    "createdAt": "2025-06-10T07:28:38.482Z"
  }
]
```

### 2. Get Notification by ID
```http
GET /notifications/:id
```
**Parameters:**
- `id` (path): Notification ID (integer, required)

**Response:** Same as above (single notification object)

### 3. Get Notifications by User ID
```http
GET /notifications/user/:userId
```
**Parameters:**
- `userId` (path): User ID (integer, required)

**Response:** Array of notifications for the user

### 4. Create Notification
```http
POST /notifications
```
**Request Body:**
```json
{
  "userId": 2,
  "message": "Your workout plan has been updated",
  "notificationType": "Workout Update",
  "status": "Unread"
}
```

**Validation Rules:**
- `userId`: Required integer, must reference existing user
- `message`: Required string, minimum 5 characters
- `notificationType`: Required string, one of ["Welcome", "Appointment Reminder", "Workout Update", "Meal Plan Update", "New Client", "System"]
- `status`: Required string, one of ["Unread", "Read"]

**Response (201 Created):** Created notification object

### 5. Update Notification
```http
PUT /notifications/:id
```
**Parameters:**
- `id` (path): Notification ID (integer, required)

**Request Body:** Same as create (all fields optional except userId)

**Response:** Updated notification object

### 6. Delete Notification
```http
DELETE /notifications/:id
```
**Parameters:**
- `id` (path): Notification ID (integer, required)

**Response:** 204 No Content

## Trainer Endpoints

### 1. Get All Trainers
```http
GET /trainers
```
**Response:**
```json
[
  {
    "id": 1,
    "userId": 1,
    "specialty": "Strength Training & Bodybuilding",
    "experienceYears": 8,
    "user": {
      "id": 1,
      "name": "Mike Johnson",
      "email": "mike.johnson@gymbite.com",
      "role": "TRAINER"
    }
  }
]
```

### 2. Get Trainer by ID
```http
GET /trainers/:id
```
**Parameters:**
- `id` (path): Trainer ID (integer, required)

**Response:** Same as above (single trainer object)

### 3. Get Trainer by User ID
```http
GET /trainers/user/:userId
```
**Parameters:**
- `userId` (path): User ID (integer, required)

**Response:** Same as above (single trainer object)

### 4. Get Complete Trainer Profile
```http
GET /trainers/:id/complete
```
**Parameters:**
- `id` (path): Trainer ID (integer, required)

**Response:**
```json
{
  "id": 1,
  "userId": 1,
  "specialty": "Strength Training & Bodybuilding",
  "experienceYears": 8,
  "user": {
    "id": 1,
    "name": "Mike Johnson",
    "email": "mike.johnson@gymbite.com",
    "role": "TRAINER"
  },
  "consultations": [...],
  "appointments": [...],
  "feedbacks": [...]
}
```

### 5. Get Trainer's Clients
```http
GET /trainers/:id/clients
```
**Parameters:**
- `id` (path): Trainer ID (integer, required)

**Response:**
```json
[
  {
    "id": 1,
    "userId": 2,
    "weight": 65.5,
    "height": 168,
    "BMI": 23.2,
    "fitnessGoals": "Weight loss and muscle toning",
    "dietaryPreferences": "Vegetarian, low carb",
    "user": {
      "id": 2,
      "name": "Sarah Williams",
      "email": "sarah.williams@email.com",
      "role": "CLIENT"
    }
  }
]
```

### 6. Get Trainer's Schedule
```http
GET /trainers/:id/schedule
```
**Parameters:**
- `id` (path): Trainer ID (integer, required)

**Response:**
```json
{
  "consultations": [
    {
      "id": 1,
      "clientId": 1,
      "trainerId": 1,
      "scheduledAt": "2025-06-15T10:00:00.000Z",
      "status": "Scheduled",
      "notes": "Initial consultation"
    }
  ],
  "appointments": [
    {
      "id": 1,
      "clientId": 1,
      "trainerId": 1,
      "appointmentTime": "2025-06-17T09:00:00.000Z",
      "status": "Scheduled",
      "notes": "First training session"
    }
  ]
}
```

### 7. Get Trainer's Metrics
```http
GET /trainers/:id/metrics
```
**Parameters:**
- `id` (path): Trainer ID (integer, required)

**Response:**
```json
{
  "totalClients": 5,
  "activeClients": 3,
  "upcomingAppointments": 2,
  "completedSessions": 45,
  "averageRating": 4.8,
  "totalReviews": 12
}
```

### 8. Create Trainer
```http
POST /trainers
```
**Request Body:**
```json
{
  "userId": 1,
  "specialty": "Weight Training",
  "experienceYears": 5
}
```

**Validation Rules:**
- `userId`: Required integer, must reference existing user with TRAINER role
- `specialty`: Required string, minimum 3 characters
- `experienceYears`: Required integer, minimum 0

**Response (201 Created):**
```json
{
  "id": 1,
  "userId": 1,
  "specialty": "Weight Training",
  "experienceYears": 5
}
```

### 9. Update Trainer
```http
PUT /trainers/:id
```
**Parameters:**
- `id` (path): Trainer ID (integer, required)

**Request Body:**
```json
{
  "specialty": "CrossFit Training",
  "experienceYears": 6
}
```

**Validation Rules:**
- `specialty`: Optional string, minimum 3 characters
- `experienceYears`: Optional integer, minimum 0
- `userId`: Cannot be updated

**Response:** Updated trainer object

### 10. Delete Trainer
```http
DELETE /trainers/:id
```
**Parameters:**
- `id` (path): Trainer ID (integer, required)

**Response:** 204 No Content

## Test Cases

### Authentication Tests

#### 1. Invalid Firebase UID
```http
GET /users/firebase/invalid-uid-12345
```
**Expected Response (404 Not Found):**
```json
{
  "error": "User not found"
}
```

#### 2. Duplicate Firebase UID
```http
POST /users
{
  "firebaseUid": "trainer-mike-johnson-2025",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "TRAINER"
}
```
**Expected Response (400 Bad Request):**
```json
{
  "error": "User with this Firebase UID already exists"
}
```

### Validation Tests

#### 3. Invalid User Role
```http
POST /users
{
  "firebaseUid": "new-user-123",
  "name": "Test User",
  "email": "test@example.com",
  "role": "INVALID_ROLE"
}
```
**Expected Response (422 Unprocessable Entity):**
```json
{
  "errors": [
    {
      "msg": "Role must be one of: CLIENT, TRAINER, ADMIN",
      "param": "role",
      "location": "body"
    }
  ]
}
```

#### 4. Invalid Email Format
```http
POST /users
{
  "firebaseUid": "new-user-456",
  "name": "Test User",
  "email": "invalid-email",
  "role": "CLIENT"
}
```
**Expected Response (422 Unprocessable Entity):**
```json
{
  "errors": [
    {
      "msg": "Must be a valid email address",
      "param": "email",
      "location": "body"
    }
  ]
}
```

#### 5. Missing Required Fields
```http
POST /clients
{
  "weight": 70.0
}
```
**Expected Response (422 Unprocessable Entity):**
```json
{
  "errors": [
    {
      "msg": "User ID is required",
      "param": "userId",
      "location": "body"
    },
    {
      "msg": "Height is required",
      "param": "height",
      "location": "body"
    },
    {
      "msg": "BMI is required",
      "param": "BMI",
      "location": "body"
    }
  ]
}
```

### Resource Not Found Tests

#### 6. Non-existent Client ID
```http
GET /clients/99999
```
**Expected Response (404 Not Found):**
```json
{
  "error": "Client not found"
}
```

#### 7. Non-existent Trainer ID
```http
GET /trainers/99999
```
**Expected Response (404 Not Found):**
```json
{
  "error": "Trainer not found"
}
```

### Business Logic Tests

#### 8. Attempt to Update Firebase UID
```http
PUT /users/1
{
  "name": "Updated Name",
  "firebaseUid": "new-firebase-uid"
}
```
**Expected Response (400 Bad Request):**
```json
{
  "error": "Firebase UID cannot be updated. Please contact support if this is necessary."
}
```

#### 9. Create Client with Non-existent User ID
```http
POST /clients
{
  "userId": 99999,
  "weight": 70.0,
  "height": 175.0,
  "BMI": 22.9
}
```
**Expected Response (404 Not Found):**
```json
{
  "error": "User not found"
}
```

#### 10. Invalid Rating in Feedback
```http
POST /feedbacks
{
  "userId": 2,
  "trainerId": 1,
  "rating": 10,
  "comments": "Great trainer!"
}
```
**Expected Response (422 Unprocessable Entity):**
```json
{
  "errors": [
    {
      "msg": "Rating must be between 1 and 5",
      "param": "rating",
      "location": "body"
    }
  ]
}
```

### Edge Cases

#### 11. Negative Values in Client Data
```http
POST /clients
{
  "userId": 2,
  "weight": -70.0,
  "height": 175.0,
  "BMI": 22.9
}
```
**Expected Response (422 Unprocessable Entity):**
```json
{
  "errors": [
    {
      "msg": "Weight must be a positive number",
      "param": "weight",
      "location": "body"
    }
  ]
}
```

#### 12. Past Date in Appointment
```http
POST /appointments
{
  "clientId": 1,
  "trainerId": 1,
  "appointmentTime": "2020-01-01T10:00:00.000Z",
  "status": "Scheduled"
}
```
**Expected Response (422 Unprocessable Entity):**
```json
{
  "errors": [
    {
      "msg": "Appointment time cannot be in the past",
      "param": "appointmentTime",
      "location": "body"
    }
  ]
}
```

### Success Cases for Reference

#### 13. Successful User Creation
```http
POST /users
{
  "firebaseUid": "new-client-user-2025",
  "name": "Alice Johnson",
  "email": "alice.johnson@email.com",
  "role": "CLIENT"
}
```
**Expected Response (201 Created):**
```json
{
  "id": 4,
  "firebaseUid": "new-client-user-2025",
  "name": "Alice Johnson",
  "email": "alice.johnson@email.com",
  "role": "CLIENT",
  "createdAt": "2025-06-10T12:00:00.000Z",
  "updatedAt": "2025-06-10T12:00:00.000Z"
}
```

#### 14. Successful Client Update
```http
PUT /clients/1
{
  "weight": 64.0,
  "BMI": 22.7,
  "fitnessGoals": "Maintain current weight and build strength"
}
```
**Expected Response (200 OK):**
```json
{
  "id": 1,
  "userId": 2,
  "weight": 64.0,
  "height": 168,
  "BMI": 22.7,
  "fitnessGoals": "Maintain current weight and build strength",
  "dietaryPreferences": "Vegetarian, low carb"
}
```

---

## Notes

1. **Authentication**: While Firebase authentication is mentioned, the current implementation accepts requests without authentication headers for development purposes.

2. **Timestamps**: All timestamps are returned in ISO 8601 format (UTC).

3. **Decimal Fields**: Weight, height, BMI, and nutrition values are stored as decimal numbers for precision.

4. **Cascade Deletion**: Deleting a user will automatically delete their associated trainer/client profile and related records.

5. **Data Integrity**: The API enforces referential integrity - you cannot create a client/trainer without a valid user ID.

6. **Status Values**: Valid status values for appointments and consultations are: "Scheduled", "Completed", "Cancelled".

7. **Notification Types**: Valid notification types are: "Welcome", "Appointment Reminder", "Workout Update", "Meal Plan Update", "New Client", "System".

8. **Rating Scale**: Feedback ratings use a 1-5 scale where 5 is the highest rating.

---

*Last updated: June 10, 2025*
*Version: 1.0.0*
```http
GET /clients/999
```
Expected Response (404 Not Found):
```json
{
  "error": "Client not found"
}
```

### 5. Create Client with Invalid Data
```http
POST /clients
{
  "userId": "invalid",
  "weight": -70,
  "height": 0
}
```
Expected Response (422 Unprocessable Entity):
```json
{
  "errors": [
    {
      "msg": "Invalid user ID",
      "param": "userId",
      "location": "body"
    },
    {
      "msg": "Weight must be a positive number",
      "param": "weight",
      "location": "body"
    },
    {
      "msg": "Height must be a positive number",
      "param": "height",
      "location": "body"
    }
  ]
}
```

### 6. Update Client with ReadOnly Fields
```http
PUT /clients/1
{
  "userId": 2
}
```
Expected Response (400 Bad Request):
```json
{
  "error": "userId cannot be updated"
}
```

### 7. Get Trainer Metrics
```http
GET /trainers/1/metrics
```
Expected Response:
```json
{
  "totalClients": 5,
  "activeClients": 3,
  "upcomingAppointments": 2,
  "completedSessions": 45,
  "averageRating": 4.8,
  "totalReviews": 12
}
```

### 8. Create Trainer with Existing User ID
```http
POST /trainers
{
  "userId": 1,
  "specialty": "Yoga",
  "experienceYears": 3
}
```
Expected Response (409 Conflict):
```json
{
  "error": "Trainer with this user ID already exists"
}
```

### 9. Update Trainer with Invalid Data
```http
PUT /trainers/1
{
  "experienceYears": -1
}
```
Expected Response (422 Unprocessable Entity):
```json
{
  "errors": [
    {
      "msg": "Experience years must be at least 0",
      "param": "experienceYears",
      "location": "body"
    }
  ]
}
```

### 10. Delete Trainer with Existing Clients
```http
DELETE /trainers/1
```
Expected Response (409 Conflict):
```json
{
  "error": "Cannot delete trainer with existing clients. Please reassign or remove clients first."
}
```