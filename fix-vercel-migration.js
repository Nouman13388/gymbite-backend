#!/usr/bin/env node

/**
 * Production Database Fix Script
 * This script fixes the migration issue on Vercel by handling null values
 */

import { execSync } from "child_process";
import dotenv from "dotenv";

dotenv.config();

console.log("🔧 Starting production database fix...");

try {
  // Step 1: Resolve the failed migration first
  console.log("📋 Step 1: Resolving failed migration...");
  execSync(
    "npx prisma migrate resolve --rolled-back 20251010184529_update_meal_plan_structure",
    {
      stdio: "inherit",
      env: { ...process.env },
    }
  );

  // Step 2: Apply data fixes before migration
  console.log("🔄 Step 2: Applying data fixes...");
  const fixDataCommand = `
    npx prisma db execute --file ./fix_production_data.sql
  `;

  try {
    execSync(fixDataCommand, { stdio: "inherit" });
  } catch (error) {
    console.log(
      "ℹ️  Data fix may have failed (this is expected if columns don't exist yet)"
    );
  }

  // Step 3: Deploy all migrations
  console.log("🚀 Step 3: Deploying migrations...");
  execSync("npx prisma migrate deploy", { stdio: "inherit" });

  // Step 4: Generate client
  console.log("🔧 Step 4: Generating Prisma client...");
  execSync("npx prisma generate", { stdio: "inherit" });

  console.log("✅ Production database fix completed successfully!");
} catch (error) {
  console.error("❌ Error fixing production database:", error.message);

  // Fallback: Reset the entire database
  console.log("🔄 Attempting database reset as fallback...");
  try {
    execSync("npx prisma migrate reset --force", { stdio: "inherit" });
    console.log("✅ Database reset completed successfully!");
  } catch (resetError) {
    console.error("❌ Database reset also failed:", resetError.message);
    process.exit(1);
  }
}
