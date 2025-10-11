# Vercel Database Reset & Backend Implementation Guide

## 🚀 Vercel Configuration for Database Reset

### 1. Updated Vercel Configuration

Your `vercel.json` should include build commands for database operations:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/src/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/src/index.ts"
    }
  ],
  "buildCommand": "prisma generate && prisma migrate deploy"
}
```

### 2. Environment Variables Setup

**Required Vercel Environment Variables:**

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@host:5432/database
DIRECT_URL=postgresql://username:password@host:5432/database

# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc123

# Firebase Admin
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Server Configuration
NODE_ENV=production
PORT=3000
```

### 3. Database Reset Commands

**For Development (Local):**
```bash
# Reset local database
npx prisma migrate reset --force

# Or step by step
npx prisma db push --force-reset
npx prisma migrate deploy
npx prisma generate
```

**For Production (Vercel):**
```bash
# Using Vercel CLI
vercel env pull .env.production
DATABASE_URL="production-url" npx prisma migrate reset --force
DATABASE_URL="production-url" npx prisma migrate deploy
```

## 🔧 Backend Implementation Guide

### 1. Updated Package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "start": "node dist/index.js",
    "dev:server": "tsx watch src/index.ts",
    "build:server": "tsc",
    "build": "npm run build:server",
    "postinstall": "prisma generate",
    "vercel-build": "prisma generate && prisma migrate deploy && npm run build:server",
    "db:reset": "prisma migrate reset --force",
    "db:deploy": "prisma migrate deploy",
    "db:generate": "prisma generate",
    "db:studio": "prisma studio"
  }
}
```

### 2. Meal Plan Controller Implementation

**File: `src/controllers/mealPlanController.ts`**

```typescript
import { Request, Response } from 'express';
import { prisma } from '../database/prisma.js';

// Get all meal plans for user
export const getMealPlans = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;
    
    const user = await prisma.user.findUnique({
      where: { firebaseUid: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const mealPlans = await prisma.mealPlan.findMany({
      where: { userId: user.id },
      include: {
        meals: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(mealPlans);
  } catch (error) {
    console.error('Error fetching meal plans:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single meal plan
export const getMealPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.uid;

    const user = await prisma.user.findUnique({
      where: { firebaseUid: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const mealPlan = await prisma.mealPlan.findFirst({
      where: { 
        id: parseInt(id),
        userId: user.id
      },
      include: {
        meals: {
          orderBy: { createdAt: 'asc' }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!mealPlan) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }

    res.json(mealPlan);
  } catch (error) {
    console.error('Error fetching meal plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create meal plan with optional nested meals
export const createMealPlan = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;
    const { title, description, category, imageUrl, meals = [] } = req.body;

    const user = await prisma.user.findUnique({
      where: { firebaseUid: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const mealPlan = await prisma.mealPlan.create({
      data: {
        userId: user.id,
        title: title || 'Untitled Meal Plan',
        description,
        category: category || 'General',
        imageUrl,
        meals: {
          create: meals.map((meal: any) => ({
            name: meal.name,
            description: meal.description,
            type: meal.mealType || meal.type || 'Breakfast',
            ingredients: meal.ingredients || [],
            calories: meal.calories || 0,
            protein: meal.protein || 0,
            imageUrl: meal.imageUrl
          }))
        }
      },
      include: {
        meals: {
          orderBy: { createdAt: 'asc' }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json(mealPlan);
  } catch (error) {
    console.error('Error creating meal plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update meal plan
export const updateMealPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.uid;
    const { title, description, category, imageUrl } = req.body;

    const user = await prisma.user.findUnique({
      where: { firebaseUid: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existingMealPlan = await prisma.mealPlan.findFirst({
      where: { 
        id: parseInt(id),
        userId: user.id
      }
    });

    if (!existingMealPlan) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }

    const mealPlan = await prisma.mealPlan.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        category,
        imageUrl
      },
      include: {
        meals: {
          orderBy: { createdAt: 'asc' }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json(mealPlan);
  } catch (error) {
    console.error('Error updating meal plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete meal plan
export const deleteMealPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.uid;

    const user = await prisma.user.findUnique({
      where: { firebaseUid: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existingMealPlan = await prisma.mealPlan.findFirst({
      where: { 
        id: parseInt(id),
        userId: user.id
      }
    });

    if (!existingMealPlan) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }

    await prisma.mealPlan.delete({
      where: { id: parseInt(id) }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting meal plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
```

### 3. Individual Meal Controller Implementation

**File: `src/controllers/mealController.ts`**

```typescript
import { Request, Response } from 'express';
import { prisma } from '../database/prisma.js';

// Get meals for a meal plan
export const getMealsForMealPlan = async (req: Request, res: Response) => {
  try {
    const { mealPlanId } = req.params;
    const userId = req.user?.uid;

    const user = await prisma.user.findUnique({
      where: { firebaseUid: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify meal plan belongs to user
    const mealPlan = await prisma.mealPlan.findFirst({
      where: {
        id: parseInt(mealPlanId),
        userId: user.id
      }
    });

    if (!mealPlan) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }

    const meals = await prisma.meal.findMany({
      where: { mealPlanId: parseInt(mealPlanId) },
      include: {
        mealPlan: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    res.json(meals);
  } catch (error) {
    console.error('Error fetching meals:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create individual meal
export const createMeal = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;
    const { 
      name, 
      description, 
      mealType, 
      type,
      ingredients, 
      calories, 
      protein, 
      imageUrl, 
      mealPlanId 
    } = req.body;

    const user = await prisma.user.findUnique({
      where: { firebaseUid: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify meal plan belongs to user
    const mealPlan = await prisma.mealPlan.findFirst({
      where: {
        id: parseInt(mealPlanId),
        userId: user.id
      }
    });

    if (!mealPlan) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }

    const meal = await prisma.meal.create({
      data: {
        mealPlanId: parseInt(mealPlanId),
        name,
        description,
        type: mealType || type || 'Breakfast',
        ingredients: ingredients || [],
        calories: calories || 0,
        protein: protein || 0,
        imageUrl
      },
      include: {
        mealPlan: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    res.status(201).json(meal);
  } catch (error) {
    console.error('Error creating meal:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single meal
export const getMeal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.uid;

    const user = await prisma.user.findUnique({
      where: { firebaseUid: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const meal = await prisma.meal.findFirst({
      where: { 
        id: parseInt(id),
        mealPlan: {
          userId: user.id
        }
      },
      include: {
        mealPlan: {
          select: {
            id: true,
            title: true,
            userId: true
          }
        }
      }
    });

    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    res.json(meal);
  } catch (error) {
    console.error('Error fetching meal:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update meal
export const updateMeal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.uid;
    const { 
      name, 
      description, 
      mealType,
      type, 
      ingredients, 
      calories, 
      protein, 
      imageUrl 
    } = req.body;

    const user = await prisma.user.findUnique({
      where: { firebaseUid: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify meal belongs to user
    const existingMeal = await prisma.meal.findFirst({
      where: { 
        id: parseInt(id),
        mealPlan: {
          userId: user.id
        }
      }
    });

    if (!existingMeal) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    const meal = await prisma.meal.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        type: mealType || type,
        ingredients,
        calories,
        protein,
        imageUrl
      },
      include: {
        mealPlan: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    res.json(meal);
  } catch (error) {
    console.error('Error updating meal:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete meal
export const deleteMeal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.uid;

    const user = await prisma.user.findUnique({
      where: { firebaseUid: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify meal belongs to user
    const existingMeal = await prisma.meal.findFirst({
      where: { 
        id: parseInt(id),
        mealPlan: {
          userId: user.id
        }
      }
    });

    if (!existingMeal) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    await prisma.meal.delete({
      where: { id: parseInt(id) }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting meal:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
```

### 4. Route Definitions

**File: `src/routes/mealPlanRoutes.ts`**

```typescript
import { Router } from 'express';
import {
  getMealPlans,
  getMealPlan,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan
} from '../controllers/mealPlanController.js';
import { verifyFirebaseToken } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(verifyFirebaseToken);

// Meal plan routes
router.get('/', getMealPlans);
router.get('/:id', getMealPlan);
router.post('/', createMealPlan);
router.put('/:id', updateMealPlan);
router.delete('/:id', deleteMealPlan);

export default router;
```

**File: `src/routes/mealRoutes.ts`**

```typescript
import { Router } from 'express';
import {
  getMealsForMealPlan,
  createMeal,
  getMeal,
  updateMeal,
  deleteMeal
} from '../controllers/mealController.js';
import { verifyFirebaseToken } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(verifyFirebaseToken);

// Individual meal routes
router.get('/meal-plan/:mealPlanId/meals', getMealsForMealPlan);
router.post('/', createMeal);
router.get('/:id', getMeal);
router.put('/:id', updateMeal);
router.delete('/:id', deleteMeal);

export default router;
```

## 🚀 Deployment Commands

### 1. Local Development Reset
```bash
# Reset and rebuild everything
npm run db:reset
npm run dev:server
```

### 2. Production Deployment
```bash
# Commit changes
git add .
git commit -m "Update database schema and endpoints"
git push origin stage

# Force Vercel redeploy if needed
git commit --allow-empty -m "Force redeploy"
git push origin stage
```

### 3. Manual Production Database Reset
```bash
# Get production DATABASE_URL from Vercel
# Then run:
DATABASE_URL="production-url" npx prisma migrate reset --force
DATABASE_URL="production-url" npx prisma migrate deploy
```

## ✅ Verification Steps

1. **Test locally:**
   ```bash
   npm run dev:server
   # Test endpoints with Postman
   ```

2. **Check Vercel deployment:**
   - Monitor build logs for migration success
   - Test production endpoints

3. **Verify database schema:**
   ```bash
   npx prisma studio
   # Check that MealPlan and Meal tables exist with correct structure
   ```

This guide provides everything needed to reset your database and implement the new meal plan endpoints properly!