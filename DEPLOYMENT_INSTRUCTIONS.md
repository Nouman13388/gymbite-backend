# 🚀 Deployment Instructions

## Changes Made

I've updated the migration files to be **production-safe** with the following improvements:

### ✅ Migration Files Updated

1. **`20251020193601_enhance_workout_plan_and_consolidate_appointments/migration.sql`**

   - Added `IF NOT EXISTS` checks to prevent errors on re-run
   - Added default values for NOT NULL columns
   - Safe column rename (name → title) with data preservation
   - Safe type conversion (exercises string → JSONB)

2. **`20251020200045_use_appointment_type_enum/migration.sql`**
   - Safe enum creation (only if not exists)
   - Data-preserving type conversion (string → enum)
   - Maps all possible string values to enum values
   - Handles meetingUrl → meetingLink rename safely

### 📋 Additional Files Created

- **`safe-migration.sql`** - Manual migration script (if needed)
- **`fix-production-migration.sql`** - SQL to delete failed migration records
- **`PRODUCTION_MIGRATION_FIX.md`** - Comprehensive troubleshooting guide

---

## 🎯 Deployment Steps

### Step 1: Clean Up Failed Migration (Required)

Before pushing, you need to clean up the failed migration in your production database.

**Option A: Via Vercel Postgres Dashboard**

1. Go to Vercel Dashboard → Storage → Postgres
2. Click "Query" button
3. Run this SQL:

```sql
DELETE FROM _prisma_migrations
WHERE migration_name IN (
  '20251020193601_enhance_workout_plan_and_consolidate_appointments',
  '20251020200045_use_appointment_type_enum'
)
AND finished_at IS NULL;
```

**Option B: Via psql Command Line**

```bash
# Connect to your production database
psql $DATABASE_URL

# Run the cleanup
DELETE FROM _prisma_migrations
WHERE migration_name IN (
  '20251020193601_enhance_workout_plan_and_consolidate_appointments',
  '20251020200045_use_appointment_type_enum'
)
AND finished_at IS NULL;

# Exit
\q
```

### Step 2: Commit and Push Changes

```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "fix: Update migrations for safe production deployment

- Add IF NOT EXISTS checks to prevent re-run errors
- Add default values for NOT NULL columns
- Safe data type conversions (string → JSONB, string → enum)
- Preserve existing data during column renames
- Handle all edge cases for AppointmentType enum mapping"

# Push to trigger deployment
git push origin stage
```

### Step 3: Monitor Deployment

1. Go to Vercel Dashboard → Deployments
2. Watch the build logs
3. Look for these success indicators:

```
✔ Generated Prisma Client
✔ 15 migrations found in prisma/migrations
✔ No pending migrations to apply  (or migrations applied successfully)
✔ Build completed successfully
```

---

## ✅ Verification After Deployment

### 1. Check Deployment Status

Visit your Vercel deployment logs and ensure:

- ✅ No migration errors
- ✅ Build completed
- ✅ Server started successfully

### 2. Test API Endpoints

**Test WorkoutPlan API:**

```bash
curl -X POST "https://your-app.vercel.app/api/workout-plans" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "title": "Test Workout",
    "description": "Testing new structure",
    "category": "Strength",
    "duration": 60,
    "difficulty": "Intermediate",
    "exercises": [{"name": "Squat", "sets": 3, "reps": 10}]
  }'
```

**Test Appointment API:**

```bash
curl -X POST "https://your-app.vercel.app/api/appointments" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": 1,
    "trainerId": 1,
    "appointmentTime": "2025-10-25T10:00:00Z",
    "type": "VIDEO_CALL",
    "status": "scheduled",
    "duration": 60,
    "meetingLink": "https://meet.google.com/abc"
  }'
```

### 3. Verify Database Schema

Connect to your database and check:

```sql
-- Check WorkoutPlan structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'WorkoutPlan'
ORDER BY ordinal_position;

-- Check Appointment structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'Appointment'
ORDER BY ordinal_position;

-- Check AppointmentType enum values
SELECT enumlabel FROM pg_enum
WHERE enumtypid = 'AppointmentType'::regtype
ORDER BY enumsortorder;

-- Verify migrations completed
SELECT migration_name, finished_at, applied_steps_count
FROM _prisma_migrations
ORDER BY finished_at DESC
LIMIT 5;
```

---

## 🆘 Troubleshooting

### If Deployment Still Fails

#### Issue: "Migration already applied"

**Solution**: The cleanup worked! No action needed.

#### Issue: "P3009 - failed migrations found"

**Solution**: Run the cleanup SQL again (Step 1)

#### Issue: "Column already exists"

**Solution**: The `IF NOT EXISTS` checks should handle this. If it still fails:

```sql
-- Check what columns exist
SELECT column_name FROM information_schema.columns
WHERE table_name = 'WorkoutPlan' OR table_name = 'Appointment';

-- Manually add missing columns only
```

#### Issue: "Type conversion failed"

**Solution**: Your data might have unexpected values. Check:

```sql
-- See existing appointment types
SELECT DISTINCT type FROM "Appointment";

-- See existing workout exercises
SELECT id, exercises FROM "WorkoutPlan" LIMIT 5;
```

### If You Need to Rollback

If something goes wrong, you can manually rollback:

```sql
-- Rollback WorkoutPlan changes
ALTER TABLE "WorkoutPlan"
  DROP COLUMN IF EXISTS "title",
  DROP COLUMN IF EXISTS "description",
  DROP COLUMN IF EXISTS "category",
  DROP COLUMN IF EXISTS "duration",
  DROP COLUMN IF EXISTS "difficulty",
  DROP COLUMN IF EXISTS "imageUrl",
  ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);

-- Rollback Appointment changes
ALTER TABLE "Appointment"
  DROP COLUMN IF EXISTS "type",
  DROP COLUMN IF EXISTS "duration",
  DROP COLUMN IF EXISTS "meetingLink",
  DROP COLUMN IF EXISTS "updatedAt";

DROP TYPE IF EXISTS "AppointmentType";

-- Delete migration records
DELETE FROM _prisma_migrations
WHERE migration_name IN (
  '20251020193601_enhance_workout_plan_and_consolidate_appointments',
  '20251020200045_use_appointment_type_enum'
);
```

---

## 📊 Expected Results

### Before Migration

```
WorkoutPlan: name, exercises (string), userId
Appointment: clientId, trainerId, appointmentTime, status, notes
Consultation: [separate table]
```

### After Migration

```
WorkoutPlan: title, description, category, duration, difficulty, imageUrl, exercises (JSON), userId
Appointment: clientId, trainerId, appointmentTime, type (enum), status, duration, meetingLink, notes, updatedAt
Consultation: [removed - consolidated into Appointment]
AppointmentType: [new enum] IN_PERSON, VIDEO_CALL, PHONE_CALL, CHAT
```

---

## 🎉 Success Checklist

- [ ] Ran cleanup SQL in production database
- [ ] Committed migration file updates
- [ ] Pushed to `stage` branch
- [ ] Vercel deployment completed successfully
- [ ] No migration errors in logs
- [ ] WorkoutPlan API tested successfully
- [ ] Appointment API tested successfully
- [ ] Database schema verified
- [ ] All tests passing (10/10)

---

## 📞 Need Help?

If you encounter any issues:

1. Check `PRODUCTION_MIGRATION_FIX.md` for detailed troubleshooting
2. Review Vercel deployment logs
3. Check database migration status:
   ```sql
   SELECT * FROM _prisma_migrations ORDER BY started_at DESC LIMIT 10;
   ```
4. Run the `safe-migration.sql` script manually if needed

---

**Last Updated**: October 21, 2025  
**Migration Version**: v3.0.0  
**Status**: Ready for deployment
