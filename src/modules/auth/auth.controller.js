import { registerUser, loginUser } from './auth.service.js';

/**
 * Handles user registration.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export async function register(req, res, next) {
  const { username, password } = req.body;

  try {
    const user = await registerUser(username, password);
    res.status(201).json({
      message: 'User registered successfully',
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Handles user login.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export async function login(req, res, next) {
    const { username, password } = req.body;

    try {
        const data = await loginUser(username, password);
        res.status(200).json({
            message: 'Login successful',
            data,
        });
    } catch (err) {
        next(err);
    }
}
