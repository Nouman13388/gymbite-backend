import { Request, Response, NextFunction } from 'express';
import prisma from '../database/prisma.js';

// Get all notifications
export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notifications = await prisma.notification.findMany({
      include: { user: true },
    });
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

// Get a single notification by ID
export const getNotificationById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const notification = await prisma.notification.findUnique({
      where: { id: parseInt(id) },
      include: { user: true },
    });
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.json(notification);
  } catch (error) {
    next(error);
  }
};

// Create a new notification
export const createNotification = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, message, notificationType, status } = req.body;
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        message,
        notificationType,
        status,
      },
    });
    res.status(201).json(notification);
  } catch (error) {
    next(error);
  }
};

// Update a notification
export const updateNotification = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { message, notificationType, status } = req.body;
  try {
    const notification = await prisma.notification.update({
      where: { id: parseInt(id) },
      data: {
        message,
        notificationType,
        status,
      },
    });
    res.json(notification);
  } catch (error) {
    next(error);
  }
};

// Delete a notification
export const deleteNotification = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await prisma.notification.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
