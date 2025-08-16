import { getPool } from "../../config/db.js";

const SUBSCRIPTION_FIELDS = [
  "id",
  "user_id",
  "service_name",
  "category",
  "cost",
  "billing_cycle",
  "auto_renews",
  "start_date",
  "annualized_cost",
  "created_at",
  "updated_at",
];

export const createSubscription = async (userId, subscriptionData) => {
  const {
    service_name,
    category,
    cost,
    billing_cycle,
    auto_renews,
    start_date,
    annualized_cost,
  } = subscriptionData;
  const client = await getPool().connect();
  try {
    const result = await client.query(
      `INSERT INTO subscriptions (
      user_id, service_name, category, cost, billing_cycle, auto_renews, start_date, annualized_cost
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING ${SUBSCRIPTION_FIELDS.join(
      ", "
    )}`,
      [
        userId,
        service_name,
        category,
        cost,
        billing_cycle,
        auto_renews,
        start_date,
        annualized_cost,
      ]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
};

export const updateSubscription = async (id, userId, subscriptionData) => {
  const updates = [];
  const values = [];
  let paramIndex = 1;

  for (const key of Object.keys(subscriptionData)) {
    if (
      SUBSCRIPTION_FIELDS.includes(key) &&
      key !== "id" &&
      key !== "user_id" &&
      key !== "created_at" &&
      key !== "updated_at"
    ) {
      updates.push(`${key} = $${paramIndex++}`);
      values.push(subscriptionData[key]);
    }
  }

  if (updates.length === 0) {
    return null; // No fields to update
  }

  values.push(id, userId); // Add id and user_id for WHERE clause

  const client = await getPool().connect();
  try {
    const result = await client.query(
      `UPDATE subscriptions SET ${updates.join(
        ", "
      )}, updated_at = NOW() WHERE id = $${paramIndex++} AND user_id = $${paramIndex++} RETURNING ${SUBSCRIPTION_FIELDS.join(
        ", "
      )}`,
      values
    );
    return result.rows[0];
  } finally {
    client.release();
  }
};

export const deleteSubscription = async (id, userId) => {
  const client = await getPool().connect();
  try {
    const result = await client.query(
      "DELETE FROM subscriptions WHERE id = $1 AND user_id = $2",
      [id, userId]
    );
    return result;
  } finally {
    client.release();
  }
};

export const getSubscriptionById = async (id, userId) => {
  const client = await getPool().connect();
  try {
    const result = await client.query(
      `SELECT 
        s.id,
        s.user_id,
        s.service_name,
        s.category,
        s.cost,
        s.billing_cycle,
        s.auto_renews,
        s.start_date,
        s.annualized_cost,
        s.created_at,
        s.updated_at,
        c.name as category_name
      FROM subscriptions s
      LEFT JOIN categories c ON s.category = c.id
      WHERE s.id = $1 AND s.user_id = $2`,
      [id, userId]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
};

export async function listSubscriptions(userId, options = {}) {
  const pool = getPool();
  const client = await pool.connect();
  try {
    let query = `
      SELECT 
        s.id,
        s.user_id,
        s.service_name,
        s.category,
        s.cost,
        s.billing_cycle,
        s.auto_renews,
        s.start_date,
        s.annualized_cost,
        s.created_at,
        s.updated_at,
        c.name as category_name
      FROM subscriptions s
      LEFT JOIN categories c ON s.category = c.id
      WHERE s.user_id = $1
    `;
    const params = [userId];

    if (options.status) {
      query += " AND s.status = $2";
      params.push(options.status);
    }

    query += " ORDER BY s.start_date DESC";

    const result = await client.query(query, params);
    return result.rows; // Return array directly
  } finally {
    client.release();
  }
}
