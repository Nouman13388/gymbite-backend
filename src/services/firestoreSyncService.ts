import { adminFirestore } from "../config/firebaseAdmin.js";
import { User } from "@prisma/client";

/**
 * Syncs user data from PostgreSQL to Firestore
 * @param user - The Prisma User object to sync
 */
export async function syncUserToFirestore(user: User): Promise<void> {
  try {
    if (!user.firebaseUid) {
      console.warn(
        `Cannot sync user ${user.id} to Firestore: firebaseUid is null`
      );
      return;
    }

    await adminFirestore.collection("users").doc(user.firebaseUid).set(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isActive: true,
      },
      { merge: true }
    );

    console.log(
      `Successfully synced user ${user.id} (${user.email}) to Firestore`
    );
  } catch (error: any) {
    // Check for Firestore NOT_FOUND error
    if (error.code === 5 || error.message?.includes("NOT_FOUND")) {
      console.error(
        `❌ Firestore database not initialized! Please enable Firestore in Firebase Console:`,
        `\nhttps://console.firebase.google.com/project/${process.env.FIREBASE_PROJECT_ID}/firestore`
      );
    } else {
      console.error(
        `Error syncing user ${user.id} to Firestore:`,
        error instanceof Error ? error.message : error
      );
    }
    throw error;
  }
}
