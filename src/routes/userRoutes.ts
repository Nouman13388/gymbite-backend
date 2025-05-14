import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserByFirebaseUid,
  getUserByEmail,
} from "../controllers/userController.js";

const router = express.Router();

// GET all users
router.get("/", getUsers);

// GET a single user by ID
router.get("/:id", getUserById);

// GET user by Firebase UID
router.get("/firebase/:firebaseUid", getUserByFirebaseUid);

// GET user by email
router.get("/email/:email", getUserByEmail);

// POST create a new user
router.post("/", createUser);

// PUT update a user
router.put("/:id", updateUser);

// DELETE a user
router.delete("/:id", deleteUser);

export default router;
