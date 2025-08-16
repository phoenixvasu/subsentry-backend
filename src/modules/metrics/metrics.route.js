// src/modules/metrics/metrics.route.js
const express = require('express');
const metricsController = require('./metrics.controller');
const { protect } = require('../../middleware/auth'); // Assuming auth middleware is here

const router = express.Router();

router.get('/', protect, metricsController.getMetrics);

module.exports = router;