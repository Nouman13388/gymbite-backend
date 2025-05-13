import { Request, Response } from 'express';
import prisma from '../database/prisma.js';

// Get all workout plans
export const getWorkoutPlans = async (req: Request, res: Response) => {
  try {
    const workoutPlans = await prisma.workoutPlan.findMany();
    res.status(200).json(workoutPlans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workout plans' });
  }
};

// Get a workout plan by ID
export const getWorkoutPlanById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const workoutPlan = await prisma.workoutPlan.findUnique({ where: { id: parseInt(id) } });
    if (!workoutPlan) {
      return res.status(404).json({ error: 'Workout plan not found' });
    }
    res.status(200).json(workoutPlan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workout plan' });
  }
};

// Create a new workout plan
export const createWorkoutPlan = async (req: Request, res: Response) => {
  const { userId, name, exercises, sets, reps } = req.body;
  try {
    const newWorkoutPlan = await prisma.workoutPlan.create({
      data: { userId, name, exercises, sets, reps },
    });
    res.status(201).json(newWorkoutPlan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create workout plan' });
  }
};

// Update a workout plan by ID
export const updateWorkoutPlan = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, exercises, sets, reps } = req.body;
  try {
    const updatedWorkoutPlan = await prisma.workoutPlan.update({
      where: { id: parseInt(id) },
      data: { name, exercises, sets, reps },
    });
    res.status(200).json(updatedWorkoutPlan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update workout plan' });
  }
};

// Delete a workout plan by ID
export const deleteWorkoutPlan = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.workoutPlan.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete workout plan' });
  }
};
