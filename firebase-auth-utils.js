#!/usr/bin/env node

/**
 * Firebase Authentication Test Utilities
 * Multiple functions to help with API testing and token management
 */

import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// Load environment variables
dotenv.config();

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/**
 * Get Firebase ID token by signing in
 */
async function getIdToken(email, password) {
  try {
    console.log("🔐 Signing in to Firebase...");
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    console.log("✅ Successfully signed in!");
    console.log(`👤 User: ${user.email} (${user.uid})`);

    const idToken = await user.getIdToken();

    console.log("\n🎯 Firebase ID Token:");
    console.log(idToken);

    console.log("\n📋 For Postman Authorization Header:");
    console.log(`Bearer ${idToken}`);

    // Save token to file for easy access
    const tokenFile = path.join(process.cwd(), "firebase-token.txt");
    fs.writeFileSync(tokenFile, idToken);
    console.log(`\n💾 Token saved to: ${tokenFile}`);

    console.log("\n⏰ Token expires in 1 hour");

    return idToken;
  } catch (error) {
    console.error("❌ Error getting Firebase ID token:", error.message);
    throw error;
  }
}

/**
 * Create a new Firebase user for testing
 */
async function createTestUser(email, password) {
  try {
    console.log("👤 Creating new Firebase user...");
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    console.log("✅ User created successfully!");
    console.log(`👤 User: ${user.email} (${user.uid})`);

    console.log("\n🎯 Firebase UID for backend registration:");
    console.log(user.uid);

    return user;
  } catch (error) {
    console.error("❌ Error creating user:", error.message);
    throw error;
  }
}

/**
 * Get user info and token
 */
async function getUserInfo(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const idToken = await user.getIdToken();

    const userInfo = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      idToken: idToken,
    };

    console.log("👤 User Information:");
    console.log(JSON.stringify(userInfo, null, 2));

    return userInfo;
  } catch (error) {
    console.error("❌ Error getting user info:", error.message);
    throw error;
  }
}


/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  console.log("🔥 Firebase Authentication Test Utilities");
  console.log("==========================================\n");

  switch (command) {
    case "token":
    case "get-token":
      const email =
        args[1] || process.env.FIREBASE_TEST_EMAIL || "testadmin@gymbite.com";
      const password = args[2] || process.env.FIREBASE_TEST_PASSWORD;

      if (!password) {
        console.log("Usage: npm run get-token token <email> <password>");
        console.log("Or set FIREBASE_TEST_PASSWORD environment variable");
        process.exit(1);
      }

      const token = await getIdToken(email, password);
      generatePostmanCollection(token);
      break;

    case "create-user":
      const newEmail = args[1];
      const newPassword = args[2];

      if (!newEmail || !newPassword) {
        console.log("Usage: npm run get-token create-user <email> <password>");
        process.exit(1);
      }

      await createTestUser(newEmail, newPassword);
      break;

    case "user-info":
      const infoEmail = args[1] || process.env.FIREBASE_TEST_EMAIL;
      const infoPassword = args[2] || process.env.FIREBASE_TEST_PASSWORD;

      if (!infoEmail || !infoPassword) {
        console.log("Usage: npm run get-token user-info <email> <password>");
        process.exit(1);
      }

      await getUserInfo(infoEmail, infoPassword);
      break;

    default:
      console.log("Available commands:");
      console.log("  token <email> <password>     - Get Firebase ID token");
      console.log("  create-user <email> <pass>   - Create new test user");
      console.log("  user-info <email> <pass>     - Get user information");
      console.log("\nExamples:");
      console.log("  npm run get-token token testadmin@gymbite.com mypassword");
      console.log(
        "  npm run get-token create-user newuser@test.com password123"
      );
      console.log(
        "  npm run get-token user-info testadmin@gymbite.com mypassword"
      );
      process.exit(1);
  }
}

// Run the script
main().catch((error) => {
  console.error("❌ Script failed:", error.message);
  process.exit(1);
});
