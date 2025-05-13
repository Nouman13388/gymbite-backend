import { Request, Response, NextFunction } from 'express';
import prisma from '../database/prisma.js';

// Get all consultations
export const getConsultations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const consultations = await prisma.consultation.findMany({
      include: { client: true, trainer: true },
    });
    res.json(consultations);
  } catch (error) {
    next(error);
  }
};

// Get a single consultation by ID
export const getConsultationById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const consultation = await prisma.consultation.findUnique({
      where: { id: parseInt(id) },
      include: { client: true, trainer: true },
    });
    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }
    res.json(consultation);
  } catch (error) {
    next(error);
  }
};

// Create a new consultation
export const createConsultation = async (req: Request, res: Response, next: NextFunction) => {
  const { clientId, trainerId, scheduledAt, status, notes } = req.body;
  try {
    const consultation = await prisma.consultation.create({
      data: {
        clientId,
        trainerId,
        scheduledAt,
        status,
        notes,
      },
    });
    res.status(201).json(consultation);
  } catch (error) {
    next(error);
  }
};

// Update a consultation
export const updateConsultation = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { scheduledAt, status, notes } = req.body;
  try {
    const consultation = await prisma.consultation.update({
      where: { id: parseInt(id) },
      data: {
        scheduledAt,
        status,
        notes,
      },
    });
    res.json(consultation);
  } catch (error) {
    next(error);
  }
};

// Delete a consultation
export const deleteConsultation = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await prisma.consultation.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
