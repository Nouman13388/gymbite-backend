import express from 'express';
import {
  getTrainers,
  getTrainerById,
  createTrainer,
  updateTrainer,
  deleteTrainer,
} from '../controllers/trainerController.js';

const router = express.Router();

// GET all trainers
router.get('/', getTrainers);

// GET a single trainer by ID
router.get('/:id', getTrainerById);

// POST create a new trainer
router.post('/', createTrainer);

// PUT update a trainer
router.put('/:id', updateTrainer);

// DELETE a trainer
router.delete('/:id', deleteTrainer);

export default router;
