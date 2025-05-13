import express from 'express';
import {
  getConsultations,
  getConsultationById,
  createConsultation,
  updateConsultation,
  deleteConsultation,
} from '../controllers/consultationController.js';

const router = express.Router();

// Define routes for consultations
router.get('/', getConsultations);
router.get('/:id', getConsultationById);
router.post('/', createConsultation);
router.put('/:id', updateConsultation);
router.delete('/:id', deleteConsultation);

export default router;
