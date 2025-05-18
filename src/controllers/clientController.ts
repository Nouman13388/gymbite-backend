import { Request, Response, NextFunction } from 'express';
import prisma from '../database/prisma.js';
import { validationResult } from 'express-validator';

// Custom error class for API errors
class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Error handling middleware
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
};

// Get all clients
export const getClients = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clients = await prisma.client.findMany({
      include: { user: true },
    });
    res.json(clients);
  } catch (error) {
    next(new ApiError(500, 'Failed to fetch clients'));
  }
};

// Get a single client by ID
export const getClientById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const client = await prisma.client.findUnique({
      where: { id: parseInt(id) },
      include: { user: true },
    });
    if (!client) {
      throw new ApiError(404, 'Client not found');
    }
    res.json(client);
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, 'Failed to fetch client'));
    }
  }
};

// Get client by user ID
export const getClientByUserId = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  
  try {
    const client = await prisma.client.findFirst({
      where: { userId: parseInt(userId) },
      include: { user: true },
    });

    if (!client) {
      return res.status(404).json({ error: 'Client not found for this user ID' });
    }

    res.json(client);
  } catch (error) {
    console.error('Error fetching client by user ID:', error);
    next(new ApiError(500, 'Failed to fetch client by user ID'));
  }
};

// Create a new client
export const createClient = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, weight, height, BMI, fitnessGoals, dietaryPreferences } = req.body;
  try {
    // Validate that the userId corresponds to a user with the CLIENT role
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== 'CLIENT') {
      throw new ApiError(400, 'Invalid userId. The user must have the CLIENT role.');
    }

    // Check if client already exists for this user
    const existingClient = await prisma.client.findUnique({
      where: { userId }
    });
    if (existingClient) {
      throw new ApiError(400, 'A client profile already exists for this user');
    }

    const client = await prisma.client.create({
      data: {
        userId,
        weight,
        height,
        BMI,
        fitnessGoals,
        dietaryPreferences,
      },
    });
    res.status(201).json(client);
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, 'Failed to create client'));
    }
  }
};

// Update a client
export const updateClient = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { weight, height, BMI, fitnessGoals, dietaryPreferences } = req.body;
  try {
    // Check if client exists
    const existingClient = await prisma.client.findUnique({
      where: { id: parseInt(id) }
    });
    if (!existingClient) {
      throw new ApiError(404, 'Client not found');
    }

    const client = await prisma.client.update({
      where: { id: parseInt(id) },
      data: {
        weight,
        height,
        BMI,
        fitnessGoals,
        dietaryPreferences,
      },
    });
    res.json(client);
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, 'Failed to update client'));
    }
  }
};

// Delete a client
export const deleteClient = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    // Check if client exists
    const existingClient = await prisma.client.findUnique({
      where: { id: parseInt(id) }
    });
    if (!existingClient) {
      throw new ApiError(404, 'Client not found');
    }

    await prisma.client.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, 'Failed to delete client'));
    }
  }
};

// Get client's complete profile with related data
export const getClientCompleteProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const client = await prisma.client.findUnique({
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
        progress: true
      }
    });
    
    if (!client) {
      throw new ApiError(404, 'Client not found');
    }
    
    res.json(client);
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, 'Failed to fetch client profile'));
    }
  }
};

// Get client's workout and meal plans
export const getClientPlans = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    // First get the client to get their userId
    const client = await prisma.client.findUnique({
      where: { id: parseInt(id) },
      select: { userId: true }
    });

    if (!client) {
      throw new ApiError(404, 'Client not found');
    }

    const [workoutPlans, mealPlans] = await Promise.all([
      prisma.workoutPlan.findMany({
        where: { userId: client.userId }
      }),
      prisma.mealPlan.findMany({
        where: { userId: client.userId }
      })
    ]);
    
    res.json({
      workoutPlans,
      mealPlans
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, 'Failed to fetch client plans'));
    }
  }
};

// Get client's progress history
export const getClientProgress = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    // Check if client exists
    const existingClient = await prisma.client.findUnique({
      where: { id: parseInt(id) }
    });
    if (!existingClient) {
      throw new ApiError(404, 'Client not found');
    }

    const progress = await prisma.progress.findMany({
      where: { clientId: parseInt(id) },
      orderBy: { progressDate: 'desc' }
    });
    
    res.json(progress);
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, 'Failed to fetch client progress'));
    }
  }
};

// Get client's recent activities
export const getClientActivities = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    // Check if client exists
    const existingClient = await prisma.client.findUnique({
      where: { id: parseInt(id) }
    });
    if (!existingClient) {
      throw new ApiError(404, 'Client not found');
    }

    const [consultations, appointments, progress, notifications] = await Promise.all([
      prisma.consultation.findMany({
        where: { clientId: parseInt(id) },
        orderBy: { scheduledAt: 'desc' },
        take: 5
      }),
      prisma.appointment.findMany({
        where: { clientId: parseInt(id) },
        orderBy: { appointmentTime: 'desc' },
        take: 5
      }),
      prisma.progress.findMany({
        where: { clientId: parseInt(id) },
        orderBy: { progressDate: 'desc' },
        take: 5
      }),
      prisma.notification.findMany({
        where: { userId: existingClient.userId },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ]);
    
    res.json({
      consultations,
      appointments,
      progress,
      notifications
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, 'Failed to fetch client activities'));
    }
  }
};
