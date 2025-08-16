import { getPool } from '../../config/db.js';

class CategoryRepository {
  async create({ name, userId }) {
    const pool = getPool();
    const client = await pool.connect();
    try {
      const result = await client.query(
        'INSERT INTO categories (user_id, name) VALUES ($1, $2) RETURNING *',
        [userId, name]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async findByUser(userId) {
    const pool = getPool();
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM categories WHERE user_id = $1 ORDER BY name',
        [userId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  async findByIdAndUser(id, userId) {
    const pool = getPool();
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM categories WHERE id = $1 AND user_id = $2',
        [id, userId]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async updateById({ id, name, userId }) {
    const pool = getPool();
    const client = await pool.connect();
    try {
      const result = await client.query(
        'UPDATE categories SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
        [name, id, userId]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async deleteById(id, userId) {
    const pool = getPool();
    const client = await pool.connect();
    try {
      const result = await client.query(
        'DELETE FROM categories WHERE id = $1 AND user_id = $2 RETURNING *',
        [id, userId]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }
}

export default new CategoryRepository();
