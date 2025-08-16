import express from 'express';
import subController from './sub.controller.js';
import authMiddleware from '../../middleware/auth.js';

const router = express.Router();

// All subscription routes require authentication
router.use(authMiddleware);

router.post('/', subController.createSubscription);
router.put('/:id', subController.updateSubscription);
router.delete('/:id', subController.deleteSubscription);
router.get('/:id', subController.getSubscriptionById);
router.get('/', subController.listSubscriptions);

export default router;