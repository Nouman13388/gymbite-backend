/*
  Warnings:

  - The `type` column on the `Meal` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `name` on the `MealPlan` table. All the data in the column will be lost.
  - The `category` column on the `MealPlan` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Meal" DROP COLUMN "type",
ADD COLUMN     "type" VARCHAR(50) NOT NULL DEFAULT 'Breakfast';

-- AlterTable
ALTER TABLE "public"."MealPlan" DROP COLUMN "name",
ALTER COLUMN "title" SET DEFAULT 'Untitled Meal Plan',
DROP COLUMN "category",
ADD COLUMN     "category" VARCHAR(100) NOT NULL DEFAULT 'General';

-- DropEnum
DROP TYPE "public"."MealPlanCategory";

-- DropEnum
DROP TYPE "public"."MealType";
