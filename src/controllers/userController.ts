import { Request, Response, NextFunction } from 'express';
import prisma from '../database/prisma.js';
import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import Joi from 'joi';

// Define validation schema
const userValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(3).max(255).required(),
  role: Joi.string().valid(...Object.values(Role)),
  password: Joi.string().min(8).max(255).required(),
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

// Create a new user
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, name, role = 'CLIENT', password } = req.body;
  try {
    // Validate request body
    const { error } = userValidationSchema.validate({ email, name, role, password });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        role: role as Role,
        password: hashedPassword,
      },
    });
    res.status(201).json(user);
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    next(error);
  }
};

// Update a user
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { email, name, role, password } = req.body;
  try {
    // Validate ID
    const userId = parseInt(id);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Validate request body
    const { error } = userValidationSchema.validate({ email, name, role, password });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Hash password if provided
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        email,
        name,
        role: role as Role,
        ...(hashedPassword && { password: hashedPassword }),
      },
    });
    res.json(user);
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return res.status(400).json({ error: 'Email already exists' });
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