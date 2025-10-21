/*
  Warnings:

  - You are about to drop the column `name` on the `WorkoutPlan` table. All the data in the column will be lost.
  - You are about to drop the column `reps` on the `WorkoutPlan` table. All the data in the column will be lost.
  - You are about to drop the column `sets` on the `WorkoutPlan` table. All the data in the column will be lost.
  - You are about to drop the `Consultation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `WorkoutPlan` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `exercises` on the `WorkoutPlan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."Consultation" DROP CONSTRAINT "Consultation_clientId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Consultation" DROP CONSTRAINT "Consultation_trainerId_fkey";

-- AlterTable (Appointment - Safe with defaults)
ALTER TABLE "public"."Appointment" 
  ADD COLUMN IF NOT EXISTS "duration" INTEGER NOT NULL DEFAULT 60,
  ADD COLUMN IF NOT EXISTS "meetingUrl" VARCHAR(500),
  ADD COLUMN IF NOT EXISTS "type" VARCHAR(50) NOT NULL DEFAULT 'in-person',
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable (WorkoutPlan - Safe approach)
-- Step 1: Add new columns first
ALTER TABLE "public"."WorkoutPlan" 
  ADD COLUMN IF NOT EXISTS "category" VARCHAR(100) NOT NULL DEFAULT 'Full Body',
  ADD COLUMN IF NOT EXISTS "description" TEXT,
  ADD COLUMN IF NOT EXISTS "difficulty" VARCHAR(50) NOT NULL DEFAULT 'Intermediate',
  ADD COLUMN IF NOT EXISTS "duration" INTEGER NOT NULL DEFAULT 30,
  ADD COLUMN IF NOT EXISTS "imageUrl" VARCHAR(500),
  ADD COLUMN IF NOT EXISTS "title" VARCHAR(255) NOT NULL DEFAULT 'Untitled Workout';

-- Step 2: Copy data from name to title if name column exists
UPDATE "public"."WorkoutPlan" SET "title" = "name" WHERE "name" IS NOT NULL AND "title" = 'Untitled Workout';

-- Step 3: Handle exercises column (convert string to JSONB)
-- Create temp column for new JSONB data
ALTER TABLE "public"."WorkoutPlan" ADD COLUMN IF NOT EXISTS "exercises_temp" JSONB;

-- Convert existing exercises data to JSON format
UPDATE "public"."WorkoutPlan" 
SET "exercises_temp" = 
  CASE 
    WHEN "exercises" IS NULL OR "exercises" = '' THEN '[]'::jsonb
    ELSE jsonb_build_array(jsonb_build_object('name', "exercises", 'sets', 0, 'reps', 0, 'restTime', 0))
  END
WHERE "exercises_temp" IS NULL;

-- Step 4: Drop old columns
ALTER TABLE "public"."WorkoutPlan" 
  DROP COLUMN IF EXISTS "name",
  DROP COLUMN IF EXISTS "reps",
  DROP COLUMN IF EXISTS "sets",
  DROP COLUMN IF EXISTS "exercises";

-- Step 5: Rename temp column to exercises
ALTER TABLE "public"."WorkoutPlan" RENAME COLUMN "exercises_temp" TO "exercises";

-- Step 6: Set NOT NULL constraint
ALTER TABLE "public"."WorkoutPlan" ALTER COLUMN "exercises" SET NOT NULL;

-- DropTable
DROP TABLE "public"."Consultation";
