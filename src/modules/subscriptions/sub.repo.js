const db = require('../../config/db');

const SUBSCRIPTION_FIELDS = [
  'id',
  'user_id',
  'service_name',
  'category',
  'cost',
  'billing_cycle',
  'auto_renews',
  'start_date',
  'annualized_cost',
  'created_at',
  'updated_at',
];

const createSubscription = async (userId, subscriptionData) => {
  const { service_name, category, cost, billing_cycle, auto_renews, start_date, annualized_cost } = subscriptionData;
  const result = await db.query(
    `INSERT INTO subscriptions (
      user_id, service_name, category, cost, billing_cycle, auto_renews, start_date, annualized_cost
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING ${SUBSCRIPTION_FIELDS.join(', ')}`,
    [userId, service_name, category, cost, billing_cycle, auto_renews, start_date, annualized_cost]
  );
  return result.rows[0];
};

const updateSubscription = async (id, userId, subscriptionData) => {
  const updates = [];
  const values = [];
  let paramIndex = 1;

  for (const key of Object.keys(subscriptionData)) {
    if (SUBSCRIPTION_FIELDS.includes(key) && key !== 'id' && key !== 'user_id' && key !== 'created_at' && key !== 'updated_at') {
      updates.push(`${key} = $${paramIndex++}`);
      values.push(subscriptionData[key]);
    }
  }

  if (updates.length === 0) {
    return null; // No fields to update
  }

  values.push(id, userId); // Add id and user_id for WHERE clause

  const result = await db.query(
    `UPDATE subscriptions SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${paramIndex++} AND user_id = $${paramIndex++} RETURNING ${SUBSCRIPTION_FIELDS.join(', ')}`,
    values
  );
  return result.rows[0];
};

const deleteSubscription = async (id, userId) => {
  const result = await db.query(
    'DELETE FROM subscriptions WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  return result;
};

const getSubscriptionById = async (id, userId) => {
  const result = await db.query(
    `SELECT ${SUBSCRIPTION_FIELDS.join(', ')} FROM subscriptions WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );
  return result.rows[0];
};

const listSubscriptions = async (userId, filters) => {
  const { page, limit, offset, category, billingCycle, search, sortBy } = filters;
  const queryParams = [userId];
  let whereClauses = ['user_id = $1'];
  let paramIndex = 2;

  if (category) {
    whereClauses.push(`category = $${paramIndex++}`);
    queryParams.push(category);
  }

  if (billingCycle) {
    whereClauses.push(`billing_cycle = $${paramIndex++}`);
    queryParams.push(billingCycle);
  }

  if (search) {
    whereClauses.push(`service_name ILIKE $${paramIndex++}`);
    queryParams.push(`%${search}%`);
  }

  let orderBy = 'created_at DESC'; // Default sort
  const allowedSortFields = {
    service_name: 'service_name',
    cost: 'cost',
    annualized_cost: 'annualized_cost',
    start_date: 'start_date',
    billing_cycle: 'billing_cycle',
  };

  if (sortBy) {
    const [field, order] = sortBy.split('_');
    if (allowedSortFields[field]) {
      const sortOrder = order && order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
      orderBy = `${allowedSortFields[field]} ${sortOrder}`;
    }
  }

  const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const query = `
    WITH filtered_subscriptions AS (
      SELECT ${SUBSCRIPTION_FIELDS.join(', ')}
      FROM subscriptions
      ${whereClause}
    ),
    count_cte AS (
      SELECT COUNT(*) AS total FROM filtered_subscriptions
    )
    SELECT
      fs.*,
      (SELECT total FROM count_cte) as total_count
    FROM filtered_subscriptions fs
    ORDER BY ${orderBy}
    LIMIT $${paramIndex++} OFFSET $${paramIndex++};
  `;

  queryParams.push(limit, offset);

  const result = await db.query(query, queryParams);

  const total = result.rows.length > 0 ? parseInt(result.rows[0].total_count, 10) : 0;
  const totalPages = Math.ceil(total / limit);

  return {
    items: result.rows.map(row => {
      const { total_count, ...item } = row;
      return item;
    }),
    page,
    limit,
    total,
    totalPages,
  };
};

module.exports = {
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getSubscriptionById,
  listSubscriptions,
};