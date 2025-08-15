import express from 'express';
import { register, login } from './auth.controller.js';
import { validate } from '../../middleware/validate.js';
import { registerSchema, loginSchema } from './auth.schema.js';
import { requireAuth } from '../../middleware/auth.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

// Example of a protected route
router.get('/profile', requireAuth, (req, res) => {
    res.json({ message: `Welcome user ${req.user.id}` });
});

export default router;
