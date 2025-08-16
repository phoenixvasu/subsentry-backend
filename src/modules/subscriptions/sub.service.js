import { getPool } from '../../config/db.js';

class SubscriptionService {
  async create(subscriptionData) {
    const pool = getPool();
    const client = await pool.connect();
    try {
      const {
        service_name,
        category,
        cost,
        billing_cycle,
        auto_renews,
        start_date,
        annualized_cost,
        userId
      } = subscriptionData;

      const result = await client.query(
        `INSERT INTO subscriptions (
          user_id, service_name, category, cost, billing_cycle, 
          auto_renews, start_date, annualized_cost
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [userId, service_name, category, cost, billing_cycle, auto_renews, start_date, annualized_cost]
      );

      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async getAll(userId) {
    const pool = getPool();
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY start_date DESC',
        [userId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  async update(id, updates, userId) {
    const pool = getPool();
    const client = await pool.connect();
    try {
      // Build dynamic update query
      const updateFields = [];
      const values = [];
      let paramIndex = 1;

      Object.keys(updates).forEach(key => {
        if (key !== 'id' && key !== 'user_id') {
          updateFields.push(`${key} = $${paramIndex++}`);
          values.push(updates[key]);
        }
      });

      if (updateFields.length === 0) {
        throw new Error('No valid fields to update');
      }

      // Add updated_at timestamp
      updateFields.push(`updated_at = NOW()`);
      
      // Add WHERE clause parameters
      values.push(userId, id);
      
      const query = `
        UPDATE subscriptions 
        SET ${updateFields.join(', ')}
        WHERE user_id = $${paramIndex++} AND id = $${paramIndex++}
        RETURNING *
      `;

      const result = await client.query(query, values);
      
      if (result.rows.length === 0) {
        throw new Error('Subscription not found or unauthorized');
      }

      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async delete(id, userId) {
    const pool = getPool();
    const client = await pool.connect();
    try {
      const result = await client.query(
        'DELETE FROM subscriptions WHERE id = $1 AND user_id = $2 RETURNING *',
        [id, userId]
      );
      
      if (result.rows.length === 0) {
        throw new Error('Subscription not found or unauthorized');
      }

      return result.rows[0];
    } finally {
      client.release();
    }
  }
}

export default new SubscriptionService();
