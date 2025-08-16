import express from "express";
import authRoutes from './modules/auth/auth.route.js';
import categoryRoutes from './modules/categories/cat.route.js';
import subscriptionRoutes from './modules/subscriptions/sub.route.js';

const router = express.Router();

// Example route
router.get("/", (req, res) => {
  res.send("API is working!");
});

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/subscriptions', subscriptionRoutes);

export default router;
