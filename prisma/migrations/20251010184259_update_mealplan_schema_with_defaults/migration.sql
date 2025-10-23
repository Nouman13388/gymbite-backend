/*
  Warnings:

  - You are about to drop the column `calories` on the `MealPlan` table. All the data in the column will be lost.
  - You are about to drop the column `carbs` on the `MealPlan` table. All the data in the column will be lost.
  - You are about to drop the column `fat` on the `MealPlan` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `MealPlan` table. All the data in the column will be lost.
  - You are about to drop the column `protein` on the `MealPlan` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."MealType" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK');

-- AlterTable
ALTER TABLE "public"."MealPlan" DROP COLUMN "calories",
DROP COLUMN "carbs",
DROP COLUMN "fat",
DROP COLUMN "name",
DROP COLUMN "protein",
ADD COLUMN     "category" VARCHAR(100) NOT NULL DEFAULT 'General',
ADD COLUMN     "imageUrl" VARCHAR(500),
ADD COLUMN     "title" VARCHAR(255) NOT NULL DEFAULT 'Untitled Meal Plan';

-- CreateTable
CREATE TABLE "public"."Meal" (
    "id" SERIAL NOT NULL,
    "mealPlanId" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "type" "public"."MealType" NOT NULL,
    "ingredients" TEXT[],
    "calories" INTEGER NOT NULL,
    "protein" INTEGER NOT NULL DEFAULT 0,
    "imageUrl" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Meal" ADD CONSTRAINT "Meal_mealPlanId_fkey" FOREIGN KEY ("mealPlanId") REFERENCES "public"."MealPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
