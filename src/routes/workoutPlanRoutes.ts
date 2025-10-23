import express from "express";
import {
  getWorkoutPlans,
  getWorkoutPlanById,
  createWorkoutPlan,
  updateWorkoutPlan,
  deleteWorkoutPlan,
} from "../controllers/workoutPlanController.js";
import { verifyFirebaseToken } from "../middleware/auth.js";

const router = express.Router();

// All workout plan routes require authentication
router.use(verifyFirebaseToken);

// Get all workout plans
router.get("/", getWorkoutPlans);

// Get a workout plan by ID
router.get("/:id", getWorkoutPlanById);

// Create a new workout plan
router.post("/", createWorkoutPlan);

// Update a workout plan by ID
router.put("/:id", updateWorkoutPlan);

// Delete a workout plan by ID
router.delete("/:id", deleteWorkoutPlan);

export default router;
