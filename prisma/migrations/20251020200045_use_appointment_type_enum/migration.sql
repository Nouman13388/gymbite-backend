/*
  Warnings:

  - You are about to drop the column `meetingUrl` on the `Appointment` table. All the data in the column will be lost.
  - The `type` column on the `Appointment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum (safe - only if not exists)
DO $$ BEGIN
  CREATE TYPE "public"."AppointmentType" AS ENUM ('IN_PERSON', 'VIDEO_CALL', 'PHONE_CALL', 'CHAT');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- AlterTable (Safe approach with data preservation)
-- Step 1: Rename meetingUrl to meetingLink if it exists
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'Appointment' 
    AND column_name = 'meetingUrl'
  ) THEN
    ALTER TABLE "public"."Appointment" RENAME COLUMN "meetingUrl" TO "meetingLink";
  END IF;
END $$;

-- Step 2: Add meetingLink if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'Appointment' 
    AND column_name = 'meetingLink'
  ) THEN
    ALTER TABLE "public"."Appointment" ADD COLUMN "meetingLink" VARCHAR(500);
  END IF;
END $$;

-- Step 3: Convert type column to enum (preserving data)
DO $$ BEGIN
  -- Check if type is already an enum
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'Appointment' 
    AND column_name = 'type' 
    AND udt_name = 'AppointmentType'
  ) THEN
    -- Create temporary column with enum type
    ALTER TABLE "public"."Appointment" ADD COLUMN "type_new" "public"."AppointmentType" NOT NULL DEFAULT 'IN_PERSON';
    
    -- Map existing string values to enum values
    UPDATE "public"."Appointment" 
    SET "type_new" = 
      CASE 
        WHEN LOWER("type") = 'in-person' OR LOWER("type") = 'in_person' THEN 'IN_PERSON'::"public"."AppointmentType"
        WHEN LOWER("type") = 'video-call' OR LOWER("type") = 'video_call' OR LOWER("type") = 'virtual' THEN 'VIDEO_CALL'::"public"."AppointmentType"
        WHEN LOWER("type") = 'phone-call' OR LOWER("type") = 'phone_call' OR LOWER("type") = 'phone' THEN 'PHONE_CALL'::"public"."AppointmentType"
        WHEN LOWER("type") = 'chat' OR LOWER("type") = 'consultation' THEN 'CHAT'::"public"."AppointmentType"
        ELSE 'IN_PERSON'::"public"."AppointmentType"
      END;
    
    -- Drop old column and rename new one
    ALTER TABLE "public"."Appointment" DROP COLUMN "type";
    ALTER TABLE "public"."Appointment" RENAME COLUMN "type_new" TO "type";
  END IF;
END $$;
