/*
  Warnings:

  - The `category` column on the `MealPlan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `name` to the `MealPlan` table without a default value. This is not possible if the table is not empty.

*/

-- First, update any existing null values in title column
UPDATE "public"."MealPlan" SET "title" = 'Untitled Meal Plan' WHERE "title" IS NULL OR "title" = '';

-- CreateEnum
CREATE TYPE "public"."MealPlanCategory" AS ENUM ('WEIGHT_LOSS', 'MUSCLE_GAIN', 'MAINTENANCE', 'GENERAL', 'KETO', 'VEGETARIAN', 'VEGAN');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."MealType" ADD VALUE 'PRE_WORKOUT';
ALTER TYPE "public"."MealType" ADD VALUE 'POST_WORKOUT';

-- AlterTable
ALTER TABLE "public"."Meal" ALTER COLUMN "type" SET DEFAULT 'BREAKFAST',
ALTER COLUMN "ingredients" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "calories" SET DEFAULT 0;

-- AlterTable - Add name column with default value first, then update it
ALTER TABLE "public"."MealPlan" 
ADD COLUMN "calories" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "carbs" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN "fat" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN "name" VARCHAR(255) NOT NULL DEFAULT 'Untitled Meal Plan',
ADD COLUMN "protein" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- Update name column with title values
UPDATE "public"."MealPlan" SET "name" = "title" WHERE "title" IS NOT NULL AND "title" != '';

-- Continue with the rest of the migration
ALTER TABLE "public"."MealPlan"
DROP COLUMN "category",
ADD COLUMN "category" "public"."MealPlanCategory" NOT NULL DEFAULT 'GENERAL',
ALTER COLUMN "title" DROP DEFAULT;
