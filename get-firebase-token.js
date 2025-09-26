#!/usr/bin/env node

/**
 * Firebase ID Token Generator Script
 * Use this script to generate Firebase ID tokens for testing API endpoints
 */

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import dotenv from "dotenv";

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
 * Get Firebase ID token by signing in with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<string>} Firebase ID token
 */
async function getFirebaseIdToken(email, password) {
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

    console.log("🎫 Getting ID token...");
    const idToken = await user.getIdToken();

    console.log("✅ ID Token generated successfully!");
    console.log("\n🎯 Use this token in your Postman Authorization header:");
    console.log(`Bearer ${idToken}`);

    console.log("\n📋 Copy this for Postman:");
    console.log(idToken);

    console.log("\n⏰ Token expires in 1 hour");

    return idToken;
  } catch (error) {
    console.error("❌ Error getting Firebase ID token:", error.message);
    throw error;
  }
}

/**
 * Main function to handle command line arguments
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log("🔥 Firebase ID Token Generator");
    console.log("=====================================\n");
    console.log("Usage: node get-firebase-token.js <email> <password>");
    console.log("\nExample:");
    console.log(
      "  node get-firebase-token.js testadmin@gymbite.com mypassword"
    );
    console.log("\nOr set environment variables:");
    console.log("  FIREBASE_TEST_EMAIL=testadmin@gymbite.com");
    console.log("  FIREBASE_TEST_PASSWORD=mypassword");
    console.log("  node get-firebase-token.js");
    process.exit(1);
  }

  const email = args[0] || process.env.FIREBASE_TEST_EMAIL;
  const password = args[1] || process.env.FIREBASE_TEST_PASSWORD;

  if (!email || !password) {
    console.error("❌ Email and password are required");
    process.exit(1);
  }

  try {
    await getFirebaseIdToken(email, password);
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to get ID token:", error.message);
    process.exit(1);
  }
}

// Run the script
main();
