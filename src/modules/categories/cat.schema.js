import { z } from 'zod';

export const createCategorySchema = z.object({
    name: z.string().min(1, 'Category name is required').max(255, 'Category name is too long'),
});

export const updateCategorySchema = z.object({
    name: z.string().min(1, 'Category name is required').max(255, 'Category name is too long'),
});
