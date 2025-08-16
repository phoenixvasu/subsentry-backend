// src/modules/renewals/renewals.controller.js
import { getUpcomingRenewals as serviceGetUpcomingRenewals } from "./renewals.service.js";
import { z } from "zod";

const getRenewalsSchema = z.object({
  query: z.object({
    withinDays: z.preprocess(
      (a) => parseInt(a),
      z.number().int().positive().min(1).max(365).default(30)
    ),
  }),
});

export const getUpcomingRenewals = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { withinDays } = getRenewalsSchema.parse(req).query;
    const renewals = await serviceGetUpcomingRenewals(userId, withinDays);
    res.json(renewals);
  } catch (error) {
    next(error);
  }
};
