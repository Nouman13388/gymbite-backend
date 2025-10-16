# 🚀 Vercel Deployment Guide - GymBite Backend

## ✅ Automatic Database Sync Configuration

Your Vercel deployment is now configured to automatically sync database schema changes during deployment.

### Updated Configuration

#### `vercel.json`

```json
{
  "buildCommand": "npm run vercel-build",
  "installCommand": "npm install && npx prisma generate"
}
```

#### `package.json` Scripts

```json
{
  "vercel-build": "prisma generate && prisma migrate deploy && npm run build:client && npm run build:server",
  "db:push": "prisma db push",
  "db:migrate": "prisma migrate deploy"
}
```

## 📋 Deployment Process

### What Happens Automatically on Each Deploy:

1. **Install Dependencies** → `npm install`
2. **Generate Prisma Client** → `npx prisma generate`
3. **Deploy Migrations** → `prisma migrate deploy`
4. **Build Frontend** → `npm run build:client`
5. **Build Backend** → `npm run build:server`

### Environment Variables Required in Vercel

Set these in your Vercel project dashboard:

#### Database

- `DATABASE_URL` - PostgreSQL connection string

#### Firebase Admin SDK

- `FIREBASE_PROJECT_ID` - Your Firebase project ID
- `FIREBASE_CLIENT_EMAIL` - Service account email
- `FIREBASE_PRIVATE_KEY` - Service account private key (keep the `\n` characters as-is)

#### Server Configuration

- `PORT` - Usually `3000` (optional, Vercel handles this)
- `NODE_ENV` - Set to `production`
- `CORS_ORIGIN` - Your frontend URL (e.g., `https://your-app.vercel.app`)

## 🔧 Local Development Commands

### Database Management

```bash
# Generate Prisma Client (after schema changes)
npm run postinstall
# or
npx prisma generate

# Sync schema to database (development only)
npm run db:push
# or
npx prisma db push

# Create and apply migrations (production-ready)
npx prisma migrate dev --name description_of_change

# Apply existing migrations (production)
npm run db:migrate
# or
npx prisma migrate deploy
```

### Development Server

```bash
# Start both backend and frontend
npm run dev

# Backend only
npm run dev:server

# Frontend only
npm run dev:client
```

## 📝 Schema Change Workflow

### For Development (Local Changes)

1. **Modify** `prisma/schema.prisma`
2. **Sync to local database**:
   ```bash
   npx prisma db push
   ```
3. **Test your changes** locally
4. **Create migration** (for production):
   ```bash
   npx prisma migrate dev --name add_new_feature
   ```
5. **Commit** migration files to git
6. **Push** to GitHub → Vercel auto-deploys

### For Production Deployment

When you push to GitHub:

1. ✅ Vercel detects the push
2. ✅ Runs `npm install && npx prisma generate`
3. ✅ Runs `npm run vercel-build` which includes:
   - `prisma generate` (Prisma Client)
   - `prisma migrate deploy` (Apply migrations)
   - `npm run build:client` (Build dashboard)
   - `npm run build:server` (Build backend)
4. ✅ Deploys the application

## 🔒 Database Migration Best Practices

### ✅ DO:

- Use `prisma migrate dev` for creating migrations in development
- Commit migration files to version control
- Use `prisma migrate deploy` in production (Vercel)
- Test migrations locally before deploying
- Review migration SQL before applying

### ❌ DON'T:

- Use `prisma db push` in production (it can cause data loss)
- Manually edit the database schema in production
- Skip testing migrations locally
- Delete migration files from git

## 🐛 Troubleshooting

### Issue: "Migration failed"

**Solution**: Check that:

- DATABASE_URL is correctly set in Vercel
- Database is accessible from Vercel
- Migration files are committed to git
- No conflicting schema changes

### Issue: "Prisma Client not generated"

**Solution**:

- Ensure `postinstall` script runs: `"postinstall": "prisma generate"`
- Check build logs in Vercel dashboard
- Verify `prisma` is in devDependencies

### Issue: "Cannot find module '@prisma/client'"

**Solution**:

- Run `npm install` locally
- Commit `package-lock.json`
- Redeploy to Vercel

### Issue: Schema drift detected

**Solution**:

```bash
# Check migration status
npx prisma migrate status

# If in development and safe to reset
npx prisma migrate reset

# If in production, create a new migration
npx prisma migrate dev --name fix_schema_drift
```

## 📊 Checking Deployment Status

### In Vercel Dashboard:

1. Go to your project
2. Click on "Deployments"
3. Select the latest deployment
4. Check "Build Logs" for:
   - ✅ `prisma generate` success
   - ✅ `prisma migrate deploy` success
   - ✅ Build completion

### Via CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Check deployment logs
vercel logs

# Check environment variables
vercel env ls
```

## 🎯 Quick Reference

| Command                     | Purpose                | When to Use                   |
| --------------------------- | ---------------------- | ----------------------------- |
| `npx prisma generate`       | Generate Prisma Client | After schema changes          |
| `npx prisma db push`        | Sync schema (dev)      | Local development             |
| `npx prisma migrate dev`    | Create migration       | Before production deploy      |
| `npx prisma migrate deploy` | Apply migrations       | Production (Vercel does this) |
| `npx prisma migrate status` | Check migration state  | Debugging issues              |
| `npx prisma studio`         | Open database GUI      | Viewing/editing data          |

## ✨ Your Setup is Now:

✅ **Automatic schema sync on deploy**
✅ **Migration-based database updates**
✅ **Environment variables configured**
✅ **Build process optimized**
✅ **Production-ready workflow**

## 🚀 Next Steps

1. Set environment variables in Vercel dashboard
2. Push your code to GitHub
3. Vercel will automatically deploy with database sync
4. Monitor deployment logs to ensure success
5. Test your deployed application

---

**Note**: Always test schema changes locally before deploying to production!
