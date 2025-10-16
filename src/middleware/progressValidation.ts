import { body, param, query } from "express-validator";

export const validateCreateProgress = [
  body("clientId").isInt().withMessage("Client ID must be an integer"),
  body("weight").isDecimal().withMessage("Weight must be a decimal number"),
  body("BMI").isDecimal().withMessage("BMI must be a decimal number"),
  body("progressDate")
    .isISO8601()
    .withMessage("Progress date must be a valid date"),
  body("workoutPerformance").optional().isString(),
  body("mealPlanCompliance").optional().isString(),
];

export const validateUpdateProgress = [
  param("id").isInt().withMessage("Progress ID must be an integer"),
  body("weight").optional().isDecimal(),
  body("BMI").optional().isDecimal(),
  body("progressDate").optional().isISO8601(),
  body("workoutPerformance").optional().isString(),
  body("mealPlanCompliance").optional().isString(),
];

export const validateProgressQuery = [
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("period").optional().isInt({ min: 1, max: 365 }),
];
