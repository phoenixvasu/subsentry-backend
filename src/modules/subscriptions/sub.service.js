const { subscriptionCreateSchema, subscriptionUpdateSchema, billingCycleEnum } = require('./sub.schema');
const subRepo = require('./sub.repo');
const { ApplicationError } = require('../../utils/errors');

/**
 * Calculates the annualized cost based on the billing cycle.
 * @param {number} cost - The cost of the subscription.
 * @param {'Monthly'|'Quarterly'|'Yearly'} billingCycle - The billing cycle.
 * @returns {number} The annualized cost.
 */
function calcAnnualizedCost(cost, billingCycle) {
  switch (billingCycle) {
    case 'Monthly':
      return cost * 12;
    case 'Quarterly':
      return cost * 4;
    case 'Yearly':
      return cost;
    default:
      throw new ApplicationError('Invalid billing cycle', 400);
  }
}

// Placeholder for other service functions, will be implemented later
const createSubscription = async (userId, subscriptionData) => {
  const validatedData = subscriptionCreateSchema.parse(subscriptionData);
  const annualized_cost = calcAnnualizedCost(validatedData.cost, validatedData.billing_cycle);
  return subRepo.createSubscription(userId, { ...validatedData, annualized_cost });
};

const updateSubscription = async (id, userId, subscriptionData) => {
  const validatedData = subscriptionUpdateSchema.parse(subscriptionData);
  const existingSub = await subRepo.getSubscriptionById(id, userId);

  if (!existingSub) {
    throw new ApplicationError('Subscription not found or not authorized', 404);
  }

  let annualized_cost = existingSub.annualized_cost;
  if (validatedData.cost !== undefined || validatedData.billing_cycle !== undefined) {
    const newCost = validatedData.cost !== undefined ? validatedData.cost : existingSub.cost;
    const newBillingCycle = validatedData.billing_cycle !== undefined ? validatedData.billing_cycle : existingSub.billing_cycle;
    annualized_cost = calcAnnualizedCost(newCost, newBillingCycle);
  }

  return subRepo.updateSubscription(id, userId, { ...validatedData, annualized_cost });
};

const deleteSubscription = async (id, userId) => {
  const result = await subRepo.deleteSubscription(id, userId);
  if (result.rowCount === 0) {
    throw new ApplicationError('Subscription not found or not authorized', 404);
  }
  return { message: 'Subscription deleted successfully' };
};

const getSubscriptionById = async (id, userId) => {
  const subscription = await subRepo.getSubscriptionById(id, userId);
  if (!subscription) {
    throw new ApplicationError('Subscription not found or not authorized', 404);
  }
  return subscription;
};

const listSubscriptions = async (userId, queryParams) => {
  const page = parseInt(queryParams.page) || 1;
  let limit = parseInt(queryParams.limit) || 10;

  if (limit < 5) limit = 5;
  if (limit > 50) limit = 50;

  const offset = (page - 1) * limit;

  const filters = {
    category: queryParams.category,
    billingCycle: queryParams.billingCycle,
    search: queryParams.search,
    sortBy: queryParams.sortBy,
    limit,
    offset,
  };

  return subRepo.listSubscriptions(userId, filters);
};

module.exports = {
  calcAnnualizedCost,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getSubscriptionById,
  listSubscriptions,
};