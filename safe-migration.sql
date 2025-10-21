-- Safe Migration Script for Production
-- This script handles existing data and avoids NOT NULL errors

-- Part 1: Handle Appointment table updates safely
DO $$ 
BEGIN
  -- Add duration column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'Appointment' 
    AND column_name = 'duration'
  ) THEN
    ALTER TABLE "public"."Appointment" ADD COLUMN "duration" INTEGER NOT NULL DEFAULT 60;
  END IF;

  -- Add meetingUrl column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'Appointment' 
    AND column_name = 'meetingUrl'
  ) THEN
    ALTER TABLE "public"."Appointment" ADD COLUMN "meetingUrl" VARCHAR(500);
  END IF;

  -- Add type column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'Appointment' 
    AND column_name = 'type'
  ) THEN
    ALTER TABLE "public"."Appointment" ADD COLUMN "type" VARCHAR(50) NOT NULL DEFAULT 'in-person';
  END IF;

  -- Add updatedAt column if it doesn't exist (with default)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'Appointment' 
    AND column_name = 'updatedAt'
  ) THEN
    ALTER TABLE "public"."Appointment" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
  END IF;
END $$;

-- Part 2: Handle WorkoutPlan table updates safely
DO $$ 
BEGIN
  -- Add new columns first (safe operation)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'WorkoutPlan' 
    AND column_name = 'category'
  ) THEN
    ALTER TABLE "public"."WorkoutPlan" ADD COLUMN "category" VARCHAR(100) NOT NULL DEFAULT 'Full Body';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'WorkoutPlan' 
    AND column_name = 'description'
  ) THEN
    ALTER TABLE "public"."WorkoutPlan" ADD COLUMN "description" TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'WorkoutPlan' 
    AND column_name = 'difficulty'
  ) THEN
    ALTER TABLE "public"."WorkoutPlan" ADD COLUMN "difficulty" VARCHAR(50) NOT NULL DEFAULT 'Intermediate';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'WorkoutPlan' 
    AND column_name = 'duration'
  ) THEN
    ALTER TABLE "public"."WorkoutPlan" ADD COLUMN "duration" INTEGER NOT NULL DEFAULT 30;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'WorkoutPlan' 
    AND column_name = 'imageUrl'
  ) THEN
    ALTER TABLE "public"."WorkoutPlan" ADD COLUMN "imageUrl" VARCHAR(500);
  END IF;

  -- Add title column with default value first
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'WorkoutPlan' 
    AND column_name = 'title'
  ) THEN
    -- Add with default first to avoid NOT NULL error
    ALTER TABLE "public"."WorkoutPlan" ADD COLUMN "title" VARCHAR(255) NOT NULL DEFAULT 'Untitled Workout';
    
    -- Copy data from name to title if name exists
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'WorkoutPlan' 
      AND column_name = 'name'
    ) THEN
      UPDATE "public"."WorkoutPlan" SET "title" = "name" WHERE "name" IS NOT NULL;
    END IF;
  END IF;

  -- Handle exercises column type change
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'WorkoutPlan' 
    AND column_name = 'exercises'
    AND data_type != 'jsonb'
  ) THEN
    -- Create a temporary column
    ALTER TABLE "public"."WorkoutPlan" ADD COLUMN "exercises_new" JSONB;
    
    -- Try to convert existing data (comma-separated string to JSON array)
    UPDATE "public"."WorkoutPlan" 
    SET "exercises_new" = 
      CASE 
        WHEN "exercises" IS NULL OR "exercises" = '' THEN '[]'::jsonb
        ELSE jsonb_build_array(jsonb_build_object('name', "exercises", 'sets', 0, 'reps', 0))
      END;
    
    -- Drop old column and rename new one
    ALTER TABLE "public"."WorkoutPlan" DROP COLUMN "exercises";
    ALTER TABLE "public"."WorkoutPlan" RENAME COLUMN "exercises_new" TO "exercises";
    
    -- Set NOT NULL constraint
    ALTER TABLE "public"."WorkoutPlan" ALTER COLUMN "exercises" SET NOT NULL;
  END IF;

  -- Drop old columns if they exist
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'WorkoutPlan' 
    AND column_name = 'name'
  ) THEN
    ALTER TABLE "public"."WorkoutPlan" DROP COLUMN "name";
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'WorkoutPlan' 
    AND column_name = 'reps'
  ) THEN
    ALTER TABLE "public"."WorkoutPlan" DROP COLUMN "reps";
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'WorkoutPlan' 
    AND column_name = 'sets'
  ) THEN
    ALTER TABLE "public"."WorkoutPlan" DROP COLUMN "sets";
  END IF;
END $$;

-- Part 3: Handle Consultation table (if it exists)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'Consultation'
  ) THEN
    -- Drop foreign key constraints first
    ALTER TABLE "public"."Consultation" DROP CONSTRAINT IF EXISTS "Consultation_clientId_fkey";
    ALTER TABLE "public"."Consultation" DROP CONSTRAINT IF EXISTS "Consultation_trainerId_fkey";
    
    -- Drop the table
    DROP TABLE "public"."Consultation";
  END IF;
END $$;
