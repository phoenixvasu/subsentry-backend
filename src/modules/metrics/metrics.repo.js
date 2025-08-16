import { getPool } from "../../config/db.js";

export async function getMetrics(userId) {
  const pool = getPool();
  const client = await pool.connect();
  try {
    // Get total monthly cost, annualized cost, and subscription count
    const metricsQuery = `
      SELECT 
        COALESCE(SUM(
          CASE 
            WHEN billing_cycle = 'Monthly' THEN cost
            WHEN billing_cycle = 'Yearly' THEN cost / 12
            WHEN billing_cycle = 'Quarterly' THEN cost / 3
            ELSE 0
          END
        ), 0) as totalmonthlycost,
        COALESCE(SUM(annualized_cost), 0) as totalannualizedcost,
        COUNT(*) as totalsubscriptions
      FROM subscriptions 
      WHERE user_id = $1
    `;

    const metricsResult = await client.query(metricsQuery, [userId]);

    // Get highest subscription by annualized cost
    const highestQuery = `
      SELECT service_name, annualized_cost
      FROM subscriptions 
      WHERE user_id = $1
      ORDER BY annualized_cost DESC 
      LIMIT 1
    `;

    const highestResult = await client.query(highestQuery, [userId]);

    return {
      totalmonthlycost: metricsResult.rows[0].totalmonthlycost,
      totalannualizedcost: metricsResult.rows[0].totalannualizedcost,
      totalsubscriptions: metricsResult.rows[0].totalsubscriptions,
      highestSubscription: highestResult.rows[0] || null,
    };
  } finally {
    client.release();
  }
}
