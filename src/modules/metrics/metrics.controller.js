// src/modules/metrics/metrics.controller.js
const metricsService = require('./metrics.service');
const { catchAsync } = require('../../utils/errors');

const getMetrics = catchAsync(async (req, res) => {
  const userId = req.user.id; // Assuming user ID is available from JWT middleware
  const metrics = await metricsService.getMetrics(userId);
  res.json(metrics);
});

module.exports = {
  getMetrics,
};