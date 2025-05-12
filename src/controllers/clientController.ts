import { Request, Response, NextFunction } from 'express';
import prisma from '../database/prisma.js';

// Get all clients
export const getClients = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clients = await prisma.client.findMany({
      include: { user: true },
    });
    res.json(clients);
  } catch (error) {
    next(error);
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
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    next(error);
  }
};

// Create a new client
export const createClient = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, weight, height, BMI, fitnessGoals, dietaryPreferences } = req.body;
  try {
    // Validate that the userId corresponds to a user with the CLIENT role
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== 'CLIENT') {
      return res.status(400).json({ error: 'Invalid userId. The user must have the CLIENT role.' });
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
    next(error);
  }
};

// Update a client
export const updateClient = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { weight, height, BMI, fitnessGoals, dietaryPreferences } = req.body;
  try {
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
    next(error);
  }
};

// Delete a client
export const deleteClient = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await prisma.client.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
