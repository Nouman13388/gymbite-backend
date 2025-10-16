-- Production Database Fix Migration
-- This script fixes the null values issue in the MealPlan table

-- Step 1: Update any existing null values in the name column (if it exists)
UPDATE "MealPlan" 
SET "name" = COALESCE("title", 'Untitled Meal Plan') 
WHERE "name" IS NULL;

-- Step 2: Update any existing null values in the title column
UPDATE "MealPlan" 
SET "title" = COALESCE("name", 'Untitled Meal Plan') 
WHERE "title" IS NULL;

-- Step 3: Ensure all required fields have non-null values
UPDATE "MealPlan" 
SET 
  "title" = 'Untitled Meal Plan'
WHERE "title" IS NULL OR "title" = '';

-- Step 4: Update category if needed
UPDATE "MealPlan" 
SET "category" = 'General'
WHERE "category" IS NULL OR "category" = '';

-- Step 5: Set default values for numeric fields if they exist and are null
UPDATE "MealPlan" 
SET 
  "calories" = 0,
  "protein" = 0,
  "fat" = 0,
  "carbs" = 0
WHERE 
  "calories" IS NULL OR 
  "protein" IS NULL OR 
  "fat" IS NULL OR 
  "carbs" IS NULL;