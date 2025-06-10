import express from 'express';
import { healthCheck, readinessCheck, livenessCheck } from '../controllers/healthController.js';

const router = express.Router();

// Health check endpoint - comprehensive health status
router.get('/health', healthCheck);

// Readiness check - for load balancers and orchestrators
router.get('/ready', readinessCheck);

// Liveness check - basic process health
router.get('/alive', livenessCheck);

export default router;
