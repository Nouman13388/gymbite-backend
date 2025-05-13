import { Request, Response, NextFunction } from 'express';
import prisma from '../database/prisma.js';

// Get all feedbacks
export const getFeedbacks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const feedbacks = await prisma.feedback.findMany({
      include: { user: true, trainer: true },
    });
    res.json(feedbacks);
  } catch (error) {
    next(error);
  }
};

// Get a single feedback by ID
export const getFeedbackById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const feedback = await prisma.feedback.findUnique({
      where: { id: parseInt(id) },
      include: { user: true, trainer: true },
    });
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    res.json(feedback);
  } catch (error) {
    next(error);
  }
};

// Create a new feedback
export const createFeedback = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, trainerId, rating, comments } = req.body;
  try {
    const feedback = await prisma.feedback.create({
      data: {
        userId,
        trainerId,
        rating,
        comments,
      },
    });
    res.status(201).json(feedback);
  } catch (error) {
    next(error);
  }
};

// Update a feedback
export const updateFeedback = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { rating, comments } = req.body;
  try {
    const feedback = await prisma.feedback.update({
      where: { id: parseInt(id) },
      data: {
        rating,
        comments,
      },
    });
    res.json(feedback);
  } catch (error) {
    next(error);
  }
};

// Delete a feedback
export const deleteFeedback = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await prisma.feedback.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
