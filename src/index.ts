import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import userRoutes from "./routes/userRoutes.js";
import trainerRoutes from "./routes/trainerRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import workoutPlanRoutes from "./routes/workoutPlanRoutes.js";
import mealPlanRoutes from "./routes/mealPlanRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import consultationRoutes from "./routes/consultationRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Security & performance middlewares (apply early)
if (process.env.NODE_ENV === "production") {
  app.use(helmet());
  app.use(compression());
  app.set("trust proxy", 1);
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP
    })
  );
}

// CORS
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.CORS_ORIGIN?.split(",") || false
      : true,
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Register API routes (keep API routing above static file serving)
app.use("/api/users", userRoutes);
app.use("/api/trainers", trainerRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/workout-plans", workoutPlanRoutes);
app.use("/api/meal-plans", mealPlanRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/feedbacks", feedbackRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/appointments", appointmentRoutes);

// Health check routes
app.use("/api", healthRoutes);

// Serve static files from the public directory (after API routes)
app.use(
  express.static(join(__dirname, "..", "public"), {
    index: false,
    maxAge: process.env.NODE_ENV === "production" ? "1y" : 0,
  })
);

// SPA fallback for non-API routes (must be after API routes/static)
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(join(__dirname, "..", "public", "index.html"), (err) => {
    if (err) next(err);
  });
});

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", err);
    res.status(500).json({ error: err?.message || "Internal Server Error" });
  }
);

// Start server (only in development/non-Vercel environment)
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app
    .listen(port, () => {
      console.log(`Server is running on port ${port}`);
    })
    .on("error", (err) => {
      console.error("Server failed to start:", err);
    });
}

// Export for Vercel
export default app;
