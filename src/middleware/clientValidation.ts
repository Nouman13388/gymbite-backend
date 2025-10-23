import { body, param } from "express-validator";

export const validateCreateClient = [
  body("userId").isInt().withMessage("User ID must be an integer"),
  body("weight").isDecimal().withMessage("Weight must be a decimal number"),
  body("height").isDecimal().withMessage("Height must be a decimal number"),
  body("BMI").isDecimal().withMessage("BMI must be a decimal number"),
  body("fitnessGoals").optional().isString(),
  body("dietaryPreferences").optional().isString(),
];

export const validateUpdateClient = [
  param("id").isInt().withMessage("Client ID must be an integer"),
  body("weight").optional().isDecimal(),
  body("height").optional().isDecimal(),
  body("BMI").optional().isDecimal(),
  body("fitnessGoals").optional().isString(),
  body("dietaryPreferences").optional().isString(),
];
