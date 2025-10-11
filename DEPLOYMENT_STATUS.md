# 🚀 Deployment and Database Reset - Complete Guide

## ✅ **What Has Been Accomplished**

### 1. **Database Reset Configuration**

- ✅ Updated `vercel.json` with automatic migration deployment
- ✅ Updated `package.json` with new database scripts
- ✅ Created production database reset script (`reset-production-db.js`)
- ✅ Local database successfully reset and migrations applied

### 2. **New Scripts Available**

```bash
# Local development
npm run db:reset          # Reset local database
npm run db:deploy         # Deploy migrations only
npm run db:generate       # Generate Prisma client
npm run db:studio         # Open Prisma Studio

# Production
npm run db:reset-prod     # Reset production database
```

### 3. **Vercel Configuration Updated**

Your `vercel.json` now includes:

```json
{
  "buildCommand": "prisma generate && prisma migrate deploy && npm run build:server"
}
```

## 🎯 **Next Steps for Production**

### **Immediate Actions Required:**

1. **Check Vercel Deployment Status**

   - Go to your Vercel dashboard
   - Look for the latest deployment triggered by the push
   - Monitor build logs for successful migration

2. **Verify Environment Variables in Vercel**
   Make sure these are set in your Vercel project settings:

   ```
   DATABASE_URL=postgresql://...
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   FIREBASE_ADMIN_PROJECT_ID=...
   FIREBASE_ADMIN_PRIVATE_KEY=...
   FIREBASE_ADMIN_CLIENT_EMAIL=...
   NODE_ENV=production
   ```

3. **Test Your API Endpoints**
   Use the Postman collection to test:
   ```
   GET  /api/meal-plans      # Should return meal plans with new schema
   POST /api/meal-plans      # Create with title, description, category
   GET  /api/meals/meal-plan/:id/meals  # Get meals for a plan
   ```

## 🔧 **Manual Production Database Reset (If Needed)**

If the automatic deployment doesn't work, use this manual process:

### **Option 1: Using Production DATABASE_URL**

```bash
# Get your production DATABASE_URL from Vercel dashboard
# Then run locally:
DATABASE_URL="your-production-url" npm run db:reset-prod
```

### **Option 2: Direct Prisma Commands**

```bash
# Set production DATABASE_URL temporarily
DATABASE_URL="production-url" npx prisma migrate reset --force
DATABASE_URL="production-url" npx prisma migrate deploy
DATABASE_URL="production-url" npx prisma generate
```

## 📊 **Verification Checklist**

### **Local Verification (✅ Already Complete)**

- [x] Database reset successful
- [x] 11 migrations applied
- [x] Prisma client generated
- [x] Schema includes MealPlan and Meal models
- [x] Relationships properly configured

### **Production Verification (To Do)**

- [ ] Vercel deployment successful
- [ ] Build logs show successful migration
- [ ] API endpoints return new schema structure
- [ ] Database contains MealPlan and Meal tables
- [ ] Authentication working with Firebase

## 🚨 **Troubleshooting**

### **If Vercel Build Fails:**

1. Check build logs for specific error messages
2. Verify all environment variables are set
3. Ensure DATABASE_URL is valid and accessible

### **If Database Migration Fails:**

1. Check if DATABASE_URL has sufficient permissions
2. Manually run migration commands with production URL
3. Verify PostgreSQL version compatibility

### **If API Returns Old Structure:**

1. Clear Vercel function cache by redeploying
2. Check if correct branch is deployed
3. Verify Prisma client was regenerated

## 🎉 **Success Indicators**

You'll know everything is working when:

1. **API Response Structure:**

   ```json
   {
     "id": 1,
     "title": "Muscle Building Plan",
     "description": "High protein meals...",
     "category": "muscle_building",
     "imageUrl": "https://...",
     "userId": 123,
     "meals": [
       {
         "id": 1,
         "name": "Breakfast",
         "type": "breakfast",
         "ingredients": ["eggs", "bread"],
         "calories": 400,
         "protein": 25
       }
     ]
   }
   ```

2. **Database Schema:**

   - MealPlan table with new fields (title, description, category, imageUrl)
   - Meal table with proper relationships
   - Foreign key constraints working

3. **Authentication:**
   - Firebase tokens accepted
   - User-specific data filtering
   - Proper error handling

## 📞 **Support Commands**

If you need help debugging:

```bash
# Check migration status
npx prisma migrate status

# View database in browser
npx prisma studio

# Test API locally
npm run dev:server

# Get Firebase token for testing
npm run get-token your-email@example.com password
```

Your backend is now configured for automatic database migration on deployment! 🚀
