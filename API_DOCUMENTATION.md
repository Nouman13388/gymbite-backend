# GymBite Backend API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
The API uses Firebase Authentication. All endpoints require a valid Firebase UID.

## Error Handling
The API uses standard HTTP status codes and returns errors in the following format:
```json
{
  "error": "Error message"
}
```

For validation errors:
```json
{
  "errors": [
    {
      "msg": "Error message",
      "param": "parameter_name",
      "location": "body/params"
    }
  ]
}
```

## Quick Reference

### User Endpoints
```bash
# Get user by Firebase UID
GET http://localhost:3000/api/users/firebase/:firebaseUid

# Create new user
POST http://localhost:3000/api/users
{
  "firebaseUid": "firebase-uid-from-firebase",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "TRAINER"
}

# Get all users
GET http://localhost:3000/api/users

# Get specific user
GET http://localhost:3000/api/users/4

# Update user
PUT http://localhost:3000/api/users/4
{
  "name": "John Doe Updated",
  "email": "john.doe.updated@example.com",
  "role": "TRAINER"
}

# Delete user
DELETE http://localhost:3000/api/users/4
```

### Client Endpoints
```bash
# Get complete client profile
GET http://localhost:3000/api/clients/1/complete

# Get client's plans
GET http://localhost:3000/api/clients/1/plans

# Get client's progress
GET http://localhost:3000/api/clients/1/progress

# Get client's activities
GET http://localhost:3000/api/clients/1/activities

# Get all clients
GET http://localhost:3000/api/clients

# Get specific client
GET http://localhost:3000/api/clients/1

# Create new client
POST http://localhost:3000/api/clients
{
  "userId": 5,
  "weight": 65.0,
  "height": 170.0,
  "BMI": 22.5,
  "fitnessGoals": "Build muscle",
  "dietaryPreferences": "Balanced"
}

# Update client
PUT http://localhost:3000/api/clients/1
{
  "weight": 64.0,
  "BMI": 22.2,
  "fitnessGoals": "Muscle gain"
}

# Delete client
DELETE http://localhost:3000/api/clients/1
```

### Trainer Endpoints
```bash
# Get complete trainer profile
GET http://localhost:3000/api/trainers/1/complete

# Get trainer's clients
GET http://localhost:3000/api/trainers/1/clients

# Get trainer's schedule
GET http://localhost:3000/api/trainers/1/schedule

# Get trainer's metrics
GET http://localhost:3000/api/trainers/1/metrics

# Get all trainers
GET http://localhost:3000/api/trainers

# Get specific trainer
GET http://localhost:3000/api/trainers/1

# Create new trainer
POST http://localhost:3000/api/trainers
{
  "userId": 4,
  "specialty": "Weight Training",
  "experienceYears": 5
}

# Update trainer
PUT http://localhost:3000/api/trainers/1
{
  "specialty": "CrossFit",
  "experienceYears": 6
}

# Delete trainer
DELETE http://localhost:3000/api/trainers/1
```

## User Endpoints

### 1. Get User by Firebase UID
```http
GET /users/firebase/:firebaseUid
```
Parameters:
- `firebaseUid` (path parameter): Firebase Authentication UID

Response:
```json
{
  "id": 4,
  "firebaseUid": "firebase-uid-trainer",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "TRAINER",
  "createdAt": "2025-05-13T21:00:46.896Z",
  "updatedAt": "2025-05-13T21:00:46.896Z"
}
```

### 2. Create User
```http
POST /users
```
Request Body:
```json
{
  "firebaseUid": "firebase-uid-from-firebase",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "TRAINER"
}
```
Validation Rules:
- `firebaseUid`: Required string, must be unique
- `name`: Required string, min length 3
- `email`: Required string, must be valid email format
- `role`: Required string, must be one of ["CLIENT", "TRAINER", "ADMIN"]

Response (201 Created):
```json
{
  "id": 4,
  "firebaseUid": "firebase-uid-trainer",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "TRAINER",
  "createdAt": "2025-05-13T21:00:46.896Z",
  "updatedAt": "2025-05-13T21:00:46.896Z"
}
```

### 3. Update User
```http
PUT /users/:id
```
Parameters:
- `id` (path parameter): User ID (positive integer)

Request Body:
```json
{
  "name": "John Doe Updated",
  "email": "john.doe.updated@example.com",
  "role": "TRAINER"
}
```
Validation Rules:
- `name`: Required string, min length 3
- `email`: Required string, must be valid email format
- `role`: Required string, must be one of ["CLIENT", "TRAINER", "ADMIN"]
- `firebaseUid`: Optional string, cannot be changed after creation

Response:
```json
{
  "id": 4,
  "firebaseUid": "firebase-uid-trainer",
  "name": "John Doe Updated",
  "email": "john.doe.updated@example.com",
  "role": "TRAINER",
  "createdAt": "2025-05-13T21:00:46.896Z",
  "updatedAt": "2025-05-13T21:00:46.896Z"
}
```

## Client Endpoints

### 1. Get All Clients
```http
GET /clients
```
Response:
```json
[
  {
    "id": 1,
    "userId": 1,
    "weight": 75.5,
    "height": 180.0,
    "BMI": 23.3,
    "fitnessGoals": "Weight loss",
    "dietaryPreferences": "Vegetarian",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "CLIENT"
    }
  }
]
```

### 2. Get Client by ID
```http
GET /clients/:id
```
Parameters:
- `id` (path parameter): Client ID (positive integer)

Response:
```json
{
  "id": 1,
  "userId": 1,
  "weight": 75.5,
  "height": 180.0,
  "BMI": 23.3,
  "fitnessGoals": "Weight loss",
  "dietaryPreferences": "Vegetarian",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "CLIENT"
  }
}
```

### 3. Create Client
```http
POST /clients
```
Request Body:
```json
{
  "userId": 1,
  "weight": 75.5,
  "height": 180.0,
  "BMI": 23.3,
  "fitnessGoals": "Weight loss",
  "dietaryPreferences": "Vegetarian"
}
```
Validation Rules:
- `userId`: Positive integer
- `weight`: Positive number
- `height`: Positive number
- `BMI`: Positive number
- `fitnessGoals`: Optional string
- `dietaryPreferences`: Optional string

Response (201 Created):
```json
{
  "id": 1,
  "userId": 1,
  "weight": 75.5,
  "height": 180.0,
  "BMI": 23.3,
  "fitnessGoals": "Weight loss",
  "dietaryPreferences": "Vegetarian"
}
```

### 4. Update Client
```http
PUT /clients/:id
```
Parameters:
- `id` (path parameter): Client ID (positive integer)

Request Body:
```json
{
  "weight": 74.0,
  "height": 180.0,
  "BMI": 22.8,
  "fitnessGoals": "Muscle gain",
  "dietaryPreferences": "High protein"
}
```
All fields are optional.

Response:
```json
{
  "id": 1,
  "userId": 1,
  "weight": 74.0,
  "height": 180.0,
  "BMI": 22.8,
  "fitnessGoals": "Muscle gain",
  "dietaryPreferences": "High protein"
}
```

### 5. Delete Client
```http
DELETE /clients/:id
```
Parameters:
- `id` (path parameter): Client ID (positive integer)

Response: 204 No Content

### 6. Get Client Complete Profile
```http
GET /clients/:id/complete
```
Parameters:
- `id` (path parameter): Client ID (positive integer)

Response:
```json
{
  "id": 1,
  "userId": 1,
  "weight": 75.5,
  "height": 180.0,
  "BMI": 23.3,
  "fitnessGoals": "Weight loss",
  "dietaryPreferences": "Vegetarian",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "CLIENT"
  },
  "consultations": [...],
  "appointments": [...],
  "progress": [...]
}
```

### 7. Get Client Plans
```http
GET /clients/:id/plans
```
Parameters:
- `id` (path parameter): Client ID (positive integer)

Response:
```json
{
  "workoutPlans": [
    {
      "id": 1,
      "userId": 1,
      "name": "Strength Training",
      "exercises": "Bench Press, Squats, Deadlifts",
      "sets": 3,
      "reps": 10,
      "createdAt": "2024-02-14T12:00:00.000Z",
      "updatedAt": "2024-02-14T12:00:00.000Z"
    }
  ],
  "mealPlans": [
    {
      "id": 1,
      "userId": 1,
      "name": "High Protein Diet",
      "description": "Meal plan for muscle gain",
      "calories": 2500,
      "protein": 180.0,
      "fat": 80.0,
      "carbs": 250.0,
      "createdAt": "2024-02-14T12:00:00.000Z",
      "updatedAt": "2024-02-14T12:00:00.000Z"
    }
  ]
}
```

### 8. Get Client Progress
```http
GET /clients/:id/progress
```
Parameters:
- `id` (path parameter): Client ID (positive integer)

Response:
```json
[
  {
    "id": 1,
    "clientId": 1,
    "weight": 75.5,
    "BMI": 23.3,
    "progressDate": "2024-02-14T12:00:00.000Z",
    "workoutPerformance": "Completed all sets with good form",
    "mealPlanCompliance": "Followed meal plan 90%",
    "createdAt": "2024-02-14T12:00:00.000Z"
  }
]
```

### 9. Get Client Activities
```http
GET /clients/:id/activities
```
Parameters:
- `id` (path parameter): Client ID (positive integer)

Response:
```json
{
  "consultations": [
    {
      "id": 1,
      "clientId": 1,
      "trainerId": 1,
      "scheduledAt": "2024-02-14T12:00:00.000Z",
      "status": "Scheduled",
      "notes": "Initial consultation"
    }
  ],
  "appointments": [
    {
      "id": 1,
      "clientId": 1,
      "trainerId": 1,
      "appointmentTime": "2024-02-14T12:00:00.000Z",
      "status": "Scheduled",
      "notes": "First training session"
    }
  ],
  "progress": [
    {
      "id": 1,
      "clientId": 1,
      "weight": 75.5,
      "BMI": 23.3,
      "progressDate": "2024-02-14T12:00:00.000Z"
    }
  ],
  "notifications": [
    {
      "id": 1,
      "userId": 1,
      "message": "Your workout plan has been updated",
      "notificationType": "Workout Update",
      "status": "Unread"
    }
  ]
}
```

## Test Cases

### 1. Invalid Firebase UID
```http
GET /users/firebase/invalid-uid
```
Expected Response (404 Not Found):
```json
{
  "error": "User not found"
}
```

### 2. Duplicate Firebase UID
```http
POST /users
{
  "firebaseUid": "existing-uid",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "TRAINER"
}
```
Expected Response (400 Bad Request):
```json
{
  "error": "User with this Firebase UID already exists"
}
```

### 3. Attempt to Update Firebase UID
```http
PUT /users/1
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "TRAINER",
  "firebaseUid": "new-firebase-uid"
}
```
Expected Response (400 Bad Request):
```json
{
  "error": "Firebase UID cannot be updated. Please contact support if this is necessary."
}
```

### 4. Invalid Client ID
```