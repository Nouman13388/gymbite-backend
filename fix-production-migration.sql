-- Prisma Migration Resolver Script
-- Run this against your production database to resolve the failed migration

-- Step 1: Check the _prisma_migrations table
SELECT * FROM _prisma_migrations 
WHERE migration_name = '20251020193601_enhance_workout_plan_and_consolidate_appointments'
ORDER BY started_at DESC;

-- Step 2: Mark the failed migration as rolled back
UPDATE _prisma_migrations
SET finished_at = NULL,
    applied_steps_count = 0,
    logs = 'Manually rolled back due to deployment failure'
WHERE migration_name = '20251020193601_enhance_workout_plan_and_consolidate_appointments'
  AND finished_at IS NULL;

-- Step 3: Delete the failed migration record (alternative approach)
-- DELETE FROM _prisma_migrations
-- WHERE migration_name = '20251020193601_enhance_workout_plan_and_consolidate_appointments'
--   AND finished_at IS NULL;
