import express from 'express';
import {
  getNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
} from '../controllers/notificationController.js';

const router = express.Router();

// Define routes for notifications
router.get('/', getNotifications);
router.get('/:id', getNotificationById);
router.post('/', createNotification);
router.put('/:id', updateNotification);
router.delete('/:id', deleteNotification);

export default router;
