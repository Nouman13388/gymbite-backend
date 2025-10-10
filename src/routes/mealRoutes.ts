import express from "express";
import {
  getMealsByMealPlanId,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal,
} from "../controllers/mealController.js";

const router = express.Router();

// Routes for individual meals
router.get("/meal-plan/:mealPlanId/meals", getMealsByMealPlanId); // Get all meals for a meal plan
router.get("/:id", getMealById); // Get meal by ID
router.post("/", createMeal); // Create new meal
router.put("/:id", updateMeal); // Update meal by ID
router.delete("/:id", deleteMeal); // Delete meal by ID

export default router;
