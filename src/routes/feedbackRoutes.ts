import express from 'express';
import {
  getFeedbacks,
  getFeedbackById,
  createFeedback,
  updateFeedback,
  deleteFeedback,
} from '../controllers/feedbackController.js';
import { verifyFirebaseToken } from '@/middleware/auth.js';

const router = express.Router();

router.use(verifyFirebaseToken);

// Define routes for feedback
router.get('/', getFeedbacks);
router.get('/:id', getFeedbackById);
router.post('/', createFeedback);
router.put('/:id', updateFeedback);
router.delete('/:id', deleteFeedback);

export default router;
