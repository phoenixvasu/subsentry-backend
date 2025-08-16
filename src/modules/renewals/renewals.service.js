// src/modules/renewals/renewals.service.js
const { addMonths, addQuarters, addYears, startOfDay, addDays } = require('date-fns'); // Added addDays
const subRepo = require('../subscriptions/sub.repo');

function nextRenewalDate(startDate, billingCycle) {
  let renewalDate = new Date(startDate);
  const today = startOfDay(new Date());
  let iterations = 0;
  const maxIterations = 200; // Guard against infinite loops

  while (startOfDay(renewalDate) < today && iterations < maxIterations) {
    switch (billingCycle) {
      case 'monthly':
        renewalDate = addMonths(renewalDate, 1);
        break;
      case 'quarterly':
        renewalDate = addQuarters(renewalDate, 1);
        break;
      case 'yearly':
        renewalDate = addYears(renewalDate, 1);
        break;
      default:
        // Should not happen with proper validation
        return null;
    }
    iterations++;
  }

  // If we exceeded maxIterations and still haven't passed today, something is wrong or it's a very old subscription
  if (iterations >= maxIterations && startOfDay(renewalDate) < today) {
    return null; // Or handle as an error
  }

  return renewalDate;
}

async function getUpcomingRenewals(userId, withinDays) {
  // Fetch all subscriptions for the user
  const { items: subscriptions } = await subRepo.listSubscriptions(userId, {}); // Fetch all, no specific filters

  const today = startOfDay(new Date());
  const cutoffDate = addDays(today, withinDays);

  const upcomingRenewals = [];

  for (const sub of subscriptions) {
    if (sub.auto_renews) {
      const renewalDate = nextRenewalDate(sub.start_date, sub.billing_cycle);
      // Compare using startOfDay for accurate date comparison
      if (renewalDate && startOfDay(renewalDate) >= today && startOfDay(renewalDate) <= startOfDay(cutoffDate)) {
        upcomingRenewals.push({
          id: sub.id,
          service_name: sub.service_name,
          billing_cycle: sub.billing_cycle,
          nextRenewalDate: renewalDate.toISOString(), // Return as ISO string
        });
      }
    }
  }
  return upcomingRenewals;
}

module.exports = {
  getUpcomingRenewals,
  nextRenewalDate, // Export for testing if needed
};