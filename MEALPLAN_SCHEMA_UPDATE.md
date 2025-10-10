# Updated MealPlan Schema Documentation

## Overview

The MealPlan schema has been updated to match your Flutter frontend requirements, providing a more structured and comprehensive approach to meal planning with individual meals and better organization.

## Schema Changes

### MealPlan Model

**Updated Fields:**

```prisma
model MealPlan {
  id          Int      @id @default(autoincrement())
  userId      Int                                       // Trainer who created it
  title       String   @default("Untitled Meal Plan")  // Title/name of the meal plan
  description String?                                   // Optional description
  category    String   @default("General")              // Category (e.g., "Weight Loss", "Muscle Gain")
  imageUrl    String?                                   // URL of the meal plan image
  calories    Int      @default(0)                      // Total calories
  protein     Decimal  @default(0)                      // Total protein in grams
  fat         Decimal  @default(0)                      // Total fat in grams
  carbs       Decimal  @default(0)                      // Total carbs in grams
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  meals       Meal[]                                    // One-to-many relationship with meals
}
```

### New Meal Model

**Individual Meals:**

```prisma
model Meal {
  id          Int      @id @default(autoincrement())
  mealPlanId  Int                                       // Foreign key to MealPlan
  name        String                                    // Name of the meal
  description String?                                   // Optional description
  type        String   @default("Breakfast")            // Type: "Breakfast", "Lunch", "Dinner", "Snack"
  ingredients String[] @default([])                     // Array of ingredients
  calories    Int      @default(0)                      // Calories in this meal
  protein     Int      @default(0)                      // Protein content in grams
  imageUrl    String?                                   // URL of the meal image
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  mealPlan    MealPlan @relation(fields: [mealPlanId], references: [id], onDelete: Cascade)
}
```

## API Endpoints

### MealPlan Endpoints

- **GET /api/meal-plans** - Get all meal plans (includes meals and user info)
- **GET /api/meal-plans/:id** - Get specific meal plan (includes meals and user info)
- **POST /api/meal-plans** - Create new meal plan
- **PUT /api/meal-plans/:id** - Update meal plan
- **DELETE /api/meal-plans/:id** - Delete meal plan

### Meal Endpoints

- **GET /api/meals/meal-plan/:mealPlanId/meals** - Get all meals for a meal plan
- **GET /api/meals/:id** - Get specific meal
- **POST /api/meals** - Create new meal
- **PUT /api/meals/:id** - Update meal
- **DELETE /api/meals/:id** - Delete meal

## API Request/Response Examples

### Create MealPlan

**Request:**

```json
POST /api/meal-plans
{
  "userId": 1,
  "title": "Weight Loss Meal Plan",
  "description": "A comprehensive meal plan for healthy weight loss",
  "category": "Weight Loss",
  "imageUrl": "https://example.com/meal-plan.jpg",
  "calories": 1500,
  "protein": 120,
  "fat": 50,
  "carbs": 150,
  "meals": [
    {
      "name": "Protein Oatmeal",
      "description": "Healthy breakfast with oats and protein",
      "type": "Breakfast",
      "ingredients": ["oats", "protein powder", "berries", "almonds"],
      "calories": 350,
      "protein": 25,
      "imageUrl": "https://example.com/oatmeal.jpg"
    },
    {
      "name": "Grilled Chicken Salad",
      "description": "Fresh salad with grilled chicken",
      "type": "Lunch",
      "ingredients": ["chicken breast", "mixed greens", "tomatoes", "cucumber"],
      "calories": 400,
      "protein": 35,
      "imageUrl": "https://example.com/chicken-salad.jpg"
    }
  ]
}
```

**Response:**

```json
{
  "id": 1,
  "userId": 1,
  "title": "Weight Loss Meal Plan",
  "description": "A comprehensive meal plan for healthy weight loss",
  "category": "Weight Loss",
  "imageUrl": "https://example.com/meal-plan.jpg",
  "calories": 1500,
  "protein": "120",
  "fat": "50",
  "carbs": "150",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "user": {
    "id": 1,
    "name": "Trainer Name",
    "email": "trainer@example.com"
  },
  "meals": [
    {
      "id": 1,
      "mealPlanId": 1,
      "name": "Protein Oatmeal",
      "description": "Healthy breakfast with oats and protein",
      "type": "Breakfast",
      "ingredients": ["oats", "protein powder", "berries", "almonds"],
      "calories": 350,
      "protein": 25,
      "imageUrl": "https://example.com/oatmeal.jpg",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "mealPlanId": 1,
      "name": "Grilled Chicken Salad",
      "description": "Fresh salad with grilled chicken",
      "type": "Lunch",
      "ingredients": ["chicken breast", "mixed greens", "tomatoes", "cucumber"],
      "calories": 400,
      "protein": 35,
      "imageUrl": "https://example.com/chicken-salad.jpg",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## Frontend Integration

### Flutter Model Mapping

Your Flutter `MealPlanModel.fromJson` should work with minimal changes:

```dart
factory MealPlanModel.fromJson(Map<String, dynamic> json) {
  List<Meal> parsedMeals = [];
  if (json['meals'] != null && json['meals'] is List) {
    parsedMeals = (json['meals'] as List).map((m) => Meal.fromJson(m)).toList();
  }

  return MealPlanModel(
    id: json['id'] ?? 0,
    userId: json['userId'] ?? 0,
    title: json['title'] ?? 'Unnamed Meal Plan', // Changed from 'name' to 'title'
    description: json['description'] ?? 'No description available',
    category: json['category'] ?? 'General',
    meals: parsedMeals,
    imageUrl: json['imageUrl'] ?? 'assets/images/Meals.png',
    createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : null,
    updatedAt: json['updatedAt'] != null ? DateTime.parse(json['updatedAt']) : null,
  );
}
```

### Dashboard TypeScript Types

Updated types are already available in `dashboard/src/types/api.ts`:

```typescript
export interface MealPlan {
  id: number;
  userId: number;
  title: string;
  description?: string;
  category: string;
  imageUrl?: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  meals?: Meal[];
}

export interface Meal {
  id: number;
  mealPlanId: number;
  name: string;
  description?: string;
  type: string;
  ingredients: string[];
  calories: number;
  protein: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Migration Applied

The database schema has been successfully updated with:

- ✅ New Meal model with proper relationships
- ✅ Updated MealPlan model with title, category, imageUrl fields
- ✅ Proper default values and constraints
- ✅ Cascade deletion relationships
- ✅ Array support for ingredients

## Key Benefits

1. **Structured Data**: Individual meals are now separate entities with their own properties
2. **Flexible Categories**: String-based categories allow for easy expansion
3. **Rich Metadata**: Support for images, detailed descriptions, and nutritional info
4. **Frontend Compatibility**: Direct mapping to your Flutter models
5. **Scalable Design**: Easy to extend with additional meal properties or relationships

## Notes

- The `userId` in MealPlan represents the trainer who created the meal plan
- Individual meals can have their own images, ingredients, and nutritional information
- Categories are flexible strings, allowing for custom categorization
- All relationships use cascade deletion for data integrity
- The API includes user information and related meals in responses for convenience
