// src/modules/metrics/metrics.service.js
import { getMetrics as repoGetMetrics } from "./metrics.repo.js";

export async function getMetrics(userId) {
  const metrics = await repoGetMetrics(userId);

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
