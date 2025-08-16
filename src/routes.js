import express from "express";
import authRoutes from './modules/auth/auth.route.js';
import categoryRoutes from './modules/categories/cat.route.js';
import subscriptionRoutes from './modules/subscriptions/sub.route.js';
import metricsRoutes from './modules/metrics/metrics.route.js';
import renewalsRoutes from './modules/renewals/renewals.route.js'; // Add this line

const router = express.Router();

// Example route
router.get("/", (req, res) => {
  res.send("API is working!");
});

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/metrics', metricsRoutes);
router.use('/renewals', renewalsRoutes); // Add this line

export default router;