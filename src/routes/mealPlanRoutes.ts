import express from "express";
import {
  getMealPlans,
  getMealPlanById,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
} from "../controllers/mealPlanController.js";

const router = express.Router();

// Get all meal plans
router.get("/", getMealPlans);

// Get a meal plan by ID
router.get("/:id", getMealPlanById);

// Create a new meal plan
router.post("/", createMealPlan);

// Update a meal plan by ID
router.put("/:id", updateMealPlan);

// Delete a meal plan by ID
router.delete("/:id", deleteMealPlan);

export default router;
