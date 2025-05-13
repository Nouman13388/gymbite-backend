import { Request, Response } from 'express';
import prisma from '../database/prisma.js';

// Get all meal plans
export const getMealPlans = async (req: Request, res: Response) => {
  try {
    const mealPlans = await prisma.mealPlan.findMany();
    res.status(200).json(mealPlans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meal plans' });
  }
};

// Get a meal plan by ID
export const getMealPlanById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const mealPlan = await prisma.mealPlan.findUnique({ where: { id: parseInt(id) } });
    if (!mealPlan) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }
    res.status(200).json(mealPlan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meal plan' });
  }
};

// Create a new meal plan
export const createMealPlan = async (req: Request, res: Response) => {
  const { userId, name, description, calories, protein, fat, carbs } = req.body;
  try {
    const newMealPlan = await prisma.mealPlan.create({
      data: { userId, name, description, calories, protein, fat, carbs },
    });
    res.status(201).json(newMealPlan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create meal plan' });
  }
};

// Update a meal plan by ID
export const updateMealPlan = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, calories, protein, fat, carbs } = req.body;
  try {
    const updatedMealPlan = await prisma.mealPlan.update({
      where: { id: parseInt(id) },
      data: { name, description, calories, protein, fat, carbs },
    });
    res.status(200).json(updatedMealPlan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update meal plan' });
  }
};

// Delete a meal plan by ID
export const deleteMealPlan = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.mealPlan.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete meal plan' });
  }
};
