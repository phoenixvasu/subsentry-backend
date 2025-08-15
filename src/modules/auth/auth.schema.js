import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    username: z.string(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    username: z.string(),
    password: z.string(),
  }),
});
