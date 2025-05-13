import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all progress records
export const getAllProgress = async (req: Request, res: Response) => {
  try {
    const progress = await prisma.progress.findMany();
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch progress records' });
  }
};

// Get a single progress record by ID
export const getProgressById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const progress = await prisma.progress.findUnique({ where: { id: parseInt(id) } });
    if (!progress) {
      return res.status(404).json({ error: 'Progress record not found' });
    }
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch progress record' });
  }
};

// Create a new progress record
export const createProgress = async (req: Request, res: Response) => {
  const { clientId, weight, BMI, progressDate, workoutPerformance, mealPlanCompliance } = req.body;
  try {
    const newProgress = await prisma.progress.create({
      data: { clientId, weight, BMI, progressDate, workoutPerformance, mealPlanCompliance },
    });
    res.status(201).json(newProgress);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create progress record' });
  }
};

// Update a progress record by ID
export const updateProgress = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { weight, BMI, progressDate, workoutPerformance, mealPlanCompliance } = req.body;
  try {
    const updatedProgress = await prisma.progress.update({
      where: { id: parseInt(id) },
      data: { weight, BMI, progressDate, workoutPerformance, mealPlanCompliance },
    });
    res.status(200).json(updatedProgress);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update progress record' });
  }
};

// Delete a progress record by ID
export const deleteProgress = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.progress.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete progress record' });
  }
};
