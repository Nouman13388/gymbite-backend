import { body, param } from 'express-validator';

export const validateClientId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Client ID must be a positive integer')
];

export const validateCreateClient = [
  body('userId')
    .isInt({ min: 1 })
    .withMessage('User ID must be a positive integer'),
  body('weight')
    .isFloat({ min: 0 })
    .withMessage('Weight must be a positive number'),
  body('height')
    .isFloat({ min: 0 })
    .withMessage('Height must be a positive number'),
  body('BMI')
    .isFloat({ min: 0 })
    .withMessage('BMI must be a positive number'),
  body('fitnessGoals')
    .optional()
    .isString()
    .withMessage('Fitness goals must be a string'),
  body('dietaryPreferences')
    .optional()
    .isString()
    .withMessage('Dietary preferences must be a string')
];

export const validateUpdateClient = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Client ID must be a positive integer'),
  body('weight')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Weight must be a positive number'),
  body('height')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Height must be a positive number'),
  body('BMI')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('BMI must be a positive number'),
  body('fitnessGoals')
    .optional()
    .isString()
    .withMessage('Fitness goals must be a string'),
  body('dietaryPreferences')
    .optional()
    .isString()
    .withMessage('Dietary preferences must be a string')
]; 