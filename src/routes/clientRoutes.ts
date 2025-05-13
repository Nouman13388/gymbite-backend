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
  errorHandler
} from '../controllers/clientController.js';
import {
  validateClientId,
  validateCreateClient,
  validateUpdateClient
} from '../middleware/validation.js';

const router = express.Router();

// GET all clients
router.get('/', getClients);

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

// Error handling middleware
router.use(errorHandler);

export default router;
