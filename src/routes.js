import express from "express";
import authRoutes from "./modules/auth/auth.route.js";
import categoryRoutes from "./modules/categories/cat.route.js";
import subscriptionRoutes from "./modules/subscriptions/sub.route.js";
import metricsRoutes from "./modules/metrics/metrics.route.js";
import renewalsRoutes from "./modules/renewals/renewals.route.js"; // Add this line
import { swaggerMiddleware } from "./swagger.js";

const router = express.Router();

// Health check route for deployment testing
router.get("/", (req, res) => {
  res.json({
    message: "SubSentry API is working!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    cors_origins: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim())
      : [],
  });
});

// API Documentation
router.use("/docs", swaggerMiddleware);

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/subscriptions", subscriptionRoutes);
router.use("/metrics", metricsRoutes);
router.use("/renewals", renewalsRoutes); // Add this line

export default router;
