import express from 'express';
import {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
} from '../controllers/clientController.js';

const router = express.Router();

// GET all clients
router.get('/', getClients);

// GET a single client by ID
router.get('/:id', getClientById);

// POST create a new client
router.post('/', createClient);

// PUT update a client
router.put('/:id', updateClient);

// DELETE a client
router.delete('/:id', deleteClient);

export default router;
