import { Request, Response, NextFunction } from 'express';
import prisma from '../database/prisma.js';

// Get all trainers
export const getTrainers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const trainers = await prisma.trainer.findMany({
      include: { user: true },
    });
    res.json(trainers);
  } catch (error) {
    next(error);
  }
};

// Get a single trainer by ID
export const getTrainerById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const trainer = await prisma.trainer.findUnique({
      where: { id: parseInt(id) },
      include: { user: true },
    });
    if (!trainer) {
      return res.status(404).json({ error: 'Trainer not found' });
    }
    res.json(trainer);
  } catch (error) {
    next(error);
  }
};

// Create a new trainer
export const createTrainer = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, specialty, experienceYears } = req.body;
  try {
    const trainer = await prisma.trainer.create({
      data: {
        userId,
        specialty,
        experienceYears,
      },
    });
    res.status(201).json(trainer);
  } catch (error) {
    next(error);
  }
};

// Update a trainer
export const updateTrainer = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { specialty, experienceYears } = req.body;
  try {
    const trainer = await prisma.trainer.update({
      where: { id: parseInt(id) },
      data: {
        specialty,
        experienceYears,
      },
    });
    res.json(trainer);
  } catch (error) {
    next(error);
  }
};

// Delete a trainer
export const deleteTrainer = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await prisma.trainer.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
