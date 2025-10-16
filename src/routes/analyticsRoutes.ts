import express from "express";
import {
  getDashboard,
  getUserStats,
  getUserGrowth,
  getTrainerStats,
  getClientStats,
  getAppointmentStats,
  getAppointmentTrendsData,
  getSystemHealthData,
} from "../controllers/analyticsController.js";
import { verifyFirebaseToken } from "../middleware/auth.js";

const router = express.Router();

router.use(verifyFirebaseToken);

// Dashboard overview
router.get("/dashboard", getDashboard);

// User analytics
router.get("/users", getUserStats);
router.get("/users/growth", getUserGrowth);

// Trainer analytics
router.get("/trainers", getTrainerStats);

// Client analytics
router.get("/clients", getClientStats);

// Appointment analytics
router.get("/appointments", getAppointmentStats);
router.get("/appointments/trends", getAppointmentTrendsData);

// System health
router.get("/system/health", getSystemHealthData);

export default router;
