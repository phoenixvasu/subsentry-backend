import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getPool } from '../../config/db.js';

/**
 * Registers a new user.
 *
 * @param {string} username - The username.
 * @param {string} password - The password.
 * @returns {Promise<object>} The created user data.
 */
export async function registerUser(username, password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const pool = getPool();
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
      [username, hashedPassword]
    );
    return result.rows[0];
  } catch (err) {
    if (err.code === '23505') { // unique_violation
      const error = new Error('Username already exists');
      error.statusCode = 409;
      throw error;
    }
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Logs in a user.
 *
 * @param {string} username - The username.
 * @param {string} password - The password.
 * @returns {Promise<object>} The user's data and token.
 */
export async function loginUser(username, password) {
    const pool = getPool();
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (!user) {
            const error = new Error('Invalid username or password');
            error.statusCode = 401;
            throw error;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const error = new Error('Invalid username or password');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        return { token, username: user.username };
    } finally {
        client.release();
    }
}
