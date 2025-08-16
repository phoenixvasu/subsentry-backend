import express from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { getMetrics } from './metrics.service.js';

const router = express.Router();

// All metrics routes require authentication
router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const metrics = await getMetrics(req.user.id);
    res.json(metrics);
  } catch (error) {
    next(error);
  }
});

export default router;
