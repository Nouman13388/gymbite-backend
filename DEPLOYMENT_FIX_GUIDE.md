# Backend Deployment Fix Guide

## Root Cause Analysis

Your backend changes aren't reflected in production because:

1. **Database migrations haven't been applied in production**
2. **Vercel build cache might be stale**
3. **Production database schema is outdated**

## Step-by-Step Solution

### Step 1: Force Vercel Redeployment

```bash
# Method 1: Trigger redeploy via Vercel CLI
npx vercel --prod --force

# Method 2: Push a small change to trigger rebuild
git commit --allow-empty -m "Force Vercel redeploy"
git push origin main
```

### Step 2: Apply Database Migrations in Production

You need to apply the new migrations to your production database:

```bash
# If using Vercel with PostgreSQL
# Set your production DATABASE_URL in Vercel environment variables
# Then run migrations against production DB

# Generate Prisma client for production
npx prisma generate

# Apply migrations to production database
npx prisma migrate deploy
```

### Step 3: Verify Environment Variables

Check that these are set in your Vercel project settings:

1. **Database Variables:**

   - `DATABASE_URL` (production PostgreSQL connection string)
   - `DIRECT_URL` (if using connection pooling)

2. **Firebase Variables:**
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `FIREBASE_ADMIN_PROJECT_ID`
   - `FIREBASE_ADMIN_PRIVATE_KEY`
   - `FIREBASE_ADMIN_CLIENT_EMAIL`

### Step 4: Check Vercel Build Configuration

Your `vercel.json` should include migration commands:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/src/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/src/index.ts"
    }
  ]
}
```

### Step 5: Manual Migration Commands

If automatic migration doesn't work, run these manually:

```bash
# Connect to production database
# (Use your production DATABASE_URL)

# 1. Check current migration status
npx prisma migrate status

# 2. Apply pending migrations
npx prisma migrate deploy

# 3. Generate new Prisma client
npx prisma generate
```

## Verification Steps

### 1. Check Production Database Schema

Connect to your production database and verify the schema:

```sql
-- Check if new tables exist
\dt

-- Check MealPlan table structure
\d "MealPlan"

-- Check Meal table structure
\d "Meal"

-- Verify relationships
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'MealPlan';
```

### 2. Test API Endpoints

Test your production API endpoints:

```bash
# Test meal plan endpoint
curl -X GET "https://your-domain.vercel.app/api/meal-plans" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"

# Test health endpoint
curl -X GET "https://your-domain.vercel.app/api/health"
```

### 3. Check Vercel Logs

```bash
# View deployment logs
npx vercel logs YOUR_DEPLOYMENT_URL

# View function logs
npx vercel logs YOUR_DEPLOYMENT_URL --follow
```

## Common Issues & Solutions

### Issue 1: "Table doesn't exist" errors

**Solution:** Run `npx prisma migrate deploy` against production DB

### Issue 2: "Module not found" errors

**Solution:** Clear Vercel build cache and redeploy

### Issue 3: "Authentication failed" errors

**Solution:** Verify Firebase environment variables in Vercel

### Issue 4: Old API responses

**Solution:** Check if you're hitting the correct deployment URL

## Emergency Rollback Plan

If needed, you can rollback:

```bash
# Revert to previous migration
npx prisma migrate resolve --rolled-back "MIGRATION_NAME"

# Or reset database (⚠️ DATA LOSS)
npx prisma migrate reset --force
```

## Next Steps

1. **Immediate Actions:**

   - Apply migrations to production DB
   - Force Vercel redeploy
   - Verify environment variables

2. **Testing:**

   - Test all meal plan endpoints
   - Verify database relationships
   - Check authentication flow

3. **Monitoring:**
   - Monitor Vercel function logs
   - Check database connection status
   - Verify API response structure

## Migration Commands Summary

```bash
# Local development (already working)
npx prisma migrate dev

# Production deployment
npx prisma migrate deploy

# Generate client after migrations
npx prisma generate

# Check migration status
npx prisma migrate status
```
