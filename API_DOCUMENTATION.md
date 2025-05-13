# GymBite Backend API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Currently, the API does not implement authentication. All endpoints are publicly accessible.

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

### Client Endpoints
```bash
# Get complete client profile
GET http://localhost:3000/api/clients/3/complete

# Get client's plans
GET http://localhost:3000/api/clients/3/plans

# Get client's progress
GET http://localhost:3000/api/clients/3/progress

# Get client's activities
GET http://localhost:3000/api/clients/3/activities

# Get all clients
GET http://localhost:3000/api/clients

# Get specific client
GET http://localhost:3000/api/clients/3

# Create new client
POST http://localhost:3000/api/clients
{
  "userId": 1,
  "weight": 75.5,
  "height": 180.0,
  "BMI": 23.3,
  "fitnessGoals": "Weight loss",
  "dietaryPreferences": "Vegetarian"
}

# Update client
PUT http://localhost:3000/api/clients/3
{
  "weight": 74.0,
  "BMI": 22.8,
  "fitnessGoals": "Muscle gain"
}

# Delete client
DELETE http://localhost:3000/api/clients/3
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
  "userId": 2,
  "specialty": "Strength Training",
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

### 1. Invalid Client ID
```http
GET /clients/abc
```
Expected Response (400 Bad Request):
```json
{
  "errors": [
    {
      "msg": "Client ID must be a positive integer",
      "param": "id",
      "location": "params"
    }
  ]
}
```

### 2. Invalid Create Client Data
```http
POST /clients
{
  "userId": "abc",
  "weight": -10,
  "height": 0,
  "BMI": "invalid"
}
```
Expected Response (400 Bad Request):
```json
{
  "errors": [
    {
      "msg": "User ID must be a positive integer",
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
    },
    {
      "msg": "BMI must be a positive number",
      "param": "BMI",
      "location": "body"
    }
  ]
}
```

### 3. Non-existent Client
```http
GET /clients/999
```
Expected Response (404 Not Found):
```json
{
  "error": "Client not found"
}
```

### 4. Duplicate Client Creation
```http
POST /clients
{
  "userId": 1,
  "weight": 75.5,
  "height": 180.0,
  "BMI": 23.3
}
```
Expected Response (400 Bad Request):
```json
{
  "error": "A client profile already exists for this user"
}
```

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file with:
```
DATABASE_URL="postgresql://username:password@localhost:5432/gymbite"
```

3. Run database migrations:
```bash
npx prisma migrate dev
```

4. Start the server:
```bash
npm start
```

## Development

1. Run in development mode:
```bash
npm run dev
```

2. Run tests:
```bash
npm test
```

## Notes
- All timestamps are in ISO 8601 format
- All numeric values (weight, height, BMI) should be positive numbers
- User IDs must exist in the users table before creating a client
- The API implements proper error handling and input validation
- All endpoints return appropriate HTTP status codes 