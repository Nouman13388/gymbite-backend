# 🔧 Production Migration Fix Guide

**Issue**: Migration `20251020193601_enhance_workout_plan_and_consolidate_appointments` failed during Vercel deployment.

**Error**:

```
P3009: migrate found failed migrations in the target database
The `20251020193601_enhance_workout_plan_and_consolidate_appointments` migration
started at 2025-10-21 09:51:05.109696 UTC failed
```

---

## 🎯 Quick Fix Options

### Option 1: Reset Failed Migration (Recommended)

This marks the failed migration as rolled back so it can be re-applied.

#### Step 1: Connect to Production Database

Use your database client (psql, pgAdmin, or Vercel Postgres dashboard) to run:

```sql
-- Check current migration status
SELECT migration_name, finished_at, applied_steps_count, logs
FROM _prisma_migrations
WHERE migration_name = '20251020193601_enhance_workout_plan_and_consolidate_appointments'
ORDER BY started_at DESC;

-- Delete the failed migration record
DELETE FROM _prisma_migrations
WHERE migration_name = '20251020193601_enhance_workout_plan_and_consolidate_appointments'
  AND finished_at IS NULL;
```

#### Step 2: Redeploy on Vercel

```bash
# Trigger a new deployment
git commit --allow-empty -m "Trigger redeploy after migration fix"
git push origin stage
```

---

### Option 2: Manual Migration Execution

If Option 1 doesn't work, manually apply the migration SQL.

#### Step 1: Get Migration SQL

The migration file is located at:

```
prisma/migrations/20251020193601_enhance_workout_plan_and_consolidate_appointments/migration.sql
```

#### Step 2: Execute SQL Manually

Run the SQL directly in your production database:

```sql
-- Start a transaction
BEGIN;

-- Create enum first
CREATE TYPE "AppointmentType" AS ENUM ('IN_PERSON', 'VIDEO_CALL', 'PHONE_CALL', 'CHAT');

-- Update WorkoutPlan table
ALTER TABLE "WorkoutPlan"
  RENAME COLUMN "name" TO "title";

ALTER TABLE "WorkoutPlan"
  ADD COLUMN "description" TEXT,
  ADD COLUMN "category" VARCHAR(255) DEFAULT 'Full Body',
  ADD COLUMN "duration" INTEGER DEFAULT 30,
  ADD COLUMN "difficulty" VARCHAR(255) DEFAULT 'Intermediate',
  ADD COLUMN "imageUrl" VARCHAR(500);

-- Change exercises column type (if needed - be careful with data)
-- This might need manual intervention if there's existing data
-- ALTER TABLE "WorkoutPlan" ALTER COLUMN "exercises" TYPE JSONB USING exercises::jsonb;

-- Update Appointment table (if Consultation existed)
ALTER TABLE "Appointment"
  ADD COLUMN IF NOT EXISTS "type" "AppointmentType" DEFAULT 'IN_PERSON',
  ADD COLUMN IF NOT EXISTS "duration" INTEGER DEFAULT 60,
  ADD COLUMN IF NOT EXISTS "meetingLink" VARCHAR(500),
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- Drop Consultation table if it exists
DROP TABLE IF EXISTS "Consultation" CASCADE;

-- Mark migration as complete
INSERT INTO _prisma_migrations (
  migration_name,
  finished_at,
  applied_steps_count,
  logs
) VALUES (
  '20251020193601_enhance_workout_plan_and_consolidate_appointments',
  NOW(),
  1,
  'Manually applied after failed deployment'
);

-- Commit transaction
COMMIT;
```

#### Step 3: Verify

```sql
-- Check WorkoutPlan structure
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'WorkoutPlan';

-- Check Appointment structure
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'Appointment';

-- Verify migration record
SELECT * FROM _prisma_migrations
WHERE migration_name = '20251020193601_enhance_workout_plan_and_consolidate_appointments';
```

---

### Option 3: Fresh Migration Approach (If Database is Empty/Test)

If your production database doesn't have critical data:

#### Step 1: Reset Database (DANGER!)

```sql
-- ⚠️ WARNING: This deletes ALL data!
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

#### Step 2: Deploy Fresh Migrations

```bash
# Redeploy - Prisma will apply all migrations from scratch
git commit --allow-empty -m "Redeploy with fresh migrations"
git push origin stage
```

---

## 🔍 Root Cause Analysis

The migration likely failed due to:

1. **Existing Data Conflicts**:

   - WorkoutPlan table had data with NULL values not compatible with new constraints
   - Column rename from `name` to `title` failed if app was still using old column

2. **Enum Creation Issues**:

   - AppointmentType enum creation failed if it already existed
   - Type conflicts with existing data

3. **Consultation Table**:

   - Foreign key constraints prevented table deletion
   - Active references from other tables

4. **Concurrent Deployment**:
   - Another deployment might have started the migration simultaneously

---

## ✅ Prevention for Future Migrations

### 1. Use Prisma Migrate Deploy Correctly

Update `vercel.json` to handle migrations safely:

```json
{
  "buildCommand": "prisma generate && prisma migrate deploy && npm run build:client && npm run build:server",
  "env": {
    "PRISMA_GENERATE_SKIP_AUTOINSTALL": "true"
  }
}
```

### 2. Test Migrations in Staging First

```bash
# Create staging environment
DATABASE_URL="your_staging_db_url" npx prisma migrate deploy

# Test application
npm run dev

# If successful, deploy to production
git push origin stage
```

### 3. Make Migrations Idempotent

Add safety checks to migration SQL:

```sql
-- Check if column exists before adding
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'WorkoutPlan' AND column_name = 'description'
  ) THEN
    ALTER TABLE "WorkoutPlan" ADD COLUMN "description" TEXT;
  END IF;
END $$;
```

### 4. Separate Risky Changes

Instead of one big migration, split into smaller steps:

**Migration 1**: Add new columns (safe)

```sql
ALTER TABLE "WorkoutPlan" ADD COLUMN "description" TEXT;
```

**Migration 2**: Rename columns (after ensuring app compatibility)

```sql
ALTER TABLE "WorkoutPlan" RENAME COLUMN "name" TO "title";
```

**Migration 3**: Drop old tables (after data migration)

```sql
DROP TABLE IF EXISTS "Consultation";
```

---

## 🚀 Recommended Action Plan

### Immediate Fix (5 minutes):

1. **Connect to production database**
2. **Delete failed migration record** (Option 1)
3. **Trigger Vercel redeploy**

### If That Fails (15 minutes):

1. **Read migration SQL file**
2. **Manually execute SQL** (Option 2)
3. **Mark migration as complete**
4. **Redeploy**

### If Database Has No Critical Data (2 minutes):

1. **Reset database schema** (Option 3)
2. **Redeploy for fresh migrations**

---

## 📞 Database Access

### Vercel Postgres

1. Go to your Vercel project dashboard
2. Navigate to Storage → Postgres
3. Click "Query" to open SQL editor
4. Run the fix SQL commands

### Connection String

Get from Vercel environment variables:

```
DATABASE_URL="postgresql://user:pass@host:5432/database"
```

Use with psql:

```bash
psql $DATABASE_URL
```

---

## 📝 Verification Steps

After applying the fix:

### 1. Check Migration Status

```bash
# In Vercel deployment logs, look for:
✔ Generated Prisma Client
✔ No pending migrations to apply
```

### 2. Verify Database Schema

```sql
-- WorkoutPlan should have new columns
\d "WorkoutPlan"

-- Appointment should have enum type
\d "Appointment"

-- Consultation should NOT exist
\d "Consultation"
```

### 3. Test API Endpoints

```bash
# Test WorkoutPlan creation
curl -X POST "https://your-app.vercel.app/api/workout-plans" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "title": "Test Workout",
    "description": "Test",
    "category": "Strength",
    "duration": 60,
    "difficulty": "Beginner",
    "exercises": []
  }'

# Test Appointment creation with enum
curl -X POST "https://your-app.vercel.app/api/appointments" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": 1,
    "trainerId": 1,
    "appointmentTime": "2025-10-25T10:00:00Z",
    "type": "VIDEO_CALL",
    "status": "scheduled"
  }'
```

---

## 🆘 Still Having Issues?

### Check Prisma Migration Status

```bash
npx prisma migrate status --schema=./prisma/schema.prisma
```

### View Migration History

```sql
SELECT migration_name, finished_at, applied_steps_count, logs
FROM _prisma_migrations
ORDER BY started_at DESC
LIMIT 10;
```

### Contact Support

- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Prisma Discord**: [pris.ly/discord](https://pris.ly/discord)
- **Check Logs**: Vercel Dashboard → Deployments → View Logs

---

## ✅ Success Indicators

You'll know it's fixed when:

1. ✅ Vercel deployment completes successfully
2. ✅ No migration errors in logs
3. ✅ API endpoints respond correctly
4. ✅ Database schema matches your Prisma schema
5. ✅ No failed migrations in `_prisma_migrations` table

---

**Last Updated**: October 21, 2025  
**Migration**: `20251020193601_enhance_workout_plan_and_consolidate_appointments`  
**Status**: Resolution guide complete
