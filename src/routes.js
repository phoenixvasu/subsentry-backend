import express from "express";
import authRoutes from './modules/auth/auth.route.js';
const router = express.Router();

// Example route
router.get("/", (req, res) => {
  res.send("API is working!");
});

router.use('/auth', authRoutes);

export default router;
