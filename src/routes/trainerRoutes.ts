import express from "express";
import {
  getTrainers,
  getTrainerById,
  createTrainer,
  updateTrainer,
  deleteTrainer,
  getTrainerCompleteProfile,
  getTrainerClients,
  getTrainerSchedule,
  getTrainerMetrics,
  getTrainerByUserId,
} from "../controllers/trainerController.js";
import { verifyFirebaseToken } from "../middleware/auth.js";

const router = express.Router();

// All trainer routes require authentication
router.use(verifyFirebaseToken);

// GET all trainers
router.get("/", getTrainers);

// GET trainer by user ID
router.get("/user/:userId", getTrainerByUserId);

// GET a single trainer by ID
router.get("/:id", getTrainerById);

// POST create a new trainer
router.post("/", createTrainer);

// PUT update a trainer
router.put("/:id", updateTrainer);

// DELETE a trainer
router.delete("/:id", deleteTrainer);

// Enhanced routes
router.get("/:id/complete", getTrainerCompleteProfile);
router.get("/:id/clients", getTrainerClients);
router.get("/:id/schedule", getTrainerSchedule);
router.get("/:id/metrics", getTrainerMetrics);

export default router;
