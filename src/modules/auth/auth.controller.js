import { z } from 'zod';
import { registerUser, loginUser } from './auth.service.js';

const authSchema = z.object({
  body: z.object({
    username: z.string().min(3),
    password: z.string().min(8),
  }),
  query: z.any().optional(),
  params: z.any().optional(),
});

export const register = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await registerUser({ username, password });
    res.status(201).json({ message: 'Registered', data: user });
  } catch (err) {
    if (err.code === '23505') err.status = 409; // unique violation
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await loginUser({ username, password });
    res.json({ message: 'Logged in', data: result });
  } catch (err) {
    next(err);
  }
};

export const authValidators = { authSchema };
