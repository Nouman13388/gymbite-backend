-- Automatic cleanup of failed migrations before deployment
-- This runs automatically during Vercel deployment via npm run db:cleanup

DELETE FROM _prisma_migrations
WHERE finished_at IS NULL;
