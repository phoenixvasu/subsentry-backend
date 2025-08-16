import { z } from "zod";

export const billingCycleEnum = z.enum(["Monthly", "Quarterly", "Yearly"]);

export const subscriptionCreateSchema = z.object({
  service_name: z.string().min(1, "Service name is required"),
  category: z.string().min(1, "Category is required"),
  cost: z.number().min(0, "Cost must be a non-negative number"),
  billing_cycle: billingCycleEnum,
  auto_renews: z.boolean(),
  start_date: z.string().datetime({ message: "Invalid ISO date format" }),
});

export const subscriptionUpdateSchema = subscriptionCreateSchema.partial();
