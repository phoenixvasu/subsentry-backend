// src/modules/metrics/metrics.repo.js
const pool = require('../../config/db');

async function getMetrics(userId) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `
      SELECT
        SUM(CASE
          WHEN billing_cycle = 'monthly' THEN cost
          WHEN billing_cycle = 'quarterly' THEN cost / 3
          WHEN billing_cycle = 'yearly' THEN cost / 12
          ELSE 0
        END) AS "totalMonthlyCost",
        SUM(annualized_cost) AS "totalAnnualizedCost",
        (SELECT json_build_object('id', id, 'service_name', service_name, 'annualized_cost', annualized_cost)
         FROM subscriptions
         WHERE user_id = $1
         ORDER BY annualized_cost DESC
         LIMIT 1) AS "highestSubscription",
        COUNT(*) AS "totalSubscriptions"
      FROM subscriptions
      WHERE user_id = $1;
      `,
      [userId]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

module.exports = {
  getMetrics,
};