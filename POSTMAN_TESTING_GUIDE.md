# Postman Testing Guide for Meal Plan API

## Server Information

- **Base URL**: `http://localhost:3000`
- **Authentication**: Firebase Bearer Token required for all endpoints

## Authentication Setup

### 1. Get Firebase Token

Before testing any endpoints, you need a valid Firebase authentication token:

1. **Method 1 - Use existing auth utility:**

   ```bash
   node get-firebase-token.js
   ```

2. **Method 2 - Login through your Flutter app and extract token**

3. **Method 3 - Use Firebase Auth REST API:**
   ```
   POST https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=YOUR_API_KEY
   Body: {
     "email": "your-email@example.com",
     "password": "your-password",
     "returnSecureToken": true
   }
   ```

### 2. Configure Postman Headers

For all requests, add these headers:

- `Authorization`: `Bearer YOUR_FIREBASE_TOKEN`
- `Content-Type`: `application/json`

## Meal Plan Endpoints

### 1. Create Meal Plan

**POST** `http://localhost:3000/api/meal-plans`

**Headers:**

```
Authorization: Bearer YOUR_FIREBASE_TOKEN
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "title": "High Protein Muscle Building Plan",
  "description": "A comprehensive meal plan focused on muscle building with high protein content",
  "category": "muscle_building",
  "imageUrl": "https://example.com/muscle-building-plan.jpg",
  "meals": [
    {
      "name": "Protein Power Breakfast",
      "description": "High protein breakfast to kickstart your day",
      "calories": 450,
      "protein": 35,
      "carbs": 30,
      "fat": 18,
      "ingredients": [
        "3 eggs",
        "2 slices whole grain bread",
        "1 avocado",
        "Greek yogurt"
      ],
      "instructions": "Scramble eggs, toast bread, slice avocado, serve with yogurt",
      "mealType": "breakfast",
      "preparationTime": 15,
      "imageUrl": "https://example.com/protein-breakfast.jpg"
    },
    {
      "name": "Grilled Chicken Lunch",
      "description": "Lean protein with complex carbs",
      "calories": 520,
      "protein": 45,
      "carbs": 35,
      "fat": 15,
      "ingredients": [
        "200g chicken breast",
        "1 cup brown rice",
        "Mixed vegetables"
      ],
      "instructions": "Grill chicken, cook rice, steam vegetables",
      "mealType": "lunch",
      "preparationTime": 25,
      "imageUrl": "https://example.com/grilled-chicken.jpg"
    }
  ]
}
```

**Expected Response (201):**

```json
{
  "id": "generated-uuid",
  "title": "High Protein Muscle Building Plan",
  "description": "A comprehensive meal plan focused on muscle building with high protein content",
  "category": "muscle_building",
  "imageUrl": "https://example.com/muscle-building-plan.jpg",
  "userId": "firebase-user-id",
  "createdAt": "2025-10-11T...",
  "updatedAt": "2025-10-11T...",
  "meals": [
    {
      "id": "meal-uuid-1",
      "name": "Protein Power Breakfast",
      "description": "High protein breakfast to kickstart your day",
      "calories": 450,
      "protein": 35,
      "carbs": 30,
      "fat": 18,
      "ingredients": [
        "3 eggs",
        "2 slices whole grain bread",
        "1 avocado",
        "Greek yogurt"
      ],
      "instructions": "Scramble eggs, toast bread, slice avocado, serve with yogurt",
      "mealType": "breakfast",
      "preparationTime": 15,
      "imageUrl": "https://example.com/protein-breakfast.jpg",
      "mealPlanId": "generated-uuid",
      "createdAt": "2025-10-11T...",
      "updatedAt": "2025-10-11T..."
    }
    // ... second meal
  ]
}
```

### 2. Get All Meal Plans

**GET** `http://localhost:3000/api/meal-plans`

**Headers:**

```
Authorization: Bearer YOUR_FIREBASE_TOKEN
```

**Expected Response (200):**

```json
[
  {
    "id": "uuid",
    "title": "High Protein Muscle Building Plan",
    "description": "A comprehensive meal plan...",
    "category": "muscle_building",
    "imageUrl": "https://example.com/image.jpg",
    "userId": "firebase-user-id",
    "createdAt": "2025-10-11T...",
    "updatedAt": "2025-10-11T...",
    "meals": [...]
  }
]
```

### 3. Get Specific Meal Plan

**GET** `http://localhost:3000/api/meal-plans/{mealPlanId}`

**Headers:**

```
Authorization: Bearer YOUR_FIREBASE_TOKEN
```

### 4. Update Meal Plan

**PUT** `http://localhost:3000/api/meal-plans/{mealPlanId}`

**Headers:**

```
Authorization: Bearer YOUR_FIREBASE_TOKEN
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "title": "Updated Meal Plan Title",
  "description": "Updated description",
  "category": "weight_loss",
  "imageUrl": "https://example.com/new-image.jpg"
}
```

### 5. Delete Meal Plan

**DELETE** `http://localhost:3000/api/meal-plans/{mealPlanId}`

**Headers:**

```
Authorization: Bearer YOUR_FIREBASE_TOKEN
```

## Individual Meal Endpoints

### 1. Get Meals for a Meal Plan

**GET** `http://localhost:3000/api/meals/meal-plan/{mealPlanId}/meals`

**Headers:**

```
Authorization: Bearer YOUR_FIREBASE_TOKEN
```

### 2. Create Individual Meal

**POST** `http://localhost:3000/api/meals`

**Headers:**

```
Authorization: Bearer YOUR_FIREBASE_TOKEN
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "name": "Post-Workout Shake",
  "description": "High protein shake for post-workout recovery",
  "calories": 300,
  "protein": 40,
  "carbs": 20,
  "fat": 5,
  "ingredients": ["Whey protein", "Banana", "Almond milk", "Honey"],
  "instructions": "Blend all ingredients until smooth",
  "mealType": "snack",
  "preparationTime": 5,
  "imageUrl": "https://example.com/protein-shake.jpg",
  "mealPlanId": "existing-meal-plan-uuid"
}
```

### 3. Update Individual Meal

**PUT** `http://localhost:3000/api/meals/{mealId}`

### 4. Delete Individual Meal

**DELETE** `http://localhost:3000/api/meals/{mealId}`

## Testing Scenarios

### Scenario 1: Full Meal Plan Creation Flow

1. Create a new meal plan with nested meals
2. Verify the meal plan was created with correct relationships
3. Get all meal plans to confirm it appears in the list
4. Get the specific meal plan by ID

### Scenario 2: Meal Management

1. Create a meal plan without meals
2. Add individual meals to the plan using the meals endpoint
3. Update a specific meal
4. Delete a meal from the plan

### Scenario 3: Error Handling

1. Try to access endpoints without authentication (should get 401)
2. Try to access non-existent meal plan (should get 404)
3. Try to create meal plan with invalid data (should get 400)

## Common Response Codes

- `200`: Success (GET, PUT)
- `201`: Created (POST)
- `204`: No Content (DELETE)
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing/invalid token)
- `404`: Not Found (resource doesn't exist)
- `500`: Internal Server Error

## Tips for Testing

1. **Save your Firebase token as a Postman variable:**

   - Go to Environment or Collection variables
   - Create a variable named `firebase_token`
   - Use `{{firebase_token}}` in Authorization headers

2. **Save the base URL as a variable:**

   - Create `base_url` variable with value `http://localhost:3000`
   - Use `{{base_url}}/api/meal-plans` in requests

3. **Save created IDs for subsequent tests:**

   - After creating a meal plan, save the returned ID
   - Use it in GET, PUT, DELETE requests

4. **Test in sequence:**

   - Create → Read → Update → Delete
   - Verify each step returns expected data

5. **Check server logs:**
   - Monitor your terminal running the server
   - Look for any error messages or debugging info
