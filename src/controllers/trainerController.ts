import { Request, Response, NextFunction } from 'express';
import prisma from '../database/prisma.js';

// Get trainer by user ID
export const getTrainerByUserId = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  
  try {
    const trainer = await prisma.trainer.findFirst({
      where: { userId: parseInt(userId) },
      include: { user: true },
    });

    if (!trainer) {
      return res.status(404).json({ error: 'Trainer not found for this user ID' });
    }

    res.json(trainer);
  } catch (error) {
    console.error('Error fetching trainer by user ID:', error);
    next(error);
  }
};

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

// Get trainer's complete profile with related data
export const getTrainerCompleteProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const trainer = await prisma.trainer.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        consultations: true,
        appointments: true,
        feedbacks: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });
    
    if (!trainer) {
      return res.status(404).json({ error: 'Trainer not found' });
    }
    
    res.json(trainer);
  } catch (error) {
    next(error);
  }
};

// Get trainer's client list
export const getTrainerClients = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const clients = await prisma.client.findMany({
      where: {
        consultations: {
          some: {
            trainerId: parseInt(id)
          }
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });
    
    res.json(clients);
  } catch (error) {
    next(error);
  }
};

// Get trainer's schedule
export const getTrainerSchedule = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const [consultations, appointments] = await Promise.all([
      prisma.consultation.findMany({
        where: { 
          trainerId: parseInt(id),
          status: 'Scheduled'
        },
        include: {
          client: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          }
        },
        orderBy: { scheduledAt: 'asc' }
      }),
      prisma.appointment.findMany({
        where: { 
          trainerId: parseInt(id),
          status: 'Scheduled'
        },
        include: {
          client: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          }
        },
        orderBy: { appointmentTime: 'asc' }
      })
    ]);
    
    res.json({
      consultations,
      appointments
    });
  } catch (error) {
    next(error);
  }
};

// Get trainer's performance metrics
export const getTrainerMetrics = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const [
      clientCount,
      feedbacks,
      activeAppointments,
      completedConsultations
    ] = await Promise.all([
      prisma.client.count({
        where: {
          consultations: {
            some: {
              trainerId: parseInt(id)
            }
          }
        }
      }),
      prisma.feedback.findMany({
        where: { trainerId: parseInt(id) }
      }),
      prisma.appointment.count({
        where: { 
          trainerId: parseInt(id),
          status: 'Scheduled'
        }
      }),
      prisma.consultation.count({
        where: { 
          trainerId: parseInt(id),
          status: 'Completed'
        }
      })
    ]);
    
    const averageRating = feedbacks.length > 0
      ? feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length
      : 0;
    
    res.json({
      clientCount,
      averageRating,
      activeAppointments,
      completedConsultations,
      totalFeedbacks: feedbacks.length
    });
  } catch (error) {
    next(error);
  }
};
