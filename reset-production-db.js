#!/usr/bin/env node

/**
 * Production Database Reset Script
 * Use this script to reset and migrate the production database
 */

import dotenv from "dotenv";
import { execSync } from "child_process";

// Load environment variables
dotenv.config();

async function resetProductionDatabase() {
  try {
    console.log("🔄 Starting production database reset...");

    // Check if production DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.error("❌ DATABASE_URL environment variable is not set");
      process.exit(1);
    }

    console.log(
      "📊 Current database URL:",
      process.env.DATABASE_URL.replace(/\/\/.*@/, "//***@")
    );

    // Step 1: Generate Prisma client
    console.log("🔧 Generating Prisma client...");
    execSync("npx prisma generate", { stdio: "inherit" });

    // Step 2: Reset and apply migrations
    console.log("🗄️  Resetting database and applying migrations...");
    execSync("npx prisma migrate reset --force", { stdio: "inherit" });

    // Step 3: Verify migration status
    console.log("✅ Verifying migration status...");
    execSync("npx prisma migrate status", { stdio: "inherit" });

    console.log("🎉 Production database reset completed successfully!");
    console.log("📝 Next steps:");
    console.log("   1. Test your API endpoints");
    console.log("   2. Verify data structure in database");
    console.log("   3. Run your application");
  } catch (error) {
    console.error("❌ Error resetting production database:", error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  resetProductionDatabase();
}

export { resetProductionDatabase };
