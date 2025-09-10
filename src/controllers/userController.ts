import { Request, Response, NextFunction } from 'express';
import prisma from '../database/prisma.js';
import bcrypt from 'bcrypt';
import Joi from 'joi';

// Define validation schema
const userValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(3).max(255).required(),
  role: Joi.string().valid('CLIENT', 'TRAINER', 'ADMIN'),
  firebaseUid: Joi.string().required(),
});

// Define update validation schema
const userUpdateValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(3).max(255).required(),
  role: Joi.string().valid('CLIENT', 'TRAINER', 'ADMIN'),
  firebaseUid: Joi.string().optional(),
});

// Get all users
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// Get a single user by ID
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Get user by Firebase UID
export const getUserByFirebaseUid = async (req: Request, res: Response, next: NextFunction) => {
  const { firebaseUid } = req.params;
  try {
    const user = await prisma.user.findFirst({
      where: { firebaseUid } as any,
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Get user by email
export const getUserByEmail = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Create a new user
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, name, role = 'CLIENT', firebaseUid } = req.body;
  try {
    // Validate request body
    const { error } = userValidationSchema.validate({ email, name, role, firebaseUid });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check if user with Firebase UID already exists
    const existingUser = await prisma.user.findFirst({
      where: { firebaseUid } as any,
    });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this Firebase UID already exists' });
    }    
    
    const user = await prisma.user.create({
      data: {
        email,
        name,
        role: role as 'CLIENT' | 'TRAINER' | 'ADMIN',
        firebaseUid,
        password: '', // Empty password since authentication is handled by Firebase
      } as any,
    });
    res.status(201).json(user);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email or Firebase UID already exists' });
    }
    next(error);
  }
};

// Update a user
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { email, name, role, firebaseUid } = req.body;
  try {
    // Validate ID
    const userId = parseInt(id);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    }) as { firebaseUid: string | null } & { email: string; name: string; role: 'CLIENT' | 'TRAINER' | 'ADMIN'; id: number; password: string; createdAt: Date; updatedAt: Date; };
    
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent firebaseUid updates unless explicitly allowed
    if (firebaseUid && firebaseUid !== existingUser.firebaseUid) {
      return res.status(400).json({ 
        error: 'Firebase UID cannot be updated. Please contact support if this is necessary.' 
      });
    }

    // Validate request body using update schema
    const { error } = userUpdateValidationSchema.validate({ email, name, role, firebaseUid });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        email,
        name,
        role: role as 'CLIENT' | 'TRAINER' | 'ADMIN',
        // Only update firebaseUid if it's the same as existing
        ...(firebaseUid === existingUser.firebaseUid ? { firebaseUid } : {}),
      } as any,
    });
    res.json(user);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email or Firebase UID already exists' });
    }
    next(error);
  }
};

// Delete a user
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};