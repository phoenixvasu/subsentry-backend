import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getPool } from '../../config/db.js';

export async function registerUser({ username, password }) {
  const pool = getPool();
  const hash = await bcrypt.hash(password, 10);

  const { rows } = await pool.query(
    `insert into users (username, password_hash)
     values ($1, $2)
     returning id, username, created_at`,
    [username, hash]
  );
  return rows[0];
}

export async function loginUser({ username, password }) {
  const pool = getPool();

  const { rows } = await pool.query(
    `select id, username, password_hash from users where username = $1`,
    [username]
  );
  const user = rows[0];
  if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
  return { token, user: { id: user.id, username: user.username } };
}
