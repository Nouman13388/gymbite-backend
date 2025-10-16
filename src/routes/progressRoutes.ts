import express from "express";
import {
  getAllProgress,
  getProgressById,
  createProgress,
  updateProgress,
  deleteProgress,
  getProgressByClientId,
  getProgressTrends,
  getProgressSummary,
} from "../controllers/progressController.js";
import { verifyFirebaseToken } from "../middleware/auth.js";
import {
  validateCreateProgress,
  validateUpdateProgress,
  validateProgressQuery,
} from "../middleware/progressValidation.js";

const router = express.Router();

router.use(verifyFirebaseToken);

// Define routes for progress
router.get("/", getAllProgress);
router.get("/:id", getProgressById);
router.post("/", validateCreateProgress, createProgress);
router.put("/:id", validateUpdateProgress, updateProgress);
router.delete("/:id", deleteProgress);

// Enhanced analytics routes
router.get("/client/:clientId", validateProgressQuery, getProgressByClientId);
router.get(
  "/client/:clientId/trends",
  validateProgressQuery,
  getProgressTrends
);
router.get("/client/:clientId/summary", getProgressSummary);

export default router;
