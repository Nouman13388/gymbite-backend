import { body, param } from "express-validator";

export const validateCreateTrainer = [
  body("userId").isInt().withMessage("User ID must be an integer"),
  body("specialty").notEmpty().withMessage("Specialty is required"),
  body("experienceYears")
    .isInt({ min: 0 })
    .withMessage("Experience years must be a positive integer"),
];

export const validateUpdateTrainer = [
  param("id").isInt().withMessage("Trainer ID must be an integer"),
  body("specialty")
    .optional()
    .notEmpty()
    .withMessage("Specialty cannot be empty"),
  body("experienceYears")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Experience years must be a positive integer"),
];
