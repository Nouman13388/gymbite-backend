import express from 'express';
import {
  getAllProgress,
  getProgressById,
  createProgress,
  updateProgress,
  deleteProgress,
} from '../controllers/progressController.js';

const router = express.Router();

// Define routes for progress
router.get('/', getAllProgress);
router.get('/:id', getProgressById);
router.post('/', createProgress);
router.put('/:id', updateProgress);
router.delete('/:id', deleteProgress);

export default router;
