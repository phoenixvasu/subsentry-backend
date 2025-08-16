import express from 'express';
import { requireAuth } from '../../middleware/auth.js';
import categoryController from './cat.controller.js';

const router = express.Router();

// All category routes require authentication
router.use(requireAuth);

router.post('/', categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

export default router;
