import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserByFirebaseUid,
  getUserByEmail,
  getCurrentUser,
} from "../controllers/userController.js";
import { verifyFirebaseToken } from "../middleware/auth.js";

const router = express.Router();


// POST create a new user
router.post("/", createUser);

// GET all users
router.get("/", verifyFirebaseToken, getUsers);

// GET current user profile
router.get("/me", verifyFirebaseToken, getCurrentUser);

// GET a single user by ID
router.get("/:id", verifyFirebaseToken, getUserById);

// GET user by Firebase UID (deprecated - use /me instead)
router.get("/firebase/:firebaseUid", verifyFirebaseToken, getUserByFirebaseUid);

// GET user by email
router.get("/email/:email", verifyFirebaseToken, getUserByEmail);

// PUT update a user
router.put("/:id", verifyFirebaseToken, updateUser);

// DELETE a user
router.delete("/:id", verifyFirebaseToken, deleteUser);

export default router;
