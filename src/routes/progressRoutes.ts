import express from "express";
import {
  getAllProgress,
  getProgressById,
  createProgress,
  updateProgress,
  deleteProgress,
} from "../controllers/progressController.js";
import { verifyFirebaseToken } from "../middleware/auth.js";

const router = express.Router();

router.use(verifyFirebaseToken);

// Define routes for progress
router.get("/", getAllProgress);
router.get("/:id", getProgressById);
router.post("/", createProgress);
router.put("/:id", updateProgress);
router.delete("/:id", deleteProgress);

export default router;
