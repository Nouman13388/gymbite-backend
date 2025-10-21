/*
  Warnings:

  - You are about to drop the column `meetingUrl` on the `Appointment` table. All the data in the column will be lost.
  - The `type` column on the `Appointment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."AppointmentType" AS ENUM ('IN_PERSON', 'VIDEO_CALL', 'PHONE_CALL', 'CHAT');

-- AlterTable
ALTER TABLE "public"."Appointment" DROP COLUMN "meetingUrl",
ADD COLUMN     "meetingLink" VARCHAR(500),
DROP COLUMN "type",
ADD COLUMN     "type" "public"."AppointmentType" NOT NULL DEFAULT 'IN_PERSON';
