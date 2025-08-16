import express from 'express';
import categoryController from './cat.controller.js';
import { validate } from '../../middleware/validate.js';
import { createCategorySchema, updateCategorySchema } from './cat.schema.js';
import { requireAuth } from '../../middleware/auth.js';

const router = express.Router();

router.post(
    '/',
    requireAuth,
    validate(createCategorySchema),
    categoryController.createCategory
);

router.get(
    '/',
    requireAuth,
    categoryController.getCategories
);

router.put(
    '/:id',
    requireAuth,
    validate(updateCategorySchema),
    categoryController.updateCategory
);

router.delete(
    '/:id',
    requireAuth,
    categoryController.deleteCategory
);

export default router;
