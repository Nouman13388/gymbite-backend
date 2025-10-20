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

-- AlterTable
ALTER TABLE "public"."Appointment" ADD COLUMN     "duration" INTEGER NOT NULL DEFAULT 60,
ADD COLUMN     "meetingUrl" VARCHAR(500),
ADD COLUMN     "type" VARCHAR(50) NOT NULL DEFAULT 'in-person',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."WorkoutPlan" DROP COLUMN "name",
DROP COLUMN "reps",
DROP COLUMN "sets",
ADD COLUMN     "category" VARCHAR(100) NOT NULL DEFAULT 'Full Body',
ADD COLUMN     "description" TEXT,
ADD COLUMN     "difficulty" VARCHAR(50) NOT NULL DEFAULT 'Intermediate',
ADD COLUMN     "duration" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "imageUrl" VARCHAR(500),
ADD COLUMN     "title" VARCHAR(255) NOT NULL,
DROP COLUMN "exercises",
ADD COLUMN     "exercises" JSONB NOT NULL;

-- DropTable
DROP TABLE "public"."Consultation";
