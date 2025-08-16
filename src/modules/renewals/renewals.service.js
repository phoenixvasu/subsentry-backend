// src/modules/renewals/renewals.service.js
import {
  addMonths,
  addQuarters,
  addYears,
  startOfDay,
  addDays,
} from "date-fns";
import { listSubscriptions } from "../subscriptions/sub.repo.js";

export function nextRenewalDate(startDate, billingCycle) {
  let renewalDate = new Date(startDate);
  const today = startOfDay(new Date());
  let iterations = 0;
  const maxIterations = 200;

  while (startOfDay(renewalDate) < today && iterations < maxIterations) {
    switch (billingCycle) {
      case "Monthly":
        renewalDate = addMonths(renewalDate, 1);
        break;
      case "Quarterly":
        renewalDate = addQuarters(renewalDate, 1);
        break;
      case "Yearly":
        renewalDate = addYears(renewalDate, 1);
        break;
      default:
        return null;
    }
    iterations++;
  }

  if (iterations >= maxIterations && startOfDay(renewalDate) < today) {
    return null;
  }

  return renewalDate;
}

export async function getUpcomingRenewals(userId, withinDays) {
  const { items: subscriptions } = await listSubscriptions(userId, {});
  const today = startOfDay(new Date());
  const cutoffDate = addDays(today, withinDays);
  const upcomingRenewals = [];

  for (const sub of subscriptions) {
    if (sub.auto_renews) {
      const renewalDate = nextRenewalDate(sub.start_date, sub.billing_cycle);
      if (
        renewalDate &&
        startOfDay(renewalDate) >= today &&
        startOfDay(renewalDate) <= startOfDay(cutoffDate)
      ) {
        upcomingRenewals.push({
          id: sub.id,
          service_name: sub.service_name,
          billing_cycle: sub.billing_cycle,
          nextRenewalDate: renewalDate.toISOString(),
        });
      }
    }
  }
  return upcomingRenewals;
}
