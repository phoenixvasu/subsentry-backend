// src/modules/renewals/renewals.controller.js
const renewalsService = require('./renewals.service');
const { catchAsync } = require('../../utils/errors');
const { z } = require('zod'); // Assuming Zod is available

const getRenewalsSchema = z.object({
  query: z.object({
    withinDays: z.preprocess(
      (a) => parseInt(a),
      z.number().int().positive().min(1).max(365).default(30)
    ),
  }),
});

const getUpcomingRenewals = catchAsync(async (req, res) => {
  const userId = req.user.id; // Assuming user ID is available from JWT middleware
  const { withinDays } = getRenewalsSchema.parse(req).query; // Validate and parse query param

  const renewals = await renewalsService.getUpcomingRenewals(userId, withinDays);
  res.json(renewals);
});

module.exports = {
  getUpcomingRenewals,
};