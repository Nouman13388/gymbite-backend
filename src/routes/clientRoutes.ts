import express from 'express';
import {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  getClientCompleteProfile,
  getClientPlans,
  getClientProgress,
  getClientActivities,
  getClientByUserId,
  errorHandler
} from '../controllers/clientController.js';
import {
  validateClientId,
  validateCreateClient,
  validateUpdateClient
} from '../middleware/validation.js';
import { verify } from 'crypto';
import { verifyFirebaseToken } from '@/middleware/auth.js';

const router = express.Router();

router.use(verifyFirebaseToken);

// GET all clients
router.get('/', getClients);

// GET client by user ID
router.get('/user/:userId', getClientByUserId);

// GET a single client by ID
router.get('/:id', validateClientId, getClientById);

// POST create a new client
router.post('/', validateCreateClient, createClient);

// PUT update a client
router.put('/:id', validateUpdateClient, updateClient);

// DELETE a client
router.delete('/:id', validateClientId, deleteClient);

// Enhanced routes
router.get('/:id/complete', validateClientId, getClientCompleteProfile);
router.get('/:id/plans', validateClientId, getClientPlans);
router.get('/:id/progress', validateClientId, getClientProgress);
router.get('/:id/activities', validateClientId, getClientActivities);
router.get('/user/:userId', getClientByUserId);

// Error handling middleware
router.use(errorHandler);

export default router;
