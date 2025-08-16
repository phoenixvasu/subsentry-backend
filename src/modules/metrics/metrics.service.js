// src/modules/metrics/metrics.service.js
const metricsRepo = require('./metrics.repo');

async function getMetrics(userId) {
  const metrics = await metricsRepo.getMetrics(userId);

  // Ensure highestSubscription is an object, not null, if no subscriptions exist
  if (!metrics.highestSubscription) {
    metrics.highestSubscription = null;
  }

  // Convert string numbers to actual numbers
  metrics.totalmonthlycost = parseFloat(metrics.totalmonthlycost || 0);
  metrics.totalannualizedcost = parseFloat(metrics.totalannualizedcost || 0);
  metrics.totalsubscriptions = parseInt(metrics.totalsubscriptions || 0, 10);

  return {
    totalMonthlyCost: metrics.totalmonthlycost,
    totalAnnualizedCost: metrics.totalannualizedcost,
    highestSubscription: metrics.highestSubscription,
    totalSubscriptions: metrics.totalsubscriptions,
  };
}

module.exports = {
  getMetrics,
};